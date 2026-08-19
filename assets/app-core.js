const CONTENT_URLS=['assets/content-data.00.b64','assets/content-data.01.b64','assets/content-data.02.b64','assets/content-data.03.b64'];
const QUESTION_URLS=['assets/question-bank.00.b64','assets/question-bank.01.b64'];
const FLASH_URLS=['assets/flashcards.00.b64'];
async function loadPacked(urls){
  const parts=await Promise.all(urls.map(async url=>{const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw Error(`${url} ${r.status}`);return (await r.text()).trim()}));
  const b64=parts.join(''),bin=atob(b64),bytes=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
  const text=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
  return JSON.parse(text);
}
const STORE='az104-drive-v2';
let DATA=[],QUESTIONS=[],FLASH=[],state={};
try{state=JSON.parse(localStorage.getItem(STORE)||'{}')}catch(_){}
state.objectives ||= {};
state.blueprint ||= {};
state.quizStats ||= {attempted:0,correct:0,byDomain:{}};
const save=()=>localStorage.setItem(STORE,JSON.stringify(state));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slugify=s=>String(s).toLowerCase().replace(/[^a-z0-9ก-๙]+/gi,'-').replace(/^-|-$/g,'').slice(0,60);
function loadTheme(){
  let t=localStorage.getItem('az104-theme');
  if(!t){try{t=JSON.parse(localStorage.getItem('az104-master-2026-v1')||'{}').theme}catch(_){}}
  document.documentElement.dataset.theme=t||'dark';
}
function injectCss(){
  if(document.querySelector('link[data-content-v2]'))return;
  const l=document.createElement('link');l.rel='stylesheet';l.href='assets/content-v2.css';l.dataset.contentV2='1';document.head.appendChild(l);
}
function nav(active){
  const ds=DATA.domains.map(d=>`<a class="g-link ${active===d.slug?'active':''}" href="${d.slug}.html"><span class="ico">${({identity:'👤',storage:'🗄️',compute:'🖥️',networking:'🌐',monitoring:'📈'})[d.slug]}</span><span>${esc(d.displayTitle)}</span><span class="nav-badge">${esc(d.weight)}</span></a>`).join('');
  return `<header class="topbar"><button class="icon-btn mobile-menu" id="menuBtn">☰</button><a class="brand" href="index.html"><span class="brand-badge">AZ</span><span>AZ-104 Pass-First</span></a><div class="top-actions"><button class="icon-btn search-open" id="searchBtn">⌕ Search</button><button class="icon-btn" id="themeBtn">◐</button></div></header>
  <aside class="global-nav"><div class="nav-section">Dashboard</div><a class="g-link ${active==='home'?'active':''}" href="index.html"><span class="ico">⌂</span>Home</a>
  <div class="nav-section">Learn</div>${ds}
  <div class="nav-section">Visualize</div><a class="g-link ${active==='labs'?'active':''}" href="labs.html"><span class="ico">🧭</span>Visual Labs<span class="nav-badge">10</span></a>
  <div class="nav-section">Exam Mode</div>
  <a class="g-link ${active==='cram'?'active':''}" href="cram.html"><span class="ico">⚡</span>Cram Sheet</a>
  <a class="g-link ${active==='flashcards'?'active':''}" href="flashcards.html"><span class="ico">🧠</span>Flashcards<span class="nav-badge">${FLASH.length}</span></a>
  <a class="g-link ${active==='quiz'?'active':''}" href="quiz.html"><span class="ico">🧪</span>Question Bank<span class="nav-badge">${QUESTIONS.length}</span></a>
  <a class="g-link ${active==='blueprint'?'active':''}" href="blueprint.html"><span class="ico">☑</span>Blueprint</a></aside>`;
}
function shell(active,html,toc=''){
  document.body.innerHTML=nav(active)+`<main class="app"><div class="page ${toc?'with-toc':''}">${html}</div>${toc}</main>${modal()}`;
  document.getElementById('menuBtn')?.addEventListener('click',()=>document.body.classList.toggle('nav-open'));
  document.getElementById('themeBtn')?.addEventListener('click',()=>{
    const n=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=n;localStorage.setItem('az104-theme',n);
  });
  document.getElementById('searchBtn')?.addEventListener('click',openSearch);
  document.getElementById('searchClose')?.addEventListener('click',closeSearch);
  document.getElementById('searchModal')?.addEventListener('click',e=>e.target.id==='searchModal'&&closeSearch());
}
function modal(){return `<div class="search-modal" id="searchModal"><div class="search-box"><div style="display:flex"><input id="globalSearch" placeholder="ค้นหา SSPR, SAS, Bastion, KQL…"><button class="icon-btn" id="searchClose" style="border:0;border-radius:0">✕</button></div><div class="search-results" id="searchResults"></div></div></div>`}
function searchIndex(){
  const out=[];
  DATA.domains.forEach(d=>d.objectives.forEach(o=>{
    out.push({label:`${o.code} ${o.title}`,url:`${d.slug}.html#${o.id}`,domain:d.displayTitle});
    o.topics.forEach(t=>out.push({label:t.title,url:`${d.slug}.html#${t.id}`,domain:d.displayTitle,objective:o.title}));
    o.lines.filter(x=>x.startsWith('•')&&x.length<150).forEach((x,i)=>out.push({label:x.slice(1).trim(),url:`${d.slug}.html#${o.id}`,domain:d.displayTitle,objective:o.title}));
  }));
  return out;
}
function openSearch(){
  const m=document.getElementById('searchModal'),i=document.getElementById('globalSearch');if(!m||!i)return;
  m.classList.add('open');i.value='';renderSearch('');setTimeout(()=>i.focus(),20);i.oninput=()=>renderSearch(i.value);
}
function closeSearch(){document.getElementById('searchModal')?.classList.remove('open')}
function renderSearch(q){
  q=q.trim().toLowerCase();let a=searchIndex().filter(x=>!q||(x.label+' '+x.domain+' '+(x.objective||'')).toLowerCase().includes(q)).slice(0,45);
  document.getElementById('searchResults').innerHTML=a.map(x=>`<a class="search-result" href="${x.url}"><b>${esc(x.label)}</b><span>${esc(x.domain)}${x.objective?' • '+esc(x.objective):''}</span></a>`).join('')||'<div class="muted" style="padding:15px">ไม่พบหัวข้อ</div>';
}
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch()}if(e.key==='Escape')closeSearch()});
function domainPct(d){const ids=d.objectives.map(o=>o.id),done=ids.filter(id=>state.objectives[id]).length;return{done,total:ids.length,pct:ids.length?Math.round(done*100/ids.length):0}}
function overall(){const ids=DATA.domains.flatMap(d=>d.objectives.map(o=>o.id)),done=ids.filter(id=>state.objectives[id]).length;return{done,total:ids.length,pct:Math.round(done*100/ids.length)}}
function days(){return Math.max(0,Math.ceil((new Date(DATA.meta.examDate)-Date.now())/86400000))}
function lastGet(){try{return JSON.parse(localStorage.getItem('az104-last-v2')||'null')}catch(_){return null}}
function lastSet(url,label){localStorage.setItem('az104-last-v2',JSON.stringify({url,label}))}
function qCount(slug){return QUESTIONS.filter(q=>q.domain===slug).length}
function home(){
  const o=overall(),last=lastGet();
  const cards=DATA.domains.map(d=>{const p=domainPct(d);return `<a class="card domain-card" href="${d.slug}.html"><span class="weight">${d.weight} ของข้อสอบ</span><h3>${d.n}. ${esc(d.displayTitle)}</h3><p>${d.objectives.length} objectives • ${d.objectives.reduce((n,x)=>n+x.topics.length,0)} study sections • ${qCount(d.slug)} questions</p><div class="progress"><i style="width:${p.pct}%"></i></div><div class="stat-row"><span>${p.done}/${p.total} objectives</span><b>${p.pct}%</b></div><span class="go">เปิดเนื้อหาเต็ม →</span></a>`}).join('');
  const cont=last?`<div class="card continue-card"><div class="big">↗</div><div class="continue-info"><b>เรียนต่อจากครั้งล่าสุด</b><span>${esc(last.label)}</span></div><a class="btn primary" href="${last.url}">Continue</a></div>`:`<div class="card continue-card"><div class="big">▶</div><div class="continue-info"><b>เริ่มจาก Identity & Governance</b><span>Google Drive source ถูก merge เข้าเว็บแล้ว</span></div><a class="btn primary" href="identity.html">Start</a></div>`;
  shell('home',`<section class="hero drive-hero"><div class="eyebrow">GOOGLE DRIVE SOURCE OF TRUTH • PASS-FIRST 2026</div><h1>AZ-104 Complete Study System</h1><p class="lead">รอบนี้เนื้อหา Domain ถูกสร้างจาก <b>${esc(DATA.meta.title)}</b> จริง ไม่ใช่ payload เก่า พร้อม Question Bank ใหม่แบบ scenario.</p><div class="source-badges"><span>📄 ${DATA.meta.chars.toLocaleString()} chars source</span><span>☑ ${DATA.meta.objectives} official objectives</span><span>🧪 ${QUESTIONS.length} original questions</span><span>🧠 ${FLASH.length} flashcards</span></div><div class="hero-actions"><a class="btn primary" href="${last?.url||'identity.html'}">${last?'เรียนต่อ':'เริ่มเรียน'} →</a><a class="btn" href="quiz.html">🧪 Question Bank</a><a class="btn" href="labs.html">🧭 Visual Labs</a></div></section>
  <div class="grid dash-grid"><div class="card"><div class="eyebrow">Overall objective progress</div><h2 style="margin:3px 0">${o.pct}%</h2><div class="progress"><i style="width:${o.pct}%"></i></div><div class="stat-row"><span>${o.done}/${o.total} objectives</span><span>เหลือ ${days()} วันถึงสอบ</span></div></div>${cont}</div>
  <h2>เรียนจาก Complete Cheat Sheet</h2><div class="grid domains">${cards}</div>
  <h2>Practice & Visualize</h2><div class="grid quick-grid"><a class="card quick-card" href="labs.html"><h3>🧭 10 Visual Labs</h3><p>เห็นภาพ scope, storage, compute, network, monitor และ recovery</p></a><a class="card quick-card" href="quiz.html"><h3>🧪 ${QUESTIONS.length} Questions</h3><p>เลือก Domain หรือทำ Mock 20/50/100 ข้อ พร้อมเฉลยและ breakdown</p></a><a class="card quick-card" href="flashcards.html"><h3>🧠 ${FLASH.length} Flashcards</h3><p>Active recall จาก high-yield keywords และ comparisons ใน Google Doc</p></a><a class="card quick-card" href="cram.html"><h3>⚡ Cram Sheet</h3><p>Cross-topic comparisons + last-minute exam keywords จากเอกสารเต็ม</p></a></div>`);
}
