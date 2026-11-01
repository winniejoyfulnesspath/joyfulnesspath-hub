"use strict";
/* Contextual mobile CTA only: it appears after the opening screen
   and disappears before the registration panel; no submission logic. */
(()=>{
 const fixed=document.querySelector(".r12-fixed");
 const hero=document.querySelector("#entrance");
 const dates=document.querySelector("#course-dates");
 const enroll=document.querySelector("#enroll");
 if(!fixed||!hero||!enroll)return;
 let frame=0;
 const update=()=>{
   frame=0;
   const mobile=window.matchMedia("(max-width:760px)").matches;
   const vh=window.innerHeight;
   const y=window.scrollY;
   const first=dates||hero;
   const start=first.offsetTop+first.offsetHeight-vh*0.6;
   const stop=enroll.offsetTop-vh*0.45;
   fixed.classList.toggle("r12-scroll-active",mobile&&y>start&&y<stop);
 };
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
 document.addEventListener("scroll",schedule,{passive:true});
 window.addEventListener("resize",schedule,{passive:true});
 window.addEventListener("pageshow",schedule,{passive:true});
 schedule();
})();
