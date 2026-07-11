/* ==========================================
   parallax.js — Hero视差 + 鼠标跟随
   ========================================== */

window.Portfolio = window.Portfolio || {};

Portfolio.Parallax = (function() {
  'use strict';

  var heroSwiperEl;
  var ticking = false;

  /* ---------- 滚动视差 ---------- */
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function() {
        var scrollY = window.scrollY;
        if (heroSwiperEl && scrollY < window.innerHeight) {
          // Hero照片0.5x速度上移 + 叠加鼠标位移
          var currentTransform = heroSwiperEl.style.transform || '';
          var mouseY = currentTransform.match(/translateY\(([^)]+)\)/);
          var mouseVal = mouseY ? parseFloat(mouseY[1]) : 0;
          heroSwiperEl.style.transform = 'translateY(' + (scrollY * 0.5 + mouseVal) + 'px)';
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  /* ---------- 鼠标跟随 ---------- */
  var mouseX = 0, mouseY = 0;

  function onMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;  // -1 ~ 1
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

    if (heroSwiperEl) {
      var scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroSwiperEl.style.transform =
          'translate(' + (mouseX * -15) + 'px, ' + (scrollY * 0.5 + mouseY * -15) + 'px)';
      }
    }

    // 光标光晕跟随
    var glow = document.getElementById('cursor-glow');
    if (glow && window.innerWidth >= 768) {
      glow.style.opacity = '1';
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }
  }

  function onMouseLeave() {
    var glow = document.getElementById('cursor-glow');
    if (glow) glow.style.opacity = '0';
  }

  /* ---------- 公共接口 ---------- */
  function init() {
    heroSwiperEl = document.querySelector('.hero-slider');

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
  }

  return {
    init: init
  };
})();
