const{chromium}=require("C:/Users/paulw/Documents/sne-website/node_modules/playwright");
const path=require("path");const base=__dirname;
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--disable-gpu"]});
 for(const spec of [{n:"desktop",w:1440,h:900},{n:"mobile",w:390,h:844}]){
  const ctx=await browser.newContext({viewport:{width:spec.w,height:spec.h},deviceScaleFactor:1});
  const page=await ctx.newPage();await page.goto("file:///"+base.replaceAll("\\","/")+"/index.html",{waitUntil:"load"});
  await page.waitForTimeout(1200);
  await page.screenshot({path:path.join(base,"R4_"+spec.n+"_HERO.png"),fullPage:false});
  for(const sel of [["TREE","#constellation"],["MATRIX","#alignment"],["MENTOR","#winnie"]]){
   await page.locator(sel[1]).scrollIntoViewIfNeeded();await page.waitForTimeout(800);
   await page.screenshot({path:path.join(base,"R4_"+spec.n+"_"+sel[0]+".png"),fullPage:false});
  }
  console.log("CAPTURED "+spec.n);
  await ctx.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
