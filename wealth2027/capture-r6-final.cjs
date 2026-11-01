const {chromium}=require("C:/Users/paulw/Documents/sne-website/node_modules/playwright");
const fs=require("fs"),path=require("path");
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--disable-gpu"]});
 const result=[];
 for(const [name,w,h] of [["desktop",1440,900],["mobile",390,844]]){
  const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});
  const p=await ctx.newPage(),err=[];p.on("pageerror",e=>err.push(e.message));
  await p.goto("file:///"+__dirname.replaceAll("\\","/")+"/index.html",{waitUntil:"load",timeout:30000});
  // Captured steady state: actual reveal elements become visible during a full scroll.
  for(const sel of ["#threshold .threshold-content","#constellation .tree-intro","#constellation .tree-environment","#alignment"]){
    await p.locator(sel).scrollIntoViewIfNeeded();await p.waitForTimeout(200);
  }
  await p.evaluate(()=>document.querySelectorAll(".reveal").forEach(n=>n.classList.add("in-view")));
  for(const [label,sel] of [["THRESHOLD","#threshold"],["TREE","#constellation"],["OUTRO",".last-section"]]){
    await p.locator(sel).screenshot({path:path.join(__dirname,"R6_FINAL_"+name+"_"+label+".png"),animations:"disabled",timeout:40000});
    console.log("SNAP "+name+" "+label);
  }
  const geometry=await p.evaluate(()=>{
   const rect=sel=>{const e=document.querySelector(sel);if(!e)return null;const r=e.getBoundingClientRect();return{x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),bottom:Math.round(r.bottom)}};
   const n=rect(".node-orb[data-id='10']"),legend=rect(".sculpture-legend");
   return {node10:n,legend,clearance:legend?Math.round(legend.y-n.bottom):null,overflow:document.documentElement.scrollWidth>innerWidth,nodeCount:document.querySelectorAll(".node-orb").length,css:[...document.styleSheets].some(s=>s.href?.endsWith("visual-r6.css"))};
  });
  await p.locator(".node-orb[data-id='10']").focus();
  await p.locator(".node-orb[data-id='10']").press("Enter");
  await p.locator(".axis-tab[data-axis='2']").click();
  const acts=await p.evaluate(()=>({pressed:document.querySelector(".node-orb[data-id='10']").getAttribute("aria-pressed"),title:document.querySelector("#axis-title").textContent}));
  const pass=!err.length&&!geometry.overflow&&geometry.nodeCount===10&&geometry.css&&geometry.clearance>=10&&acts.pressed==="true";
  console.log("R6_FINAL_CASE "+JSON.stringify({name,pass,geometry,acts,err}));
  result.push({name,pass,geometry,acts,err});await ctx.close();
 }await browser.close();fs.writeFileSync(path.join(__dirname,"R6_FINAL_QC.json"),JSON.stringify(result,null,2));
 if(result.some(x=>!x.pass))process.exitCode=1;
})().catch(e=>{console.error(e.stack);process.exitCode=2})