/* PrepEve shared behaviour: nav, reveal, video modal, sticky CTA, analytics events. */
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
    if (href.indexOf('wa.me') > -1 || href.indexOf('chat.whatsapp.com') > -1) track('whatsapp_click', { cta_location: loc || 'unlabelled' });
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
