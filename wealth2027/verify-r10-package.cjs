const{chromium}=require("C:/Users/paulw/Documents/sne-website/node_modules/playwright"),fs=require("fs"),path=require("path");
const root="C:/Users/paulw/Downloads/Wealth10_R10_STITCH_MOTION_LOCAL_20261030";
(async()=>{const b=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"}),out=[];
for(const [name,file,w] of [["entry","START_HERE.html",1440],["site-desktop","V3_EXPERIENTIAL_R10_MOTION/index.html",1440],["site-mobile","V3_EXPERIENTIAL_R10_MOTION/index.html",390],["review","V3_EXPERIENTIAL_R10_MOTION/REVIEW_MOTION_R10.html",1440]]){
const c=await b.newContext({viewport:{width:w,height:w===390?844:900}}),p=await c.newPage(),errors=[];p.on("pageerror",e=>errors.push(e.message));
await p.goto("file:///"+root+"/"+file,{waitUntil:"load",timeout:30000});await p.evaluate(()=>[...document.images].forEach(i=>i.loading="eager"));await p.waitForTimeout(750);
const q=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,images:[...document.images].map(im=>({ok:im.complete&&im.naturalWidth>0,name:im.src.split("/").pop()})),r10:[...document.styleSheets].some(s=>s.href?.endsWith("motion-r10.css"))}));
let controls=null;if(name.startsWith("site")){await p.locator(".node-orb[data-id='4']").click();await p.locator(".axis-tab[data-axis='2']").click();controls=await p.evaluate(()=>({r10:document.documentElement.classList.contains("r10-motion"),selected:document.querySelector(".node-orb[data-id='4']").getAttribute("aria-pressed"),axis:document.querySelector(".axis-tab[data-axis='2']").getAttribute("aria-selected")}));}
const pass=errors.length===0&&!q.overflow&&q.images.every(i=>i.ok)&&(!controls||(q.r10&&controls.r10&&controls.selected==="true"&&controls.axis==="true"));
out.push({name,pass,broken:q.images.filter(i=>!i.ok),img:q.images.length,errors,controls});console.log("R10_BUNDLE "+JSON.stringify(out.at(-1)));await c.close();}
await b.close();fs.writeFileSync(path.join(root,"PACKAGE_QC.json"),JSON.stringify(out,null,2));if(out.some(i=>!i.pass))process.exitCode=1;
})().catch(e=>{console.error(e.stack);process.exitCode=2});