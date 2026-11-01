const {chromium}=require("C:/Users/paulw/Documents/sne-website/node_modules/playwright"),fs=require("fs"),path=require("path");
const url="file:///"+__dirname.replaceAll("\\","/")+"/index.html";
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--disable-gpu"]}),cases=[];
for(const [name,w,h,reduced] of [["desktop",1440,900,false],["tablet",768,1024,false],["mobile",390,844,false],["small",320,700,false],["reduced",390,844,true]]){
 const ctx=await browser.newContext({viewport:{width:w,height:h},reducedMotion:reduced?"reduce":"no-preference"});
 const p=await ctx.newPage(),errors=[],posts=[];
 p.on("pageerror",e=>errors.push(e.message));p.on("request",req=>{if(req.method()==="POST")posts.push(req.url())});
 await p.goto(url,{waitUntil:"load",timeout:30000});await p.waitForTimeout(300);
 const start=await p.evaluate(()=>{
  const fixed=document.querySelector(".r12-fixed"),el=document.querySelector(".site-header .r12-logo"),style=getComputedStyle(el);
  return{fixedHidden:getComputedStyle(fixed).opacity==="0"||getComputedStyle(fixed).display==="none",
   logoBg:style.backgroundColor,logoImage:el.complete&&el.naturalWidth>0,
   footerBrands:[...document.querySelectorAll(".r12-footer-collab a")].map(x=>({text:x.textContent.trim(),url:x.href,img:x.querySelector("img")?.naturalWidth})),
   cards:[...document.querySelectorAll(".r12-date-link")].map(a=>({text:a.textContent.trim(),href:a.getAttribute("href"),font:getComputedStyle(a.querySelector(".r12-date-action")).fontSize})),
   overflow:document.documentElement.scrollWidth>innerWidth,css:[...document.styleSheets].some(s=>s.href?.endsWith("visual-r12-1.css"))};
 });
 await p.locator("#course-dates").scrollIntoViewIfNeeded();await p.waitForTimeout(150);
 await p.locator("#course-dates").screenshot({path:path.join(__dirname,"R12_1_"+name+"_DATES.png"),animations:"disabled"});
 const dateCard=p.locator(".r12-date-link").nth(1);await dateCard.click();const cardNav=await p.evaluate(()=>location.hash==="#enroll");
 await p.locator("#enroll").scrollIntoViewIfNeeded();await p.waitForTimeout(160);
 const enrollStickyHidden=await p.locator(".r12-fixed").evaluate(el=>getComputedStyle(el).opacity==="0"||getComputedStyle(el).display==="none");
 await p.locator(".r12-footer").scrollIntoViewIfNeeded();await p.waitForTimeout(170);
 const footerVisible=await p.locator(".r12-footer-collab").isVisible();
 if(["desktop","mobile"].includes(name)){
  for(const [key,sel] of [["HERO","#entrance"],["ENROLL","#enroll"],["FOOTER",".r12-footer"]]){
   await p.locator(sel).scrollIntoViewIfNeeded();await p.waitForTimeout(180);
   await p.locator(sel).screenshot({path:path.join(__dirname,"R12_1_"+name+"_"+key+".png"),animations:"disabled"});
  }
 }
 await p.locator("[data-r12-open]").click();
 await p.locator("#r12-dialog").waitFor({state:"visible"});
 await p.locator("input[name=name]").fill("TEST ONLY");
 await p.locator("input[name=email]").fill("test@example.com");
 await p.locator("input[name=region]").fill("Test");
 await p.locator("input[name=eventConsent]").check();
 await p.locator("#r12-form button[type=submit]").click();
 const status=await p.locator("[data-form-status]").textContent();
 await p.locator("[data-r12-close]").first().click();
 await p.locator(".node-orb[data-id='4']").click();
 const node=await p.locator(".node-orb[data-id='4']").getAttribute("aria-pressed");
 await p.locator(".axis-tab[data-axis='2']").click();const axis=await p.locator(".axis-tab[data-axis='2']").getAttribute("aria-selected");
 const running=reduced?await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==="running").length):null;
 const pass=start.fixedHidden&&start.logoImage&&start.css&&start.cards.length===3&&start.cards.every(x=>x.href==="#enroll")&&start.footerBrands.length===2&&start.footerBrands.every(x=>x.img>0)&&
 !start.overflow&&cardNav&&enrollStickyHidden&&footerVisible&&status.includes("沒有傳送")&&node==="true"&&axis==="true"&&!errors.length&&!posts.length&&(!reduced||running===0);
 cases.push({name,pass,start,cardNav,enrollStickyHidden,footerVisible,errors,posts,running});
 console.log("R12_1 "+JSON.stringify({name,pass,logoLoaded:start.logoImage,initialStickyHidden:start.fixedHidden,brands:start.footerBrands,cardClick:cardNav,stickyHiddenAtEnroll:enrollStickyHidden,overflow:start.overflow,errors,posts,running}));
 await ctx.close();
}
await browser.close();fs.writeFileSync(path.join(__dirname,"R12_1_QC.json"),JSON.stringify(cases,null,2));if(cases.some(x=>!x.pass))process.exitCode=1;
})().catch(e=>{console.error(e.stack);process.exitCode=2});