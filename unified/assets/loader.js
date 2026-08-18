(async()=>{
  const app=document.getElementById('app');
  try{
    if(typeof DecompressionStream==='undefined') throw new Error('Browser does not support DecompressionStream');
    const files=Array.from({length:16},(_,i)=>`u${String(i).padStart(2,'0')}.txt`);
    const chunks=await Promise.all(files.map(f=>fetch(`assets/${f}`,{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error(`${f} HTTP ${r.status}`);return r.text()})));
    const b64=chunks.join('').replace(/\s+/g,'');
    const bytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
    const json=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
    const bundle=JSON.parse(json);
    const style=document.createElement('style');style.textContent=bundle.css;document.head.appendChild(style);
    (0,eval)(bundle.master);(0,eval)(bundle.course);(0,eval)(bundle.notes);(0,eval)(bundle.app);
  }catch(err){
    console.error(err);
    app.innerHTML=`<div style="max-width:720px;margin:80px auto;padding:22px;border:1px solid #334155;border-radius:14px;background:#0f172a;color:#e2e8f0;font-family:system-ui"><h1 style="font-size:22px">โหลดระบบเรียนไม่สำเร็จ</h1><p style="color:#94a3b8">${String(err.message||err)}</p><p style="color:#94a3b8">ลองรีเฟรชแบบไม่ใช้ cache (Ctrl+Shift+R) หรือใช้ Chrome/Edge/Firefox รุ่นปัจจุบัน</p></div>`;
  }
})();
