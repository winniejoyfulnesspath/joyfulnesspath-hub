"use strict";
const {chromium}=require("C:/Users/paulw/Documents/sne-website/node_modules/playwright");
const fs=require("fs"),path=require("path");
const url="file:///"+__dirname.replaceAll("\\","/")+"/index.html";
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--disable-gpu"]});
 const rows=[];
 for(const [name,w,h,reduce] of [["desktop",1440,900,false],["tablet",768,1024,false],["mobile",390,844,false],["small",320,700,false],["reduced",390,844,true]]){
  const ctx=await browser.newContext({viewport:{width:w,height:h},reducedMotion:reduce?"reduce":"no-preference"});
  const page=await ctx.newPage(),errs=[],posts=[];
  page.on("pageerror",e=>errs.push(e.message));
  page.on("request",r=>{if(r.method()==="POST")posts.push(r.url())});
  await page.goto(url,{waitUntil:"load"});
  const state=await page.evaluate(()=>({
   css:[...document.styleSheets].some(x=>x.href?.endsWith("student-routing-r12-3.css")),
   script:[...document.scripts].some(x=>x.src?.endsWith("student-routing-r12-3.js")),
   initialOldHidden:document.querySelector("#r123-alumni-panel")?.hidden===true,
   initialExpanded:document.querySelector("[data-r123-alumni]")?.getAttribute("aria-expanded"),
   newBtn:document.querySelectorAll("[data-r12-open]").length,
   radio:document.querySelectorAll('input[name="focusArea"]').length,
   check:document.querySelectorAll('input[name="topicInterest"]').length,
   studentType:document.querySelector('input[name="studentType"]')?.value,
   portrait:document.querySelector(".portrait-arch img")?.naturalWidth||0,
   footerBrand:document.querySelectorAll(".r12-footer-collab a").length
  }));
  await page.locator("#enroll").scrollIntoViewIfNeeded();
  const alumni=page.locator("[data-r123-alumni]");
  await alumni.click();
  const expanded=await alumni.getAttribute("aria-expanded"), oldVisible=await page.locator("#r123-alumni-panel").isVisible();
  const panelText=await page.locator("#r123-alumni-panel").innerText();
  const oldStillNoCheckout=await page.evaluate(()=>!document.querySelector('#r123-alumni-panel a[href*="stripe"]') && !document.querySelector('#r123-alumni-panel form'));
  await alumni.click();
  const collapsed=(await alumni.getAttribute("aria-expanded"))==="false" && !(await page.locator("#r123-alumni-panel").isVisible());
  await page.locator("[data-r12-open]").first().click();
  await page.locator("#r12-dialog").waitFor({state:"visible"});
  const title=await page.locator("#r12-dialog-title").innerText();
  await page.locator('input[name="focusArea"]').first().check();
  await page.locator('input[name="name"]').fill("SYNTHETIC");
  await page.locator('input[name="email"]').fill("synthetic@example.com");
  await page.locator('input[name="region"]').fill("SYNTHETIC");
  await page.locator('input[name="eventConsent"]').check();
  await page.locator('#r12-form button[type="submit"]').click();
  const status=await page.locator('[data-form-status]').innerText();
  await page.locator("[data-r12-close]").first().click();
  await page.locator(".node-orb[data-id='4']").click();
  const node=await page.locator(".node-orb[data-id='4']").getAttribute("aria-pressed");
  await page.locator(".axis-tab[data-axis='2']").click();
  const axis=await page.locator(".axis-tab[data-axis='2']").getAttribute("aria-selected");
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  const running=reduce?await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==="running").length):null;
  await page.locator("#enroll").scrollIntoViewIfNeeded();
  if(["desktop","mobile"].includes(name)){
   await page.locator(".r12-enroll-card").screenshot({path:path.join(__dirname,"R12_3_ROUTING_"+name+".png"),animations:"disabled",timeout:30000});
  }
  const pass=state.css&&state.script&&state.initialOldHidden&&state.initialExpanded==="false"&&state.newBtn===1&&
     state.radio===6&&state.check===4&&state.studentType==="new"&&state.portrait>0&&state.footerBrand===2&&
     expanded==="true"&&oldVisible&&panelText.includes("資格")&&oldStillNoCheckout&&collapsed&&title.includes("新生")&&
     status.includes("沒有傳送")&&node==="true"&&axis==="true"&&!overflow&&!errs.length&&!posts.length&&(!reduce||running===0);
  const item={name,pass,expanded,oldVisible,collapsed,title,oldStillNoCheckout,overflow,errs,posts,running,state};
  rows.push(item);console.log(JSON.stringify({name,pass,expanded,oldVisible,collapsed,overflow,errs,posts,running}));
  await ctx.close();
 }
 await browser.close();
 fs.writeFileSync(path.join(__dirname,"R12_3_ROUTING_QC.json"),JSON.stringify(rows,null,2));
 if(rows.some(x=>!x.pass))process.exitCode=1;
})().catch(e=>{console.error(e.stack);process.exitCode=2});
