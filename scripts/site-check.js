#!/usr/bin/env node
/* PrepEve site check: run before every deploy.
 *   cd scripts && npm install && npx playwright install chromium   (first time only)
 *   node scripts/site-check.js            (from the repo root)
 * Checks every public page: broken internal links, JSON-LD validity, FAQPage vs visible FAQ,
 * exactly one <h1>, banned claims, JS errors, horizontal overflow and off-centre layout at 375/1024/1440px.
 * Exits non-zero if anything fails. */
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.resolve(__dirname, '..');
const IGNORE = fs.readFileSync(path.join(ROOT, '.vercelignore'), 'utf8').split('\n').map(s => s.trim()).filter(Boolean);
const BANNED = /exam-cleared|money.?back|risk.?free|97% (hit|of our)|#1 ielts|india'?s (best|top|leading|most trusted)/i;
let fails = 0; const fail = m => { fails++; console.log('FAIL ' + m); };

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f), rel = path.relative(ROOT, p);
    if (f.startsWith('.') || f === 'node_modules' || IGNORE.some(i => rel === i.replace(/\/$/, '') || rel.startsWith(i))) continue;
    if (fs.statSync(p).isDirectory()) walk(p, out); else if (f.endsWith('.html')) out.push(rel);
  }
  return out;
}
const files = walk(ROOT);
const exists = h => { const p = path.join(ROOT, h.replace(/^\//, '').replace(/\/$/, '')); return h === '/' || fs.existsSync(p) || fs.existsSync(p + '.html') || fs.existsSync(path.join(p, 'index.html')); };
const redirects = new Set((JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'))).redirects || []).map(r => r.source));

for (const f of files) {
  const s = fs.readFileSync(path.join(ROOT, f), 'utf8');
  for (const [, h] of s.matchAll(/href="(\/[^"#?]*)/g)) if (!exists(h) && !redirects.has(h.replace(/\/$/, ''))) fail(`${f}: broken link ${h}`);
  const h1 = (s.match(/<h1[\s>]/g) || []).length; if (h1 !== 1) fail(`${f}: ${h1} <h1>`);
  const text = s.replace(/<!--[\s\S]*?-->/g, '');
  if (BANNED.test(text)) fail(`${f}: banned claim "${text.match(BANNED)[0]}"`);
  for (const [, b] of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let d; try { d = JSON.parse(b); } catch (e) { fail(`${f}: invalid JSON-LD ${e.message}`); continue; }
    const nodes = d['@graph'] || [d];
    for (const n of nodes) if (n['@type'] === 'FAQPage') for (const q of n.mainEntity || [])
      if (!text.includes(q.name.replace(/&/g, '&amp;')) && !text.includes(q.name)) fail(`${f}: FAQ schema question not visible: "${q.name.slice(0, 60)}"`);
  }
}
console.log(`static checks: ${files.length} pages`);

let chromium; try { ({ chromium } = require(path.join(__dirname, 'node_modules', 'playwright'))); } catch (e) {
  try { ({ chromium } = require('playwright')); } catch (e2) { console.log('playwright not installed: skipping browser checks (see header)'); process.exit(fails ? 1 : 0); }
}
const srv = http.createServer((req, res) => {
  let p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
  else if (!fs.existsSync(p) && fs.existsSync(p + '.html')) p += '.html';
  if (!fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  const t = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg' }[path.extname(p)] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': t }); fs.createReadStream(p).pipe(res);
}).listen(0, async () => {
  const base = 'http://localhost:' + srv.address().port;
  const exe = fs.existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {};
  const b = await chromium.launch(exe);
  for (const w of [375, 1024, 1440]) for (const f of files) {
    const u = '/' + f.replace(/index\.html$/, '');
    const pg = await b.newPage({ viewport: { width: w, height: 900 } }); const errs = [];
    pg.on('pageerror', e => errs.push(e.message));
    await pg.route(/googletagmanager|youtube|ytimg|google\.com|facebook/, r => r.abort());
    await pg.goto(base + u);
    await pg.evaluate(() => document.querySelectorAll('.rv').forEach(e => e.classList.add('in')));
    const r = await pg.evaluate(() => {
      const out = [], vis = e => { const s = getComputedStyle(e), r = e.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0; };
      if (document.documentElement.scrollWidth > innerWidth + 1) out.push('horizontal overflow ' + (document.documentElement.scrollWidth - innerWidth) + 'px');
      for (const e of document.querySelectorAll('body *')) {
        if (!vis(e) || e.closest('.mcta,.vmodal,.mnav,nav,header,[role=region],.tbl-wrap,.sr-only')) continue;
        const par = e.parentElement; if (!par || !vis(par)) continue;
        const s = getComputedStyle(e), ps = getComputedStyle(par);
        if (/flex|grid/.test(ps.display) || !['block', 'flow-root', 'table'].includes(s.display) || s.position === 'absolute' || s.position === 'fixed' || s.float !== 'none') continue;
        const rr = e.getBoundingClientRect(), pr = par.getBoundingClientRect();
        const pl = pr.left + parseFloat(ps.paddingLeft) + parseFloat(ps.borderLeftWidth), prt = pr.right - parseFloat(ps.paddingRight) - parseFloat(ps.borderRightWidth);
        if (rr.width >= prt - pl - 2) continue;
        if ((s.textAlign === 'center' || ps.textAlign === 'center') && Math.abs((rr.left - pl) - (prt - rr.right)) > 6) out.push('off-centre: ' + e.textContent.trim().slice(0, 40));
      }
      return out;
    });
    for (const m of r.concat(errs.map(e => 'JS error: ' + e))) fail(`${w}px ${u}: ${m}`);
    await pg.close();
  }
  await b.close(); srv.close();
  console.log(fails ? `\n${fails} problem(s) found` : '\nAll checks passed');
  process.exit(fails ? 1 : 0);
});
