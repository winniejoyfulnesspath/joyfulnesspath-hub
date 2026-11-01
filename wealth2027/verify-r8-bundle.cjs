const{chromium}=require("C:/Users/paulw/Documents/sne-website/node_modules/playwright"),fs=require("fs");
const root="C:/Users/paulw/Downloads/Wealth10_R8_SELECTED_ART_LOCAL_20261030";
(async()=>{const b=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"}),records=[];
for(const x of [{n:"entry",f:"START_HERE.html",w:1440,h:900},{n:"page-desktop",f:"V3_EXPERIENTIAL_R8_SELECTED_ART/index.html",w:1440,h:900},{n:"page-mobile",f:"V3_EXPERIENTIAL_R8_SELECTED_ART/index.html",w:390,h:844},{n:"review",f:"V3_EXPERIENTIAL_R8_SELECTED_ART/REVIEW_R8.html",w:1440,h:900}]){
const c=await b.newContext({viewport:{width:x.w,height:x.h}}),p=await c.newPage(),errs=[];
p.on("pageerror",e=>errs.push(e.message));await p.goto("file:///"+root+"/"+x.f,{waitUntil:"load",timeout:30000});
await p.evaluate(()=>{for(const im of document.images)im.loading="eager"});await p.waitForTimeout(1250);
let dat=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,images:[...document.images].map(im=>({name:im.src.split('/').pop(),ok:im.complete&&im.naturalWidth>0})),css:[...document.styleSheets].some(s=>s.href?.endsWith("visual-r8.css"))}));
let interact=null;
if(x.n.startsWith("page")){await p.locator(".node-orb[data-id='5']").focus();await p.locator(".node-orb[data-id='5']").press("Enter");await p.locator(".axis-tab[data-axis='2']").click();
interact=await p.evaluate(()=>({pressed:document.querySelector(".node-orb[data-id='5']").getAttribute("aria-pressed"),axis:document.querySelector("#axis-title").textContent,images:[...document.images].map(im=>({name:im.src.split('/').pop(),ok:im.complete&&im.naturalWidth>0}))}));dat.images=interact.images;
}
const pass=!errs.length&&!dat.overflow&&dat.images.every(i=>i.ok)&&(!x.n.startsWith("page")||(dat.css&&interact.pressed==="true"));
const out={name:x.n,pass,broken:dat.images.filter(i=>!i.ok),totalImages:dat.images.length,errors:errs,overflow:dat.overflow,interact:interact?{pressed:interact.pressed,axis:interact.axis}:null};records.push(out);console.log("R8_PACKAGE "+JSON.stringify(out));await c.close()}
await b.close();fs.writeFileSync(root+"/PACKAGE_QC.json",JSON.stringify(records,null,2));if(records.some(x=>!x.pass))process.exitCode=1;
})().catch(e=>{console.error(e.stack);process.exitCode=2});