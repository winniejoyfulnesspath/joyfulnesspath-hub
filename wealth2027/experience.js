"use strict";
(function(){
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const $ = (selector,root=document) => root.querySelector(selector);
const $$ = (selector,root=document) => Array.from(root.querySelectorAll(selector));
const revealTargets = $$(".reveal");
if ("IntersectionObserver" in window){
 const observer = new IntersectionObserver(entries=>{
   entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("in-view");observer.unobserve(entry.target)}});
 },{threshold:.12,rootMargin:"0px 0px -30px 0px"});
 revealTargets.forEach(el=>observer.observe(el));
}else revealTargets.forEach(el=>el.classList.add("in-view"));
if(reduced.matches)revealTargets.forEach(el=>el.classList.add("in-view"));
const progress = $("#progress");
const stage = $(".hero-stage");
const door = $(".threshold-scenography");
const threshold=$("#threshold");
let scrollQueued=false;
function updateScroll(){
 const maxScroll=Math.max(1,document.documentElement.scrollHeight-innerHeight);
 if(progress)progress.style.width=(Math.min(1,scrollY/maxScroll)*100).toFixed(2)+"%";
 if(!reduced.matches && door && threshold){
   const tr=threshold.getBoundingClientRect();
   const f=Math.max(-1,Math.min(1,((innerHeight/2)-(tr.top+tr.height*.48))/innerHeight));
   door.style.setProperty("--door-x",(f*43).toFixed(1)+"px");
 }
 scrollQueued=false;
}
window.addEventListener("scroll",()=>{
 if(scrollQueued)return;
 scrollQueued=true;
 requestAnimationFrame(updateScroll);
},{passive:true});
window.addEventListener("resize",updateScroll,{passive:true});
updateScroll();
if(stage){
 const hero=$("#entrance");
 let pending=false,point={x:0,y:0};
 hero.addEventListener("pointermove",event=>{
  if(reduced.matches||event.pointerType==="touch")return;
  const rect=hero.getBoundingClientRect();
  point.x=((event.clientX-rect.left)/rect.width-.5)*20;
  point.y=((event.clientY-rect.top)/rect.height-.5)*14;
  if(pending)return;
  pending=true;
  requestAnimationFrame(()=>{stage.style.setProperty("--par-x",point.x.toFixed(2)+"px");stage.style.setProperty("--par-y",point.y.toFixed(2)+"px");pending=false});
 },{passive:true});
 hero.addEventListener("pointerleave",()=>{stage.style.setProperty("--par-x","0px");stage.style.setProperty("--par-y","0px")});
}

const points=[
{id:1,name:"王冠輪",latin:"KETHER / THE CROWN",concept:"初心與方向",question:"我真正想走向的是甚麼？",action:"先寫下此刻最重要的一個方向。",x:360,y:65},
{id:2,name:"智慧輪",latin:"CHOKMAH / THE IDEA",concept:"靈感與直覺",question:"有甚麼想法一直等著我認真聆聽？",action:"將三個閃過的念頭記下來，不急於判斷。",x:475,y:165},
{id:3,name:"理解輪",latin:"BINAH / THE FORM",concept:"架構與界線",question:"這個想法需要甚麼條件才能開始？",action:"列出時間、資源與責任的邊界。",x:245,y:165},
{id:4,name:"慈悲輪",latin:"CHESED / THE GIFT",concept:"給予與接收",question:"我是否容許自己接受已有的支持？",action:"辨認一項能夠善用的現有資源。",x:495,y:300},
{id:5,name:"力量輪",latin:"GEBURAH / THE STRENGTH",concept:"選擇與行動",question:"我願意為真正重要的事守住甚麼原則？",action:"為本週一項重要行動設下清晰界線。",x:225,y:300},
{id:6,name:"和美輪",latin:"TIPHARETH / THE HEART",concept:"統整與平衡",question:"我的想法與每日的選擇是否一致？",action:"選一個微小而可持續的日常練習。",x:360,y:390},
{id:7,name:"凱旋輪",latin:"NETZACH / THE DRIVE",concept:"熱情與持續",question:"甚麼事值得我持續投入？",action:"把一項想做的事排進下一週。",x:490,y:515},
{id:8,name:"臣服輪",latin:"HOD / THE REFLECTION",concept:"反思與整理",question:"我可以如何檢驗而非只憑感覺？",action:"寫下兩項可以觀察的現實訊號。",x:230,y:515},
{id:9,name:"奠基輪",latin:"YESOD / THE FOUNDATION",concept:"節奏與準備",question:"最穩固的第一步是甚麼？",action:"將想法拆成一個十分鐘內可做的小步驟。",x:360,y:620},
{id:10,name:"顯現輪",latin:"MALKUTH / THE WORLD",concept:"現實中的實踐",question:"明日的生活裡，我會做得有何不同？",action:"選擇一個具體行動，並設定回顧時間。",x:360,y:726}
];
const edges=[[1,2],[1,3],[1,6],[2,3],[2,4],[2,6],[3,5],[3,6],[4,5],[4,6],[4,7],[5,6],[5,8],[6,7],[6,8],[6,9],[7,8],[7,9],[8,9],[9,10],[7,10],[8,10]];
const pathRoot=$("#tree-paths"),nodesRoot=$("#tree-nodes"),sculpture=$("#sculpture-frame");
const svgNS="http://www.w3.org/2000/svg";
const pointsById=new Map(points.map(p=>[p.id,p]));
if(pathRoot&&nodesRoot){
 edges.forEach(([a,b])=>{
  const p1=pointsById.get(a),p2=pointsById.get(b);
  const line=document.createElementNS(svgNS,"path");
  const middle=(p1.y+p2.y)/2;
  line.setAttribute("d","M "+p1.x+" "+p1.y+" Q "+((p1.x+p2.x)/2)+" "+middle+" "+p2.x+" "+p2.y);
  line.setAttribute("class","tree-path");
  line.setAttribute("data-from",a);line.setAttribute("data-to",b);
  pathRoot.appendChild(line);
  if((a+b)%3===0){
   const sparkle=document.createElementNS(svgNS,"path");
   sparkle.setAttribute("d",line.getAttribute("d"));
   sparkle.setAttribute("class","tree-path foreground");
   sparkle.setAttribute("data-glow","true");
   pathRoot.appendChild(sparkle);
  }
 });
 points.forEach(item=>{
  const button=document.createElement("button");
  button.type="button";button.className="node-orb";
  button.style.setProperty("--nx",(item.x/720*100).toFixed(4)+"%");
  button.style.setProperty("--ny",(item.y/780*100).toFixed(4)+"%");
  button.dataset.id=String(item.id);
  button.setAttribute("aria-label",String(item.id).padStart(2,"0")+" "+item.name);
  button.setAttribute("aria-pressed","false");
  const crystal=document.createElement("span");crystal.className="node-crystal";crystal.setAttribute("aria-hidden","true");
  const num=document.createElement("span");num.className="num";num.textContent=String(item.id).padStart(2,"0");
  const label=document.createElement("span");label.className="node-label";label.textContent=item.name;label.setAttribute("aria-hidden","true");
  button.append(crystal,num,label);
  button.addEventListener("click",()=>selectPoint(item.id));
  nodesRoot.appendChild(button);
 });
}
let selectedPoint=1;
function selectPoint(id){
 const target=pointsById.get(id);if(!target)return;
 selectedPoint=id;
 $$("#tree-nodes .node-orb").forEach(button=>button.setAttribute("aria-pressed",String(Number(button.dataset.id)===id)));
 $$("#tree-paths .tree-path").forEach(line=>{
  const active=Number(line.dataset.from)===id||Number(line.dataset.to)===id;
  line.classList.toggle("active",active);
 });
 const content=[
 ["#tree-index",String(target.id).padStart(2,"0")],
 ["#tree-caption",target.latin],["#tree-name",target.name],
 ["#tree-concept",target.concept],["#tree-question",target.question],
 ["#tree-action",target.action],["#tree-progress-label",String(target.id).padStart(2,"0")+" / 10"]
 ];
 content.forEach(([sel,value])=>{const el=$(sel);if(el)el.textContent=value;});
}
selectPoint(1);
$("#tree-prev")?.addEventListener("click",()=>selectPoint(selectedPoint===1?10:selectedPoint-1));
$("#tree-next")?.addEventListener("click",()=>selectPoint(selectedPoint===10?1:selectedPoint+1));
if(sculpture){
 sculpture.addEventListener("pointermove",event=>{
  if(reduced.matches||event.pointerType==="touch")return;
  const rect=sculpture.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width-.5,y=(event.clientY-rect.top)/rect.height-.5;
  sculpture.style.setProperty("--spin-y",(-9+x*17).toFixed(2)+"deg");
  sculpture.style.setProperty("--spin-x",(8-y*14).toFixed(2)+"deg");
 },{passive:true});
 sculpture.addEventListener("pointerleave",()=>{sculpture.style.setProperty("--spin-y","-9deg");sculpture.style.setProperty("--spin-x","8deg")});
}

const axes=[
{key:"Z / CORE",title:"你在走向哪裡？",desc:"先找到值得投入時間的方向，不必在一開始就擁有全部答案。",rotate:"-10deg",shift:"-9px"},
{key:"Y / NOW",title:"你此刻看見甚麼？",desc:"留意現在的資源、感受與限制。看清楚，才能作出更完整的選擇。",rotate:"0deg",shift:"0px"},
{key:"X / REALITY",title:"你願意做哪一步？",desc:"把意念化成一個具體、可回顧的行動。真正的改變從每日的選擇累積。",rotate:"16deg",shift:"10px"}
];
const axisButtons=$$(".axis-tab");
function selectAxis(index,focus){
 const axis=axes[index];if(!axis)return;
 axisButtons.forEach((button,i)=>{button.classList.toggle("active",i===index);button.setAttribute("aria-selected",String(i===index));button.tabIndex=i===index?0:-1;});
 const panel=$("#matrix-panel");if(panel)panel.setAttribute("aria-labelledby",axisButtons[index].id);
 $("#axis-coordinate").textContent=axis.key;
 $("#axis-title").textContent=axis.title;
 $("#axis-description").textContent=axis.desc;
 const visual=$("#matrix-visual");
 if(visual){visual.style.setProperty("--axis-x",axis.rotate);visual.style.setProperty("--axis-y",axis.shift);}
 if(focus)axisButtons[index].focus();
}
axisButtons.forEach((button,i)=>{
 button.addEventListener("click",()=>selectAxis(i,false));
 button.addEventListener("keydown",e=>{
  if(e.key==="ArrowRight"||e.key==="ArrowDown"){e.preventDefault();selectAxis((i+1)%axes.length,true)}
  if(e.key==="ArrowLeft"||e.key==="ArrowUp"){e.preventDefault();selectAxis((i+axes.length-1)%axes.length,true)}
  if(e.key==="Home"){e.preventDefault();selectAxis(0,true)}
  if(e.key==="End"){e.preventDefault();selectAxis(axes.length-1,true)}
 });
});
selectAxis(0,false);
reduced.addEventListener("change",e=>{if(e.matches){revealTargets.forEach(el=>el.classList.add("in-view"));if(stage){stage.style.setProperty("--par-x","0px");stage.style.setProperty("--par-y","0px")};if(sculpture){sculpture.style.setProperty("--spin-y","0deg");sculpture.style.setProperty("--spin-x","0deg")}}});
})();