(()=>{
  let injected=false;
  function inject(){
    if(injected)return true;
    const head=document.querySelector('.lesson-head');
    if(!head)return false;
    injected=true;
    const card=document.createElement('a');
    card.href='networking-lab.html';
    card.className='card';
    card.style.cssText='display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;margin:16px 0 0;border-color:color-mix(in srgb,#22d3ee 42%,var(--border));background:linear-gradient(135deg,color-mix(in srgb,#22d3ee 8%,var(--panel)),var(--panel));';
    card.innerHTML='<div style="font-size:30px">◎</div><div><div class="eyebrow">Interactive visual lab</div><b style="display:block;font-size:16px;margin-top:2px">Networking Flow Lab</b><span style="display:block;color:var(--muted);font-size:12px;margin-top:3px">ตามรอย DNS → Route/UDR → NSG → Peering/Endpoint และจำลอง root cause ที่ข้อสอบชอบถาม</span></div><span class="btn primary" style="pointer-events:none">Open Lab →</span>';
    head.insertAdjacentElement('afterend',card);
    return true;
  }
  if(!inject()){
    const mo=new MutationObserver(()=>{if(inject())mo.disconnect()});
    mo.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>mo.disconnect(),10000);
  }
})();
