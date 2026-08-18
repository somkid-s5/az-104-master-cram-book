(()=>{
  const CH={identity:{n:1,label:'Identity & Governance'},storage:{n:2,label:'Secure Storage'},networking:{n:5,label:'Network Troubleshooting'},monitoring:{n:6,label:'Monitor & Recovery'}};
  function target(domain,index){
    if(domain==='compute') return index<=3?{n:3,label:'Infrastructure as Code'}:{n:4,label:'Compute & PaaS'};
    return CH[domain]||null;
  }
  function enhanceTopic(){
    const m=(location.hash||'').match(/^#\/topic\/(identity|storage|compute|networking|monitoring)\/(\d+)$/);
    if(!m)return;
    const actions=document.querySelector('.topic-side .side-actions');
    if(!actions||actions.querySelector('.topic-challenge-link'))return;
    const t=target(m[1],Number(m[2]));if(!t)return;
    const b=document.createElement('button');
    b.className='btn soft topic-challenge-link';
    b.innerHTML=`↗ Apply in CH-${String(t.n).padStart(2,'0')} <small>${t.label}</small>`;
    b.addEventListener('click',()=>{location.hash=`#/challenge/${t.n}`});
    const mark=actions.querySelector('#markTopic');
    if(mark)actions.insertBefore(b,mark);else actions.appendChild(b);
  }
  const s=document.createElement('style');
  s.textContent='.topic-challenge-link{display:flex!important;align-items:center;justify-content:space-between;gap:8px;width:100%;text-align:left}.topic-challenge-link small{font-size:10px;opacity:.72;font-weight:600}.topic-side .side-actions{display:grid;gap:8px}';
  document.head.appendChild(s);
  let n=0;const t=setInterval(()=>{n++;if(document.querySelector('.sidebar')){enhanceTopic();clearInterval(t)}else if(n>200)clearInterval(t)},40);
  window.addEventListener('hashchange',()=>setTimeout(enhanceTopic,40));
})();