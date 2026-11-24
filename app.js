"use strict";

const $ = id => document.getElementById(id);
const appUrl = new URL($("paper-page") ? "../" : "./", location.href);
const params = new URLSearchParams(location.search);
const descending = [...issues].sort((a,b) => b.date.localeCompare(a.date));
const byId = new Map(issues.flatMap(issue => issue.papers.map(p => [p.id,{p,issue}])));
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
const detail = p => editorial[p.id] ?? {};
const version = p => detail(p).version ?? "v1";
const arxiv = p => "https://arxiv.org/abs/"+p.id;
const pdf = p => "https://arxiv.org/pdf/"+p.id+version(p);
const html = p => "https://arxiv.org/html/"+p.id+version(p);
const EnglishDate = new Intl.DateTimeFormat("en",{year:"numeric",month:"short",day:"numeric",timeZone:"UTC"});
const formatDate = day => /^\d{4}-\d{2}-\d{2}$/.test(day ?? "") ? EnglishDate.format(new Date(day+"T00:00:00Z")) : "";
const titleOf = issue => oldNames[issue.key] ?? issue.title;
const editionName = issue => issue.batch ? formatDate(issue.batch) : titleOf(issue);
const validId = id => /^\d{4}\.\d{4,5}$/.test(id ?? "");
const safeHTTPS = s => typeof s==="string" && /^https:\/\//i.test(s);
const issueDefault = descending.find(issue=>issue.batch);
let selectedIssue = descending.find(issue=>issue.key===params.get("issue")) ?? issueDefault;
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
  const raw=detail(p).keywords ?? otherTopics.filter(t=>t.keywords.test(p.en+" "+p.summary)).map(t=>t.name);
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

function mediaSource(path){return safeHTTPS(path)?path:new URL(path,appUrl).href;}
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
    if(!picture && !p.project)return null;
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
  if(p.author)copy.append(el("p",authors(p,true),"authors"));
  copy.append(el("time",formatDate(p.first),"muted"),lang("p",p.summary,"card-summary"));
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
  $("issue-label").textContent=cross?"":selectedIssue.batch?"arXiv batch · "+formatDate(selectedIssue.batch):"Selected readings";
  $("brief").hidden=cross||!selectedIssue.insights?.length||selectedIssue.papers.length<2;
  $("insights").replaceChildren(...(selectedIssue.insights??[]).map(([, ,blurb])=>lang("p",blurb)));
  const needles=norm(raw).split(/\s+/).filter(Boolean);
  const source=cross?[...byId.values()].map(x=>x.p).sort((a,b)=>b.first.localeCompare(a.first)):selectedIssue.papers;
  const shown=source.filter(p=>{
    const words=topicNames(p);
    if(selectedTopic&&!words.includes(selectedTopic))return false;
    const text=norm([p.en,p.name,p.author,p.id,p.summary,p.method,...words].join(" "));
    return needles.every(token=>text.includes(token));
  });
  $("count").textContent=shown.length+(shown.length===1?" paper":" papers");
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
  $("papers").replaceChildren(...(groups.length?groups:selectedIssue.automated&&!cross?[]:[el("p","No matching papers.","muted empty")]));
  pruneMedia();
  renderCompare(shown);
  loadDailyPicks();
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
  const usedTopics=new Set([...byId.values()].flatMap(({p})=>topicNames(p)));
  $("topic-list").replaceChildren();
  for(const name of catalog.filter(t=>usedTopics.has(t))){
    const n=[...byId.values()].filter(({p})=>topicNames(p).includes(name)).length;
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
  for(const issue of descending){
    const option=el("option",editionName(issue));option.value=issue.key;$("issue").append(option);
    const entry=a("",searchUrl({issue:issue.key}),"archive-entry");
    entry.append(el("time",formatDate(issue.batch??issue.date)),el("strong",titleOf(issue)),el("span",issue.papers.length+(issue.papers.length===1?" paper":" papers")));
    $("archive-list").append(entry);
  }
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
    if(validEdition(data?.latestBatch)&&!descending.some(i=>i.batch===data.latestBatch)){
      const latest={key:data.latestBatch,batch:data.latestBatch,date:data.latestBatch,title:"Latest Papers",automated:true,papers:[]};
      descending.unshift(latest);
      const option=el("option",editionName(latest));option.value=latest.key;$("issue").prepend(option);
      if(params.get("issue")===latest.key||(!params.has("issue")&&!selectedTopic&&!$("search").value.trim()&&selectedIssue===issueDefault)){
        selectedIssue=latest;updateIndex();
      }
    }
    addNavTopics(data);
  });
}
const validEdition = day => /^\d{4}-\d{2}-\d{2}$/.test(day??"");
async function showPaper(){
  const body=$("paper-body");
  $("back-to-digest").href=searchUrl({issue:params.get("issue"),topic:params.get("topic"),q:params.get("q")});
  const paper=byId.get(params.get("id"));
  if(!paper){
    const id=params.get("id");
    if(!validId(id)){body.append(el("h1","Paper not found"));return;}
    body.append(el("p","Loading paper…","muted"));
    const snapshot=await getSnapshot();
    const listed=[...(snapshot?.picks??[]),...(snapshot?.latestPapers??[]),...(snapshot?.communityPicks??[]),
      ...[...(snapshot?.topics??[]),...(snapshot?.archivedTopics??[])].flatMap(t=>t.papers??[])].find(p=>p.id===id);
    body.replaceChildren();
    if(!listed){
      body.append(el("h1","Paper details"),summaryLink("Open on arXiv",arxiv({id})));
      return;
    }
    document.title=listed.title+" · Robotics Digest";
    const head=el("header",null,"reader-header");
    head.append(el("h1",listed.title));
    if(authors(listed))head.append(el("p",authors(listed),"authors"));
    const date=listed.batch?"arXiv batch · "+formatDate(listed.batch):formatDate(listed.date);
    const facts=[date,Number.isInteger(listed.upvotes)?"Robotica · "+listed.upvotes+" upvotes":""].filter(Boolean).join(" · ");
    if(facts)head.append(el("p",facts,"muted"));
    const sources=el("div",null,"chips");
    sources.append(summaryLink("arXiv",arxiv(listed)),summaryLink("PDF","https://arxiv.org/pdf/"+listed.id));
    head.append(sources);body.append(head);
    if(listed.brief)body.append(section("Abstract Brief",listed.brief));
    if(listed.abstract)body.append(section("Abstract",listed.abstract));
    if(!listed.abstract&&!listed.brief)body.append(a("Read the abstract on arXiv",arxiv(listed),"subtle-link",true));
    return;
  }
  const {p}=paper;
  const data=detail(p);
  document.title=p.en+" · Robotics Digest";
  const head=el("header",null,"reader-header");
  head.append(el("h1",p.en),el("p",authors(p),"authors"));
  const facts=el("p",formatDate(p.first)+(data.revision?" · "+version(p)+" updated "+formatDate(data.revision):""),"muted");
  head.append(facts);
  const links=el("div",null,"chips reader-links");
  links.append(summaryLink("arXiv",arxiv(p)),summaryLink("PDF",pdf(p)));
  if(p.project && safeHTTPS(p.project))links.append(summaryLink("Project page",p.project));
  head.append(links,paperChips(p));
  body.append(head);
  const mainMedia=media(p,{clip:data.videos?.[0]});
  if(mainMedia){mainMedia.classList.add("hero-media");body.append(mainMedia);}
  const recap=el("p",null,"tldr");
  recap.append(el("strong","TL;DR"),lang("span",p.summary));
  body.append(recap);
  if(data.why)body.append(section("What they do",data.why));
  body.append(section("How it works",p.method),section("Results",data.results??p.result),section("Limitations",p.caveat));
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
  }else if(content)n.append(lang("p",content));
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
  for(const item of data.figures??[])collected.set(item.src,item);
  if(p.picture&&!collected.has(p.picture))collected.set(p.picture,{src:p.picture,caption:p.caption});
  const fallback=a("View figures in the PDF",pdf(p),"subtle-link",true);
  const render=()=>gallery.replaceChildren(...[...collected.values()].map(figure),fallback);
  render();
  readJSON("figures/"+p.id+".json").then(manifest=>{
    if(manifest?.version!==version(p)||!Array.isArray(manifest.figures))return;
    let changed=false;
    for(const item of manifest.figures){
      if(typeof item.src==="string"&&item.src.startsWith(html(p)+"/")&&!collected.has(item.src)){
        collected.set(item.src,item);changed=true;
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
async function loadDailyPicks(){
  const dest=$("daily-picks");
  if(!dest) return;
  if(selectedTopic||$("search").value.trim()) {dest.hidden=true;return;}
  const issue=selectedIssue;
  const extra=await getSnapshot();
  if(issue!==selectedIssue||selectedTopic||$("search").value.trim())return;
  if(!extra?.latestBatch||issue.batch!==extra.latestBatch){dest.hidden=true;return;}
  const prefs=new Set(issue.papers.map(p=>p.id));
  const curated=(extra.picks??[]).filter(p=>!prefs.has(p.id)).slice(0,Math.max(0,5-issue.papers.length));
  const community=(extra.communityPicks??[]).filter(p=>!prefs.has(p.id)).slice(0,3);
  const children=[];
  if(curated.length){
    const block=section(issue.automated?"Daily picks":"More from this batch");
    block.append(el("p","Abstract briefs","muted"),...curated.map(p=>itemRow(p)).filter(Boolean));children.push(block);
  }
  if(community.length){
    const block=section("Community picks");
    block.append(el("p","Recent papers · not necessarily in this batch","muted"),...community.map(p=>itemRow(p,{community:true})).filter(Boolean));children.push(block);
  }
  dest.replaceChildren(...children);
  dest.hidden=!children.length;
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
  n.append(h,...(t.papers??[]).map(p=>itemRow(p,{full:true})).filter(Boolean));
  return n;
}

if($("paper-page"))showPaper();else showIndex();
