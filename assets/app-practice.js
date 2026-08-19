function quiz(){
  const params=new URLSearchParams(location.search),initial=params.get('domain')||'all';
  shell('quiz',`<div class="crumbs"><a href="index.html">Home</a><span>›</span><span>Question Bank</span></div><section class="hero compact-hero quiz-hero"><div class="eyebrow">ORIGINAL SCENARIO BANK • ${QUESTIONS.length} QUESTIONS</div><h1>AZ-104 Practice Questions</h1><p class="lead">สร้างใหม่จาก decision patterns ใน Complete Cheat Sheet — ไม่ใช่ Quiz 25 ข้อชุดเก่า</p><div class="source-badges"><span>Identity ${qCount('identity')}</span><span>Storage ${qCount('storage')}</span><span>Compute ${qCount('compute')}</span><span>Networking ${qCount('networking')}</span><span>Monitor ${qCount('monitoring')}</span></div></section>
  <div class="quiz-setup card"><label>Domain<select id="quizDomain"><option value="all">All domains</option>${DATA.domains.map(d=>`<option value="${d.slug}" ${initial===d.slug?'selected':''}>${esc(d.displayTitle)} (${qCount(d.slug)})</option>`).join('')}</select></label><label>Questions<select id="quizSize"><option>20</option><option selected>50</option><option>100</option><option value="all">All available</option></select></label><button class="btn primary" id="startQuiz">Start / Shuffle</button><div class="bank-note" id="bankNote"></div></div>
  <div id="quizArea"></div>`);
  let set=[],i=0,score=0,answered=false,wrong=[];
  const updateNote=()=>{const d=quizDomain.value,avail=QUESTIONS.filter(q=>d==='all'||q.domain===d).length;bankNote.textContent=`Available: ${avail} questions • จะสุ่มใหม่ทุกครั้งที่กด Start`};quizDomain.onchange=updateNote;updateNote();
  function start(){
    const d=quizDomain.value,avail=shuffle(QUESTIONS.filter(q=>d==='all'||q.domain===d)),n=quizSize.value==='all'?avail.length:Math.min(Number(quizSize.value),avail.length);set=avail.slice(0,n);i=0;score=0;wrong=[];answered=false;render();
  }
  function render(){
    if(!set.length){quizArea.innerHTML='<div class="card" style="margin-top:14px">เลือกชุดข้อสอบแล้วกด Start</div>';return}
    if(i>=set.length){finish();return}
    const q=set[i],d=DATA.domains.find(x=>x.slug===q.domain);
    quizArea.innerHTML=`<section class="quiz-shell card"><div class="quiz-meta"><span>${esc(d?.displayTitle||q.domain)}</span><b>${i+1} / ${set.length}</b><span>Score ${score}</span></div><div class="progress"><i style="width:${(i/set.length)*100}%"></i></div><h2 class="quiz-question">${esc(q.q)}</h2><div class="quiz-options">${q.options.map((x,j)=>`<button class="quiz-opt" data-i="${j}"><span>${String.fromCharCode(65+j)}</span>${esc(x)}</button>`).join('')}</div><div class="quiz-explain" id="quizExplain"></div><div class="quiz-footer"><button class="btn" id="quitQuiz">Restart</button><button class="btn primary" id="nextQuiz" disabled>${i===set.length-1?'Finish':'Next →'}</button></div></section>`;
    document.querySelectorAll('.quiz-opt').forEach(b=>b.onclick=()=>answer(Number(b.dataset.i)));
    nextQuiz.onclick=()=>{i++;answered=false;render()};quitQuiz.onclick=start;
  }
  function answer(choice){
    if(answered)return;answered=true;const q=set[i],correct=choice===q.answer;if(correct)score++;else wrong.push(q);
    state.quizStats.attempted++;if(correct)state.quizStats.correct++;const ds=state.quizStats.byDomain[q.domain]||{attempted:0,correct:0};ds.attempted++;if(correct)ds.correct++;state.quizStats.byDomain[q.domain]=ds;save();
    document.querySelectorAll('.quiz-opt').forEach((b,j)=>{b.disabled=true;if(j===q.answer)b.classList.add('correct');else if(j===choice)b.classList.add('wrong')});
    quizExplain.innerHTML=`<b>${correct?'✓ ถูก':'✗ ยังไม่ใช่'}</b><p>${esc(q.explanation)}</p>`;nextQuiz.disabled=false;
  }
  function finish(){
    const pct=Math.round(score*100/set.length);const groups=DATA.domains.map(d=>{const all=set.filter(q=>q.domain===d.slug),miss=wrong.filter(q=>q.domain===d.slug).length;return all.length?`<div><span>${esc(d.displayTitle)}</span><b>${all.length-miss}/${all.length}</b></div>`:''}).join('');
    quizArea.innerHTML=`<section class="card quiz-result"><div class="eyebrow">RESULT</div><h1>${pct}%</h1><p>${score}/${set.length} correct</p><div class="result-breakdown">${groups}</div>${wrong.length?`<details><summary>Review ${wrong.length} wrong questions</summary>${wrong.map(q=>`<div class="wrong-review"><b>${esc(q.q)}</b><span>✓ ${esc(q.options[q.answer])}</span><p>${esc(q.explanation)}</p></div>`).join('')}</details>`:'<div class="memory-box">Perfect set ✓</div>'}<button class="btn primary" id="againQuiz">ทำชุดใหม่</button></section>`;againQuiz.onclick=start;
  }
  startQuiz.onclick=start;start();
}
function blueprint(){
  let cat='Overview',items=[];const groups=[];
  DATA.checklist.forEach(ln=>{if(ln.startsWith('✓'))items.push(ln.slice(1).trim());else{if(items.length)groups.push({cat,items});cat=ln;items=[]}});if(items.length)groups.push({cat,items});
  const all=groups.flatMap(g=>g.items),done=all.filter(x=>state.blueprint[x]).length,pct=all.length?Math.round(done*100/all.length):0;
  shell('blueprint',`<div class="crumbs"><a href="index.html">Home</a><span>›</span><span>Blueprint</span></div><section class="hero compact-hero"><div class="eyebrow">OFFICIAL OBJECTIVE COMPLETENESS CHECKLIST • FROM GOOGLE DOC</div><h1>${pct}% coverage checked</h1><p class="lead">${done}/${all.length} checklist items</p><div class="progress"><i style="width:${pct}%"></i></div></section><div class="blueprint-grid">${groups.map(g=>`<section class="card blueprint-group"><h2>${esc(g.cat)}</h2>${g.items.map(x=>`<label class="blueprint-item"><input type="checkbox" data-k="${esc(x)}" ${state.blueprint[x]?'checked':''}><span>${esc(x)}</span></label>`).join('')}</section>`).join('')}</div>`);
  document.querySelectorAll('.blueprint-item input').forEach(c=>c.onchange=()=>{state.blueprint[c.dataset.k]=c.checked;save()});
}
async function boot(){
  injectCss();loadTheme();
  try{
    [DATA,QUESTIONS,FLASH]=await Promise.all([loadPacked(CONTENT_URLS),loadPacked(QUESTION_URLS),loadPacked(FLASH_URLS)]);
    const page=document.body.dataset.page||'home';
    if(page==='home')home();else if(['identity','storage','compute','networking','monitoring'].includes(page))domain(page);else if(page==='cram')cram();else if(page==='flashcards')flashcards();else if(page==='quiz')quiz();else if(page==='blueprint')blueprint();else home();
  }catch(e){
    console.error(e);document.body.innerHTML=`<main class="app"><div class="page"><div class="card"><h2>Content load failed</h2><p>${esc(e.message)}</p></div></div></main>`;
  }
}
boot();
