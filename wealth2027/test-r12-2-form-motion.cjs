"use strict";
const {chromium}=require("C:/Users/paulw/Documents/sne-website/node_modules/playwright");
const fs=require("fs"),path=require("path");
const url="file:///"+__dirname.replaceAll("\\","/")+"/index.html";
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--disable-gpu"]});
 const out=[];
 for(const [name,w,h,reduced] of [["desktop",1440,900,false],["mobile",390,844,false],["small",320,700,false],["reduced",390,844,true]]){
  const ctx=await browser.newContext({viewport:{width:w,height:h},reducedMotion:reduced?"reduce":"no-preference"});
  const p=await ctx.newPage(),errors=[],posts=[];
  p.on("pageerror",e=>errors.push(e.message));
  p.on("request",req=>{if(req.method()==="POST")posts.push(req.url())});
  await p.goto(url,{waitUntil:"load",timeout:45000});await p.waitForTimeout(300);
  const cards=p.locator(".r12-date-link");
  const style=await p.evaluate(()=>({loaded:[...document.styleSheets].some(x=>x.href?.endsWith("depth-form-r12-2.css")),perspective:getComputedStyle(document.querySelector(".r12-date-grid")).perspective,
    motion:document.documentElement.classList.contains("depth-motion-ready"),
    cardShadow:getComputedStyle(document.querySelector(".r12-date-link")).boxShadow,
    image:document.querySelector(".portrait-arch img")?.naturalWidth||0}));
  await p.locator("#course-dates").scrollIntoViewIfNeeded();await p.waitForTimeout(reduced?120:1050);
  const entering=await cards.first().evaluate(el=>({cls:el.classList.contains("is-visible"),opacity:parseFloat(getComputedStyle(el).opacity)}));
  if(name==="desktop"||name==="mobile")await p.locator("#course-dates").screenshot({path:path.join(__dirname,"R12_2_DEPTH_"+name+".png"),animations:"disabled"});
  if(!reduced){await p.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));await p.waitForTimeout(300);}
  await p.locator("[data-r12-open]").click();
  const dialog=p.locator("#r12-dialog");await dialog.waitFor({state:"visible"});
  const fields=await p.evaluate(()=>({radio:document.querySelectorAll("input[name=focusArea]").length,checks:document.querySelectorAll("input[name=topicInterest]").length,
    optionWidth:getComputedStyle(document.querySelector('input[name=focusArea]')).width,modalOverflow:document.querySelector("#r12-dialog").scrollHeight>document.querySelector("#r12-dialog").clientHeight}));
  await p.locator('input[name=focusArea]').nth(2).check();
  await p.locator('input[name=topicInterest]').nth(1).check();
  await p.locator('input[name=topicInterest]').nth(3).check();
  const selected=await p.evaluate(()=>({radio:document.querySelector('input[name=focusArea]:checked')?.value,
    checks:[...document.querySelectorAll('input[name=topicInterest]:checked')].map(x=>x.value)}));
  if(name==="desktop"||name==="mobile")await dialog.screenshot({path:path.join(__dirname,"R12_2_FORM_"+name+".png"),animations:"disabled"});
  await p.locator('input[name=name]').fill("DEMO");
  await p.locator('input[name=email]').fill("demo@example.com");
  await p.locator('input[name=region]').fill("DEMO REGION");
  await p.locator('input[name=eventConsent]').check();
  await p.locator("#r12-form button[type=submit]").click();
  const status=(await p.locator("[data-form-status]").textContent())||"";
  await p.locator("[data-r12-close]").first().click();
  const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  const running=reduced?await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==="running").length):null;
  const pass=style.loaded&&style.image>0&&style.perspective!=="none"&&fields.radio===6&&fields.checks===4&&
   entering.opacity>.9&&(!reduced?entering.cls:!style.motion)&&selected.radio.length>0&&selected.checks.length===2&&
   status.includes("沒有傳送")&&!posts.length&&!errors.length&&!overflow&&(!reduced||running===0);
  const row={name,pass,style,entering,fields,selected,overflow,errors,posts,running};
  console.log("R12_2_BEHAVIOR "+JSON.stringify({name,pass,entering,fields,overflow,errors,posts,running}));
  out.push(row);await ctx.close();
 }
 await browser.close();
 fs.writeFileSync(path.join(__dirname,"R12_2_FORM_MOTION_QC.json"),JSON.stringify(out,null,2),"utf8");
 if(out.some(x=>!x.pass))process.exitCode=1;
})().catch(e=>{console.error("QA_ERROR",e.stack);process.exitCode=2});
