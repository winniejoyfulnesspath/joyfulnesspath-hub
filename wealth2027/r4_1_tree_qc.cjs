const{chromium}=require("C:/Users/paulw/Documents/sne-website/node_modules/playwright"),fs=require("fs"),path=require("path");
const root=__dirname;
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--disable-gpu"]});const results=[];
 for(const [w,h] of [[320,720],[390,844],[428,926],[768,1024],[1440,900]]){
 const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});const page=await ctx.newPage(),errors=[];
 page.on("pageerror",e=>errors.push(e.message));await page.goto("file:///"+root.replaceAll("\\","/")+"/index.html",{waitUntil:"load",timeout:30000});await page.waitForTimeout(800);
 const data=await page.evaluate(()=>{
 const rect=(q)=>{const r=document.querySelector(q).getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,bottom:r.bottom,top:r.top}};
 const n=rect('.node-orb[data-id="10"]'),legend=rect('.sculpture-legend');
 const css=getComputedStyle(document.querySelector(".node-orb .node-label"));return{viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,node10:n,legend,verticalClearance:Math.round(legend.top-n.bottom),labelFont:css.fontSize,topFrame:rect(".sculpture-frame"),nodeCount:document.querySelectorAll(".node-orb").length};
 });await page.locator("#constellation").scrollIntoViewIfNeeded();await page.waitForTimeout(500);
 if(w<=428)await page.screenshot({path:path.join(root,"R4_1_TREE_"+w+".png"),fullPage:false});
 await page.locator(".node-orb[data-id='10']").focus();await page.locator(".node-orb[data-id='10']").press("Enter");
 const pressed=await page.locator(".node-orb[data-id='10']").getAttribute("aria-pressed"),name=await page.locator("#tree-name").textContent();
 const pass={noOverflow:data.scrollWidth<=w,tenNodes:data.nodeCount===10,touch:(w>480||data.node10.w>=44),clearance:(w>480||data.verticalClearance>=14),labels:(w>480||parseFloat(data.labelFont)>=9),interaction:pressed==="true"&&name==="顯現輪",errors:errors.length===0};
 results.push({w,h,data,pass});console.log("R4_1 "+JSON.stringify({w,clear:data.verticalClearance,label:data.labelFont,pass}));
 await ctx.close();
 }await browser.close();fs.writeFileSync(path.join(root,"R4_1_TREE_QC.json"),JSON.stringify({cases:results},null,2));if(results.some(r=>Object.values(r.pass).some(p=>!p)))process.exitCode=1;
})().catch(e=>{console.error(e.stack);process.exitCode=2});