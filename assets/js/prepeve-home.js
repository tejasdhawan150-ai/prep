/* PrepEve homepage — page-specific behavior for the redesigned index.html.
   Intentionally separate from /assets/js/common.js (which other pages still
   use) so this rebuild doesn't affect any other page on the site. */
(function(){
  "use strict";

  document.addEventListener("DOMContentLoaded", function(){

    /* ---- splash ---- */
    var splash = document.getElementById("splash");
    if (splash){
      window.addEventListener("load", function(){
        setTimeout(function(){ splash.classList.add("hide"); }, 280);
      });
      // fallback in case load already fired
      setTimeout(function(){ splash.classList.add("hide"); }, 1600);
    }

    /* ---- scroll progress bar + navbar shadow + back-to-top ---- */
    var progress = document.getElementById("progress-bar");
    var navbar   = document.getElementById("navbar");
    var backTop  = document.getElementById("back-top");

    function onScroll(){
      var doc = document.documentElement;
      var scrollTop = window.scrollY || doc.scrollTop;
      var max = (doc.scrollHeight - doc.clientHeight) || 1;
      if (progress) progress.style.width = Math.min(100, (scrollTop / max) * 100) + "%";
      if (navbar) navbar.classList.toggle("sc", scrollTop > 8);
      if (backTop) backTop.classList.toggle("show", scrollTop > 480);
    }
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (backTop){
      backTop.addEventListener("click", function(){
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    /* ---- urgency bar close ---- */
    var ubar = document.getElementById("ubar");
    var ubarX = document.getElementById("ubar-x");
    if (ubarX && ubar){
      ubarX.addEventListener("click", function(){ ubar.style.display = "none"; });
    }

    /* ---- mobile nav ---- */
    var hamburger = document.getElementById("hamburger");
    var mobMenu   = document.getElementById("mob-menu");
    if (hamburger && mobMenu){
      hamburger.addEventListener("click", function(){
        hamburger.classList.toggle("open");
        mobMenu.classList.toggle("open");
      });
      mobMenu.querySelectorAll("a").forEach(function(a){
        a.addEventListener("click", function(){
          hamburger.classList.remove("open");
          mobMenu.classList.remove("open");
        });
      });
    }

    /* ---- FAQ accordion ---- */
    document.querySelectorAll(".faq-item").forEach(function(item){
      var btn = item.querySelector(".faq-q");
      if (!btn) return;
      btn.addEventListener("click", function(){
        var wasOpen = item.classList.contains("open");
        document.querySelectorAll(".faq-item.open").forEach(function(i){
          if (i !== item) i.classList.remove("open");
        });
        item.classList.toggle("open", !wasOpen);
      });
    });

    /* ---- reveal on scroll ---- */
    var revealEls = document.querySelectorAll(".rv");
    if ("IntersectionObserver" in window && revealEls.length){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting){
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      revealEls.forEach(function(el){ io.observe(el); });
    } else {
      revealEls.forEach(function(el){ el.classList.add("in"); });
    }

    /* ---- video lightbox (used by vt-modal markup) ---- */
    window.videoLightbox = function(id){
      var modal = document.getElementById("vt-modal");
      var iframe = document.getElementById("vt-iframe");
      if (!modal || !iframe) return;
      iframe.src = "https://www.youtube.com/embed/" + id + "?autoplay=1";
      modal.classList.add("open");
    };
    var vtClose = document.getElementById("vt-modal-close");
    var vtBg    = document.getElementById("vt-modal-bg");
    function closeLightbox(){
      var modal = document.getElementById("vt-modal");
      var iframe = document.getElementById("vt-iframe");
      if (modal) modal.classList.remove("open");
      if (iframe) iframe.src = "";
    }
    if (vtClose) vtClose.addEventListener("click", closeLightbox);
    if (vtBg) vtBg.addEventListener("click", closeLightbox);

  });
})();
