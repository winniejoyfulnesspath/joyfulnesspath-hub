const {chromium}=require("C:/Users/paulw/Documents/sne-website/node_modules/playwright"),fs=require("fs"),path=require("path");
const url="file:///"+__dirname.replaceAll("\\","/")+"/index.html";
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--disable-gpu"]});
 const cases=[];
 for(const [tag,w,h,reduced] of [["desktop",1440,900,false],["tablet",768,1024,false],["mobile",390,844,false],["small",320,700,false],["reduced",390,844,true]]){
  const ctx=await browser.newContext({viewport:{width:w,height:h},reducedMotion:reduced?"reduce":"no-preference",deviceScaleFactor:1});
  const p=await ctx.newPage(),errs=[],posts=[];
  p.on("pageerror",e=>errs.push(e.message));p.on("request",req=>{if(req.method()==="POST")posts.push(req.url())});
  await p.goto(url,{waitUntil:"load",timeout:25000});await p.waitForTimeout(290);
  const basic=await p.evaluate(()=>({
    title:document.title,
    dateCount:document.body.innerText.split("2027 年 1 月 8–10 日").length-1,
    loginStale:document.querySelector("meta[name=description]").getAttribute("content").includes("尚未確認"),
    logo:[...document.querySelectorAll(".r12-logo,.r12-footer-brand img")].every(i=>i.complete&&i.naturalWidth>0),
    imageFailures:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src.split("/").pop()),
    css:[...document.styleSheets].some(s=>s.href?.endsWith("enrollment-r12.css")),
    overflow:document.documentElement.scrollWidth>innerWidth,
    sections:[...document.querySelectorAll("#course-dates,#enroll")].length,
    footerLinks:[...document.querySelectorAll(".r12-footer-links a")].map(a=>a.href)
  }));
  await p.locator(".nav-action").click();await p.waitForTimeout(100);
  const nav=await p.evaluate(()=>location.hash==="#enroll");
  await p.locator("[data-r12-open]").click();
  const opened=await p.locator("#r12-dialog").evaluate(el=>el.open);
  await p.locator("input[name=name]").fill("Demo Example");
  await p.locator("input[name=email]").fill("demo@example.com");
  await p.locator("input[name=region]").fill("Test");
  await p.locator("input[name=eventConsent]").check();
  await p.locator("#r12-form button[type=submit]").click();
  const preview=await p.locator("[data-form-status]").textContent();
  await p.locator("[data-r12-close]").first().click();
  const closed=!(await p.locator("#r12-dialog").evaluate(el=>el.open));
  await p.locator(".node-orb[data-id='4']").focus();await p.locator(".node-orb[data-id='4']").press("Enter");
  const tree=await p.locator(".node-orb[data-id='4']").getAttribute("aria-pressed");
  await p.locator(".axis-tab[data-axis='2']").click();
  const axis=await p.locator(".axis-tab[data-axis='2']").getAttribute("aria-selected");
  const animations=reduced?await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==="running").length):null;
  const pass=!errs.length&&!posts.length&&!basic.loginStale&&basic.dateCount>=3&&basic.logo&&basic.imageFailures.length===0&&basic.css&&!basic.overflow&&basic.sections===2&&opened&&closed&&nav&&preview.includes("沒有傳送")&&tree==="true"&&axis==="true"&&(!reduced||animations===0);
  if(tag==="desktop"||tag==="mobile"){
   for(const [id,sel] of [["HERO","#entrance"],["DATES","#course-dates"],["ENROLL","#enroll"],["FOOTER",".r12-footer"]]){
    await p.locator(sel).scrollIntoViewIfNeeded();await p.waitForTimeout(180);
    await p.locator(sel).screenshot({path:path.join(__dirname,"R12_"+tag+"_"+id+".png"),animations:"disabled",timeout:35000});
   }
   await p.locator("[data-r12-open]").click();
   await p.locator("#r12-dialog").screenshot({path:path.join(__dirname,"R12_"+tag+"_FORM.png"),animations:"disabled"});
  }
  const item={tag,pass,errs,posts,basic,nav,opened,closed,tree,axis,preview,animations};
  cases.push(item);console.log("R12 "+JSON.stringify({tag,pass,overflow:basic.overflow,dates:basic.dateCount,logo:basic.logo,broken:basic.imageFailures,posted:posts.length,form:preview,errors:errs,animations}));
  await ctx.close();
 }
 await browser.close();fs.writeFileSync(path.join(__dirname,"R12_QC.json"),JSON.stringify(cases,null,2));if(cases.some(x=>!x.pass))process.exitCode=1;
})().catch(e=>{console.error(e.stack);process.exitCode=2});