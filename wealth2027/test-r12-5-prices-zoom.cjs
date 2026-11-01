"use strict";
const {chromium}=require("C:/Users/paulw/Documents/sne-website/node_modules/playwright");
const fs=require("fs"),path=require("path");
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--disable-gpu"]});
 const out=[];
 for(const [name,width,height,reduced] of [["desktop",1440,900,false],["tablet",768,1024,false],["mobile",390,844,false],["small",320,700,false],["reduced",390,844,true]]){
   const ctx=await b.newContext({viewport:{width,height},reducedMotion:reduced?"reduce":"no-preference"});
   const p=await ctx.newPage(); const errs=[],posts=[];
   p.on("pageerror",e=>errs.push(e.message));
   p.on("request",q=>{if(q.method()==="POST")posts.push(q.url())});
   await p.goto("file:///"+__dirname.replaceAll("\\","/")+"/index.html",{waitUntil:"load",timeout:25000});
   const result=await p.evaluate(()=>{
     const x=id=>document.querySelector(id)?.innerText||"";
     const prices=[...document.querySelectorAll(".r125-card-price")].map(x=>x.textContent.trim());
     const card=x(".r12-enroll-card"),intro=x(".r12-dates"),hero=x(".r12-hero-detail");
     return {
       prices,cardZoom:card.includes("Zoom"),cardTime:card.includes("8:30–10:30"),
       introZoom:intro.includes("Zoom"),introTime:intro.includes("8:30–10:30"),
       heroZoom:hero.includes("Zoom"),cardTimezoneNotice:card.includes("時區待確認"),
       newPrice:card.includes("US$111"),alumniPrice:card.includes("US$62"),
       stillPreview:card.includes("只供預覽"),noEmbeddedStripe:!document.documentElement.outerHTML.includes("buy.stripe.com"),
       overflow:document.documentElement.scrollWidth>innerWidth
     };
   });
   await p.locator("#enroll").scrollIntoViewIfNeeded();
   if(["desktop","mobile"].includes(name))await p.locator(".r12-enroll-card").screenshot({path:path.join(__dirname,"R12_5_COURSE_"+name+".png"),animations:"disabled"});
   const motionCount=reduced?await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==="running").length):null;
   const pass=result.prices.length===2&&result.prices[0]==="US$111"&&result.prices[1].startsWith("US$62")&&
      result.cardZoom&&result.cardTime&&result.introZoom&&result.introTime&&result.heroZoom&&result.cardTimezoneNotice&&
      result.newPrice&&result.alumniPrice&&result.stillPreview&&result.noEmbeddedStripe&&!result.overflow&&
      errs.length===0&&posts.length===0&&(!reduced||motionCount===0);
   console.log("R12_5_QC "+JSON.stringify({name,pass,prices:result.prices,overflow:result.overflow,errs,posts,running:motionCount}));
   out.push({name,pass,...result,errs,posts,running:motionCount});
   await ctx.close();
 }
 await b.close();
 fs.writeFileSync(path.join(__dirname,"R12_5_COURSE_QC.json"),JSON.stringify(out,null,2),"utf8");
 if(out.some(x=>!x.pass))process.exitCode=1;
})().catch(e=>{console.error(e.stack);process.exitCode=2});
