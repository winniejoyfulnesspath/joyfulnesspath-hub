"use strict";
/* Wealth10 local PREVIEW only. No eligibility lookup, checkout link, storage,
   submission or Stripe connection in browser code. Backend gate is HOLD. */
(()=>{
 const modal=document.querySelector("#r12-dialog");
 const form=document.querySelector("#r12-form");
 const oldButton=document.querySelector("[data-r123-alumni]");
 const newButtons=[...document.querySelectorAll("[data-r12-open]")];
 const hidden=form?.querySelector('input[name="studentType"]');
 const note=document.querySelector("#r124-route-note");
 if(!modal||!form||!oldButton||!hidden||!note)return;
 const selectRoute=route=>{
  form.reset();
  hidden.value=route;
  const isOld=route==="alumni";
  note.textContent=isOld
   ?"舊生：填表後先核對過往大天使課程報名電郵，對中先去舊生付款。未付款不會記入名單。"
   :"新生：填表後去新生付款。未付款不會記入名單。";
  const status=form.querySelector("[data-form-status]");
  if(status)status.textContent="";
 };
 newButtons.forEach(b=>b.addEventListener("click",()=>selectRoute("new")));
 oldButton.addEventListener("click",()=>{
  selectRoute("alumni");
  if(!modal.open)modal.showModal();
  modal.querySelector('input[name="name"]')?.focus();
 });
})();
