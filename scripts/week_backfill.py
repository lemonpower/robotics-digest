"""Read official recent-listing dates, not submission timestamps, for the Nov 18–24 archive."""
from datetime import date
from html.parser import HTMLParser
import re
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
import xml.etree.ElementTree as ET

RECENT_URL = 'https://arxiv.org/list/cs.RO/recent?show=2000&skip=0'
WINDOW = ('2026-11-18','2026-11-24')
EXPECTED = {'2026-11-18':89,'2026-11-19':104,'2026-11-20':92,'2026-11-23':89,'2026-11-24':191}
PINS = {
    '2026-11-18': ('2611.23143',),
    '2026-11-19': ('2611.24011','2611.24789'),
    '2026-11-20': ('2611.26444',),
    '2026-11-23': ('2611.27338','2611.27648','2611.26916'),
}
SOURCE_OFFSETS={'2026-11-24':0,'2026-11-23':191,'2026-11-20':280,'2026-11-19':372,'2026-11-18':476}
MONTHS = {m:i for i,m in enumerate('Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(),1)}
PAPER_ID = re.compile(r'/abs/(\d{4}\.\d{4,5})(?:v(\d+))?$')
CAT = re.compile(r'\(([a-z-]+\.[A-Z]+)\)')
VOID = set('area base br col embed hr img input link meta param source track wbr'.split())


class Recent(HTMLParser):
    """Collect a listing's day headings and dt/dd records; never infer dates from IDs."""
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack=[]
        self.captures={}
        self.day=None
        self.item=None
        self.rows={}
        self.counts={}

    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag not in VOID:
            self.stack.append(tag)
        if tag=='h3':
            self.captures['date']=(len(self.stack),[])
        if tag=='dt':
            self.flush_row()
            self.item={}
        if tag=='a' and self.item is not None and 'dt' in self.stack:
            m=PAPER_ID.search(a.get('href',''))
            if m:
                self.item['id']=m[1]
        if self.item is not None:
            classes=set(a.get('class','').split())
            for name,cls in [('title','list-title'),('authors','list-authors'),('subjects','list-subjects')]:
                if cls in classes:
                    self.captures[name]=(len(self.stack),[])

    def handle_data(self, data):
        for _,parts in self.captures.values():
            parts.append(data)

    def handle_endtag(self, tag):
        if tag not in self.stack:
            return
        end=len(self.stack)-self.stack[::-1].index(tag)
        self.stack=self.stack[:end-1]
        for field,(depth,parts) in list(self.captures.items()):
            if depth<end:
                continue
            self.captures.pop(field)
            value=' '.join(''.join(parts).split())
            if field=='date':
                self.flush_row()
                m=re.search(r'(\d{1,2}) ([A-Z][a-z]{2}) (\d{4})\s+\(showing (?:first )?\d+ of (\d+) entries?',value)
                if m and m[2] in MONTHS:
                    self.day=date(int(m[3]),MONTHS[m[2]],int(m[1])).isoformat()
                    self.counts[self.day]=int(m[4])
                    self.rows.setdefault(self.day,[])
            elif self.item is not None:
                self.item[field]=value.split(':',1)[1].strip() if ':' in value and value.split(':',1)[0].lower() in ('title','authors','subjects') else value
        if tag=='dd':
            self.flush_row()

    def flush_row(self):
        item=self.item
        self.item=None
        if not self.day or not item or not (item.get('id') and item.get('title')):
            return
        people=[p.strip() for p in item.get('authors','').split(',') if p.strip()]
        groups=CAT.findall(item.get('subjects',''))
        primary=groups[0] if groups else ''
        self.rows[self.day].append({'id':item['id'],'title':item['title'],'abstract':'','authors':[],
             'displayAuthors':people,'batch':self.day,'primary':primary,
             'kind':'new' if primary=='cs.RO' else 'cross' if primary else 'listed'})


def parse_recent(raw):
    parser=Recent()
    parser.feed(raw.decode('utf-8','replace') if isinstance(raw,bytes) else raw)
    parser.flush_row()
    result={}
    for day, count in EXPECTED.items():
        rows={p['id']:p for p in parser.rows.get(day,[])}
        if len(rows)==count==parser.counts.get(day):
            result[day]=list(rows.values())
        else:
            print(f'{day}: expected {count}, parsed {len(rows)} (not treating the partial listing as complete)',flush=True)
    return result


def select_week(rows, day, known, norm):
    pins=PINS.get(day,())
    pattern=[re.compile(rule) for _,rule in known.values()]
    rank=lambda p:(p['id'] in pins,-pins.index(p['id']) if p['id'] in pins else -99,
                   sum(bool(rx.search(norm(p['title']))) for rx in pattern[:3]),
                   sum(bool(rx.search(norm(p['title']))) for rx in pattern))
    # Keep verified editorial anchors, then fill remaining spots by relevance.
    return sorted(rows,key=rank,reverse=True)[:5]


def enrich_atom(papers, read_source, norm, clean):
    by_id={p['id']:p for p in papers if not p.get('abstract')}
    if not by_id:
        return
    url='https://export.arxiv.org/api/query?'+urlencode({'id_list':','.join(ident+'v1' for ident in by_id),'max_results':len(by_id)})
    try:
        time.sleep(3)
        root=ET.fromstring(read_source(url,4_000_000))
        ns={'a':'http://www.w3.org/2005/Atom'}
        for entry in root.findall('a:entry',ns):
            m=PAPER_ID.search(entry.findtext('a:id','',ns))
            if not m or m[1] not in by_id or m[2] not in (None,'1'):
                continue
            p=by_id[m[1]]
            p['abstract']=clean(entry.findtext('a:summary','',ns))[:3000]
            published=entry.findtext('a:published','',ns)[:10]
            if re.fullmatch(r'\d{4}-\d{2}-\d{2}',published):
                p['first']=published
            names=[n.text for n in entry.findall('a:author/a:name',ns) if n.text]
            if names:
                p['displayAuthors']=names
                p['authors']=[norm(n) for n in names]
    except (ValueError,ET.ParseError,URLError,TimeoutError) as e:
        print(f'arXiv Atom metadata not available; using official individual abstracts: {e}',flush=True)
