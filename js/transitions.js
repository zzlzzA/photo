/* ==========================================
   transitions.js — 开幕幕布 + 滚动揭示
   ========================================== */

window.Portfolio = window.Portfolio || {};

Portfolio.Transitions = (function() {
  'use strict';

  let observer = null;

  /* ---------- 开幕幕布 ---------- */
  function curtainOpen() {
    const curtain = document.getElementById('curtain');
    if (!curtain) return;

    // 第一阶段：闪现Logo
    curtain.classList.add('show-logo');

    // 第二阶段：幕布拉开
    setTimeout(function() {
      curtain.classList.add('open');
    }, 800);

    // 第三阶段：移除幕布DOM
    setTimeout(function() {
      curtain.style.display = 'none';
    }, 2200);
  }

  /* ---------- 滚动揭示 ---------- */
  function setupReveal() {
    var revealEls = document.querySelectorAll(
      '.gallery-item, .section-title, .gold-divider, .connect-title, .social-links, .footer'
    );

    if (!('IntersectionObserver' in window)) {
      // 降级：直接显示
      for (var i = 0; i < revealEls.length; i++) {
        revealEls[i].style.opacity = '1';
      }
      return;
    }

    observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          // gallery-item通过CSS .revealed类控制
          if (!el.classList.contains('gallery-item')) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }
          el.classList.add('revealed');
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -30px 0px'
    });

    for (var i = 0; i < revealEls.length; i++) {
      var el = revealEls[i];
      if (!el.classList.contains('gallery-item')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      }
      observer.observe(el);
    }
  }

  /* ---------- 公共接口 ---------- */
  function init() {
    curtainOpen();
    setupReveal();
  }

  return {
    init: init,
    curtainOpen: curtainOpen
  };
})();
