const rank={mg:0,sub:1,rg:2,res:3};
const labels={mg:'Management Group',sub:'Subscription',rg:'Resource Group',res:'Resource'};
const state={mode:'rbac',scope:'sub',step:0};
const nodes=[...document.querySelectorAll('.scope-node')];
const lines=[...document.querySelectorAll('.scope-line')];
const modeBtns=[...document.querySelectorAll('.mode-btn')];
const rail=[...document.querySelectorAll('.rail-item')];
const $=id=>document.getElementById(id);
const lessonMeta=[
  ['Scope inheritance','เลือกเครื่องมือและ scope แล้วดูว่า resource ไหนได้รับผลกระทบ'],
  ['RBAC — ใครทำอะไรได้ที่ไหน','ทดลอง Built-in roles และดู inheritance ตาม scope'],
  ['Azure Policy — บังคับมาตรฐาน','Policy ไม่ได้ให้สิทธิ์คน แต่ควบคุมว่า resource ต้องเป็นแบบไหน'],
  ['Resource Locks — กันแก้/กันลบ','Locks ป้องกันการเปลี่ยนแปลง ไม่ใช่ระบบ permission'],
  ['Challenge mode','ใช้ requirement เลือกเครื่องมือที่ตรงที่สุด']
];
function detail(){
  const scope=state.scope,mode=state.mode;
  if(mode==='rbac'){
    const role=$('roleSelect').value;
    const body=role==='Owner'
      ? `Owner ที่ ${labels[scope]} จัดการ resource ได้ทั้งหมด และจัดการ role assignment ได้ด้วย ผลจะสืบทอดลง scope ลูก.`
      : role==='Contributor'
      ? `Contributor ที่ ${labels[scope]} จัดการ resource ใน scope นี้และ scope ลูกได้ แต่ไม่ได้สิทธิ์มอบ Azure RBAC role ให้ผู้อื่น.`
      : `Reader ที่ ${labels[scope]} ดู resource และ configuration ได้ แต่เปลี่ยนแปลง resource ไม่ได้.`;
    return {badge:role,title:'RBAC controls who can do what',body,memory:'WHO + ROLE + SCOPE',trap:role==='Contributor'?'Contributor ≠ Owner: Contributor จัดการ resource ได้ แต่ไม่สามารถจัดการ access/role assignments ได้':'เลือก scope เล็กที่สุดที่ตอบ requirement เพื่อ least privilege'};
  }
  if(mode==='policy'){
    const p=$('policySelect').value;
    const map={
      'allowed-locations':['Allowed locations','จำกัด Region ที่ resource ใหม่/แก้ไขสามารถใช้ได้'],
      'require-tag':['Require tag','บังคับ/ตรวจว่าต้องมี CostCenter tag ตาม policy effect'],
      'deny-public-ip':['Deny public IP','ปฏิเสธ deployment ที่ละเมิดเงื่อนไข public IP']
    }[p];
    return {badge:'Policy',title:'Policy controls what is allowed',body:`${map[0]} ที่ ${labels[scope]} จะประเมิน resource ใน scope นี้และ scope ลูก: ${map[1]}.`,memory:'Policy = enforce / audit configuration',trap:'Policy ไม่ได้ให้ permission แก่ user และไม่ใช่ตัวแทน RBAC'};
  }
  const lock=$('lockSelect').value;
  return {badge:lock,title:'Locks protect resources from changes',body:lock==='CanNotDelete'?`CanNotDelete ที่ ${labels[scope]} ป้องกันการลบ resource ที่ scope นี้และด้านล่าง แต่ยังแก้ไข resource ได้.`:`ReadOnly ที่ ${labels[scope]} บล็อกการ update และ delete ใน management plane สำหรับ scope นี้และด้านล่าง.`,memory:'CanNotDelete = แก้ได้ แต่ลบไม่ได้',trap:'Lock ใช้ป้องกัน resource ไม่ใช่ grant/deny สิทธิ์แบบ RBAC'};
}
function render(){
  if(state.step===1)setMode('rbac',false);
  if(state.step===2)setMode('policy',false);
  if(state.step===3)setMode('lock',false);
  const d=detail(),sRank=rank[state.scope];
  document.body.dataset.mode=state.mode;
  nodes.forEach(n=>{
    const r=rank[n.dataset.scope];
    n.classList.toggle('assigned',r===sRank);
    n.classList.toggle('affected',r>sRank);
    n.querySelector('.effect-badge').textContent=r===sRank?'ASSIGNED':r>sRank?'INHERITED':'';
  });
  lines.forEach((l,i)=>l.classList.toggle('flow',i>=sRank));
  $('resultTitle').textContent=d.title;
  $('resultBody').textContent=d.body;
  $('memoryRule').textContent=d.memory;
  $('trapText').textContent=d.trap;
  $('flowNote').textContent=`${d.badge} @ ${labels[state.scope]} → ${state.scope==='res'?'มีผลเฉพาะ resource นี้':'scope ลูกด้านล่างได้รับผลตาม inheritance'}`;
  $('lessonTitle').textContent=lessonMeta[state.step][0];
  $('lessonSubtitle').textContent=lessonMeta[state.step][1];
  $('stepCounter').textContent=`${state.step+1} / 5`;
  $('lessonProgress').style.width=`${(state.step+1)*20}%`;
  rail.forEach((b,i)=>b.classList.toggle('active',i===state.step));
  if(state.step===4)$('challengeSection').scrollIntoView({behavior:'smooth',block:'center'});
  localStorage.setItem('az104-rbac-lab-v1',JSON.stringify({mode:state.mode,scope:state.scope,step:state.step}));
}
function setMode(mode,doRender=true){
  state.mode=mode;
  modeBtns.forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
  $('rbacControl').hidden=mode!=='rbac';
  $('policyControl').hidden=mode!=='policy';
  $('lockControl').hidden=mode!=='lock';
  if(doRender)render();
}
modeBtns.forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
$('scopeSelect').onchange=e=>{state.scope=e.target.value;render()};
$('roleSelect').onchange=render;
$('policySelect').onchange=render;
$('lockSelect').onchange=render;
$('applyBtn').onclick=()=>{render();document.querySelector('.diagram-card').animate([{transform:'scale(.997)'},{transform:'scale(1)'}],{duration:220})};
rail.forEach((b,i)=>b.onclick=()=>{state.step=i;render()});
$('prevStep').onclick=()=>{state.step=Math.max(0,state.step-1);render()};
$('nextStep').onclick=()=>{state.step=Math.min(4,state.step+1);render()};
document.querySelectorAll('.scenario-card').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.scenario-card').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  const s=b.dataset.scenario;
  if(s==='rg-contributor'){setMode('rbac',false);state.scope='rg';$('scopeSelect').value='rg';$('roleSelect').value='Contributor'}
  if(s==='prevent-delete'){setMode('lock',false);state.scope='rg';$('scopeSelect').value='rg';$('lockSelect').value='CanNotDelete'}
  if(s==='location-policy'){setMode('policy',false);state.scope='sub';$('scopeSelect').value='sub';$('policySelect').value='allowed-locations'}
  state.step={rbac:1,policy:2,lock:3}[state.mode];render();
});
document.querySelectorAll('#answerGrid button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('#answerGrid button').forEach(x=>x.classList.remove('correct','wrong'));
  const ok=b.dataset.answer==='B';
  b.classList.add(ok?'correct':'wrong');
  if(ok){
    $('challengeFeedback').innerHTML='<b>ถูก ✓</b> Contributor ที่ Resource Group ตรง least privilege: จัดการ VM ใน RG ได้ แต่ไม่ได้สิทธิ์จัดการ role assignments.';
    localStorage.setItem('az104-rbac-challenge-complete','1');
  }else $('challengeFeedback').innerHTML='<b>ยังไม่ตรง</b> โฟกัส requirement: ต้อง “แก้ VM ได้” + “ห้ามเปลี่ยน access” + “เฉพาะ RG นี้” → Contributor @ Resource Group.';
});
$('themeToggle').onclick=()=>{const root=document.documentElement;root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';localStorage.setItem('az104-lab-theme',root.dataset.theme)};
const savedTheme=localStorage.getItem('az104-lab-theme');if(savedTheme)document.documentElement.dataset.theme=savedTheme;
try{const saved=JSON.parse(localStorage.getItem('az104-rbac-lab-v1')||'{}');if(saved.scope&&rank[saved.scope]!==undefined){state.scope=saved.scope;$('scopeSelect').value=saved.scope}if(saved.mode)setMode(saved.mode,false);if(Number.isInteger(saved.step))state.step=Math.max(0,Math.min(4,saved.step));}catch(e){}
render();
