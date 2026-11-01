"use strict";
const {chromium}=require("C:/Users/paulw/Documents/sne-website/node_modules/playwright");
const urls=[
["A","https://buy.stripe.com/9B6cN6eYubNu1qSdpXdMI03"],
["B","https://buy.stripe.com/00w7sM7w23gY4D4clTdMI05"]
];
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--disable-gpu"]});
 for (const [key,url] of urls){
  const p=await browser.newPage({viewport:{width:1200,height:900}});
  const errors=[]; const resourceCounts={};
  p.on("pageerror",e=>errors.push(e.message.slice(0,150)));
  p.on("response",r=>{try{ const host=new URL(r.url()).hostname;resourceCounts[host]=(resourceCounts[host]||0)+1;}catch{}});
  try {
   const response=await p.goto(url,{waitUntil:"domcontentloaded",timeout:25000});
   await p.waitForTimeout(8000);
   const info=await p.evaluate(()=>({
    title:document.title,
    state:document.readyState,
    bodyText:document.body?.innerText?.slice(0,1200)||"",
    iframes:[...document.querySelectorAll("iframe")].map(x=>({title:x.title,src:x.src.slice(0,160)})),
    scripts:document.scripts.length,
    data:document.querySelector("meta[name=description]")?.content||"",
    checkoutId:document.querySelector("[data-qa=payment-link-title]")?.textContent||"",
    textLength:document.body?.innerText?.length||0
   }));
   await p.screenshot({path:__dirname+"/_stripe_probe_"+key+".png",fullPage:false,timeout:15000});
   console.log(JSON.stringify({key,status:response?.status(),info,errors,resourceCounts}));
  }catch(e){console.log(JSON.stringify({key,error:e.message.slice(0,350),errors}))}
  await p.close();
 }
 await browser.close();
})().catch(e=>{console.error("TOP",e.message);process.exitCode=1;});