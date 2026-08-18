(()=>{
  const PHASES=[
    {k:'scenario',label:'01 Scenario',re:/^scenario$|สถานการณ์/i},
    {k:'tasks',label:'02 Tasks',re:/challenge requirements|challenge tasks|challenge workflow|required baseline|task 1|deliverable/i},
    {k:'break',label:'03 Break-It',re:/break-it|incident 1/i},
    {k:'validate',label:'04 Validate',re:/final validation|expected final state/i},
    {k:'cleanup',label:'05 Cleanup',re:/cleanup|teardown/i},
    {k:'check',label:'06 Check',re:/knowledge check|decision questions/i}
  ];
  function enhance(){
    if(!/^#\/(challenge\/\d+|capstone)$/.test(location.hash||'')||document.getElementById('missionFlow'))return;
    const page=document.querySelector('.main .page'), head=page?.querySelector('.reader-head'), body=page?.querySelector('.content-card');
    if(!page||!head||!body)return;
    const hs=[...body.querySelectorAll('h2,h3')];
    const found=PHASES.map(p=>({p,h:hs.find(h=>p.re.test(h.textContent.trim()))})).filter(x=>x.h);
    if(!found.length)return;
    const flow=document.createElement('section');flow.id='missionFlow';flow.className='mission-flow';
    flow.innerHTML=`<div class="mission-copy"><span>MISSION FLOW</span><b>ทำทีละช่วง ไม่ต้องอ่านทั้งหน้าในครั้งเดียว</b></div><div class="mission-steps">${found.map((x,i)=>`<button data-phase="${i}">${x.p.label}</button>`).join('')}</div>`;
    head.insertAdjacentElement('afterend',flow);
    flow.querySelectorAll('button').forEach((b,i)=>b.addEventListener('click',()=>found[i].h.scrollIntoView({behavior:'smooth',block:'start'})));
  }
  const st=document.createElement('style');
  st.textContent='.mission-flow{position:sticky;top:68px;z-index:8;margin:0 0 16px;padding:12px 14px;border:1px solid var(--border,#233552);border-radius:14px;background:color-mix(in srgb,var(--bg,#07101d) 92%,transparent);backdrop-filter:blur(14px);box-shadow:0 10px 30px rgba(0,0,0,.12)}.mission-copy{display:flex;gap:10px;align-items:baseline;margin-bottom:9px}.mission-copy span{font-size:10px;letter-spacing:.13em;color:#60a5fa;font-weight:800}.mission-copy b{font-size:12px}.mission-steps{display:flex;gap:7px;overflow:auto;padding-bottom:2px}.mission-steps button{white-space:nowrap;border:1px solid var(--border,#233552);border-radius:9px;padding:7px 9px;background:transparent;color:var(--text,#e8f0fb);font-size:11px;cursor:pointer}.mission-steps button:hover{border-color:#60a5fa;background:rgba(37,99,235,.08)}.content-card h2,.content-card h3{scroll-margin-top:150px}@media(max-width:700px){.mission-flow{top:58px}.mission-copy{display:block}.mission-copy b{display:block;margin-top:3px}.mission-steps{margin-right:-8px}}';
  document.head.appendChild(st);
  let n=0;const timer=setInterval(()=>{n++;if(document.querySelector('.sidebar')){enhance();clearInterval(timer)}else if(n>200)clearInterval(timer)},40);
  window.addEventListener('hashchange',()=>setTimeout(enhance,40));
})();