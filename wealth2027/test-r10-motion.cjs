const {chromium}=require("C:/Users/paulw/Documents/sne-website/node_modules/playwright"),fs=require("fs"),path=require("path");
const base=__dirname,uri="file:///"+base.replaceAll("\\","/")+"/index.html";
const specs=[["desktop",1440,900,false],["tablet",768,1024,false],["mobile",390,844,false],["reduced",390,844,true]];
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--disable-gpu"]});const cases=[];
 for(const [label,w,h,reduced] of specs){
  const c=await b.newContext({viewport:{width:w,height:h},reducedMotion:reduced?"reduce":"no-preference",deviceScaleFactor:1}),p=await c.newPage(),errors=[];
  p.on("pageerror",e=>errors.push(e.message));await p.goto(uri,{waitUntil:"load",timeout:30000});await p.waitForTimeout(250);
  await p.locator("#constellation").scrollIntoViewIfNeeded();await p.waitForTimeout(280);
  let before=await p.evaluate(()=>({enhanced:document.documentElement.classList.contains("r10-motion"),seen:document.querySelector("#constellation").classList.contains("r10-in-view"),bg:getComputedStyle(document.querySelector(".tree-section")).backgroundImage,visible:document.querySelector("#tree-title").getBoundingClientRect().height>0}));
  await p.locator(".node-orb[data-id='4']").click();let node=await p.locator(".node-orb[data-id='4']").evaluate(el=>({selected:el.getAttribute("aria-pressed"),pulse:el.classList.contains("r10-selected")}));
  await p.locator(".axis-tab[data-axis='2']").click();let axis=await p.evaluate(()=>({name:document.querySelector("#axis-title").textContent,pulse:document.querySelector(".matrix-visual").classList.contains("r10-axis-switched"),selected:document.querySelector(".axis-tab[data-axis='2']").getAttribute("aria-selected")}));
  if(w>900){const el=p.locator(".matrix-visual");let rect=await el.boundingBox();await p.mouse.move(rect.x+rect.width*.7,rect.y+rect.height*.4);await p.waitForTimeout(90)}
  const visual=await p.evaluate(()=>({x:document.querySelector(".matrix-visual").style.getPropertyValue("--r10-mx"),scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,portrait:[...document.querySelectorAll("img")].filter(i=>i.src.includes("AUTHORIZED")).every(i=>i.complete&&i.naturalWidth>0),activeAnimations:document.getAnimations().filter(a=>a.playState==="running").map(a=>a instanceof CSSAnimation?a.animationName:"other"),reduced:matchMedia("(prefers-reduced-motion: reduce)").matches}));
  const pass=errors.length===0&&before.enhanced&&before.seen&&before.visible&&node.selected==="true"&&axis.selected==="true"&&visual.scrollWidth<=w&&visual.portrait&&(reduced?!node.pulse&&!axis.pulse&&visual.activeAnimations.length===0:node.pulse&&axis.pulse);
  if(label==="desktop"||label==="mobile"){
    for(const [key,sel]of [["TREE","#constellation"],["MATRIX","#alignment"],["MENTOR","#winnie"],["GALLERY",".practice-strip"]]){
      await p.locator(sel).scrollIntoViewIfNeeded();await p.waitForTimeout(150);
      await p.locator(sel).screenshot({path:path.join(base,"R10_"+label+"_"+key+".png"),animations:"disabled",timeout:30000});
    }
  }
  const out={label,pass,errors,before,node,axis,visual:{...visual,activeAnimations:visual.activeAnimations.slice(0,12)}};
  cases.push(out);console.log("R10_MOTION "+JSON.stringify({label,pass,seen:before.seen,nodePulse:node.pulse,axisPulse:axis.pulse,animations:visual.activeAnimations.length,overflow:visual.scrollWidth>w,errors}));
  await c.close();
 }
 await b.close();fs.writeFileSync(path.join(base,"R10_MOTION_QC.json"),JSON.stringify(cases,null,2));if(cases.some(x=>!x.pass))process.exitCode=1;
})().catch(e=>{console.error(e.stack);process.exitCode=2});