"use strict";
/* Same registration path as CardWhispers: save pending, then open the returned payment page. */
(()=>{
 const ENDPOINT="https://script.google.com/macros/s/AKfycbzEHNWnXvWTBx4LBKvW68hKUxyUxWkd3xgo1f9jqOa0reS-_X7nTEN2pZiwgTbdImmJ/exec";
 const modal=document.querySelector("#r12-dialog");
 const form=document.querySelector("#r12-form");
 if(!modal||!form)return;
 document.querySelectorAll("[data-r12-open]").forEach(b=>b.addEventListener("click",()=>{
  modal.showModal();modal.querySelector("input[name=name]").focus();
 }));
 document.querySelectorAll("[data-r12-close]").forEach(b=>b.addEventListener("click",()=>modal.close()));
 const bm=document.querySelector("#bmPayDialog");
 if(bm){
  document.querySelectorAll("[data-open-bm]").forEach(b=>b.addEventListener("click",()=>bm.showModal()));
  bm.querySelectorAll("[data-close-bm]").forEach(b=>b.addEventListener("click",()=>bm.close()));
  bm.addEventListener("click",e=>{if(e.target===bm)bm.close();});
 }
 modal.addEventListener("click",e=>{if(e.target===modal)modal.close();});
 form.addEventListener("submit",async(e)=>{
  e.preventDefault();
  if(!form.reportValidity())return;
  const status=form.querySelector("[data-form-status]");
  const button=form.querySelector("button[type=submit]");
  const fd=new FormData(form);
  const v=(name)=>String(fd.get(name)||"").trim();
  if(button)button.disabled=true;
  status.textContent="正在提交報名資料，請稍候……";
  try{
   const res=await fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},redirect:"follow",body:JSON.stringify({
    eventId:"winnie-wealth-2027-01",
    studentType:v("studentType")||"new",
    registration_type:v("studentType")||"new",
    name:v("name"),email:v("email"),whatsapp:v("whatsapp"),region:v("region"),
    focusArea:v("focusArea"),focus:v("focus"),
    topicInterest:fd.getAll("topicInterest"),
    eventConsent:fd.has("eventConsent"),
    updatesConsent:fd.has("updatesConsent"),
    newsletterConsent:fd.has("newsletterConsent")
   })});
   const payload=await res.json();
   if(payload&&payload.error==="alumni_email_not_found"){
    status.textContent="這個電郵未見於過往大天使課程報名紀錄，未能進入舊生付款。";
    if(button)button.disabled=false;
    return;
   }
   if(!res.ok||!payload||payload.ok!==true||payload.status!=="pending_payment"||typeof payload.checkout_url!=="string"||!/^https:\/\/buy\.stripe\.com\//.test(payload.checkout_url)){
    throw new Error((payload&&payload.error)||"未能確認報名紀錄，請稍後再試。");
   }
   status.textContent="資料已保存。正在前往付款頁，請使用已鎖定的同一個電郵……";
   window.location.assign(payload.checkout_url);
  }catch(err){
   status.textContent=err instanceof Error?err.message:"傳送失敗，請稍後再試。";
   if(button)button.disabled=false;
  }
 });
  const section=document.querySelector("#enroll"),fixed=document.querySelector(".r12-fixed");
  if(section&&fixed&&"IntersectionObserver" in window){
    new IntersectionObserver(entries=>{
      fixed.classList.toggle("r12-hidden-near-enroll",entries.some(e=>e.isIntersecting));
    },{threshold:.18}).observe(section);
  }
})();