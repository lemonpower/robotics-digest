"""Collect arXiv announcement batches and expose evidence-backed topic clusters."""
import argparse
from collections import defaultdict
from datetime import date, timedelta
from email.utils import parsedate_to_datetime
import hashlib
from html import unescape
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import time
import unicodedata
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

FEED = 'https://rss.arxiv.org/rss/cs.RO'
ID = re.compile(r'(?<![\d.])(\d{4}\.\d{4,5})(?:v(\d+))?(?![\d.])')
DAYS = 14
KNOWN = {
    'tactile': ('触觉感知', r'\btactile\b|\bvisuotactile\b|tactile sensing'),
    'robot-rl': ('机器人强化学习', r'\breinforcement learning\b|\bsupermimic\b|\bpolicy gradient\b'),
    'agentic-robots': ('机器人智能体：待人工核对', r'robot(?:ic)? (?:control|manipulation|execution) with (?:llm|language model)|robot(?:ic)? agent|embodied agent|agentic (?:robot|control)|code as policies'),
    'vla': ('视觉语言动作模型（VLA）', r'\bvlas?\b|\bvision language action\b'),
    'world-models': ('世界模型与动作建模', r'\bworld (?:action )?models?\b'),
    'sim-real': ('仿真到现实', r'\bsim to real\b|\bsimulation to real\b|\bdomain randomization\b'),
    'navigation': ('具身导航', r'\bvision language navigation\b|\bembodied navigation\b|\bvisual navigation\b'),
    'dexterous': ('灵巧操作', r'\bdexterous manipulation\b|\bin hand manipulation\b'),
    'teleoperation': ('遥操作与示教', r'\bteleoperation\b|\bteleoperated\b'),
    'multi-robot': ('多机器人协作', r'\bmulti robot (?:collaboration|coordination|cooperation|planning)\b'),
}
STOP = set('a an the of to in for from by with via as on under over using based towards is are and or robot robots robotic robotics task tasks policy policies model models framework approach learning method system systems intelligent novel new efficient improved robust autonomous based'.split())


def norm(value):
    return ' '.join(re.findall(r'[a-z0-9]+', unicodedata.normalize('NFKC', value).lower()))


def read_source(url, limit=15_000_000):
    req = Request(url, headers={'User-Agent': 'RoboticsDigest/1.0 (https://github.com/lemonpower/robotics-digest)'})
    with urlopen(req, timeout=35) as response:
        body = response.read(limit + 1)
    if len(body) > limit:
        raise ValueError('arXiv response exceeds safety limit')
    return body


def child_text(element, name):
    return next((''.join(c.itertext()).strip() for c in element if c.tag.rsplit('}', 1)[-1] == name), '')


def clean(value):
    return ' '.join(unescape(re.sub(r'</?(?:p|br|em|strong|span|div)\b[^>]*>', ' ', value, flags=re.I)).split())


def parse_feed(content):
    channel = ET.fromstring(content).find('channel')
    if channel is None:
        raise ValueError('arXiv RSS response did not contain a channel')
    batch = parsedate_to_datetime(child_text(channel, 'pubDate')).date().isoformat()
    out = {}
    for entry in channel.findall('item'):
        kind = child_text(entry, 'announce_type')
        if kind not in ('new', 'cross'):
            continue
        description = child_text(entry, 'description')
        identity = ID.search(child_text(entry, 'guid')) or ID.search(description) or ID.search(child_text(entry, 'link'))
        if not identity or identity[2] not in (None, '1'):
            continue
        paper = identity[1]
        item_date = child_text(entry, 'pubDate')
        title = clean(child_text(entry, 'title'))
        if not title or paper in out:
            continue
        out[paper] = {'id': paper, 'title': title,
                      'abstract': clean(description.partition('Abstract:')[2] or description)[:3000],
                      'authors': [norm(n) for n in child_text(entry, 'creator').split(',') if norm(n)],
                      'batch': parsedate_to_datetime(item_date).date().isoformat() if item_date else batch,
                      'kind': kind}
    return batch, list(out.values())


def recurring_phrases(title):
    words = norm(title.split(':', 1)[-1]).split()
    return {' '.join(part) for width in (2, 3) for i in range(len(words) - width + 1)
            if (part := words[i:i + width]) and all(word not in STOP and word.isalpha() and len(word) >= 3 for word in part)}


def independent_count(rows):
    # Conservative proxy: colliding author names put publications in the same component.
    groups = []
    authorless = 0
    for row in rows:
        authors = set(row['authors'])
        if not authors:
            authorless = 1
            continue
        related = [group for group in groups if authors & group]
        groups = [group for group in groups if group not in related]
        groups.append(authors.union(*related))
    return len(groups) or authorless


def public_paper(paper):
    return {key: paper[key] for key in ('id', 'title', 'abstract', 'batch', 'kind')}


def make_topics(rows, previous_rows=()):
    matchers = {key: re.compile(rule) for key, (_, rule) in KNOWN.items()}
    indexed = []
    known_ids = set()
    for key, pattern in matchers.items():
        matches = [r for r in rows if pattern.search(norm(r['title'])) or len(pattern.findall(norm(r['abstract']))) >= 2]
        old = sum(bool(pattern.search(norm(r['title']))) or len(pattern.findall(norm(r['abstract']))) >= 2 for r in previous_rows)
        indexed.append((key, KNOWN[key][0], matches, old, '标题关键词或摘要重复命中'))
        known_ids.add(key)
    phrases = defaultdict(list)
    historical_phrases = defaultdict(int)
    for row in rows:
        for phrase in recurring_phrases(row['title']):
            phrases[phrase].append(row)
    for row in previous_rows:
        for phrase in recurring_phrases(row['title']):
            historical_phrases[phrase] += 1
    for phrase, matches in sorted(phrases.items()):
        if len(matches) >= 3:
            indexed.append(('phrase-' + hashlib.sha256(phrase.encode()).hexdigest()[:12], phrase, matches, historical_phrases[phrase], '多篇标题重复使用的术语，名称与归类待人工确认'))
    ranked = []
    for ident, name, matches, previous, rule in indexed:
        days = len({p['batch'] for p in matches})
        if len(matches) < 3 or days < 2:
            continue
        teams = independent_count(matches)
        if teams < 3:
            continue
        growth = len(matches) - previous if previous_rows else 0
        ranked.append((ident not in known_ids, -growth, -len(matches), ident, name, matches, previous, rule, teams, days))
    output = []
    sets = []
    for _, _, _, ident, name, matches, previous, rule, teams, days in sorted(ranked):
        evidence = {p['id'] for p in matches}
        if any(len(evidence & prior) / len(evidence | prior) >= .72 for prior in sets):
            continue
        sets.append(evidence)
        output.append({'id': ident, 'name': name, 'rule': rule, 'count': len(matches), 'batches': days,
                       'teams': teams, 'previous': previous if previous_rows else None,
                       'papers': [public_paper(p) for p in sorted(matches, key=lambda p: p['batch'], reverse=True)[:20]]})
    return output[:16]


class Figures(HTMLParser):
    def __init__(self, root):
        super().__init__(convert_charrefs=True)
        self.root, self.current, self.results, self.depth, self.in_caption = root, None, [], 0, False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'figure':
            self.depth += 1
            if self.depth == 1 and 'ltx_figure' in attrs.get('class', '').split():
                self.current = {'anchor': attrs.get('id', ''), 'images': [], 'caption': []}
        if self.current is None:
            return
        if tag == 'figcaption':
            self.in_caption = True
        if tag == 'img' and not self.in_caption and 'ltx_Math' not in attrs.get('class', ''):
            src = urljoin(self.root + '/', attrs.get('src', ''))
            if src.startswith(self.root + '/') and re.search(r'\.(png|jpg|jpeg|webp|svg|gif)$', src, re.I):
                self.current['images'].append(src)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

    def handle_data(self, data):
        if self.current is not None and self.in_caption:
            self.current['caption'].append(data)

    def handle_endtag(self, tag):
        if tag == 'figcaption':
            self.in_caption = False
        if tag != 'figure' or not self.depth:
            return
        self.depth -= 1
        if self.depth != 0 or self.current is None:
            return
        caption = ' '.join(''.join(self.current['caption']).split())
        # Keep only the original figure label, not a mirror of the full caption.
        label = re.match(r'(?:Figure|Fig\.)\s*[\w.-]+', caption, re.I)
        for src in self.current['images']:
            self.results.append({'src': src, 'caption': label[0].rstrip('.') if label else '论文插图', 'anchor': self.current['anchor']})
        self.current = None


def dump(target, obj):
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def acquire_figures(target, source_root):
    source = (source_root/'data.js').read_text(encoding='utf-8') + (source_root/'editorial.js').read_text(encoding='utf-8')
    ids = set(re.findall(r"article\([\"'](\d{4}\.\d{4,5})[\"']", source))
    for ident in sorted(ids - {'2610.28480'}):
        revision = 'v4' if ident == '2209.07753' else 'v1'
        path = target/'figures'/f'{ident}.json'
        if path.exists():
            continue
        url = f'https://arxiv.org/html/{ident}{revision}'
        try:
            time.sleep(3)
            parser = Figures(url)
            parser.feed(read_source(url).decode('utf-8', 'replace'))
            if parser.results:
                dump(path, {'version': revision, 'figures': list({f['src']: f for f in parser.results}.values())})
        except (HTTPError, URLError, TimeoutError, ValueError) as exc:
            print(f'No HTML gallery for {ident}: {exc}', flush=True)
            if isinstance(exc, HTTPError) and exc.code in (429, 503):
                break


def main():
    cli = argparse.ArgumentParser()
    cli.add_argument('output', type=Path)
    cli.add_argument('--rss-file', type=Path, help='Read a local RSS fixture instead of the live source')
    cli.add_argument('--figures', action='store_true', help='Fetch official HTML figure indexes for editorial papers')
    args = cli.parse_args()
    root = args.output
    batch, records = parse_feed(args.rss_file.read_bytes() if args.rss_file else read_source(FEED))
    state_file = root/'history.json'
    history = json.loads(state_file.read_text()) if state_file.exists() else {}
    if records:
        history[batch] = records
    if history:
        latest = max(history)
        latest_day = date.fromisoformat(latest)
        cutoff = (latest_day - timedelta(days=DAYS-1)).isoformat()
        past = (latest_day - timedelta(days=2*DAYS-1)).isoformat()
        history = {day: rows for day, rows in history.items() if day >= past}
        unique = {p['id']: p for day in sorted(history, reverse=True) for p in history[day]}
        recent = [p for p in unique.values() if p['batch'] >= cutoff]
        previous = [p for p in unique.values() if past <= p['batch'] < cutoff]
        snapshot_file = root/'radar.json'
        last_snapshot = json.loads(snapshot_file.read_text()) if snapshot_file.exists() else {}
        current = [{**topic, 'lastSeen': latest} for topic in make_topics(recent, previous)]
        old_topics = {topic['id']: topic for topic in last_snapshot.get('archivedTopics', []) + last_snapshot.get('topics', []) if topic.get('lastSeen')}
        for topic in current:
            old_topics.pop(topic['id'], None)
        archive = sorted(old_topics.values(), key=lambda t:t['lastSeen'], reverse=True)[:25]
        snapshot = {'latestBatch': latest, 'paperCount': len(recent),
                    'batchCount': sum(day >= cutoff for day in history),
                    'latestPapers': [public_paper(p) for p in history[latest]],
                    'topics': current, 'archivedTopics': archive}
        dump(state_file, history)
        dump(snapshot_file, snapshot)
        print(f'{latest}: {len(recent)} unique papers, {len(snapshot["topics"])} topics')
    else:
        print('No announcements in feed; leaving the snapshot unpublished.')
    if args.figures:
        acquire_figures(root, Path(__file__).resolve().parents[1])


if __name__ == '__main__':
    main()
