"use strict";
const fs=require("fs"),path=require("path");
const f=path.join(__dirname,"index.html");let html=fs.readFileSync(f,"utf8");
if(html.includes("r12-footer-collab")||html.includes("r12-date-link"))throw Error("Already modified");
const part=html.match(/<div class="r12-date-grid">([\s\S]*?)<\/div>/);
if(!part)throw Error("Missing date grid");
let count=0;let date=part[1].replace(/<article>([\s\S]*?)<\/article>/g,(_m,inner)=>{
 count++;return '<a class="r12-date-link" href="#enroll" aria-label="2027年1月'+[8,9,10][count-1]+'日，查看報名安排">'+inner+'<span class="r12-date-action">查看報名安排 <span aria-hidden="true">↗</span></span></a>';
});
if(count!==3)throw Error("date cards expected 3 got "+count);
html=html.replace(part[0],'<div class="r12-date-grid">'+date+'</div>');
const fpattern=/<nav class="r12-footer-links"[\s\S]*?<\/nav><\/div>/;
if(!fpattern.test(html))throw Error("Footer anchor missing");
const collab=[
'<div class="r12-footer-collab" aria-label="合作品牌">',
'  <a href="https://joyfulnesspath.com/" target="_blank" rel="noopener noreferrer">',
'    <img src="assets/jp-icon.png" width="48" height="48" alt="">Joyfulness Path',
'  </a>',
'  <span class="r12-partner-x" aria-hidden="true">×</span>',
'  <a href="https://soulnewenergy.com/" target="_blank" rel="noopener noreferrer">',
'    Soul New Energy<img src="assets/sne-icon.png" width="48" height="48" alt="">',
'  </a>',
'</div>'
].join("\n");
html=html.replace(fpattern,m=>m+"\n"+collab);
fs.writeFileSync(f,html,"utf8");
console.log(JSON.stringify({cards:count,footerCollab:html.includes('r12-footer-collab'),indexBytes:fs.statSync(f).size}));
