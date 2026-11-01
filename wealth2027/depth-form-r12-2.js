"use strict";
/* R12.2: viewport-paced chapter transitions; purely presentational.
   No analytics, network, form submit/storage or payment endpoint. */
(()=>{
 const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
 if(reduced.matches||!("IntersectionObserver" in window))return;
 const groups=[
  [".r12-dates > .r12-kicker",0],
  [".r12-dates > h2",90],
  [".r12-dates > p:not(.r12-kicker)",160],
  [".r12-date-grid > .r12-date-link",0],
  [".tree-insight",80],
  [".matrix-top",0],
  [".matrix-installation",100],
  [".mentor-media",0],
  [".mentor-story .mentor-position",60],
  [".mentor-quote",100],
  [".practice-strip figure",0],
  [".r12-enroll-grid > div",0],
  [".last-section > .eyebrow",0],
  [".last-section > h2",110],
  [".last-section > p:not(.eyebrow)",160],
  [".r12-footer-collab",50]
 ];
 const targets=[];
 groups.forEach(([selector,delay])=>{
  document.querySelectorAll(selector).forEach((el,i)=>{
   if(el.classList.contains("reveal"))return; // original reveal controller owns this element
   el.classList.add("depth-enter");
   el.style.setProperty("--depth-delay",(delay+Math.min(i,3)*105)+"ms");
   targets.push(el);
  });
 });
 if(!targets.length)return;
 document.documentElement.classList.add("depth-motion-ready");
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>e.target.classList.toggle("is-visible",e.isIntersecting));
 },{threshold:.055,rootMargin:"0px 0px -6% 0px"});
 targets.forEach(el=>observer.observe(el));
 // Restore visibility when user switches to reduced motion, without another reload.
 const toggle=()=>{if(reduced.matches){document.documentElement.classList.remove("depth-motion-ready");
  targets.forEach(x=>x.classList.add("is-visible"));}
 else {document.documentElement.classList.add("depth-motion-ready");targets.forEach(x=>x.classList.remove("is-visible"));}};
 reduced.addEventListener?.("change",toggle);
})();
