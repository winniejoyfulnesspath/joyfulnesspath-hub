const {chromium}=require("C:/Users/paulw/Documents/sne-website/node_modules/playwright"),fs=require("fs"),path=require("path");
const root="C:/Users/paulw/Downloads/Wealth10_R6_SPATIAL_LOCAL_20261030";
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"});
 const results=[];
 for(const {name,src,w} of [{name:"entry",src:"START_HERE.html",w:1440},{name:"site-desktop",src:"V3_EXPERIENTIAL_R6_SPATIAL_FIX/index.html",w:1440},{name:"site-mobile",src:"V3_EXPERIENTIAL_R6_SPATIAL_FIX/index.html",w:390},{name:"review",src:"V3_EXPERIENTIAL_R6_SPATIAL_FIX/R6_VISUAL_REVIEW.html",w:1440}]){
  const ctx=await browser.newContext({viewport:{width:w,height:w===390?844:900}}),page=await ctx.newPage(),errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  await page.goto("file:///"+root+"/"+src,{waitUntil:"load",timeout:30000});
  await page.evaluate(()=>[...document.images].forEach(im=>im.loading="eager"));
  await page.waitForTimeout(1050);
  const data=await page.evaluate(()=>({imgs:[...document.images].map(i=>({ok:i.complete&&i.naturalWidth>0,name:i.src.split("/").pop()})),overflow:document.documentElement.scrollWidth>innerWidth,css:[...document.styleSheets].some(s=>s.href?.endsWith("visual-r6.css"))}));
  let active=null;if(name.startsWith("site")){
    await page.locator(".node-orb[data-id='4']").click();await page.locator(".axis-tab[data-axis='2']").click();
    active=await page.evaluate(()=>({tree:document.querySelector(".node-orb[data-id='4']").getAttribute("aria-pressed"),axis:document.querySelector("#axis-title").textContent}));
  }
  const pass=!errors.length&&!data.overflow&&data.imgs.every(i=>i.ok)&&(!name.startsWith("site")||(data.css&&active.tree==="true"));
  results.push({name,pass,errors,broken:data.imgs.filter(x=>!x.ok),count:data.imgs.length,active});
  console.log("R6_PACKAGE "+JSON.stringify(results.at(-1)));await ctx.close();
 }
 await browser.close();fs.writeFileSync(path.join(root,"PACKAGE_QC.json"),JSON.stringify(results,null,2));if(results.some(x=>!x.pass))process.exitCode=1;
})().catch(e=>{console.error(e.stack);process.exitCode=2});