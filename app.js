"use strict";
const $ = (id) => document.getElementById(id);
const allPapers = issues.flatMap(issue => issue.papers);
const translations = {
  "2610.31762":"在自构造表征空间中预测未来的导航基础模型",
  "2610.31779":"面向大规模机器人数据引擎的开放模型套件",
  "2610.31834":"从真实机器人示范生成可交互数字孪生",
  "2610.31845":"用带噪第一视角动作扩展策略学习",
  "2610.32941":"回退再试：冻结 VLA 的轻量失败恢复",
  "2610.30876":"人形移动操作统一测试平台",
  "2610.31166":"人形移动操作需要先前事件的记忆",
  "2610.30991":"统一视觉语义与四维几何的世界动作模型",
  "2610.31423":"未来意图引导的 VLA 动态视角路由",
  "2610.31617":"结合世界模型与可微仿真的四旋翼控制",
  "2610.28480":"用共享可微世界模型扩展人形全身控制",
  "2611.20452":"一分钟内学习人形运动跟踪和地形移动",
  "2611.27648":"用梯度截断改进人形运动跟踪"
};
const names = {all:"全部论文", ...Object.fromEntries(Object.entries(focusTopics).map(([key, value])=>[key,value.name])), shared:"其他方向"};
const byRecent = [...issues].sort((a,b)=>b.date.localeCompare(a.date));
const url = new URL(location.href);
let selectedIssue = issues.find(issue=>issue.key===url.searchParams.get("issue"))?.key ?? byRecent.find(issue=>issue.batch).key;
let selectedTrack = Object.hasOwn(names,url.searchParams.get("track")) ? url.searchParams.get("track") : "all";
let shown = [];
let lastFocus = null;
const dialog = $("detail");
dialog.setAttribute("aria-labelledby","reader-label");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const mediaCandidates = new Map();
const mediaObserver = new IntersectionObserver(entries=>{
  for (const entry of entries) mediaCandidates.set(entry.target,entry.intersectionRatio);
  updateVideo();
},{threshold:[0,.45,.65,.85,1]});
const manualPauses = new WeakSet();
function updateVideo(){
  const eligible=[...mediaCandidates].filter(([video,ratio])=>video.isConnected && !video.closest("[hidden]") && !manualPauses.has(video) && ratio>=.45);
  const target=eligible.sort((a,b)=>b[1]-a[1])[0]?.[0];
  for(const video of mediaCandidates.keys()){
    if(!dialog.open && !reducedMotion.matches && !document.hidden && video===target){
      if(!video.src) video.src=video.dataset.src;
      if(video.paused) video.play().catch(()=>{});
    } else if(!video.paused) video.pause();
  }
}
reducedMotion.addEventListener("change",updateVideo);
document.addEventListener("visibilitychange",updateVideo);

function node(tag, text, className) {
  const element = document.createElement(tag);
  if (text !== null && text !== undefined) element.textContent = text;
  if (className) element.className = className;
  return element;
}
function link(text, href, className) {
  const a = node("a",text,className);
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener";
  return a;
}
const tag = key => node("span",names[key] || tracks[key],"tag "+key);
const abs = paper => "https://arxiv.org/abs/"+paper.id;
const details = paper => editorial[paper.id] ?? {};
const version = paper => details(paper).version ?? "v1";
const html = paper => "https://arxiv.org/html/"+paper.id+version(paper);
const pdf = paper => "https://arxiv.org/pdf/"+paper.id+version(paper);
const keywords = paper => details(paper).keywords ?? otherTopics.filter(t=>t.keywords.test(paper.en+" "+paper.summary)).map(t=>t.name);
const zh = p => details(p).zh || translations[p.id] || p.name;
function selectTrack(key){
  selectedTrack=key;
  $("search").value="";
  update();
}
for (const [key, topic] of Object.entries(focusTopics)){
  const card=node("button",null,"topic-card "+key);
  card.type="button";
  card.append(node("span",topic.en,"topic-en"),node("strong",topic.name),node("span",topic.description,"topic-desc"));
  card.addEventListener("click",()=>{
    selectTrack(key);
    history.replaceState(null,"","?track="+key+"#reading");
    $("reading").scrollIntoView();
  });
  $("topic-list").append(card);
}

function drawField() {
  const lines = $("traces");
  for (let i=0;i<41;i++) {
    const path = document.createElementNS("http://www.w3.org/2000/svg","path");
    const k = (i-20)/20;
    const coords = [];
    for(let j=0;j<=145;j++) {
      const t=j/145, w=2*Math.PI*t;
      const rx=175+k*37, ry=100+k*37;
      const x=349+rx*Math.cos(w)+(34+15*k)*Math.cos(2*w+.72)+20*Math.sin(3*w+k);
      const y=222+ry*Math.sin(w)*.92+66*Math.sin(2*w+.45+k*.54)-37*Math.cos(w)+15*k*Math.sin(3*w);
      coords.push((j ? "L" : "M")+x.toFixed(1)+" "+y.toFixed(1));
    }
    path.setAttribute("d",coords.join("")+"Z");
    path.setAttribute("stroke","url(#filament)");
    path.setAttribute("stroke-width",i%5===0?"1.3":".82");
    path.setAttribute("opacity",i%5===0?".88":".58");
    lines.append(path);
  }
}

for (const issue of byRecent) {
  const option = node("option",issue.batch ? issue.date : issue.key==="supermimic" ? "专题 · SuperMimic" : "专题 · 入门选读");
  option.value = issue.key;
  $("issue").append(option);
  const entry=node("button",null,"archive-item");
  entry.type="button";
  const date=node("time",issue.date);
  date.dateTime=issue.date;
  entry.append(date,node("strong",issue.title),node("span",(issue.batch?"日报":"专题")+" · "+issue.papers.length+" 篇"));
  entry.addEventListener("click",()=>{
    selectedIssue=issue.key;
    selectedTrack="all";
    $("search").value="";
    update();
    $("overview").scrollIntoView();
  });
  $("archive-list").append(entry);
}
for(const [key,name] of Object.entries(names)){
  const button=node("button",name);
  button.type="button";
  button.dataset.track=key;
  button.addEventListener("click",()=>{
    selectedTrack=key;
    update();
  });
  $("filters").append(button);
}

function update(){
  const issue = issues.find(item=>item.key===selectedIssue);
  $("issue").value = issue.key;
  $("issue-label").textContent = issue.batch ? "arXiv 公布批次 "+issue.batch : "专题整理 · "+issue.date;
  $("scope").textContent = (issue.batch ? "检索："+issue.date+" "+issue.time+" · " : "")+issue.scope;
  const cards=issue.insights.map(([key,title,description])=>{
    const elem=node("article",null,"insight");
    elem.append(tag(key),node("h3",title),node("p",description));
    return elem;
  });
  $("insights").replaceChildren(...cards);
  $("inference").replaceChildren(node("strong","趋势推断"),document.createTextNode(issue.inference));
  const query=$("search").value.trim().toLowerCase();
  const words=query.split(/\s+/).filter(Boolean);
  const crossIssue=words.length>0 || selectedTrack!=="all";
  const source=crossIssue ? [...allPapers].sort((a,b)=>b.first.localeCompare(a.first)) : issue.papers;
  shown=source.filter(p=>(selectedTrack==="all"||p.track===selectedTrack) && words.every(word=>[p.id,p.name,p.en,zh(p),p.author,p.org,p.summary,p.method,tracks[p.track],...keywords(p)].join(" ").toLowerCase().includes(word)));
  document.querySelectorAll("#filters button").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.track===selectedTrack)));
  $("count").textContent = crossIssue ? "跨期检索 · "+shown.length+" 篇" : issue.papers.length+" 篇收录";
  $("compare").disabled = shown.length < 2;
  for(const video of mediaCandidates.keys()) mediaObserver.unobserve(video);
  mediaCandidates.clear();
  const paperCards=shown.map(p=>{
    const card=node("article",null,"paper");
    const copy=node("div",null,"paper-copy");
    const meta=node("div",null,"paper-meta");
    meta.append(tag(p.track),node("span","首发 "+p.first));
    const title=node("h3");
    const titleButton=node("button",p.name===zh(p) ? p.name : p.name+" · "+zh(p));
    titleButton.type="button";
    titleButton.addEventListener("click",()=>openPaper(p));
    title.append(titleButton);
    const actions=node("div",null,"card-actions");
    const read=node("button","打开精读","text-button");
    read.type="button";
    read.setAttribute("aria-label","阅读 "+p.name+" 精读");
    read.addEventListener("click",()=>openPaper(p));
    actions.append(read,link("arXiv "+p.id,abs(p)));
    copy.append(meta,title,node("p",p.en,"en"),keywordList(p,true),node("p",p.summary,"paper-summary"),node("p",p.metric,"metric"),actions);
    card.append(copy,makePreview(p));
    return card;
  });
  if(!paperCards.length) paperCards.push(node("p","没有匹配的论文。可清空搜索或改选期次、方向。","empty"));
  $("papers").replaceChildren(...paperCards);
}

function keywordList(p,interactive){
  const list=node("div",null,"keywords");
  for(const word of keywords(p)){
    const chip=node(interactive?"button":"span",word,"keyword");
    if(interactive){
      chip.type="button";
      chip.title="搜索关键词："+word;
      chip.addEventListener("click",()=>{
        selectedTrack="all";
        $("search").value=word;
        update();
        $("search").focus({preventScroll:true});
      });
    }
    list.append(chip);
  }
  return list;
}

function makePreview(p){
  const media=node("aside",null,"paper-preview");
  const clip=details(p).video;
  const addFigure=()=>{
    if(!p.picture){
      media.append(node("span",p.project?"暂无直接可嵌入的媒体":"未收录可嵌入媒体"));
      if(p.project)media.append(link("查看官方项目页",p.project,"text-button"));
      return;
    }
    const img=node("img");
    img.src=p.picture;
    img.alt=p.caption||"论文插图";
    img.loading="lazy";
    img.addEventListener("error",()=>{img.remove(); media.prepend(node("span","图片暂时不可用"));});
    media.prepend(img);
    media.append(link("论文原图",p.id==="2610.28480"?pdf(p):p.picture,"media-credit"));
  };
  if(!clip){addFigure(); return media;}
  const video=node("video");
  video.muted=true; video.defaultMuted=true; video.playsInline=true; video.loop=true; video.preload="none";
  video.dataset.src=clip;
  video.setAttribute("aria-label",p.name+" 官方项目演示");
  if(p.picture)video.poster=p.picture;
  const play=node("button","暂停视频","media-control");
  play.type="button";
  play.addEventListener("click",()=>{
    if(!video.paused){manualPauses.add(video);video.pause();}
    else {manualPauses.delete(video);if(!video.src)video.src=clip;video.play().catch(()=>{});}
  });
  video.addEventListener("play",()=>{play.textContent="暂停视频";});
  video.addEventListener("pause",()=>{play.textContent="播放视频";});
  video.addEventListener("error",()=>{
    mediaObserver.unobserve(video);mediaCandidates.delete(video);media.replaceChildren();addFigure();
    if(p.project && p.picture)media.append(link("前往官方项目页观看",p.project,"media-credit"));
  },{once:true});
  play.textContent="播放视频";
  media.append(video,play,link("官方项目视频",p.project??clip,"media-credit"));
  mediaObserver.observe(video);
  return media;
}

function showReader(title,content,hash){
  $("reader-label").textContent=title;
  $("detail-body").replaceChildren(...content);
  if(!dialog.open){
    lastFocus=document.activeElement;
    dialog.showModal();
  }
  if(hash) history.replaceState(null,"","#paper-"+hash);
  dialog.scrollTop=0;
  updateVideo();
  $("close").focus();
}
function openPaper(p){
  const issue=issues.find(item=>item.papers.includes(p));
  const links=node("div",null,"links");
  links.append(link("arXiv 摘要",abs(p),"secondary"),link("PDF · "+version(p),pdf(p),"secondary"));
  if(p.id!=="2610.28480")links.append(link("原文 HTML",html(p),"secondary"));
  if(p.project)links.append(link("项目主页",p.project,"secondary"));
  const content=[
    tag(p.track),node("h2",p.name===zh(p)?p.name:p.name+"｜"+zh(p)),node("p",p.en),keywordList(p,false),
    node("p","arXiv:"+p.id+version(p)+" · 首次提交 "+p.first+(details(p).revision?" · 此版修订 "+details(p).revision:"")+(issue.batch?" · 公布批次 "+issue.batch:" · 专题收录")),
    node("p",p.author)
  ];
  if(p.org)content.push(node("p",p.org));
  content.push(links);
  for(const [label,english,text] of [["摘要","Abstract",p.summary],["为什么做","Why they did it",details(p).why||p.summary],["怎么做","How it works",p.method],["结果","Results",p.result],["局限性","Limitations",p.caveat]]){
    const block=node("section",null,"reader-section");
    const h=node("h3",label);
    h.append(node("span",english));
    block.append(h,node("p",text));
    content.push(block);
  }
  const gallery=node("section",null,"reader-section");
  gallery.append(node("h3","论文图集"));
  const images=node("div",null,"gallery");
  gallery.append(images);
  content.push(gallery);
  populateGallery(p,images);
  showReader("论文精读",content,p.id);
}

function galleryFigure(item){
  const figure=node("figure");
  const caption=node("figcaption");
  if(item.src){
    const img=node("img");
    img.src=item.src;img.loading="lazy";img.alt=item.caption||"论文插图";
    const zoom=link("",item.src,"image-zoom");zoom.append(img);
    img.addEventListener("error",()=>{zoom.remove();caption.prepend(document.createTextNode("图片暂时无法加载。 "));});
    figure.append(zoom);
  }
  caption.append(document.createTextNode((item.caption||"")+" "),link("论文原文",item.source));
  figure.append(caption);
  return figure;
}

async function populateGallery(p,container){
  const seeded=details(p).figures??[];
  const map=new Map(seeded.map(f=>[f.src,f]));
  if(p.picture&&!map.has(p.picture))map.set(p.picture,{src:p.picture,caption:p.caption,source:p.id==="2610.28480"?pdf(p):html(p)});
  const state=node("p",map.size?"收录已核实的原图，点击可放大。":"本站暂无可展示原图，可打开论文 PDF。","gallery-note");
  if(!map.size && p.caption)container.append(galleryFigure({caption:p.caption,source:pdf(p)}));
  else container.append(...[...map.values()].map(galleryFigure));
  container.append(state,link("在 PDF 查看完整插图",pdf(p),"secondary"));
  try{
    const response=await fetch(radarDataUrl("figures/"+p.id+".json"),{signal:AbortSignal.timeout(6500)});
    if(!response.ok)return;
    const manifest=await response.json();
    const valid=Array.isArray(manifest.figures)?manifest.figures.filter(item=>typeof item.src==="string"&&item.src.startsWith(html(p)+"/")&&typeof item.caption==="string"):[];
    if(!valid.length || manifest.version!==version(p))return;
    for(const item of valid)if(!map.has(item.src))map.set(item.src,{...item,source:html(p)+(item.anchor&&/^[-.\w]+$/.test(item.anchor)?"#"+item.anchor:"")});
    state.textContent="含 arXiv HTML 可提取的原图；未转换的图仍以 PDF 为准。";
    container.replaceChildren(...[...map.values()].map(galleryFigure),state,link("在 PDF 查看完整插图",pdf(p),"secondary"));
  }catch{/* The verified local gallery or PDF link remains available. */}
}

function showComparison(){
  const table=node("table");
  const header=node("thead"), row=node("tr");
  for(const label of ["论文","分类","核心方法","代表性结果","证据边界"]){
    const th=node("th",label);th.scope="col";row.append(th);
  }
  header.append(row);
  const tbody=node("tbody");
  for(const p of shown){
    const tr=node("tr"), name=node("th",p.name);
    name.scope="row";
    tr.append(name,node("td",tracks[p.track]),node("td",p.summary),node("td",p.metric),node("td",p.caveat));
    tbody.append(tr);
  }
  table.append(header,tbody);
  const wrap=node("div",null,"table-wrap");
  wrap.append(table);
  showReader("横向对比",[node("h2","方法与实验结果"),node("p","不同论文的指标与测试条件不一。表内数值用于速览，不构成同条件排名。"),wrap]);
}

$("issue").addEventListener("change",event=>{
  selectedIssue=event.target.value;
  selectedTrack="all";
  $("search").value="";
  update();
});
$("search-form").addEventListener("submit",event=>event.preventDefault());
$("search").addEventListener("input",update);
$("compare").addEventListener("click",showComparison);
$("close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close();});
dialog.addEventListener("close",()=>{
  if(location.hash.startsWith("#paper-")) history.replaceState(null,"",location.pathname+location.search+"#reading");
  if(lastFocus instanceof HTMLElement) lastFocus.focus({preventScroll:true});
  lastFocus=null;
  updateVideo();
});
drawField();
update();
const deepPaper=allPapers.find(p=>location.hash==="#paper-"+p.id);
if(deepPaper)openPaper(deepPaper);

function radarDataUrl(path){
  const after=location.hostname.endsWith("github.io") ? location.pathname.split("/").filter(Boolean)[0] : "robotics-digest";
  const owner=location.hostname.endsWith(".github.io") ? location.hostname.split(".")[0] : "lemonpower";
  const repo=/^[\w.-]+$/.test(after||"")?after:"robotics-digest";
  return "https://raw.githubusercontent.com/"+owner+"/"+repo+"/radar-data/"+path;
}

async function loadRadar(){
  const status=$("radar-status");
  const container=$("radar-topics");
  try{
    const response=await fetch(radarDataUrl("radar.json"),{signal:AbortSignal.timeout(7000)});
    if(!response.ok)throw Error("no snapshot");
    const data=await response.json();
    if(!data.latestBatch||!Array.isArray(data.topics)||!Array.isArray(data.latestPapers))throw Error("invalid snapshot");
    const latestTime=Date.parse(data.latestBatch);
    const stale=Number.isFinite(latestTime) && Date.now()-latestTime>7*86400000;
    status.textContent=(stale?"最近一次成功收录：":"最新收录批次：")+data.latestBatch+" · 最近 14 天 "+data.paperCount+" 篇、"+data.batchCount+" 个收录批次"+(stale?"（快照可能已过期）":"");
    for(const topic of data.topics)container.append(radarTopic(topic));
    if(!data.topics.length)container.append(node("p","目前还没有方向达到自动建专题的门槛。新论文仍会收录。","empty"));
    const latest=node("details",null,"radar-card");
    latest.append(node("summary","最近批次 · 全部新条目（"+data.latestPapers.length+" 篇）"),node("p","arXiv Robotics 首发与 v1 交叉投稿；按标题和摘要查看，不等同于日报精选。","topic-desc"),radarPaperList(data.latestPapers));
    container.append(latest);
    if(Array.isArray(data.archivedTopics)&&data.archivedTopics.length){
      const archive=node("details",null,"radar-card");
      archive.append(node("summary","往期动态专题（"+data.archivedTopics.length+" 个）"),...data.archivedTopics.map(t=>radarTopic(t,true)));
      container.append(archive);
    }
    const selected=document.getElementById(location.hash.slice(1));
    if(selected?.matches(".radar-card")){selected.open=true; const parent=selected.parentElement.closest("details"); if(parent)parent.open=true; selected.scrollIntoView();}
  }catch{
    status.textContent="暂时没有可用的自动收录快照。固定专题和往期内容仍可查阅。";
    container.append(link("在 arXiv 查看最新公布批次","https://arxiv.org/list/cs.RO/new","secondary"));
  }
}

function radarTopic(topic, archived){
  const block=node("details",null,"radar-card");
  block.id="trend-"+topic.id;
  const summary=node("summary");
  summary.append(node("strong",topic.name),node("span",topic.count+" 篇 · "+topic.batches+" 个公布日"));
  const why=topic.rule+"。覆盖 "+topic.teams+" 组无重名作者的论文（近似，不等同于机构数）。";
  block.append(summary,node("p",(archived?"上次入选窗口结束于 "+topic.lastSeen+"。":"")+why,"topic-desc"));
  if(Array.isArray(topic.papers))block.append(radarPaperList(topic.papers));
  return block;
}

function radarPaperList(rows){
  const list=node("ul",null,"radar-papers");
  for(const p of rows){
    if(!p||!/^\d{4}\.\d{4,5}$/.test(p.id))continue;
    const row=node("li");
    const details=node("details");
    const title=node("summary",p.title);
    details.append(title,node("p","收录批次 "+p.batch+(p.kind==="cross"?" · v1 交叉投稿":" · 首发"),"radar-meta"));
    if(p.abstract)details.append(node("p",p.abstract,"radar-abstract"));
    const source=node("div",null,"radar-links");
    source.append(link("arXiv 摘要",abs(p)),link("PDF",pdf(p)));
    details.append(source);
    row.append(details);list.append(row);
  }
  return list;
}
loadRadar();
