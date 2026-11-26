"use strict";

const $ = id => document.getElementById(id);
const appUrl = new URL($("paper-page") ? "../" : "./", location.href);
const params = new URLSearchParams(location.search);
const descending = [...issues].sort((a,b) => b.date.localeCompare(a.date));
const byId = new Map(issues.flatMap(issue => [...issue.papers,...(issue.additional??[]),...(issue.community??[])].map(p => [p.id,{p,issue}])));
let liveSnapshot=null;
const focused = Object.values(focusTopics).map(t => t.name);
const catalog = [...new Set([...focused,...otherTopics.map(t => t.name),"Robot Foundation Models"])];
const oldNames = {
  "2026-10-27":"Navigation, Robot Data & Recovery",
  "2026-10-24":"Humanoid Manipulation, Memory & World Models",
  supermimic:"SuperMimic & Follow-up Work", "focus-reading":"Tactile Sensing & Agentic Robots"
};
const trendNames = {
  tactile:"Tactile Sensing", "robot-rl":"Robot RL", "agentic-robots":"Agentic Robots",
  vla:"Vision-Language-Action", "world-models":"World Models", "sim-real":"Sim-to-Real",
  navigation:"Embodied Navigation", dexterous:"Dexterous Manipulation",
  teleoperation:"Teleoperation", "multi-robot":"Multi-Robot Collaboration"
};
const norm = s => String(s ?? "").trim().toLowerCase();
const detail = p => editorial[p.id] ?? reviewNotes[p.id] ?? {};
const version = p => detail(p).version ?? "v1";
const arxiv = p => "https://arxiv.org/abs/"+p.id;
const pdf = p => "https://arxiv.org/pdf/"+p.id+version(p);
const html = p => "https://arxiv.org/html/"+p.id+version(p);
const EnglishDate = new Intl.DateTimeFormat("en",{year:"numeric",month:"short",day:"numeric",timeZone:"UTC"});
const formatDate = day => /^\d{4}-\d{2}-\d{2}$/.test(day ?? "") ? EnglishDate.format(new Date(day+"T00:00:00Z")) : "";
const titleOf = issue => oldNames[issue.key] ?? issue.title;
const editionName = issue => issue.curated ? formatDate(issue.date)+" · Beijing" : issue.batch ? formatDate(issue.batch) : titleOf(issue);
const findIssue = key => descending.find(issue=>issue.key===key) ?? descending.find(issue=>issue.curated&&issue.date===key);
const validId = id => /^\d{4}\.\d{4,5}$/.test(id ?? "");
const safeHTTPS = s => typeof s==="string" && /^https:\/\//i.test(s);
const issueDefault = descending.find(issue=>issue.batch);
let selectedIssue = findIssue(params.get("issue")) ?? issueDefault;
let selectedTopic = params.get("topic") ?? focusTopics[params.get("track")]?.name ?? "";
let snapshotPromise;

function el(tag,text,cls){
  const n=document.createElement(tag);
  if(text) n.textContent=text;
  if(cls) n.className=cls;
  return n;
}
function a(text,href,cls,external=false){
  const n=el("a",text,cls);
  n.href=href;
  if(external){n.target="_blank";n.rel="noopener";}
  return n;
}
function lang(tag,value,cls){
  const n=el(tag,value,cls);
  n.lang=/[\u3400-\u9FFF]/.test(value ?? "") ? "zh-CN" : "en";
  return n;
}
function searchUrl(values,hash="reading"){
  const url=new URL(appUrl);
  for(const [key,value] of Object.entries(values))if(value)url.searchParams.set(key,value);
  url.hash=hash;
  return url;
}
function paperUrl(id,issue,topic,query){
  const url=new URL("paper/",appUrl);
  url.searchParams.set("id",id);
  if(issue && issue!==issueDefault.key)url.searchParams.set("issue",issue);
  if(topic)url.searchParams.set("topic",topic);
  if(query)url.searchParams.set("q",query);
  return url;
}
function topicNames(p){
  const core=focusTopics[p.track]?.name;
  const raw=p.keywords ?? detail(p).keywords ?? otherTopics.filter(t=>t.keywords.test(p.en+" "+p.summary)).map(t=>t.name);
  return [...new Set([core,detail(p).group,...raw].filter(Boolean))];
}
const group = p => detail(p).group || focusTopics[p.track]?.name || topicNames(p)[0] || "Robotics";
function authors(p,short=false){
  const names=Array.isArray(p.authors)?p.authors:(p.author??"").split("、").filter(Boolean);
  return short && names.length>3 ? names.slice(0,3).join(", ")+" et al." : names.join(", ");
}
function summaryLink(text,url){ return a(text,url,"chip",true); }
function paperChips(p,kw=topicNames(p)){
  const bar=el("div",null,"chips");
  for(const word of kw)bar.append(a(word,searchUrl({topic:word}),"chip"));
  return bar;
}

function readable(value){
  return String(value??"").replace(/\\times\b/g,"×").replace(/\\%/g,"%").replace(/\$/g,"");
}
function automaticPaper(row){
  const notes=reviewNotes[row.id]??{};
  const tags=[...new Set([...(notes.keywords??[]),...(row.topics??[])])];
  const catalogMatches=[
    ["Tactile Sensing",/tactile|visuotactile|tactinf|t-tac|fingertip sensing/i],
    ["Robot RL",/reinforcement learning|policy gradient|\bPPO\b|\bRL\b/i],
    ["Agentic Robots",/agentic robot|code as policies|agent.?as.?policy|coding agents?[^.]*robot control/i],
    ...otherTopics.map(t=>[t.name,t.keywords]),
    ["Humanoid Control",/humanoid|whole-body control/i],
    ["Motion Generation",/motion generation|motion tracking|motion mamba/i]
  ];
  const context=(row.title??"")+" "+(row.abstract??row.brief??"");
  for(const [name,rx] of catalogMatches)if(rx.test(context)&&!tags.includes(name))tags.push(name);
  if(!tags.length){
    const prefix=(row.title??"").match(/^([A-Za-z][A-Za-z0-9.-]{2,22}):/);
    tags.push(prefix?.[1]??"Robotics");
  }
  const track=Object.keys(focusTopics).find(key=>tags.includes(focusTopics[key].name))??"shared";
  return {
    id:row.id,name:notes.name??row.title,en:row.title,track,keywords:tags.slice(0,6),
    first:notes.first??row.first??"",batch:row.batch,date:row.date,kind:row.kind,upvotes:row.upvotes,
    authors:notes.authors??row.authors??[],project:notes.project??row.project,
    picture:notes.picture??row.picture??(row.pdfPreview?.file?radarDataUrl(row.pdfPreview.file):null),
    caption:notes.caption??row.caption??(row.pdfPreview?"Original paper · PDF page "+row.pdfPreview.page:""),
    pdfPage:row.pdfPreview?.page,
    summary:notes.summary??readable(row.brief||row.abstract||""),
    abstract:readable(row.abstract||""),
    why:notes.why??readable(row.reading?.why),
    method:notes.method??readable(row.reading?.method),
    result:notes.results??readable(row.reading?.results),
    caveat:notes.caveat??readable(row.reading?.limitations),
    metric:notes.metric??"",
    sourceDepth:notes.depth??row.reading?.depth??"Abstract brief"
  };
}
function sameBatch(){
  const papers=selectedIssue.papers;
  if(selectedIssue.curated)return papers;
  const edition=batchData(selectedIssue.batch);
  if(!edition)return papers;
  const ids=new Set(papers.map(p=>p.id));
  const extra=(edition.picks??[]).filter(p=>validId(p.id)&&!ids.has(p.id)).slice(0,Math.max(0,5-papers.length));
  return [...papers,...extra.map(recordForCard)];
}
function recordForCard(row){
  const saved=byId.get(row.id)?.p;
  return saved?{...saved,batch:row.batch,kind:row.kind,upvotes:row.upvotes??saved.upvotes}:automaticPaper(row);
}
function communityPapers(){
  if(selectedIssue.community)return selectedIssue.community;
  const edition=batchData(selectedIssue.batch);
  if(!edition)return [];
  const used=new Set(sameBatch().map(p=>p.id));
  return (edition.communityPicks??[]).filter(p=>validId(p.id)&&!used.has(p.id)).slice(0,3).map(automaticPaper);
}
function batchData(day){
  if(!day||!liveSnapshot)return null;
  return day===liveSnapshot.latestBatch?liveSnapshot:liveSnapshot.editions?.[day];
}
function infoFor(day){
  if(!day||!liveSnapshot)return null;
  return day===liveSnapshot.latestBatch?liveSnapshot.editionInfo:liveSnapshot.editions?.[day];
}
function snapshotRows(data){
  return [...(data?.picks??[]),...(data?.communityPicks??[]),
    ...Object.values(data?.editions??{}).flatMap(ed=>[...(ed.picks??[]),...(ed.communityPicks??[])])];
}
function studyPapers(){
  const papers=new Map([...byId.values()].map(({p})=>[p.id,p]));
  for(const row of snapshotRows(liveSnapshot)){
    if(validId(row.id)&&!papers.has(row.id))papers.set(row.id,automaticPaper(row));
  }
  return [...papers.values()];
}

const motion=matchMedia("(prefers-reduced-motion: reduce)");
const observed=new Map();
const managed=new WeakSet();
const paused=new WeakSet();
let playing=null;
function stop(v){
  if(v && !v.paused){
    managed.add(v);
    v.pause();
  }
}
function start(v){
  if(!v.getAttribute("src"))v.src=v.dataset.src;
  if(v.paused)v.play().catch(()=>{});
}
function refreshVideo(){
  const available=[...observed.entries()].filter(([v,r])=>v.isConnected && !v.closest("[hidden]") && !paused.has(v) && r>=.55);
  const next=motion.matches||document.hidden?null:available.sort((a,b)=>b[1]-a[1])[0]?.[0];
  if(playing!==next)stop(playing);
  playing=next;
  if(next)start(next);
}
const observer=new IntersectionObserver(entries=>{
  for(const entry of entries)if(observed.has(entry.target))observed.set(entry.target,entry.intersectionRatio);
  refreshVideo();
},{threshold:[0,.55,.75,1]});
motion.addEventListener("change",refreshVideo);
document.addEventListener("visibilitychange",refreshVideo);

function mediaSource(path){
  if(!safeHTTPS(path))return new URL(path,appUrl).href;
  return path.replace(/^(https:\/\/arxiv\.org\/html\/(\d{4}\.\d{4,5}v\d+)\/)\2\//,"$1");
}
function media(p,{clip,index=0,compact=false,auto=true}={}){
  const f=el("figure",null,compact?"media media-compact":"media");
  const picture=index===0?p.picture:null;
  function still(){
    if(!picture){
      if(p.project && safeHTTPS(p.project))f.append(a("Project media",p.project,"media-fallback",true));
      else if(clip)f.append(a("Open video",clip.src,"media-fallback",true));
      return;
    }
    const img=el("img");
    img.src=mediaSource(picture);
    img.alt=p.caption || p.en;
    img.loading=compact?"lazy":"eager";
    img.decoding="async";
    img.addEventListener("error",()=>{
      img.remove();
      f.append(a(clip?"Open video":"View figure in PDF",clip?.src || pdf(p),"media-fallback",true));
    },{once:true});
    f.append(img);
    if(!compact && p.caption)f.append(lang("figcaption",p.caption));
  }
  if(!safeHTTPS(clip?.src)){
    if(!picture && !p.project){
      if(!compact)return null;
      f.classList.add("media-unavailable");
      f.append(a("Figures in original PDF",pdf(p),"media-fallback",true));
      return f;
    }
    still();return f;
  }
  const shell=el("div",null,"video-shell");
  const v=el("video");
  v.muted=true;v.defaultMuted=true;v.playsInline=true;v.loop=true;
  v.preload=auto?"none":"metadata";
  v.setAttribute("aria-label",clip.caption || p.en+" demo");
  v.dataset.src=clip.src;
  if(clip.poster || picture)v.poster=mediaSource(clip.poster||picture);
  if(!auto || !compact)v.controls=true;
  if(!auto)v.src=clip.src;
  shell.append(v);f.append(shell);
  if(compact){
    const toggle=el("button","Play","video-toggle");toggle.type="button";
    toggle.addEventListener("click",()=>{
      if(v.paused){paused.delete(v);start(v);}else{paused.add(v);v.pause();}
    });
    v.addEventListener("play",()=>{toggle.textContent="Pause";});
    v.addEventListener("pause",()=>{toggle.textContent="Play";});
    shell.append(toggle);
  }
  if(auto){
    observed.set(v,0);
    observer.observe(v);
    if(!compact){
      v.addEventListener("pause",()=>{if(managed.has(v))managed.delete(v);else paused.add(v);});
      v.addEventListener("play",()=>paused.delete(v));
      if(motion.matches)v.src=clip.src;
    }
  }
  v.addEventListener("error",()=>{
    observer.unobserve(v);observed.delete(v);
    f.replaceChildren();still();
  },{once:true});
  if(!compact && clip.caption)f.append(lang("figcaption",clip.caption));
  return f;
}

function pruneMedia(){
  for(const video of observed.keys())if(!video.isConnected){stop(video);observer.unobserve(video);observed.delete(video);}
}

function radarDataUrl(path){
  if(location.hostname.endsWith(".github.io")){
    const owner=location.hostname.split(".")[0];
    const repo=appUrl.pathname.split("/").filter(Boolean)[0];
    if(/^[\w.-]+$/.test(repo||""))return "https://raw.githubusercontent.com/"+owner+"/"+repo+"/radar-data/"+path;
  }
  return "https://raw.githubusercontent.com/lemonpower/robotics-digest/radar-data/"+path;
}
async function readJSON(path){
  const response=await fetch(radarDataUrl(path), {signal:AbortSignal.timeout(7500)});
  return response.ok?response.json():null;
}
function getSnapshot(){
  if(!snapshotPromise)snapshotPromise=readJSON("radar.json").catch(()=>null);
  return snapshotPromise;
}

function renderCard(p,query){
  const row=el("article",null,"paper-card");
  const copy=el("div",null,"paper-copy");
  const title=el("h3");
  title.append(a(p.en,paperUrl(p.id,selectedIssue.key,selectedTopic,query),"paper-title"));
  copy.append(title);
  const names=authors(p,true);
  if(names)copy.append(el("p",names,"authors"));
  const date=p.first?formatDate(p.first):(p.batch?"arXiv batch · "+formatDate(p.batch):formatDate(p.date));
  const kind=[date,p.sourceDepth,Number.isInteger(p.upvotes)?"Robotica · "+p.upvotes+" upvotes":""].filter(Boolean);
  if(kind.length)copy.append(el("p",kind.join(" · "),"muted"));
  const summary=p.cardSummary??p.summary;
  if(summary)copy.append(lang("p",summary,"card-summary"));
  else copy.append(a("Read abstract on arXiv",arxiv(p),"subtle-link",true));
  copy.append(paperChips(p));
  const m=media(p,{clip:detail(p).videos?.[0],compact:true});
  if(m)row.append(m);else row.classList.add("no-media");
  row.append(copy);
  return row;
}
function updateIndex(sync=false){
  const raw=$("search").value.trim();
  if(sync)history.replaceState(null,"",searchUrl({issue:selectedIssue.key===issueDefault.key?"":selectedIssue.key,topic:selectedTopic,q:raw}));
  $("issue").value=selectedIssue.key;
  const filter=$("active-filter");
  filter.replaceChildren();
  if(selectedTopic)filter.append(a(selectedTopic+" ×",searchUrl({issue:selectedIssue.key===issueDefault.key?"":selectedIssue.key,q:raw}),"chip"));
  const cross=!!(selectedTopic||raw);
  $("issue-title").textContent=selectedTopic || (raw ? "Search results" : titleOf(selectedIssue));
  const meta=infoFor(selectedIssue.batch);
  $("issue-label").textContent=cross?"":selectedIssue.batch?"arXiv batch · "+formatDate(selectedIssue.batch):selectedIssue.noAnnouncements?formatDate(selectedIssue.date):"Selected readings";
  if(!cross&&selectedIssue.curated)$("issue-label").textContent="Beijing edition · "+formatDate(selectedIssue.date)+"  /  "+$("issue-label").textContent+" (ET)";
  const insights=(selectedIssue.insights??[]).map(([, ,blurb])=>lang("p",blurb));
  if(selectedIssue.curated&&selectedIssue.scope)insights.push(lang("p","检索："+selectedIssue.time+"。"+selectedIssue.scope));
  if(!selectedIssue.curated&&meta?.signals?.length){
    const signal=meta.signals.map(k=>k.name+" "+k.count).join(" · ");
    insights.unshift(lang("p","题名中反复出现的方向："+signal+"。同一论文可以命中多个方向；这不是点赞或质量排序。"));
  }
  $("brief").hidden=cross||!insights.length;
  $("insights").replaceChildren(...insights);
  const needles=norm(raw).split(/\s+/).filter(Boolean);
  const source=cross?studyPapers().sort((a,b)=>(b.first||b.batch||b.date||"").localeCompare(a.first||a.batch||a.date||"")):sameBatch();
  const shown=source.filter(p=>{
    const words=topicNames(p);
    if(selectedTopic&&!words.includes(selectedTopic))return false;
    const text=norm([p.en,p.name,authors(p),p.id,p.cardSummary,p.summary,p.method,...words].join(" "));
    return needles.every(token=>text.includes(token));
  });
  $("count").textContent=shown.length+(shown.length===1?" paper":" papers");
  if(!cross){
    if(meta?.total)$("issue-label").textContent+=" · "+meta.total+" listed"+(shown.length?" · "+shown.length+" selected":"");
    else if(shown.length)$("issue-label").textContent+=" · "+$("count").textContent;
  }
  const buckets=new Map();
  for(const p of shown){
    const key=selectedTopic||group(p);
    if(!buckets.has(key))buckets.set(key,[]);
    buckets.get(key).push(p);
  }
  const groups=[...buckets].map(([label,items])=>{
    const block=el("section",null,"paper-group");
    const h=el("h2",label,"group-label");
    h.append(el("span",String(items.length),"group-count"));
    block.append(h,...items.map(p=>renderCard(p,raw)));
    return block;
  });
  $("papers").replaceChildren(...(groups.length?groups:selectedIssue.noAnnouncements&&!cross?[el("p","arXiv Robotics published no new batch on this date.","muted empty")]:selectedIssue.automated&&!cross?[]:[el("p","No matching papers.","muted empty")]));
  renderCompare(shown);
  renderCommunity(cross?[]:communityPapers(),cross?[]:(selectedIssue.additional??[]),raw);
  renderBatchIndex(cross?null:meta);
  pruneMedia();
}
function renderCompare(rows){
  $("compare").hidden=rows.length<2;
  $("compare").open=false;
  if(rows.length<2)return;
  const table=el("table");
  const head=el("thead"), heading=el("tr");
  for(const label of ["Paper","Method","Result"])heading.append(el("th",label));
  head.append(heading);table.append(head);
  const tbody=el("tbody");
  for(const p of rows){
    const line=el("tr");
    line.append(el("th",p.name),lang("td",p.summary),lang("td",p.metric));
    tbody.append(line);
  }
  table.append(tbody);$("comparison").replaceChildren(table);
}

function loadTopics(){
  const papers=studyPapers();
  const usedTopics=new Set(papers.flatMap(topicNames));
  $("topic-list").replaceChildren();
  for(const name of catalog.filter(t=>usedTopics.has(t))){
    const n=papers.filter(p=>topicNames(p).includes(name)).length;
    const card=a("",searchUrl({topic:name}),"topic-entry");
    card.append(el("strong",name),el("span",n+(n===1?" paper":" papers")));
    $("topic-list").append(card);
  }
}
function selectNav(){
  const hash=location.hash.slice(1);
  const panel=hash.startsWith("trend-")?"radar":(["topics","radar","history"].includes(hash)?hash:"reading");
  for(const n of document.querySelectorAll("[data-panel]"))n.hidden=n.id!==panel;
  for(const nav of document.querySelectorAll("[data-nav]")){
    if(nav.dataset.nav===panel)nav.setAttribute("aria-current","page");
    else nav.removeAttribute("aria-current");
  }
  const jmp=$(hash);
  if(hash.startsWith("trend-")&&jmp?.matches("details")){
    jmp.open=true;jmp.scrollIntoView({block:"start"});
  }else window.scrollTo(0,0);
  if(panel==="radar")renderRadar();
  refreshVideo();
}
function showIndex(){
  const old=location.hash.match(/^#paper-(\d{4}\.\d{4,5})$/);
  if(old && byId.has(old[1])){
    location.replace(paperUrl(old[1],params.get("issue"),selectedTopic,params.get("q")));
    return;
  }
  $("search").value=params.get("q")??"";
  renderEditions();
  $("issue").addEventListener("change",event=>{
    selectedIssue=descending.find(x=>x.key===event.target.value)??issueDefault;
    selectedTopic="";$("search").value="";updateIndex(true);
  });
  $("search-form").addEventListener("submit",e=>e.preventDefault());
  $("search").addEventListener("input",()=>updateIndex(true));
  loadTopics();updateIndex();
  window.addEventListener("hashchange",selectNav);
  selectNav();
  getSnapshot().then(data=>{
    liveSnapshot=data;
    for(const day of [data?.latestBatch,...Object.keys(data?.editions??{})]){
      if(validEdition(day)&&!descending.some(i=>i.batch===day))descending.push({key:day,batch:day,date:day,title:"Daily Papers",automated:true,papers:[]});
    }
    for(const day of data?.week?.noAnnouncements??[]){
      if(validEdition(day)&&!descending.some(i=>i.key===day))descending.push({key:day,date:day,title:"No arXiv Batch",noAnnouncements:true,papers:[]});
    }
    descending.sort((a,b)=>b.date.localeCompare(a.date));
    const requested=findIssue(params.get("issue"));
    const latest=descending.find(i=>i.batch===data?.latestBatch);
    if(requested)selectedIssue=requested;
    else if(latest && !selectedTopic&&!$("search").value.trim()&&selectedIssue===issueDefault)selectedIssue=latest;
    renderEditions();
    loadTopics();updateIndex();addNavTopics(data);
  });
}
function renderEditions(){
  const options=[], archive=[];
  for(const issue of [...descending].sort((a,b)=>Number(Boolean(b.batch||b.noAnnouncements))-Number(Boolean(a.batch||a.noAnnouncements))||b.date.localeCompare(a.date))){
    const option=el("option",issue.noAnnouncements?formatDate(issue.date)+" · No batch":editionName(issue));option.value=issue.key;options.push(option);
    const entry=a("",searchUrl({issue:issue.key}),"archive-entry");
    const edition=batchData(issue.batch);
    const count=issue.curated?issue.papers.length:Math.min(5,new Set([...issue.papers.map(p=>p.id),...(edition?.picks??[]).map(p=>p.id)]).size);
    const meta=infoFor(issue.batch);
    const caption=issue.noAnnouncements?"No new papers":meta?.total?meta.total+" listed · "+count+" selected":count+(count===1?" paper":" papers");
    entry.append(el("time",formatDate(issue.curated?issue.date:issue.batch??issue.date)),el("strong",titleOf(issue)),el("span",caption));
    archive.push(entry);
  }
  $("issue").replaceChildren(...options);$("archive-list").replaceChildren(...archive);
}
const batchLoads=new Map();
function loadBatch(day){
  if(!validEdition(day))return Promise.resolve(null);
  if(!batchLoads.has(day))batchLoads.set(day,readJSON("batches/"+day+".json").catch(()=>null));
  return batchLoads.get(day);
}
function renderBatchIndex(meta){
  const display=$("batch-index"), label=$("batch-index-label"), list=$("batch-index-list");
  if(!display)return;
  if(!meta?.total || !selectedIssue.batch){display.hidden=true;display.open=false;display.dataset.batch="";return;}
  const day=selectedIssue.batch;
  display.hidden=false;
  label.textContent="All Papers in This Batch · "+meta.total;
  if(display.dataset.batch===day)return;
  display.open=false;display.dataset.batch=day;
  list.replaceChildren();
  $("batch-search").value="";
  const counts=meta.counts??{};
  $("batch-index-count").textContent=[counts.new?counts.new+" new":null,counts.cross?counts.cross+" cross-lists":null,
       counts.listed?counts.listed+" unclassified":null].filter(Boolean).join(" · ");
  if(!display.dataset.bound){
    display.dataset.bound="true";
    display.addEventListener("toggle",async ()=>{
      if(!display.open)return;
      const opened=display.dataset.batch;
      list.replaceChildren(el("li","Loading listing…","muted"));
      const batch=await loadBatch(opened);
      if(display.dataset.batch!==opened)return;
      displayPapers(batch,opened);
    });
    $("batch-search").addEventListener("input",async ()=>{
      const opened=display.dataset.batch;
      const batch=await loadBatch(opened);
      if(display.dataset.batch===opened)displayPapers(batch,opened);
    });
  }
}
function displayPapers(data,day){
  const dest=$("batch-index-list");
  if(data?.batch!==day||!Array.isArray(data.papers)){
    const error=el("li","Index unavailable. ");
    error.append(a("Open arXiv Robotics","https://arxiv.org/list/cs.RO/recent",null,true));
    dest.replaceChildren(error);return;
  }
  const terms=norm($("batch-search").value).split(/\s+/).filter(Boolean);
  const visible=data.papers.filter(row=>validId(row.id)&&terms.every(term=>norm([row.title,row.id,...(row.authors??[])].join(" ")).includes(term)));
  dest.replaceChildren(...(visible.length?visible.map(row=>{
    const line=el("li",null,"batch-entry");
    const body=el("div");
    body.append(a(row.title,paperUrl(row.id,day),"paper-title"));
    const who=[row.kind==="new"?"New":row.kind==="cross"?"Cross-list":"Listed",authors(row,true),row.id].filter(Boolean);
    body.append(el("p",who.join(" · "),"muted"));
    line.append(body,a("arXiv",arxiv(row),"subtle-link",true));return line;
  }):[el("li","No matching papers.","muted")]));
}
const validEdition = day => /^\d{4}-\d{2}-\d{2}$/.test(day??"");
async function showPaper(){
  const body=$("paper-body");
  $("back-to-digest").href=searchUrl({issue:params.get("issue"),topic:params.get("topic"),q:params.get("q")});
  const id=params.get("id");
  if(!validId(id)){body.append(el("h1","Paper not found"));return;}
  let p=byId.get(id)?.p;
  if(!p){
    body.append(el("p","Loading paper…","muted"));
    const snapshot=await getSnapshot();
    let listed=[...snapshotRows(snapshot),...(snapshot?.latestPapers??[]),
      ...[...(snapshot?.topics??[]),...(snapshot?.archivedTopics??[])].flatMap(t=>t.papers??[])].find(p=>p.id===id);
    if(!listed&&validEdition(params.get("issue"))){
      const batch=await loadBatch(params.get("issue"));
      listed=batch?.papers?.find(p=>p.id===id);
    }
    body.replaceChildren();
    if(!listed){
      body.append(el("h1","Paper details"),summaryLink("Open on arXiv",arxiv({id})));
      return;
    }
    p=automaticPaper(listed);
  }
  const data=detail(p);
  document.title=p.en+" · Robotics Digest";
  const head=el("header",null,"reader-header");
  head.append(el("h1",p.en));
  if(authors(p))head.append(el("p",authors(p),"authors"));
  const date=p.first?formatDate(p.first):p.batch?"arXiv batch · "+formatDate(p.batch):formatDate(p.date);
  const facts=el("p",[date,data.revision?version(p)+" updated "+formatDate(data.revision):"",p.sourceDepth,
      Number.isInteger(p.upvotes)?"Robotica · "+p.upvotes+" upvotes":""].filter(Boolean).join(" · "),"muted");
  head.append(facts);
  const links=el("div",null,"chips reader-links");
  links.append(summaryLink("arXiv",arxiv(p)),summaryLink("PDF",pdf(p)));
  if(p.abstractZh)links.append(summaryLink("Full text",html(p)));
  if(p.project && safeHTTPS(p.project))links.append(summaryLink("Project page",p.project));
  head.append(links,paperChips(p));
  body.append(head);
  const mainMedia=media(p,{clip:data.videos?.[0]});
  if(mainMedia){mainMedia.classList.add("hero-media");body.append(mainMedia);}
  const recap=el("p",null,"tldr");
  const abstract=p.abstractZh??p.summary;
  recap.append(el("strong",p.abstractZh?"Abstract":"TL;DR"),abstract?lang("span",abstract):a("Read abstract on arXiv",arxiv(p),null,true));
  body.append(recap);
  if(data.why||p.why)body.append(section("What they do",data.why??p.why));
  for(const [name,content] of [["How it works",p.method],["Results",data.results??p.result],["Limitations",p.caveat]]){
    if(content)body.append(section(name,content));
  }
  if(p.abstract && p.sourceDepth){
    const disclosure=el("details",null,"issue-brief");
    disclosure.append(el("summary",p.originalReading?"Original English":"Original abstract"));
    if(p.originalReading)disclosure.append(el("h3","Original abstract"));
    disclosure.append(lang("p",p.abstract));
    for(const [key,label] of [["why","What they do"],["method","How it works"],["results","Results"],["limitations","Limitations"]]){
      const content=p.originalReading?.[key];
      if(content)disclosure.append(lang("p",label+": "+readable(content)));
    }
    body.append(disclosure);
  }
  if(data.videos?.length>1){
    const more=section("Videos",null,true);
    const layout=el("div",null,"video-grid");
    data.videos.slice(1).forEach((clip,i)=>{const m=media(p,{clip,index:i+1,auto:false});if(m)layout.append(m);});
    more.append(layout);body.append(more);
  }
  const figures=section("Figures",null,true);
  const gallery=el("div",null,"gallery");
  figures.append(gallery);
  body.append(figures);
  fillGallery(p,gallery);
}
function section(title,content,part=false){
  const n=el("section",null,part?"reader-section gallery-section":"reader-section");
  n.append(el("h2",title));
  if(Array.isArray(content)){
    const ul=el("ul");for(const line of content)ul.append(lang("li",line));
    n.append(ul);
  }else if(content){
    for(const paragraph of String(content).split(/\n\s*\n/).filter(Boolean))n.append(lang("p",paragraph));
  }
  return n;
}
function figure(item){
  const outer=el("figure");
  const img=el("img");
  img.loading="lazy";img.decoding="async";
  img.src=mediaSource(item.src);img.alt=item.caption || "Figure from the original paper";
  const zoom=a("",img.src,"figure-link",true);zoom.append(img);
  img.addEventListener("error",()=>{zoom.replaceChildren(el("span","Open original figure","media-fallback"));},{once:true});
  outer.append(zoom);
  if(item.caption)outer.append(lang("figcaption",item.caption));
  return outer;
}
function fillGallery(p,gallery){
  const data=detail(p), collected=new Map();
  for(const item of data.figures??[])collected.set(mediaSource(item.src),item);
  if(p.picture&&!collected.has(mediaSource(p.picture)))collected.set(mediaSource(p.picture),{src:p.picture,caption:p.caption});
  const fallback=a("View figures in the PDF",pdf(p)+(p.pdfPage?"#page="+p.pdfPage:""),"subtle-link",true);
  const render=()=>gallery.replaceChildren(...[...collected.values()].map(figure),fallback);
  render();
  readJSON("figures/"+p.id+".json").then(manifest=>{
    if(manifest?.version!==version(p)||!Array.isArray(manifest.figures))return;
    let changed=false;
    for(const item of manifest.figures){
      if(typeof item.src==="string"&&item.src.startsWith(html(p)+"/")&&!collected.has(mediaSource(item.src))){
        collected.set(mediaSource(item.src),item);changed=true;
      }
    }
    if(changed)render();
  }).catch(()=>{});
}

function addNavTopics(data){
  if(!data?.topics?.length)return;
  const menu=$("trending-nav");
  const list=$("trending-menu");
  const populate=()=>{
    if(!list)return;
    const links=data.topics.filter(t=>/^[\w-]+$/.test(t.id)).slice(0,12).map(t=>{
      const link=a(trendNames[t.id]??t.name,searchUrl({},"trend-"+t.id));
      return link;
    });
    list.replaceChildren(...links);
    menu.hidden=!links.length;
    list.addEventListener("click",()=>{menu.open=false;});
  };
  populate();
}

function itemRow(p,{full=false,community=false}={}){
  if(!validId(p?.id))return null;
  const article=el("article",null,"radar-item");
  const title=el("h3");
  title.append(a(p.title,paperUrl(p.id),"paper-title"));
  article.append(title);
  const meta=[p.kind==="cross"?"Cross-list":p.kind==="new"?"New":null,formatDate(p.batch??p.date),
              Number.isInteger(p.upvotes)?"Robotica · "+p.upvotes+" upvotes":null].filter(Boolean);
  if(meta.length)article.append(el("p",meta.join(" · "),"muted"));
  if(p.brief)article.append(lang("p",p.brief));
  if(full&&p.abstract){
    const more=el("details");more.append(el("summary","Abstract"),lang("p",p.abstract));article.append(more);
  }
  if(community&&!p.brief)article.append(a("Read arXiv abstract",arxiv(p),"subtle-link",true));
  return article;
}
function renderCommunity(papers,additional,query){
  const dest=$("daily-picks");
  dest.hidden=!(papers.length||additional.length);
  const sections=[];
  if(additional.length)sections.push(el("h2","Additional Papers"),...additional.map(p=>renderCard(p,query)));
  if(papers.length)sections.push(el("h2","Community Picks"),el("p","Recent papers from Robotica","muted"),...papers.map(p=>renderCard(p,query)));
  dest.replaceChildren(...sections);
}
let radarDrawn=false;
async function renderRadar(){
  if(radarDrawn)return;
  const data=await getSnapshot();
  if(radarDrawn)return;
  radarDrawn=true;
  const status=$("radar-status"), dest=$("radar-topics");
  if(!data?.latestBatch){status.textContent="No batch available yet.";return;}
  const asOf=formatDate(data.latestBatch);
  status.textContent=asOf+" · "+data.paperCount+" papers · "+data.batchCount+(data.batchCount===1?" batch":" batches")+
    (data.roboticaStatus==="live"?" · Robotica linked":data.roboticaStatus==="cached"?" · Robotica cached":"");
  const valid=t=>/^[\w-]+$/.test(t.id);
  const active=(data.topics??[]).filter(valid);
  const archived=(data.archivedTopics??[]).filter(valid);
  for(const t of active)dest.append(trendCard(t));
  if(!active.length)dest.append(el("p","No topic has met the threshold yet.","muted"));
  if(archived.length){
    const block=el("details",null,"radar-entry");
    block.append(el("summary","Past topics"),...archived.map(trendCard));dest.append(block);
  }
  const latest=el("details",null,"radar-entry");
  latest.append(el("summary","Latest arXiv batch"),...(data.latestPapers??[]).map(p=>itemRow(p,{full:true})).filter(Boolean));
  dest.append(latest);
  const anchor=$(location.hash.slice(1));
  if(anchor?.matches("details")){
    anchor.open=true;const parent=anchor.parentElement.closest("details");if(parent)parent.open=true;anchor.scrollIntoView({block:"start"});
  }
}
function trendCard(t){
  const n=el("details",null,"radar-entry");
  n.id="trend-"+t.id;
  const h=el("summary",trendNames[t.id]??t.name);
  h.append(el("span",t.count+" papers · "+t.batches+" dates"+(t.communityCount?" · "+t.communityCount+" on Robotica":"")));
  n.append(h,...(t.papers??[]).filter(row=>validId(row.id)).map(row=>renderCard(byId.get(row.id)?.p??automaticPaper(row),"")));
  return n;
}

if($("paper-page"))showPaper();else showIndex();
