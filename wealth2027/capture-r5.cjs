const {chromium}=require("C:/Users/paulw/Documents/sne-website/node_modules/playwright");
const fs=require("fs"),path=require("path");
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--disable-gpu"]});
 const results=[]; const specs=[["desktop",1440,900],["mobile",390,844]];
 for(const [name,w,h] of specs){
  const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});
  const page=await ctx.newPage(); const errors=[];page.on("pageerror",e=>errors.push(e.message));
  await page.goto("file:///"+__dirname.replaceAll("\\","/")+"/index.html",{waitUntil:"load",timeout:30000});
  await page.evaluate(()=>document.fonts.ready);
  const assets=await page.evaluate(async()=>{const files=["threshold_portal_from_approved.webp","tree_stage_composite_v3.webp","outro_architecture_from_approved.webp","tree_mobile_pillar_from_approved.webp","outro_mobile_columns_from_approved.webp"];return await Promise.all(files.map(f=>new Promise(resolve=>{const im=new Image();im.onload=()=>resolve({f,ok:true,w:im.naturalWidth,h:im.naturalHeight});im.onerror=()=>resolve({f,ok:false});im.src="assets/"+f})))});
  const sections=[["THRESHOLD","#threshold"],["TREE","#constellation"],["OUTRO",".last-section"]];
  for(const [label,sel] of sections){
   const locator=page.locator(sel);await locator.scrollIntoViewIfNeeded();await page.waitForTimeout(480);
   await locator.screenshot({path:path.join(__dirname,"R5_"+name+"_"+label+".png"),timeout:30000,animations:"disabled"});
   console.log("R5_SHOT "+name+" "+label);
  }
  await page.locator(".node-orb[data-id='4']").click();
  await page.locator(".axis-tab[data-axis='2']").click();
  const values=await page.evaluate(()=>({pressed:document.querySelector(".node-orb[data-id='4']").getAttribute("aria-pressed"),axis:document.querySelector("#axis-title")?.textContent,overflow:document.documentElement.scrollWidth>innerWidth,decorativeBg:[".threshold-scenography",".tree-section",".last-section"].map(s=>getComputedStyle(document.querySelector(s)).backgroundImage),css:[...document.styleSheets].some(s=>s.href?.endsWith("visual-r5.css"))}));
  const pass=assets.every(a=>a.ok)&&!values.overflow&&values.pressed==="true"&&values.css&&!errors.length;
  console.log("R5_CASE "+JSON.stringify({name,pass,assets,values,errors}));
  results.push({name,pass,assets,values,errors});await ctx.close();
 }await browser.close();fs.writeFileSync(path.join(__dirname,"R5_CAPTURE_QC.json"),JSON.stringify(results,null,2));if(results.some(r=>!r.pass))process.exitCode=1;
})().catch(e=>{console.error(e.stack);process.exitCode=2});