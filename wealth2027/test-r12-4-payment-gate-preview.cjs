"use strict";
const {chromium}=require("C:/Users/paulw/Documents/sne-website/node_modules/playwright");
const fs=require("fs"),path=require("path");
const url="file:///"+__dirname.replaceAll("\\","/")+"/index.html";
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--disable-gpu"]});
 const results=[];
 for(const [name,w,h,reduce] of [["desktop",1440,900,false],["tablet",768,1024,false],["mobile",390,844,false],["small",320,700,false],["reduced",390,844,true]]){
  const ctx=await browser.newContext({viewport:{width:w,height:h},reducedMotion:reduce?"reduce":"no-preference"});
  const p=await ctx.newPage(),errors=[],posts=[];
  p.on("pageerror",e=>errors.push(e.message));
  p.on("request",r=>{if(r.method()==="POST")posts.push(r.url())});
  await p.goto(url,{waitUntil:"load",timeout:30000});
  const newButton=p.locator("[data-r12-open]");
  const alumniButton=p.locator("[data-r123-alumni]");
  await newButton.click();
  const newType=await p.locator('input[name="studentType"]').inputValue();
  await p.locator('input[name="name"]').fill("TEST ONLY");
  await p.locator('input[name="email"]').fill("test@example.invalid");
  await p.locator('input[name="region"]').fill("TEST REGION");
  await p.locator('input[name="eventConsent"]').check();
  await p.locator('#r12-form button[type="submit"]').click();
  const newMessage=await p.locator("[data-form-status]").innerText();
  await p.locator("[data-r12-close]").first().click();
  await alumniButton.click();
  const alumniType=await p.locator('input[name="studentType"]').inputValue();
  const alumniNote=await p.locator("#r124-route-note").innerText();
  const resetName=await p.locator('input[name="name"]').inputValue();
  await p.locator('input[name="name"]').fill("TEST ONLY");
  await p.locator('input[name="email"]').fill("test@example.invalid");
  await p.locator('input[name="region"]').fill("TEST REGION");
  await p.locator('input[name="eventConsent"]').check();
  await p.locator('#r12-form button[type="submit"]').click();
  const alumniMessage=await p.locator("[data-form-status]").innerText();
  if(name==="mobile")await p.locator("#r12-dialog").screenshot({path:path.join(__dirname,"R12_4_MOBILE_ALUMNI_FORM.png"),animations:"disabled"});
  await p.locator("[data-r12-close]").first().click();
  const regOptions=await p.locator('input[name="focusArea"]').count();
  const topics=await p.locator('input[name="topicInterest"]').count();
  const noPublicAlumniPanel=await p.locator("#r123-alumni-panel").count()===0;
  const noRawCheckout=await p.evaluate(()=>!document.documentElement.outerHTML.includes("buy.stripe.com"));
  await p.locator(".node-orb[data-id='4']").click();
  const node=(await p.locator(".node-orb[data-id='4']").getAttribute("aria-pressed"))==="true";
  await p.locator(".axis-tab[data-axis='2']").click();
  const matrix=(await p.locator(".axis-tab[data-axis='2']").getAttribute("aria-selected"))==="true";
  const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  const running=reduce?await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==="running").length):null;
  const pass=newType==="new"&&alumniType==="alumni"&&resetName===""&&
    newMessage.includes("資料沒有傳送")&&alumniMessage.includes("尚未查詢 Winnie Panel")&&alumniNote.includes("Winnie Panel")&&
    regOptions===6&&topics===4&&noPublicAlumniPanel&&noRawCheckout&&node&&matrix&&!overflow&&!errors.length&&!posts.length&&(!reduce||running===0);
  results.push({name,pass,newType,alumniType,regOptions,topics,noPublicAlumniPanel,noRawCheckout,node,matrix,overflow,errors,posts,running});
  console.log("R12_4 "+JSON.stringify({name,pass,newType,alumniType,regOptions,topics,node,matrix,overflow,errors,posts,running}));
  await ctx.close();
 }
 await browser.close();
 fs.writeFileSync(path.join(__dirname,"R12_4_PAYMENT_GATE_PREVIEW_QC.json"),JSON.stringify(results,null,2),"utf8");
 if(results.some(x=>!x.pass))process.exitCode=1;
})().catch(e=>{console.error(e.stack);process.exitCode=2});
