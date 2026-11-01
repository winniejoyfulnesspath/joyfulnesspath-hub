const {chromium}=require("C:/Users/paulw/Documents/sne-website/node_modules/playwright"),fs=require("fs"),path=require("path");
const root="C:/Users/paulw/Downloads/Wealth10_R5_APPROVED_ART_LOCAL_20261030";
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"}),cases=[];
 for(const spec of [{n:"entry",f:"START_HERE.html",w:1440},{n:"page-desktop",f:"V3_EXPERIENTIAL_R5_APPROVED_IMAGES/index.html",w:1440},{n:"page-mobile",f:"V3_EXPERIENTIAL_R5_APPROVED_IMAGES/index.html",w:390},{n:"review",f:"V3_EXPERIENTIAL_R5_APPROVED_IMAGES/REVIEW_R5.html",w:1440}]){
  const ctx=await browser.newContext({viewport:{width:spec.w,height:900},deviceScaleFactor:1});
  const page=await ctx.newPage(),errors=[];page.on("pageerror",e=>errors.push(e.message));
  await page.goto("file:///"+root+"/"+spec.f,{waitUntil:"load",timeout:30000});
  await page.evaluate(()=>{for(const im of document.images)im.loading="eager"});await page.waitForTimeout(1100);
  const data=await page.evaluate(()=>({
    imgs:[...document.images].map(im=>({src:im.src.split('/').pop(),ok:im.complete&&im.naturalWidth>0})),
    overflow:document.documentElement.scrollWidth>innerWidth,css:[...document.styleSheets].some(s=>s.href?.endsWith("visual-r5.css")),
    links:[...document.querySelectorAll('a[href]')].map(x=>x.getAttribute('href')).slice(0,5)
  }));
  let active=null;
  if(spec.n.startsWith("page")){
    await page.locator(".node-orb[data-id='4']").click();
    await page.locator(".axis-tab[data-axis='2']").click();
    active=await page.evaluate(()=>({tree:document.querySelector(".node-orb[data-id='4']").getAttribute("aria-pressed"),title:document.querySelector("#axis-title").textContent}));
  }
  const pass=!data.overflow&&!errors.length&&data.imgs.every(i=>i.ok)&&(spec.n.startsWith("page")?data.css&&active?.tree==="true":true);
  cases.push({spec:spec.n,pass,broken:data.imgs.filter(i=>!i.ok),imgs:data.imgs.length,errors,overflow:data.overflow,active,links:spec.n==="entry"?data.links:[]});
  console.log("R5_BUNDLE "+JSON.stringify(cases.at(-1)));await ctx.close();
 }await browser.close();fs.writeFileSync(path.join(root,"PACKAGE_QC.json"),JSON.stringify(cases,null,2));if(cases.some(x=>!x.pass))process.exitCode=1;
})().catch(e=>{console.error(e.stack);process.exitCode=2});