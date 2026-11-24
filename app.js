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
const names = {all:"全部方向", agentic:tracks.agentic, robots:tracks.robots, rl:tracks.rl};
const byRecent = [...issues].sort((a,b)=>b.date.localeCompare(a.date));
const url = new URL(location.href);
let selectedIssue = issues.find(issue=>issue.key===url.searchParams.get("issue"))?.key ?? byRecent.find(issue=>issue.batch).key;
let selectedTrack = Object.hasOwn(names,url.searchParams.get("track")) ? url.searchParams.get("track") : "all";
let shown = [];
let lastFocus = null;
const dialog = $("detail");
dialog.setAttribute("aria-labelledby","reader-label");

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
const tag = key => node("span",tracks[key],"tag "+key);
const abs = paper => "https://arxiv.org/abs/"+paper.id;
const html = paper => "https://arxiv.org/html/"+paper.id+"v1";
const pdf = paper => "https://arxiv.org/pdf/"+paper.id+"v1";

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
  const option = node("option",issue.batch ? issue.date : "专题 · SuperMimic");
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
    if(key==="rl" && !$("search").value.trim() && !issues.find(issue=>issue.key===selectedIssue).papers.some(p=>p.track===key)) selectedIssue="supermimic";
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
  const source=words.length ? allPapers : issue.papers;
  shown=source.filter(p=>(selectedTrack==="all"||p.track===selectedTrack) && words.every(word=>[p.id,p.name,p.en,translations[p.id],p.author,p.org,p.summary,p.method,tracks[p.track]].join(" ").toLowerCase().includes(word)));
  document.querySelectorAll("#filters button").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.track===selectedTrack)));
  $("count").textContent = words.length ? "跨期搜索 · "+shown.length+" 篇" : issue.papers.length+" 篇收录 · 显示 "+shown.length+" 篇";
  $("compare").disabled = shown.length < 2;
  const paperCards=shown.map(p=>{
    const card=node("article",null,"paper");
    const meta=node("div",null,"paper-meta");
    meta.append(tag(p.track),node("span",p.first+" · v1"));
    const title=node("h3");
    const titleButton=node("button",p.name);
    titleButton.type="button";
    titleButton.addEventListener("click",()=>openPaper(p));
    title.append(titleButton);
    const actions=node("div",null,"card-actions");
    const read=node("button","阅读全文","text-button");
    read.type="button";
    read.setAttribute("aria-label","阅读 "+p.name+" 精读");
    read.addEventListener("click",()=>openPaper(p));
    actions.append(read,link("arXiv "+p.id,abs(p)));
    card.append(meta,title,node("p",p.en,"en"),node("p",p.summary),node("p",p.metric,"metric"),actions);
    return card;
  });
  if(!paperCards.length) paperCards.push(node("p","没有匹配的论文。可清空搜索或改选期次、方向。","empty"));
  $("papers").replaceChildren(...paperCards);
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
  $("close").focus();
}
function openPaper(p){
  const issue=issues.find(item=>item.papers.includes(p));
  const links=node("div",null,"links");
  links.append(link("arXiv 摘要",abs(p),"secondary"),link("PDF · v1",pdf(p),"secondary"),link("原文 HTML",html(p),"secondary"));
  if(p.project)links.append(link("项目主页",p.project,"secondary"));
  const content=[
    tag(p.track),node("h2",p.name+"｜"+translations[p.id]),node("p",p.en),
    node("p","arXiv:"+p.id+"v1 · 首次提交 "+p.first+(issue.batch?" · 公布批次 "+issue.batch:" · 专题收录")),
    node("p",p.author)
  ];
  if(p.org)content.push(node("p",p.org));
  content.push(links,node("h3","研究问题"),node("p",p.summary));
  const figure=node("figure");
  const caption=node("figcaption");
  if(p.picture){
    const img=node("img");
    img.src=p.picture;
    img.alt=p.caption;
    img.addEventListener("error",()=>{img.remove();caption.prepend(document.createTextNode("图片暂时无法加载。"));});
    figure.append(img);
  }else{
    caption.append(document.createTextNode("本站未嵌入该图。"));
  }
  caption.append(document.createTextNode(p.caption+" "),link("来源：论文原文",p.id==="2610.28480"?pdf(p):html(p)));
  figure.append(caption);
  content.push(figure,node("h3","核心方法与创新"),node("p",p.method),node("h3","实验设置、关键结果与消融"),node("p",p.result),node("h3","局限与证据边界"),node("p",p.caveat));
  showReader("论文精读",content,p.id);
}

function showComparison(){
  const table=node("table");
  const header=node("thead"), row=node("tr");
  for(const label of ["论文","主线","核心方法","代表性结果","证据边界"]){
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
});
drawField();
update();
const deepPaper=allPapers.find(p=>location.hash==="#paper-"+p.id);
if(deepPaper)openPaper(deepPaper);
