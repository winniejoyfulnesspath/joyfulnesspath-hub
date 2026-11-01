"use strict";
/* Wealth10 R10 — original-script-preserving progressive enhancement.
   Stitch V3-inspired narrative motion: once-per-chapter entrance,
   meaningful node/tab response, background parallax only, offscreen throttling.
   Does not inject new text, fake controls, assets or data. */
(() => {
  const doc=document;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointer=window.matchMedia("(min-width:900px) and (hover:hover) and (pointer:fine)");
  const sections=["#entrance","#threshold","#constellation","#alignment","#winnie",".practice-strip",".last-section"]
     .map(s=>doc.querySelector(s)).filter(Boolean);
  doc.documentElement.classList.add("r10-motion");

  function enter(target){target.classList.add("r10-in-view");}
  if("IntersectionObserver" in window){
    const once=new IntersectionObserver((entries,observer)=>{
      for(const entry of entries){
        if(entry.isIntersecting){enter(entry.target);observer.unobserve(entry.target);}
      }
    },{threshold:.1,rootMargin:"0px 0px -10% 0px"});
    sections.forEach(s=>once.observe(s));
  }else sections.forEach(enter);

  // Always preserve content for users who request reduced motion.
  if(reduced.matches){sections.forEach(enter);return;}

  const nodes=doc.querySelector("#tree-nodes");
  const matrix=doc.querySelector("#matrix-visual");
  const tablist=doc.querySelector(".matrix-tabs");
  const timers=new WeakMap();
  function oneShot(el,cls,ms){
    if(!el)return;
    if(timers.has(el))clearTimeout(timers.get(el));
    el.classList.remove(cls);
    void el.offsetWidth; // recompute only on a deliberate interaction
    el.classList.add(cls);
    const id=setTimeout(()=>{el.classList.remove(cls);timers.delete(el);},ms);
    timers.set(el,id);
  }
  nodes?.addEventListener("click",event=>{
    const button=event.target.closest(".node-orb");
    if(button)oneShot(button,"r10-selected",790);
  });
  const triggerAxis=()=>oneShot(matrix,"r10-axis-switched",860);
  tablist?.addEventListener("click",event=>{
    if(event.target.closest(".axis-tab"))triggerAxis();
  });
  tablist?.addEventListener("keydown",event=>{
    if(["ArrowRight","ArrowLeft","ArrowDown","ArrowUp","Home","End"].includes(event.key))
      requestAnimationFrame(triggerAxis);
  });

  // Decorative parallax only; never move controls or UI labels.
  if(matrix&&pointer.matches){
    let raf=0,x=0,y=0;
    matrix.addEventListener("pointermove",event=>{
      if(reduced.matches)return;
      const b=matrix.getBoundingClientRect();
      x=(((event.clientX-b.left)/b.width)-.5)*14;
      y=(((event.clientY-b.top)/b.height)-.5)*11;
      if(raf)return;
      raf=requestAnimationFrame(()=>{
        matrix.style.setProperty("--r10-mx",x.toFixed(2)+"px");
        matrix.style.setProperty("--r10-my",y.toFixed(2)+"px");
        raf=0;
      });
    },{passive:true});
    matrix.addEventListener("pointerleave",()=>{
      if(raf)cancelAnimationFrame(raf);
      raf=0;matrix.style.setProperty("--r10-mx","0px");
      matrix.style.setProperty("--r10-my","0px");
    });
  }

  // Existing perpetual ambient loops should not burn work while invisible.
  const ambientNames=new Set(["haloBreath","rayTravel","r2GatewayBreath",
    "portraitDrift","doorBreath","pathLight","pathFlow","matrixOrbit",
    "beamRise","r10PrismSlow","r9PrismFloat","slowTurn"]);
  function ambientFor(section){
    return section.getAnimations({subtree:true}).filter(a =>
      a instanceof CSSAnimation && ambientNames.has(a.animationName));
  }
  if("IntersectionObserver" in window){
    const active=new IntersectionObserver(entries=>{
      for(const e of entries){
        for(const a of ambientFor(e.target)){
          if(document.hidden||!e.isIntersecting)a.pause();
          else a.play();
        }
      }
    },{threshold:0});
    ["#entrance","#threshold","#constellation","#alignment",".last-section"]
       .forEach(sel=>{const s=doc.querySelector(sel);if(s)active.observe(s);});
  }
  doc.addEventListener("visibilitychange",()=>{
    if(!doc.hidden)return;
    for(const section of sections)for(const a of ambientFor(section))a.pause();
  });

  reduced.addEventListener("change",event=>{
    if(event.matches){
      for(const s of sections)enter(s);
      if(matrix){
        matrix.style.setProperty("--r10-mx","0px");
        matrix.style.setProperty("--r10-my","0px");
      }
      for(const section of sections)
        for(const a of ambientFor(section))a.cancel();
    }
  });
})();
