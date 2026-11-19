/* PrepEve shared behaviour: nav, reveal, video modal, sticky CTA, analytics events. */
/* Analytics IDs: paste them here once and every page picks them up. Leave '' to keep disabled. */
var PV_GA4_ID = 'G-VR61XWFSW3';          // e.g. 'G-XXXXXXXXXX'
var PV_META_PIXEL_ID = '';   // e.g. '123456789012345'

(function () {
  // GA4 is configured inline in each page's <head> (so Google's tag checker sees it); PV_GA4_ID is used for lead events below.
  if (PV_META_PIXEL_ID && !window.fbq) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PV_META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }
  // Every demo/webinar booking lands on /thank-you: count it once as a lead for GA4 and Meta.
  if (/^\/thank-you\/?$/.test(location.pathname)) {
    if (PV_GA4_ID && typeof window.gtag === 'function') window.gtag('event', 'generate_lead', { send_to: PV_GA4_ID });
    if (window.fbq) window.fbq('track', 'Lead');
  }
})();

(function () {
  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }
  window.pvTrack = track;

  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var toggle = document.querySelector('.nav-toggle');
  var mnav = document.querySelector('.mnav');
  if (toggle && mnav) {
    toggle.addEventListener('click', function () {
      var open = mnav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mnav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { mnav.classList.remove('open'); document.body.style.overflow = ''; toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('in'); });
  }

  var modal = document.querySelector('.vmodal');
  if (modal) {
    var frame = modal.querySelector('iframe');
    var close = function () { modal.classList.remove('open'); frame.src = ''; document.body.style.overflow = ''; };
    document.querySelectorAll('[data-vid]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        var id = b.getAttribute('data-vid');
        frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        track('video_play', { video_id: id });
      });
    });
    modal.addEventListener('click', function (e) { if (e.target === modal || e.target.closest('.vmodal-x')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
  }

  var mcta = document.querySelector('.mcta');
  if (mcta) {
    document.body.classList.add('has-mcta');
    if (mcta.classList.contains('mcta-wa')) document.body.classList.add('has-mcta-wa');
    var hide = document.querySelectorAll('[data-hide-mcta]');
    var visible = new Set();
    var update = function () { mcta.classList.toggle('show', window.scrollY > 420 && visible.size === 0); };
    if (hide.length && 'IntersectionObserver' in window) {
      var hio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target); });
        update();
      });
      hide.forEach(function (el) { hio.observe(el); });
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a,button');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var loc = a.getAttribute('data-cta') || '';
    if (href.indexOf('wa.me') > -1 || href.indexOf('chat.whatsapp.com') > -1) {
      track('whatsapp_click', { cta_location: loc || 'unlabelled' });
      /* Count a WhatsApp click as a Google Ads lead (once per page view) */
      if (!window.__pvWaConv && typeof window.gtag === 'function') { window.__pvWaConv = 1; window.gtag('event', 'conversion', { send_to: 'AW-765652199/zZIDCPHd74McEOfZi-0C' }); }
      if (window.fbq) window.fbq('track', 'Contact');
    }
    else if (loc) track('cta_click', { cta_location: loc });
  });

  document.querySelectorAll('form, [data-form]').forEach(function (f) {
    var started = false;
    f.addEventListener('focusin', function () {
      if (started) return;
      started = true;
      track('form_start', { form_id: f.id || f.getAttribute('data-form') || 'form' });
    });
  });

  var marks = [25, 50, 75, 100], sent = {};
  window.addEventListener('scroll', function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (h <= 0) return;
    var pct = (window.scrollY / h) * 100;
    marks.forEach(function (m) { if (pct >= m - 1 && !sent[m]) { sent[m] = 1; track('scroll_depth', { percent: m }); } });
  }, { passive: true });

  var y = document.querySelectorAll('[data-year]');
  y.forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

document.querySelectorAll('.sc-more').forEach(function (b) {
  b.addEventListener('click', function () { var w = b.parentNode.previousElementSibling; if (w) w.removeAttribute('data-collapsed'); });
});

document.addEventListener('click', function (e) {
  var img = e.target.closest('.sc-item img');
  if (!img) return;
  var lb = document.createElement('div');
  lb.className = 'lb';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-label', img.alt);
  lb.innerHTML = '<button class="lb-x" aria-label="Close">×</button><img alt=""><p class="lb-tip">Drag to read · tap outside to close</p>';
  lb.querySelector('img').src = img.currentSrc || img.src;
  lb.querySelector('img').alt = img.alt;
  document.body.appendChild(lb);
  document.body.style.overflow = 'hidden';
  var close = function () { lb.remove(); document.body.style.overflow = ''; document.removeEventListener('keydown', esc); };
  var esc = function (k) { if (k.key === 'Escape') close(); };
  document.addEventListener('keydown', esc);
  lb.addEventListener('click', function (ev) { if (ev.target === lb || ev.target.classList.contains('lb-x')) close(); });
  if (typeof window.pvTrack === 'function') window.pvTrack('proof_zoom', { src: img.getAttribute('src') });
});

document.querySelectorAll('.rv-wall').forEach(function (w) {
  w.removeAttribute('data-collapsed');
  var nav = document.createElement('div');
  nav.className = 'rv-nav';
  nav.innerHTML = '<button type="button" aria-label="Previous">←</button><span class="rv-count" aria-live="polite"></span><button type="button" aria-label="Next">→</button>';
  var items = w.children, count = nav.children[1];
  var cur = function () { var best = 0, d = 1e9; for (var i = 0; i < items.length; i++) { var x = Math.abs(items[i].offsetLeft - w.offsetLeft - w.scrollLeft); if (x < d) { d = x; best = i; } } return best; };
  var go = function (i) { i = Math.max(0, Math.min(items.length - 1, i)); w.scrollTo({ left: items[i].offsetLeft - w.offsetLeft, behavior: 'smooth' }); };
  var upd = function () { var c = cur(); count.textContent = (c + 1) + ' / ' + items.length; nav.children[0].disabled = c === 0; nav.children[2].disabled = w.scrollLeft + w.clientWidth >= w.scrollWidth - 4; };
  nav.children[0].addEventListener('click', function () { go(cur() - 1); });
  nav.children[2].addEventListener('click', function () { go(cur() + 1); });
  var ut; w.addEventListener('scroll', function () { clearTimeout(ut); ut = setTimeout(upd, 60); }, { passive: true });
  window.addEventListener('load', upd); upd();
  w.parentNode.insertBefore(nav, w.nextSibling);
});

/* Mark review cards whose screenshot is taller than the card, so CSS shows "Tap to read full review" */
(function () {
  var mark = function () {
    document.querySelectorAll('.rv-wall:not(.sc-car) > .sc-item:not(.sc-stack)').forEach(function (f) {
      var img = f.querySelector('img');
      if (img) f.classList.toggle('is-long', img.getBoundingClientRect().height > f.clientHeight + 4);
    });
  };
  window.addEventListener('load', mark);
  window.addEventListener('resize', mark);
  document.querySelectorAll('.rv-wall:not(.sc-car) img').forEach(function (i) { i.addEventListener('load', mark); });
})();

/* Phones: size each review carousel to the slide in view, so short slides leave no empty space */
(function () {
  var walls = document.querySelectorAll('.rv-wall:not(.sc-car)');
  if (!walls.length) return;
  var fit = function (w) {
    if (window.innerWidth > 720) { w.style.height = ''; return; }
    var best = null, d = 1e9;
    [].forEach.call(w.children, function (c) { var x = Math.abs(c.offsetLeft - w.offsetLeft - w.scrollLeft); if (x < d) { d = x; best = c; } });
    if (best) w.style.height = (best.offsetHeight + 18) + 'px';
  };
  walls.forEach(function (w) {
    var t;
    w.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(function () { fit(w); }, 80); }, { passive: true });
    window.addEventListener('load', function () { fit(w); });
    window.addEventListener('resize', function () { fit(w); });
    w.querySelectorAll('img').forEach(function (i) { i.addEventListener('load', function () { fit(w); }); });
  });
})();

/* Google review cards: "Show more" on desktop, carousel with arrows/counter and auto-height on phones, screenshot proof in the lightbox */
(function () {
  document.querySelectorAll('.gr-wall:not(.gr-static)').forEach(function (w) {
    var all = [].slice.call(w.querySelectorAll('.gr-card')), more = w.parentNode.querySelector('.gr-more');
    var cards = w.getElementsByClassName('gr-card');
    var collapsed = all.length > 6 && !!more, mode = '';
    if (more) {
      if (collapsed) more.addEventListener('click', function () { collapsed = false; mode = ''; layout(); more.parentNode.style.display = 'none'; });
      else more.parentNode.style.display = 'none';
    }
    /* Desktop: place each card in the shortest column (even columns, no gaps). Phones: one flat row for the carousel. */
    var layout = function () {
      var n = window.innerWidth <= 720 ? 1 : window.innerWidth < 1000 ? 2 : 3;
      var key = n + (collapsed ? 'c' : 'o');
      if (key === mode) return; mode = key;
      w.innerHTML = '';
      if (n === 1) { all.forEach(function (c) { w.appendChild(c); }); w.classList.remove('gr-cols'); return; }
      w.classList.add('gr-cols');
      var cols = [];
      for (var i = 0; i < n; i++) { var c = document.createElement('div'); c.className = 'gr-col'; w.appendChild(c); cols.push(c); }
      (collapsed ? all.slice(0, 6) : all).forEach(function (card) {
        var t = cols[0]; cols.forEach(function (c) { if (c.offsetHeight < t.offsetHeight) t = c; });
        t.appendChild(card);
      });
    };
    layout();
    var nav = document.createElement('div');
    nav.className = 'gr-nav';
    nav.innerHTML = '<button type="button" aria-label="Previous review">←</button><span class="rv-count" aria-live="polite"></span><button type="button" aria-label="Next review">→</button>';
    w.parentNode.insertBefore(nav, w.nextSibling);
    var mobile = function () { return window.innerWidth <= 720; };
    var cur = function () { var b = 0, d = 1e9; for (var i = 0; i < cards.length; i++) { var x = Math.abs(cards[i].offsetLeft - w.offsetLeft - w.scrollLeft - 16); if (x < d) { d = x; b = i; } } return b; };
    var fit = function () {
      if (!mobile()) { w.style.height = ''; return; }
      var c = cur(); w.style.height = (cards[c].offsetHeight + 14) + 'px';
      nav.children[1].textContent = (c + 1) + ' / ' + cards.length;
      nav.children[0].disabled = c === 0; nav.children[2].disabled = c === cards.length - 1;
    };
    var go = function (i) { i = Math.max(0, Math.min(cards.length - 1, i)); w.scrollTo({ left: cards[i].offsetLeft - w.offsetLeft - 16, behavior: 'smooth' }); };
    nav.children[0].addEventListener('click', function () { go(cur() - 1); });
    nav.children[2].addEventListener('click', function () { go(cur() + 1); });
    var t; w.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(fit, 70); }, { passive: true });
    window.addEventListener('resize', function () { layout(); fit(); }); window.addEventListener('load', fit); fit();
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-shot]');
    if (!b) return;
    var lb = document.createElement('div');
    lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-label', b.getAttribute('data-alt') || 'Screenshot');
    lb.innerHTML = '<button class="lb-x" aria-label="Close">×</button><img alt=""><p class="lb-tip">Tap outside to close</p>';
    lb.querySelector('img').src = b.getAttribute('data-shot'); lb.querySelector('img').alt = b.getAttribute('data-alt') || '';
    document.body.appendChild(lb); document.body.style.overflow = 'hidden';
    var close = function () { lb.remove(); document.body.style.overflow = ''; };
    lb.addEventListener('click', function (ev) { if (ev.target === lb || ev.target.classList.contains('lb-x')) close(); });
    document.addEventListener('keydown', function k(ev) { if (ev.key === 'Escape') { close(); document.removeEventListener('keydown', k); } });
  });
})();

/* Review screenshots: one per view, arrows + counter, height follows the current review */
(function () {
  document.querySelectorAll('.ss-wall').forEach(function (w) {
    var items = w.children;
    if (items.length < 2) return;
    var nav = document.createElement('div');
    nav.className = 'ss-nav';
    nav.innerHTML = '<button type="button" aria-label="Previous review">←</button><span class="rv-count" aria-live="polite"></span><button type="button" aria-label="Next review">→</button>';
    w.parentNode.insertBefore(nav, w);
    var z = document.createElement('p'); z.className = 'ss-zoom'; z.textContent = 'Tap a review to read it full size'; w.parentNode.insertBefore(z, w);
    var cur = function () { return Math.round(w.scrollLeft / (items[0].offsetWidth + parseFloat(getComputedStyle(w).columnGap || 0))); };
    var fit = function () {
      var c = Math.max(0, Math.min(items.length - 1, cur()));
      var mx = 0; [].forEach.call(items, function (it) { mx = Math.max(mx, it.offsetHeight); }); w.style.height = mx + 'px';
      nav.children[1].textContent = (c + 1) + ' / ' + items.length;
      nav.children[0].disabled = c === 0; nav.children[2].disabled = c === items.length - 1;
    };
    var go = function (d) { var c = Math.max(0, Math.min(items.length - 1, cur() + d)); w.scrollTo({ left: items[c].offsetLeft - items[0].offsetLeft, behavior: 'smooth' }); };
    nav.children[0].addEventListener('click', function () { go(-1); });
    nav.children[2].addEventListener('click', function () { go(1); });
    var t; w.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(fit, 60); }, { passive: true });
    window.addEventListener('resize', fit); window.addEventListener('load', fit);
    [].forEach.call(w.querySelectorAll('img'), function (i) { i.loading = 'eager'; i.addEventListener('load', fit); });
    fit();
  });
})();

/* Lead box (.lead-box): the inline form in the middle of guide pages. It saves the lead to the
   Prepeve Leads sheet, then opens WhatsApp with the details filled in. Class bookings then go to
   /thank-you; Canada, PR and Express Entry enquiries get a short thank-you inside the box. */
(function () {
  var boxes = document.querySelectorAll('.lead-box');
  if (!boxes.length) return;
  var SHEET = 'https://script.google.com/macros/s/AKfycbxV6D1QlPWjlPg7QNH4RBQb3PoyisOElpEaKW_mbFkVkyeBfIJKPi7eiGfO42jUSTYLzg/exec';
  var WA = 'https://wa.me/919877714284?text=';
  /* [code, flag, name, calling code, example number, national number pattern (without the leading 0)] */
  var C = [
    ['IN', '🇮🇳', 'India', '91', '98765 43210', /^[6-9]\d{9}$/],
    ['CA', '🇨🇦', 'Canada', '1', '416 555 0123', /^[2-9]\d{2}[2-9]\d{6}$/],
    ['US', '🇺🇸', 'USA', '1', '415 555 0123', /^[2-9]\d{2}[2-9]\d{6}$/],
    ['AE', '🇦🇪', 'UAE', '971', '50 123 4567', /^(5\d{8}|[2-46-79]\d{7})$/],
    ['AU', '🇦🇺', 'Australia', '61', '412 345 678', /^[2-478]\d{8}$/],
    ['GB', '🇬🇧', 'UK', '44', '7400 123456', /^\d{9,10}$/],
    ['NZ', '🇳🇿', 'New Zealand', '64', '21 123 4567', /^\d{8,10}$/],
    ['SA', '🇸🇦', 'Saudi Arabia', '966', '50 123 4567', /^5\d{8}$/],
    ['QA', '🇶🇦', 'Qatar', '974', '3312 3456', /^\d{8}$/],
    ['KW', '🇰🇼', 'Kuwait', '965', '5012 3456', /^\d{8}$/],
    ['OM', '🇴🇲', 'Oman', '968', '9212 3456', /^\d{8}$/],
    ['BH', '🇧🇭', 'Bahrain', '973', '3600 1234', /^\d{8}$/],
    ['SG', '🇸🇬', 'Singapore', '65', '8123 4567', /^\d{8}$/],
    ['NP', '🇳🇵', 'Nepal', '977', '984 1234567', /^9\d{9}$/],
    ['BD', '🇧🇩', 'Bangladesh', '880', '1812 345678', /^1\d{9}$/],
    ['LK', '🇱🇰', 'Sri Lanka', '94', '71 234 5678', /^7\d{8}$/],
    ['IE', '🇮🇪', 'Ireland', '353', '85 123 4567', /^\d{9}$/],
    ['XX', '🌐', 'Other country', '', '+ country code and number', null]
  ];
  function find(code) { for (var i = 0; i < C.length; i++) if (C[i][0] === code) return C[i]; return null; }
  function byPrefix(d) { var best = null; for (var i = 0; i < C.length; i++) { var c = C[i]; if (c[3] && d.indexOf(c[3]) === 0 && (!best || c[3].length > best[3].length)) best = c; } return best; }
  /* A full number with its country code: 8 to 15 digits, in the right format for countries in the list. */
  function okFull(d) { if (!/^[1-9]\d{7,14}$/.test(d)) return false; var c = byPrefix(d); return c ? c[5].test(d.slice(c[3].length)) : true; }
  /* Returns the number as digits with the country code (e.g. 919876543210), or '' if it isn't valid. */
  function norm(raw, code) {
    raw = String(raw || '');
    var d = raw.replace(/\D/g, '');
    if (/^\s*(\+|00)/.test(raw)) { if (/^\s*00/.test(raw)) d = d.slice(2); return okFull(d) ? d : ''; }
    var c = find(code);
    if (!c || !c[3]) return okFull(d) ? d : '';
    var n = d.replace(/^0+/, '');
    if (c[5].test(n)) return c[3] + n;
    if (n.indexOf(c[3]) === 0 && okFull(n)) return n;
    return '';
  }
  /* Starting country: from the phone's time zone, else the page's default (data-cc), else India. */
  function detect(box) {
    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    var m = { 'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN', 'Asia/Dubai': 'AE', 'Asia/Riyadh': 'SA', 'Asia/Qatar': 'QA', 'Asia/Kuwait': 'KW', 'Asia/Muscat': 'OM', 'Asia/Bahrain': 'BH', 'Asia/Singapore': 'SG', 'Asia/Kathmandu': 'NP', 'Asia/Katmandu': 'NP', 'Asia/Dhaka': 'BD', 'Asia/Colombo': 'LK', 'Europe/London': 'GB', 'Europe/Belfast': 'GB', 'Europe/Dublin': 'IE', 'Pacific/Auckland': 'NZ', 'Pacific/Honolulu': 'US' };
    if (m[tz]) return m[tz];
    if (/^Australia\//.test(tz)) return 'AU';
    if (/^(Canada\/|America\/(Toronto|Vancouver|Edmonton|Winnipeg|Halifax|St_Johns|Regina|Moncton|Montreal|Whitehorse|Yellowknife|Iqaluit|Glace_Bay|Goose_Bay|Swift_Current|Dawson_Creek|Dawson|Fort_Nelson|Creston|Atikokan|Coral_Harbour|Rankin_Inlet|Cambridge_Bay|Inuvik|Nipigon|Thunder_Bay|Rainy_River|Pangnirtung|Resolute|Blanc-Sablon)$)/.test(tz)) return 'CA';
    if (/^(US\/|America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Juneau|Sitka|Metlakatla|Yakutat|Nome|Adak|Boise|Detroit|Menominee|Indianapolis|Louisville|Indiana\/|Kentucky\/|North_Dakota\/))/.test(tz)) return 'US';
    var q = /[?&]cc=(1|971)(&|$)/.exec(location.search);
    if (q) return q[1] === '971' ? 'AE' : 'CA';
    return box.getAttribute('data-cc') || 'IN';
  }
  function enc(s) { return encodeURIComponent(s); }

  [].forEach.call(boxes, function (box) {
    var form = box.querySelector('form');
    if (!form) return;
    var cc = box.querySelector('.lb-cc select'), flag = box.querySelector('.lb-flag'), code = box.querySelector('.lb-code');
    var nm = form.querySelector('input[name=name]'), ph = form.querySelector('input[name=phone]'), q = form.querySelector('select[name=q]');
    var btn = form.querySelector('.lb-btn'), label = btn.textContent, start = detect(box);
    C.forEach(function (c) {
      var o = document.createElement('option');
      o.value = c[0]; o.textContent = c[1] + ' ' + c[2] + (c[3] ? ' +' + c[3] : '');
      if (c[0] === start) o.selected = true;
      cc.appendChild(o);
    });
    /* Many visitors abroad still use an Indian WhatsApp number, so remind them when another country is picked. */
    var hint = document.createElement('p');
    hint.className = 'lb-hint'; hint.textContent = 'Using an Indian WhatsApp number? Tap the flag and choose India.';
    ph.parentNode.parentNode.insertBefore(hint, ph.parentNode.nextSibling);
    function sync() { var c = find(cc.value) || C[0]; flag.textContent = c[1]; code.textContent = '+' + c[3]; ph.placeholder = c[4]; hint.hidden = c[0] === 'IN'; }
    function err(el, on) { el.setAttribute('aria-invalid', on ? 'true' : 'false'); var p = el.closest('.lb-f').querySelector('.lb-err'); if (p) p.hidden = !on; }
    sync();
    cc.addEventListener('change', function () { sync(); err(ph, false); });
    [nm, ph].forEach(function (el) { el.addEventListener('input', function () { if (el.getAttribute('aria-invalid') === 'true') err(el, false); }); });
    window.addEventListener('pageshow', function () { btn.disabled = false; btn.textContent = label; });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = nm.value.trim().slice(0, 60), phone = norm(ph.value, cc.value), bad = null;
      if (name.length < 2) { err(nm, true); bad = nm; } else err(nm, false);
      if (!phone) { err(ph, true); bad = bad || ph; } else err(ph, false);
      if (bad) { bad.focus(); return; }

      var kind = box.getAttribute('data-kind') || '', src = box.getAttribute('data-src') || location.pathname.replace(/^\/|\/$/g, '');
      var ans = q && q.value ? q.value : '', when = box.getAttribute('data-field') === 'when';
      var band = when ? (box.getAttribute('data-test') || '') : (box.getAttribute('data-prefix') || '') + (ans || 'Not specified');
      var msg = (box.getAttribute('data-intro') || 'Hi PrepEve!') + '\n\nName: ' + name + (ans ? '\n' + (box.getAttribute('data-ml') || 'Answer') + ': ' + ans : '');
      var waUrl = WA + enc(msg);
      var url = SHEET + '?name=' + enc(name) + '&phone=' + enc(phone) + '&band=' + enc(band)
        + (when ? '&when=' + enc(ans || 'Not specified') : '') + '&source=' + enc(src) + '&t=' + Date.now();
      try { fetch(url, { method: 'GET', mode: 'no-cors', keepalive: true }).catch(function () {}); } catch (x) { new Image().src = url; }

      var consult = /^(canada|pr|ee)$/.test(kind);
      if (typeof window.gtag === 'function') {
        window.gtag('set', 'user_data', { phone_number: '+' + phone });
        window.gtag('event', 'lead_form_submit', { form_id: 'leadbox', cta_location: src + '-leadbox', lead_type: kind });
        window.gtag('event', 'conversion', { send_to: 'AW-765652199/zZIDCPHd74McEOfZi-0C', transport_type: 'beacon' });
        window.__pvWaConv = 1;
        if (consult && PV_GA4_ID) window.gtag('event', 'generate_lead', { send_to: PV_GA4_ID });
      }
      btn.disabled = true; btn.textContent = 'Sending…';
      var desk = window.innerWidth >= 769;
      setTimeout(function () {
        if (consult) {
          var d = document.createElement('div');
          d.className = 'lb-done'; d.setAttribute('role', 'status');
          d.innerHTML = '<p class="lb-done-t"></p><p>Now tap <b>Send</b> in WhatsApp so ' + (kind === 'canada' ? 'Sanjita' : 'our team')
            + ' can reply. We usually reply in 5–15 minutes.</p><a class="lb-wa" target="_blank" rel="noopener">Open WhatsApp</a>';
          d.querySelector('.lb-done-t').textContent = '✓ Thanks, ' + name.split(' ')[0] + '! We have your details.';
          d.querySelector('.lb-wa').href = waUrl;
          form.parentNode.replaceChild(d, form);
          if (desk) window.open(waUrl, '_blank'); else window.location.href = waUrl;
          return;
        }
        var ty = '/thank-you?name=' + enc(name) + '&wa=' + enc(waUrl);
        if (desk) { window.open(waUrl, '_blank'); window.location.href = ty; }
        else { window.location.href = waUrl; setTimeout(function () { window.location.href = ty; }, 1500); }
      }, 300);
    });
  });
})();
