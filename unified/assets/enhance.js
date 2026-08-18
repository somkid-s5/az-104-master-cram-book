(()=>{
  const CSS=`
  .unified-start-card{margin:18px 0 28px;padding:22px;border:1px solid rgba(59,130,246,.28);border-radius:18px;background:linear-gradient(135deg,rgba(37,99,235,.12),rgba(6,182,212,.06));box-shadow:0 18px 50px rgba(2,8,23,.12)}
  .unified-start-card h2{margin:4px 0 8px;font-size:clamp(20px,3vw,28px)}.unified-start-card p{margin:0;color:var(--muted,#93a7c3);line-height:1.65}
  .unified-start-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}.unified-start-actions a{display:inline-flex;align-items:center;gap:7px;text-decoration:none}
  .identity-journey{margin:24px 0 30px}.identity-journey-head{display:flex;justify-content:space-between;gap:16px;align-items:end;margin-bottom:12px}.identity-journey-head h2{margin:0}.identity-journey-head p{margin:4px 0 0;color:var(--muted,#93a7c3)}
  .identity-journey-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}.identity-stage{position:relative;padding:16px;border:1px solid var(--border,#233552);border-radius:15px;background:var(--card,#0e1a2b);min-height:168px;display:flex;flex-direction:column;gap:8px;cursor:pointer;transition:.2s ease}.identity-stage:hover{transform:translateY(-2px);border-color:#3b82f6}.identity-stage .stage-no{font-size:11px;letter-spacing:.14em;color:#60a5fa}.identity-stage b{font-size:15px;color:var(--text,#e8f0fb)}.identity-stage p{font-size:12px;line-height:1.55;margin:0;color:var(--muted,#93a7c3)}.identity-stage .stage-go{margin-top:auto;font-size:12px;color:#7dd3fc;font-weight:700}
  .identity-memory{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:12px}.identity-memory>div{padding:12px;border-radius:12px;background:rgba(30,64,175,.09);border:1px solid rgba(96,165,250,.18)}.identity-memory span{display:block;font-size:10px;letter-spacing:.1em;color:#60a5fa}.identity-memory b{display:block;margin-top:4px;font-size:13px}
  .nav-start-here .nav-ico{font-size:10px;font-weight:800;color:#7dd3fc}
  @media(max-width:1100px){.identity-journey-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.identity-memory{grid-template-columns:1fr}}
  @media(max-width:620px){.identity-journey-grid{grid-template-columns:1fr}.identity-stage{min-height:auto}.identity-journey-head{align-items:start;flex-direction:column}.unified-start-card{padding:17px}}
  `;
  const style=document.createElement('style');style.id='unified-enhance-style';style.textContent=CSS;document.head.appendChild(style);
  function go(h){location.hash=h}
  function addSidebar(){
    const side=document.querySelector('.sidebar'); if(!side||document.getElementById('unifiedStartNav'))return;
    const home=side.querySelector('[data-nav="#/home"]'); if(!home)return;
    const item=document.createElement('div');item.id='unifiedStartNav';item.className='nav-link nav-start-here';item.innerHTML='<span class="nav-ico">01</span><span>Start Here</span>';
    item.addEventListener('click',()=>{location.href='start-here.html'});home.insertAdjacentElement('afterend',item);
  }
  function addHome(){
    if((location.hash||'#/home')!=='#/home'||document.getElementById('startHereBanner'))return;
    const hero=document.querySelector('.main .hero');if(!hero)return;
    const el=document.createElement('section');el.id='startHereBanner';el.className='unified-start-card';
    el.innerHTML='<div class="eyebrow">RECOMMENDED FIRST STEP</div><h2>ใหม่กับโครงสร้าง Azure? เริ่มตรงนี้ก่อน</h2><p>จับภาพใหญ่ให้ได้ก่อนว่า Region / Zone / Subscription / Resource Group / Tenant ต่างกันยังไง แล้วค่อยเข้า 5 Domains จะลดอาการจำคำศัพท์ปนกันเยอะมาก</p><div class="unified-start-actions"><a class="btn primary" href="start-here.html">Start Here →</a><button class="btn" data-enh-nav="#/domain/identity">ข้ามไป Identity</button></div>';
    hero.insertAdjacentElement('afterend',el);
  }
  function addIdentity(){
    if(location.hash!=='#/domain/identity'||document.getElementById('identityJourney'))return;
    const page=document.querySelector('.main .page');if(!page)return;const anchor=page.querySelector('.section-head');if(!anchor)return;
    const el=document.createElement('section');el.id='identityJourney';el.className='identity-journey';
    el.innerHTML=`<div class="identity-journey-head"><div><div class="eyebrow">RECOMMENDED PATH</div><h2>Identity & Governance — เดิน 5 ขั้นนี้พอ</h2><p>อ่านพื้นฐานก่อน แล้วค่อยไหลจาก Identity → Permission → Governance → Challenge</p></div><span class="badge">20–25% exam weight</span></div>
    <div class="identity-journey-grid">
      <div class="identity-stage" data-enh-nav="#/note/entra-id"><span class="stage-no">01 FOUNDATION</span><b>Tenant & Identity mental model</b><p>Authentication vs Authorization, Tenant vs Subscription และ Entra Role vs Azure RBAC</p><span class="stage-go">อ่าน Deep Note →</span></div>
      <div class="identity-stage" data-enh-nav="#/topic/identity/0"><span class="stage-no">02 IDENTITIES</span><b>Users & Groups</b><p>User/Guest, Groups, properties, licenses และ SSPR โดยมอง lifecycle เป็นหลัก</p><span class="stage-go">เริ่มหัวข้อ →</span></div>
      <div class="identity-stage" data-enh-nav="#/topic/identity/5"><span class="stage-no">03 ACCESS</span><b>RBAC & Scope</b><p>คิดเป็น WHO + ROLE + SCOPE แล้วดู inheritance/effective access</p><span class="stage-go">เรียน RBAC →</span></div>
      <div class="identity-stage" data-enh-nav="#/visual/rbac"><span class="stage-no">04 GOVERNANCE</span><b>Policy, Locks & Tags</b><p>ใช้ Visual Lab แยกให้ชัดว่า permission, compliance และ delete protection คนละหน้าที่</p><span class="stage-go">เปิด Visual Lab →</span></div>
      <div class="identity-stage" data-enh-nav="#/challenge/1"><span class="stage-no">05 APPLY</span><b>Challenge CH-01</b><p>Least privilege + wrong scope + policy denial + lock inheritance แบบ break-fix</p><span class="stage-go">ลงมือ Challenge →</span></div>
    </div>
    <div class="identity-memory"><div><span>ACCESS</span><b>WHO + ROLE + SCOPE</b></div><div><span>GOVERNANCE</span><b>RBAC ให้สิทธิ์ • Policy บังคับ state • Lock กันแก้/ลบ</b></div><div><span>EXAM</span><b>เลือก least privilege + narrowest scope ก่อนเสมอ</b></div></div></section>`;
    anchor.parentNode.insertBefore(el,anchor);
  }
  function bindExtra(){document.querySelectorAll('[data-enh-nav]').forEach(x=>{if(x.dataset.enhBound)return;x.dataset.enhBound='1';x.addEventListener('click',e=>{e.preventDefault();go(x.dataset.enhNav)})})}
  function enhance(){addSidebar();addHome();addIdentity();bindExtra()}
  let n=0;const timer=setInterval(()=>{n++;if(document.querySelector('.sidebar')){enhance();clearInterval(timer)}else if(n>200)clearInterval(timer)},40);
  window.addEventListener('hashchange',()=>setTimeout(enhance,35));
})();