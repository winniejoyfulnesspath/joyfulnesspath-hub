const {chromium}=require("C:/Users/paulw/Documents/sne-website/node_modules/playwright"),fs=require("fs"),path=require("path");
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--disable-gpu"]});
const c=await browser.newContext({viewport:{width:1100,height:700},recordVideo:{dir:__dirname,size:{width:1100,height:700}},reducedMotion:"no-preference"});
const p=await c.newPage();
const video=p.video();let errors=[];p.on("pageerror",e=>errors.push(e.message));
await p.goto("file:///"+__dirname.replaceAll("\\","/")+"/index.html",{waitUntil:"load"});
await p.waitForTimeout(900);
for(const [section,delay] of [["#threshold",950],["#constellation",1200]]){
 await p.evaluate(sel=>document.querySelector(sel).scrollIntoView({behavior:"smooth",block:"start"}),section);
 await p.waitForTimeout(delay);
}
await p.locator(".node-orb[data-id='4']").click();
await p.waitForTimeout(700);
await p.evaluate(()=>document.querySelector("#alignment").scrollIntoView({behavior:"smooth",block:"start"}));
await p.waitForTimeout(1100);
await p.locator(".axis-tab[data-axis='2']").click();
await p.waitForTimeout(800);
await p.evaluate(()=>document.querySelector("#winnie").scrollIntoView({behavior:"smooth",block:"start"}));
await p.waitForTimeout(1000);
await p.evaluate(()=>document.querySelector(".practice-strip").scrollIntoView({behavior:"smooth",block:"start"}));
await p.waitForTimeout(1300);
await p.waitForTimeout(200);
const src=await video.path();
await c.close();await browser.close();
const dst=path.join(__dirname,"R10_LIVE_MOTION_DEMO.webm");fs.copyFileSync(src,dst);fs.unlinkSync(src);
console.log("R10_DEMO "+JSON.stringify({bytes:fs.statSync(dst).size,path:dst,errors}));
if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e.stack);process.exitCode=2});