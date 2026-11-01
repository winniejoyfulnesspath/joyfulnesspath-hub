const {chromium}=require("C:/Users/paulw/Documents/sne-website/node_modules/playwright"),fs=require("fs"),path=require("path");
const root=__dirname,old=path.resolve(root,"../V3_EXPERIENTIAL_R10_MOTION");
function url(dir){return "file:///"+dir.replaceAll("\\","/")+"/index.html"}
async function sample(page){
 return page.evaluate(()=>{
 const h=document.getElementById("tree-title"), intro=document.querySelector("#constellation .tree-intro"), heading=document.querySelector("#constellation .tree-heading"),copy=intro.querySelector(".quiet-copy"),after=getComputedStyle(intro,"::after"),s=getComputedStyle(h);
 const bounds=e=>{let r=e.getBoundingClientRect();return{x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)}};
 const walker=document.createTreeWalker(h,NodeFilter.SHOW_TEXT),map=new Map();let n;
 while((n=walker.nextNode()))for(let i=0;i<n.textContent.length;i++){
  const ch=n.textContent[i];if(!ch.trim())continue;
  let rng=document.createRange();rng.setStart(n,i);rng.setEnd(n,i+1);
  const r=rng.getBoundingClientRect();let key=Math.round(r.top);
  if(!map.has(key))map.set(key,"");map.set(key,map.get(key)+ch);
 }
 const lines=[...map.entries()].sort((a,b)=>a[0]-b[0]).map(v=>v[1]);const hrect=h.getBoundingClientRect(),crect=copy.getBoundingClientRect();
 return{heading:bounds(heading),h2:bounds(h),copy:bounds(copy),after:{position:after.position,width:after.width,display:after.display},
  fontSize:s.fontSize,lines,overflow:document.documentElement.scrollWidth>innerWidth,
  overlap:!(hrect.right<crect.left||crect.right<hrect.left||hrect.bottom<crect.top||crect.bottom<hrect.top),
  css:[...document.styleSheets].some(x=>x.href?.endsWith("layout-r11.css"))};
 });
}
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--disable-gpu"]});
let out=[];
for(const [tag,w,h] of [["desktop",1440,900],["user-shot",1240,620],["laptop",1024,768],["tablet",768,1024],["mobile",390,844],["small",320,700]]){
 const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1}),p=await ctx.newPage(),err=[];
 p.on("pageerror",e=>err.push(e.message));
 await p.goto(url(root),{waitUntil:"load",timeout:30000});
 await p.locator("#constellation").scrollIntoViewIfNeeded();await p.waitForTimeout(250);
 await p.locator(".node-orb[data-id='4']").click();
 await p.locator(".axis-tab[data-axis='2']").click();
 const q=await sample(p);
 const active=await p.locator(".node-orb[data-id='4']").getAttribute("aria-pressed");
 const passes=q.css&&q.after.position==="absolute"&&!q.overflow&&!q.overlap&&q.lines.every(s=>s.length>=2)&&q.lines.length<=(w>=1024?3:5)&&active==="true"&&err.length===0;
 await p.locator(".tree-intro").screenshot({path:path.join(root,"R11_"+tag+"_HEADING.png"),animations:"disabled"});
 out.push({tag,pass:passes,...q,errors:err});console.log("R11 "+JSON.stringify({tag,pass:passes,font:q.fontSize,lines:q.lines,headingWidth:q.heading.w,copyX:q.copy.x,overlap:q.overlap,overflow:q.overflow,errors:err}));await ctx.close();
}
const ctx=await browser.newContext({viewport:{width:1240,height:620}}),oldpage=await ctx.newPage();await oldpage.goto(url(old),{waitUntil:"load",timeout:30000});await oldpage.locator("#constellation").scrollIntoViewIfNeeded();await oldpage.waitForTimeout(200);let oldState=await sample(oldpage);console.log("R10_BEFORE "+JSON.stringify({width:oldState.heading.w,lines:oldState.lines,pseudo:oldState.after.position}));await oldpage.locator(".tree-intro").screenshot({path:path.join(root,"R10_BROKEN_1240.png"),animations:"disabled"});await ctx.close();
await browser.close();fs.writeFileSync(path.join(root,"R11_LAYOUT_QC.json"),JSON.stringify({baseline:oldState,after:out},null,2));if(out.some(x=>!x.pass))process.exitCode=1;
})().catch(e=>{console.error(e.stack);process.exitCode=2});