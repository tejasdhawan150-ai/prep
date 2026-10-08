const {chromium}=require('playwright');
const OUT='/tmp/claude-0/-home-user-prep/a4b9226f-9663-57ed-b849-d8dfb3f6e6e7/scratchpad/';
const CSS=`
.mk-strip{display:flex;gap:8px;overflow:hidden;margin:12px -2px 0}
.mk-sc{flex:0 0 31%;border-radius:12px;overflow:hidden;background:#fff;border:1px solid #dbe3f0;box-shadow:0 6px 14px -8px rgba(15,30,70,.35);position:relative}
.mk-sc div{height:84px;background-size:250%;background-position:50% 57%;background-repeat:no-repeat}
.mk-sc b{position:absolute;left:6px;bottom:6px;background:#16A34A;color:#fff;font:800 11px/1 'Plus Jakarta Sans',sans-serif;padding:5px 7px;border-radius:7px}
.mk-cap{font-size:12px;color:#475569;margin-top:6px}
.mk-chips{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}
.mk-chips span{display:grid;place-items:center;height:44px;border:1.5px solid #cbd5e1;border-radius:10px;font-weight:700;color:#0B1B33;background:#fff;font-size:14px}
.mk-chips span.on{border-color:#1A56DB;background:#EEF4FF;color:#1A56DB}
.mk-lbl{font-weight:600;font-size:.95rem;color:#0B1B33;margin:0 0 6px;display:block}
.mk-step{font-size:12px;font-weight:700;color:#1A56DB;letter-spacing:.06em;text-transform:uppercase;margin-bottom:4px}
.mk-bar{height:6px;border-radius:9px;background:#e2e8f0;margin:0 0 12px;overflow:hidden}.mk-bar i{display:block;height:100%;width:50%;background:#1A56DB}
`;
const STRIP=`<div class="mk-strip">
<div class="mk-sc"><div style="background-image:url(/assets/img/results/f10-v2.jpg)"></div><b>GT 8.5</b></div>
<div class="mk-sc"><div style="background-image:url(/assets/img/results/f09-v2.jpg)"></div><b>GT 8.0</b></div>
<div class="mk-sc"><div style="background-image:url(/assets/img/results/f04-v2.jpg)"></div><b>Academic 7.5</b></div>
</div><p class="mk-cap">Real scorecards from PrepEve students · details hidden</p>`;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 async function shot(name,fn){
  const p=await b.newPage({viewport:{width:390,height:740},deviceScaleFactor:2});
  await p.goto('http://localhost:8765/ielts-coaching-online');await p.addStyleTag({content:CSS});
  await p.evaluate(fn,{STRIP});await p.waitForTimeout(700);
  await p.screenshot({path:OUT+name});await p.close();
 }
 // Current
 await shot('mock-0-current.png',()=>{});
 // Option A: scorecards strip under headline + short form (name, phone, band chips), email & extras hidden
 await shot('mock-A.png',({STRIP})=>{
  document.querySelector('.hproof').insertAdjacentHTML('beforebegin',STRIP);
  document.querySelector('.hproof').style.display='none';
  const f=document.getElementById('formBody');
  f.querySelector('.sub').textContent='20 seconds. A counsellor calls you back.';
  document.getElementById('email').closest('.field').style.display='none';
  document.querySelector('.opt-fields').style.display='none';
  const band=document.getElementById('band').closest('.field');
  band.innerHTML='<span class="mk-lbl">Target band *</span><div class="mk-chips"><span>6.0</span><span>6.5</span><span class="on">7.0</span><span>7.5</span><span>8+</span></div>';
  document.getElementById('phone').placeholder='10-digit mobile';
 });
 // Option B: 2-step form — step 1 only band chips + button; scorecards above
 await shot('mock-B.png',({STRIP})=>{
  document.querySelector('.hproof').insertAdjacentHTML('beforebegin',STRIP);
  document.querySelector('.hproof').style.display='none';
  const f=document.getElementById('formBody');
  f.querySelector('h2').textContent='What band do you need?';
  f.querySelector('.sub').outerHTML='<div class="mk-step">Step 1 of 2</div><div class="mk-bar"><i></i></div>';
  ['fname','phone','email'].forEach(i=>document.getElementById(i).closest('.field').style.display='none');
  document.querySelector('.opt-fields').style.display='none';
  const band=document.getElementById('band').closest('.field');
  band.innerHTML='<div class="mk-chips"><span>6.0</span><span>6.5</span><span class="on">7.0</span><span>7.5</span><span>8+</span></div>';
  document.getElementById('btnTxt').textContent='Next: Where should we call? →';
 });
 // Option C: scorecards ABOVE headline as hero proof
 await shot('mock-C.png',({STRIP})=>{
  const h=document.querySelector('.hero h1');h.insertAdjacentHTML('beforebegin',STRIP.replace('mk-strip','mk-strip mk-top'));
  document.querySelector('.hero .badge').style.display='none';
  document.querySelector('.hproof').style.display='none';
  h.style.fontSize='1.7rem';h.style.marginTop='12px';
  const f=document.getElementById('formBody');
  f.querySelector('.sub').textContent='20 seconds. A counsellor calls you back.';
  document.getElementById('email').closest('.field').style.display='none';
  document.querySelector('.opt-fields').style.display='none';
  const band=document.getElementById('band').closest('.field');
  band.innerHTML='<span class="mk-lbl">Target band *</span><div class="mk-chips"><span>6.0</span><span>6.5</span><span class="on">7.0</span><span>7.5</span><span>8+</span></div>';
 });
 await b.close();
})();
