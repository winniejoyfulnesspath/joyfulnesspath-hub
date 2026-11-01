const{chromium}=require("C:/Users/paulw/Documents/sne-website/node_modules/playwright"),fs=require("fs");
const root="C:/Users/paulw/Downloads/Wealth10_R9_PAGE_REFINEMENT_LOCAL_20261030";
(async()=>{const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"}),result=[];
for(const {name,file,width}of [{name:"entry",file:"START_HERE.html",width:1440},{name:"desktop",file:"V3_EXPERIENTIAL_R9_PAGE_REFINEMENT/index.html",width:1440},{name:"mobile",file:"V3_EXPERIENTIAL_R9_PAGE_REFINEMENT/index.html",width:390},{name:"comparison",file:"V3_EXPERIENTIAL_R9_PAGE_REFINEMENT/REVIEW_R9.html",width:1440}]){
const ctx=await browser.newContext({viewport:{width,height:width===390?844:900}}),page=await ctx.newPage(),errors=[];
page.on("pageerror",e=>errors.push(e.message));await page.goto("file:///"+root+"/"+file,{waitUntil:"load",timeout:30000});
await page.evaluate(()=>{for(const im of document.images)im.loading="eager"});await page.waitForTimeout(1000);
const data=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,img:[...document.images].map(im=>({name:im.src.split('/').pop(),ok:im.complete&&im.naturalWidth>0})),hasCSS:[...document.styleSheets].some(s=>s.href?.endsWith("visual-r9.css"))}));
let state=null;if(name==="desktop"||name==="mobile"){await page.locator(".node-orb[data-id='5']").focus();await page.locator(".node-orb[data-id='5']").press("Enter");await page.locator(".axis-tab[data-axis='2']").click();state=await page.evaluate(()=>({tree:document.querySelector(".node-orb[data-id='5']").getAttribute("aria-pressed"),axis:document.querySelector("#axis-title").textContent}));}
const pass=!errors.length&&!data.overflow&&data.img.every(x=>x.ok)&&(!state||(data.hasCSS&&state.tree==="true"));
result.push({name,pass,broken:data.img.filter(x=>!x.ok),images:data.img.length,errors,state});console.log("R9_PACKAGE "+JSON.stringify(result.at(-1)));await ctx.close()}
await browser.close();fs.writeFileSync(root+"/PACKAGE_QC.json",JSON.stringify(result,null,2));if(result.some(x=>!x.pass))process.exitCode=1;
})().catch(e=>{console.error(e.stack);process.exitCode=2});