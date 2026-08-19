function isCodeLine(s){return s==='TableName'||s.startsWith('| ')||/^(az |Get-Az|Set-Az|New-Az)/.test(s)}
function renderLines(lines,topics=[]){
  const topicByIndex=new Map(topics.map(t=>[t.lineIndex,t]));
  let html='',i=0;
  while(i<lines.length){
    const ln=lines[i],topic=topicByIndex.get(i);
    if(topic){html+=`<h3 class="study-topic" id="${topic.id}">${esc(ln)}</h3>`;i++;continue}
    if(/^Exam Trigger|^Scale Set Exam Trigger/i.test(ln)){html+=`<div class="study-callout trigger"><b>🎯 ${esc(ln)}</b></div>`;i++;continue}
    if(/^Exam Trap/i.test(ln)){html+=`<div class="study-callout trap"><b>⚠ ${esc(ln)}</b></div>`;i++;continue}
    if(/^Exam Rule/i.test(ln)){html+=`<div class="study-callout rule"><b>✓ ${esc(ln)}</b></div>`;i++;continue}
    if(ln.startsWith('•')){
      const arr=[];while(i<lines.length&&lines[i].startsWith('•')){arr.push(lines[i].slice(1).trim());i++}
      html+=`<ul class="study-list">${arr.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;continue
    }
    if(/^\d+\)/.test(ln)){
      const arr=[];while(i<lines.length&&/^\d+\)/.test(lines[i])){arr.push(lines[i].replace(/^\d+\)\s*/,''));i++}
      html+=`<ol class="study-steps">${arr.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`;continue
    }
    if(isCodeLine(ln)){
      const arr=[];while(i<lines.length&&isCodeLine(lines[i])){arr.push(lines[i]);i++}
      html+=`<pre class="study-code"><code>${esc(arr.join('\n'))}</code></pre>`;continue
    }
    const nxt=lines[i+1]||'';
    if(ln.length<58 && nxt.startsWith('•')){html+=`<h4>${esc(ln)}</h4>`;i++;continue}
    if(ln.includes('→')) html+=`<p class="memory-line">${esc(ln)}</p>`;
    else html+=`<p>${esc(ln)}</p>`;
    i++;
  }
  return html;
}
function toc(d){
  return `<aside class="local-toc"><div class="toc-title">On this page</div>${d.objectives.map(o=>`<div class="toc-objective"><a href="#${o.id}">${esc(o.code)} ${esc(o.title)}</a><div class="toc-topics">${o.topics.map(t=>`<a href="#${t.id}">${esc(t.title)}</a>`).join('')}</div></div>`).join('')}</aside>`;
}
function domain(slug){
  const d=DATA.domains.find(x=>x.slug===slug),p=domainPct(d);
  const objs=d.objectives.map(o=>`<section class="objective-block" id="${o.id}"><div class="objective-title"><div><span>${o.code}</span><h2>${esc(o.title)}</h2></div><button class="btn objective-toggle" data-id="${o.id}">${state.objectives[o.id]?'Done ✓':'Mark done'}</button></div><div class="study-body">${renderLines(o.lines,o.topics)}</div></section>`).join('');
  shell(slug,`<div class="crumbs"><a href="index.html">Home</a><span>›</span><span>${esc(d.displayTitle)}</span></div><div class="lesson-head"><div><div class="eyebrow">Domain ${d.n} • ${d.weight} • Google Drive complete source</div><h1>${esc(d.displayTitle)}</h1><p class="lead">${d.objectives.length} objectives • ${d.objectives.reduce((n,o)=>n+o.topics.length,0)} detailed sections • ${qCount(slug)} practice questions</p></div><div class="card domain-progress-card"><b>${p.pct}% complete</b><div class="progress" style="margin-top:8px"><i style="width:${p.pct}%"></i></div><div class="stat-row"><span>${p.done}/${p.total}</span><span>objectives</span></div><a class="mini-link" href="quiz.html?domain=${slug}">Practice ${qCount(slug)} questions →</a></div></div><div class="content-source-note">📄 เนื้อหาหน้านี้ merge จาก Google Drive: <b>${esc(DATA.meta.title)}</b> • source updated ${esc(DATA.meta.sourceUpdated)}</div><div class="lesson-content full-source">${objs}</div>`,toc(d));
  document.querySelectorAll('.objective-toggle').forEach(b=>b.onclick=()=>{const id=b.dataset.id;state.objectives[id]=!state.objectives[id];b.textContent=state.objectives[id]?'Done ✓':'Mark done';save()});
  const anchors=[...document.querySelectorAll('.objective-block,.study-topic')],links=[...document.querySelectorAll('.local-toc a')];
  const sync=()=>{let cur=anchors[0];anchors.forEach(a=>{if(a.getBoundingClientRect().top<150)cur=a});links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur.id));lastSet(`${slug}.html#${cur.id}`,`${d.displayTitle} • ${cur.textContent.trim().slice(0,90)}`)};
  window.addEventListener('scroll',sync,{passive:true});sync();if(location.hash)setTimeout(()=>document.querySelector(location.hash)?.scrollIntoView(),80);
}
function sectionFrom(label,arr){return `<section class="cram-section source-section"><div class="eyebrow">${esc(label)}</div>${renderLines(arr,[])}</section>`}
function cram(){
  const quickStart=DATA.intro.findIndex(x=>x.includes('กฎจำเร็ว'));
  const quick=quickStart>=0?DATA.intro.slice(quickStart+1):DATA.intro;
  shell('cram',`<div class="crumbs"><a href="index.html">Home</a><span>›</span><span>Cram Sheet</span></div><section class="hero compact-hero"><div class="eyebrow">LAST-MINUTE • FROM COMPLETE GOOGLE DOC</div><h1>Cram Sheet</h1><p class="lead">Quick rules, cross-topic comparisons และ trigger keywords ดึงจาก source เดียวกับเนื้อหาเต็ม</p></section><div class="cram-layout">${sectionFrom('High-yield rules',quick)}${sectionFrom('Cross-topic comparisons',DATA.crossTopic)}${sectionFrom('Last-minute keywords',DATA.keywords)}</div>`);
}
function flashcards(){
  let idx=Number(sessionStorage.getItem('az104-flash-index')||0)%FLASH.length,flipped=false,known=Number(localStorage.getItem('az104-flash-known')||0),review=Number(localStorage.getItem('az104-flash-review')||0);
  shell('flashcards',`<div class="crumbs"><a href="index.html">Home</a><span>›</span><span>Flashcards</span></div><div class="study-stage"><div class="eyebrow center">ACTIVE RECALL • ${FLASH.length} CARDS</div><h1 class="center">High-Yield Flashcards</h1><p class="center muted">สร้างจาก Last-minute keywords + Cross-topic comparisons ใน Complete Cheat Sheet</p><div class="flashcard" id="flashcard"><div class="flash-inner"><div class="flash-face"><span class="flash-label">QUESTION • CLICK TO FLIP</span><div class="flash-text" id="fq"></div></div><div class="flash-face flash-back"><span class="flash-label">ANSWER</span><div class="flash-text" id="fa"></div></div></div></div><div class="controls"><button class="btn" id="fp">←</button><button class="btn" id="fr">🔀 Random</button><button class="btn" id="frev">ต้องทวน</button><button class="btn primary" id="fknow">จำได้ ✓</button><button class="btn" id="fn">→</button></div><div class="center muted" id="fc"></div></div>`);
  const r=()=>{const f=FLASH[idx];fq.textContent=f.q;fa.textContent=f.a;fc.textContent=`${idx+1} / ${FLASH.length} • Known ${known} • Review ${review}`;flashcard.classList.toggle('flipped',flipped);sessionStorage.setItem('az104-flash-index',idx)};
  flashcard.onclick=()=>{flipped=!flipped;r()};fp.onclick=()=>{idx=(idx-1+FLASH.length)%FLASH.length;flipped=false;r()};fn.onclick=()=>{idx=(idx+1)%FLASH.length;flipped=false;r()};fr.onclick=()=>{idx=Math.floor(Math.random()*FLASH.length);flipped=false;r()};fknow.onclick=()=>{known++;localStorage.setItem('az104-flash-known',known);idx=(idx+1)%FLASH.length;flipped=false;r()};frev.onclick=()=>{review++;localStorage.setItem('az104-flash-review',review);idx=(idx+1)%FLASH.length;flipped=false;r()};r();
}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
