/* ============================================================================
   PREPEVE COMMON.JS
   Shared, framework-free vanilla JS behaviors used across marketing pages.
   No dependencies. Safe to include on any page — every behavior checks for
   its target element(s) before wiring up, so missing markup is a no-op
   rather than an error.

   Behaviors:
   - Nav scroll shadow + mobile hamburger menu toggle
   - Scroll progress bar
   - FAQ accordion
   - Mobile sticky CTA bar support (CSS-driven, JS just needed for nav offset)
   - Scroll-reveal animation (.rv pattern)
   - Back-to-top button
   - Splash screen dismiss
   ========================================================================= */
(function () {
  'use strict';

  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  onReady(function () {
    /* ---------------------------------------------------------------------
       SPLASH SCREEN — hide after load or 1.5s max (base64 images can block
       the load event on slow connections)
       --------------------------------------------------------------------- */
    (function splash() {
      var s = document.getElementById('splash');
      if (!s) return;
      function hide() { s.classList.add('hide'); }
      setTimeout(hide, 1500);
      window.addEventListener('load', hide);
    })();

    /* ---------------------------------------------------------------------
       SCROLL PROGRESS BAR + NAV SHADOW + BACK-TO-TOP VISIBILITY
       --------------------------------------------------------------------- */
    (function scrollFx() {
      var progressBar = document.getElementById('progress-bar');
      var nav = document.getElementById('navbar');
      var backTop = document.getElementById('back-top');
      if (!progressBar && !nav && !backTop) return;

      function onScroll() {
        var scrolled = window.scrollY;
        var total = document.body.scrollHeight - window.innerHeight;
        if (progressBar && total > 0) {
          progressBar.style.width = (scrolled / total * 100) + '%';
        }
        if (nav) nav.classList.toggle('sc', scrolled > 10);
        if (backTop) backTop.classList.toggle('show', scrolled > 600);
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    })();

    /* ---------------------------------------------------------------------
       BACK TO TOP BUTTON
       --------------------------------------------------------------------- */
    (function backToTop() {
      var btn = document.getElementById('back-top');
      if (!btn) return;
      btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    })();

    /* ---------------------------------------------------------------------
       NAV — hamburger / mobile menu toggle
       --------------------------------------------------------------------- */
    (function mobileNav() {
      var ham = document.getElementById('hamburger');
      var mob = document.getElementById('mob-menu');
      if (!ham || !mob) return;
      ham.addEventListener('click', function () {
        ham.classList.toggle('open');
        mob.classList.toggle('open');
      });
      mob.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          ham.classList.remove('open');
          mob.classList.remove('open');
        });
      });
    })();

    /* ---------------------------------------------------------------------
       URGENCY BAR — dismiss + body padding adjustment
       --------------------------------------------------------------------- */
    (function urgencyBar() {
      var urgBar = document.getElementById('urgency-bar');
      var navHeight = 68;
      if (urgBar) {
        document.body.style.paddingTop = (navHeight + urgBar.offsetHeight) + 'px';
      }
      var ubClose = document.getElementById('ub-close');
      if (!ubClose) return;
      ubClose.addEventListener('click', function () {
        var ub = document.getElementById('urgency-bar');
        if (!ub) return;
        ub.style.transition = 'opacity 0.2s, transform 0.2s';
        ub.style.opacity = '0';
        ub.style.transform = 'translateY(-100%)';
        document.body.style.transition = 'padding-top 0.2s';
        document.body.style.paddingTop = navHeight + 'px';
        setTimeout(function () { ub.style.display = 'none'; }, 200);
      });
    })();

    /* ---------------------------------------------------------------------
       SCROLL REVEAL — IntersectionObserver on .rv elements, with a fallback
       timer in case the observer never fires (e.g. element already in view
       but browser quirk, or IO unsupported)
       --------------------------------------------------------------------- */
    (function scrollReveal() {
      var targets = document.querySelectorAll('.rv');
      if (!targets.length) return;

      if ('IntersectionObserver' in window) {
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) en.target.classList.add('visible');
          });
        }, { threshold: 0.1 });
        targets.forEach(function (el) { obs.observe(el); });
      } else {
        targets.forEach(function (el) { el.classList.add('visible'); });
      }

      // Fallback: force-reveal anything still hidden after 3s
      setTimeout(function () {
        document.querySelectorAll('.rv:not(.visible)').forEach(function (el) {
          el.classList.add('visible');
        });
      }, 3000);
    })();

    /* ---------------------------------------------------------------------
       SMOOTH SCROLL for in-page anchor links
       --------------------------------------------------------------------- */
    (function smoothAnchors() {
      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          var href = a.getAttribute('href');
          if (!href || href === '#') return;
          var target;
          try { target = document.querySelector(href); } catch (err) { return; }
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    })();

    /* ---------------------------------------------------------------------
       FAQ ACCORDION — single-open behavior
       --------------------------------------------------------------------- */
    (function faqAccordion() {
      var faqButtons = document.querySelectorAll('.faq-q');
      if (!faqButtons.length) return;
      faqButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var item = btn.closest('.faq-item');
          if (!item) return;
          var isOpen = item.classList.contains('open');
          document.querySelectorAll('.faq-item').forEach(function (i) {
            i.classList.remove('open');
            var icon = i.querySelector('.faq-icon');
            if (icon) icon.textContent = '+';
          });
          if (!isOpen) {
            item.classList.add('open');
            var icon = item.querySelector('.faq-icon');
            if (icon) icon.textContent = '×';
          }
        });
      });
    })();

    /* ---------------------------------------------------------------------
       VIDEO LIGHTBOX — opens a YouTube embed in a modal (#vt-modal /
       #vt-iframe), if present on the page
       --------------------------------------------------------------------- */
    (function videoLightbox() {
      var modal = document.getElementById('vt-modal');
      var iframe = document.getElementById('vt-iframe');
      if (!modal || !iframe) return;

      window.openVideo = function (src) {
        iframe.src = src + '?autoplay=1';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
      };
      window.closeVideo = function () {
        modal.classList.remove('show');
        iframe.src = '';
        document.body.style.overflow = '';
      };
      var vtClose = document.getElementById('vt-modal-close');
      var vtBg = document.getElementById('vt-modal-bg');
      if (vtClose) vtClose.addEventListener('click', window.closeVideo);
      if (vtBg) vtBg.addEventListener('click', window.closeVideo);
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') window.closeVideo();
      });
    })();
  });
})();
