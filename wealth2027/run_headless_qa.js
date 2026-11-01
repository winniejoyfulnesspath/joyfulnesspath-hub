const{chromium}=require("C:/Users/paulw/Documents/sne-website/node_modules/playwright");
const fs=require("fs"),path=require("path"),crypto=require("crypto");
const root="C:/Users/paulw/Documents/_AGENT_CONTROL/scratch/WEALTH10_STITCH_V2_20261030/V3_EXPERIENTIAL_R11_TREE_LAYOUT_FIX";
(async()=>{const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--disable-gpu"]});const cases=[];
for(const spec of[{n:"desktop",w:1440,h:900,m:"no-preference"},{n:"tablet",w:768,h:1024,m:"no-preference"},{n:"mobile",w:390,h:844,m:"no-preference"},{n:"reduced",w:390,h:844,m:"reduce"}]){
 const c=await browser.newContext({viewport:{width:spec.w,height:spec.h},reducedMotion:spec.m,deviceScaleFactor:1});
 const pg=await c.newPage(),errors=[];pg.on("pageerror",e=>errors.push(e.message));
 await pg.goto("file:///"+root+"/index.html",{waitUntil:"domcontentloaded",timeout:30000});await pg.waitForTimeout(1600);
 const before=await pg.evaluate(()=>({vw:innerWidth,docW:document.documentElement.scrollWidth,reduced:matchMedia("(prefers-reduced-motion:reduce)").matches,animations:document.getAnimations().map(a=>({name:a.animationName,cls:String(a.effect?.target?.className).slice(0,70)})).slice(0,30),hero:getComputedStyle(document.querySelector(".portrait-arch img")).animationName,portrait:(()=>{const r=document.querySelector(".portrait-arch img").getBoundingClientRect();return {y:r.y,h:r.height,w:r.width,loaded:document.querySelector(".portrait-arch img").naturalWidth>0}})()}));
 let interaction;await pg.locator(".node-orb[data-id='5']").focus();await pg.locator(".node-orb[data-id='5']").press("Enter");
 await pg.locator(".axis-tab[data-axis='2']").click();interaction=await pg.evaluate(()=>({nodePressed:document.querySelector(".node-orb[data-id='5']").getAttribute("aria-pressed"),nodeName:document.getElementById("tree-name").innerText,axis:document.getElementById("axis-title").innerText}));
 const result={spec,before,interaction,errors,pass:{noOverflow:before.docW<=before.vw,portrait:before.portrait.loaded,interaction:interaction.nodePressed==="true"&&interaction.nodeName==="力量輪",reduced:spec.m==="reduce"?before.animations.length===0:before.animations.length>0,script:errors.length===0}};
 cases.push(result);console.log("CASE "+JSON.stringify({n:spec.n,pass:result.pass,animations:before.animations.length,reduced:before.reduced,activeNames:[...new Set(before.animations.map(a=>a.name))].slice(0,6),portrait:before.portrait,errors}).slice(0,2000));await c.close();
}
const hashes={};for(const name of ["index.html","style.css","experience.js"]){hashes[name]=crypto.createHash("sha256").update(fs.readFileSync(path.join(root,name))).digest("hex")}
const file=path.join(root,"HEADLESS_QC.json");fs.writeFileSync(file,JSON.stringify({at:new Date().toISOString(),browser:"chrome headless no GUI window/no Comet tab opened",hashes,cases},null,2));console.log("SAVED "+file);await browser.close()})().catch(e=>{console.log("HEADLESS_QC_STOP "+e.stack.slice(0,1200));process.exitCode=1});
