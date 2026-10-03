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
