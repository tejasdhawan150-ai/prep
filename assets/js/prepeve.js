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
  nav.innerHTML = '<button type="button" aria-label="Previous reviews">←</button><button type="button" aria-label="Next reviews">→</button>';
  var step = function (d) { w.scrollBy({ left: d * w.clientWidth * 0.9, behavior: 'smooth' }); };
  nav.children[0].addEventListener('click', function () { step(-1); });
  nav.children[1].addEventListener('click', function () { step(1); });
  w.parentNode.insertBefore(nav, w.nextSibling);
});
