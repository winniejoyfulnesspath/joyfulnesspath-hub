const {chromium}=require("C:/Users/paulw/Documents/sne-website/node_modules/playwright"),fs=require("fs"),path=require("path");
(async()=>{
const b=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--disable-gpu"]});
const result=[];
for(const [name,w,h] of [["desktop",1440,900],["tablet",768,1024],["mobile",390,844]]){
const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});
const p=await ctx.newPage(),errors=[];p.on("pageerror",e=>errors.push(e.message));
await p.goto("file:///"+__dirname.replaceAll("\\","/")+"/index.html",{waitUntil:"load",timeout:30000});
await p.waitForTimeout(750);
const sections=[["HERO","#entrance"],["THRESHOLD","#threshold"],["TREE","#constellation"],["MATRIX","#alignment"],["MENTOR","#winnie"],["GALLERY",".practice-strip"],["OUTRO",".last-section"]];
for(const [key,sel] of sections){
 await p.locator(sel).scrollIntoViewIfNeeded();await p.waitForTimeout(240);
 await p.locator(sel).screenshot({path:path.join(__dirname,"R8_"+name+"_"+key+".png"),animations:"disabled",timeout:40000});
 console.log("SHOT "+name+" "+key);
}
const data=await p.evaluate(()=>{const sel=[".hero",".threshold",".tree-section",".matrix-section",".matrix-visual",".mentor-section",".practice-strip",".last-section"];const bg=sel.map(s=>({s,background:getComputedStyle(document.querySelector(s)).backgroundImage}));return{w:innerWidth,scroll:document.documentElement.scrollWidth,bg,images:[...document.images].map(im=>({name:im.src.split("/").pop(),ok:im.complete&&im.naturalWidth>0})),css:[...document.styleSheets].some(s=>s.href?.endsWith("visual-r8.css")),n:document.querySelectorAll(".node-orb").length}});
await p.locator(".node-orb[data-id='4']").focus();await p.locator(".node-orb[data-id='4']").press("Enter");
await p.locator(".axis-tab[data-axis='2']").click();
const state=await p.evaluate(()=>({selected:document.querySelector(".node-orb[data-id='4']").getAttribute("aria-pressed"),axis:document.querySelector("#axis-title").textContent}));
const pass=data.scroll<=w&&data.n===10&&data.css&&!errors.length&&state.selected==="true"&&data.images.filter(i=>!i.ok).length===0;
console.log("R7 "+JSON.stringify({name,pass,bg:data.bg,loaded:data.images.length,state,errors}));
result.push({name,pass,bg:data.bg,loaded:data.images,errors,state});await ctx.close();
}
await b.close();fs.writeFileSync(path.join(__dirname,"R8_VISUAL_QC.json"),JSON.stringify(result,null,2));if(result.some(x=>!x.pass))process.exitCode=1;
})().catch(e=>{console.error(e.stack);process.exitCode=2});