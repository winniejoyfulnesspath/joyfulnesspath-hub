const{chromium}=require("C:/Users/paulw/Documents/sne-website/node_modules/playwright");
const path=require("path");(async()=>{
 const b=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"});
 for(const [name,w,h] of [["desktop",1440,900],["mobile",390,844]]){
  const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});
  const pg=await ctx.newPage();await pg.goto("file:///"+__dirname.replaceAll("\\","/")+"/index.html",{waitUntil:"load"});await pg.waitForTimeout(1600);
  await pg.locator("#threshold").scrollIntoViewIfNeeded();await pg.waitForTimeout(600);
  await pg.screenshot({path:path.join(__dirname,"R4_"+name+"_THRESHOLD.png"),fullPage:false});
  const dims=await pg.evaluate(()=>{const sels=[".threshold-content",".threshold-scenography",".threshold .scene-footnote"];return sels.map(s=>{const e=document.querySelector(s),r=e.getBoundingClientRect(),c=getComputedStyle(e);return {sel:s,rect:{x:r.x,y:r.y,width:r.width,height:r.height},display:c.display,opacity:c.opacity}})});
  console.log("THRESHOLD "+name+" "+JSON.stringify(dims));await ctx.close();
 }await b.close();
})().catch(e=>{console.error(e);process.exitCode=1});