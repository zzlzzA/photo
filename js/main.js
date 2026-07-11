/* ==========================================
   main.js — 初始化入口
   优先级: localStorage → 内置数据
   与 admin.html 通过 localStorage 互通
   ========================================== */

(function() {
  'use strict';

  /* 内置照片数据（离线兜底） */
  var BUILTIN_DATA = [
    { file:'photos/00-2923.webp',     thumb:'thumbs/00-2923.webp',     tag:'landscape', title:'Golden Hour',     aspectRatio:1.50 },
    { file:'photos/00-3279.webp',     thumb:'thumbs/00-3279.webp',     tag:'landscape', title:'City Lights',     aspectRatio:1.50 },
    { file:'photos/00-3531.webp',     thumb:'thumbs/00-3531.webp',     tag:'landscape', title:'Urban Horizon',   aspectRatio:1.50 },
    { file:'photos/00-4361.webp',     thumb:'thumbs/00-4361.webp',     tag:'landscape', title:'Twilight Melody', aspectRatio:1.50 },
    { file:'photos/00-4443.webp',     thumb:'thumbs/00-4443.webp',     tag:'landscape', title:'Silent Streets',  aspectRatio:1.50 },
    { file:'photos/00-4561.webp',     thumb:'thumbs/00-4561.webp',     tag:'landscape', title:'Winter Glow',     aspectRatio:1.50 },
    { file:'photos/00-4793.webp',     thumb:'thumbs/00-4793.webp',     tag:'landscape', title:'Night Symphony',  aspectRatio:1.50 },
    { file:'photos/动漫1-2939.webp',  thumb:'thumbs/动漫1-2939.webp',  tag:'anime',     title:'Character I',     aspectRatio:2.35 },
    { file:'photos/动漫2-2940.webp',  thumb:'thumbs/动漫2-2940.webp',  tag:'anime',     title:'Character II',    aspectRatio:1.50 },
    { file:'photos/无人机1-2937.webp',thumb:'thumbs/无人机1-2937.webp',tag:'drone',     title:'Aerial View',     aspectRatio:1.24 }
  ];

  var PHOTO_DATA;

  /* ===== 加载数据（同步，无网络依赖） ===== */
  function loadData() {
    // 尝试从 localStorage 读取（admin.html 写入的）
    try {
      var raw = localStorage.getItem('miracle_photos');
      if (raw) {
        var data = JSON.parse(raw);
        if (data && data.length > 0) {
          return data;
        }
      }
    } catch(e) { /* ignore */ }
    // 兜底：内置数据
    return BUILTIN_DATA;
  }

  /* ===== Hero 轮播 ===== */
  var heroTimer = null;
  var heroCurrent = 0;

  function initHero() {
    var slider = document.getElementById('hero-slider');
    if (!slider || PHOTO_DATA.length === 0) return;

    if (heroTimer) clearInterval(heroTimer);
    slider.innerHTML = '';

    // 选不同分类做Hero（最多5张）
    var heroPhotos = [];
    var used = {};
    for (var i = 0; i < PHOTO_DATA.length && heroPhotos.length < 5; i++) {
      if (!used[PHOTO_DATA[i].tag]) {
        used[PHOTO_DATA[i].tag] = true;
        heroPhotos.push(PHOTO_DATA[i]);
      }
    }
    if (heroPhotos.length === 0) return;

    for (var j = 0; j < heroPhotos.length; j++) {
      var slide = document.createElement('div');
      slide.className = 'hero-slide' + (j === 0 ? ' active' : '');
      slide.style.backgroundImage = 'url(' + heroPhotos[j].file + ')';
      slider.appendChild(slide);
    }

    heroCurrent = 0;
    heroTimer = setInterval(function() {
      var slides = slider.querySelectorAll('.hero-slide');
      if (!slides.length) return;
      slides[heroCurrent].classList.remove('active');
      heroCurrent = (heroCurrent + 1) % slides.length;
      slides[heroCurrent].classList.add('active');
    }, 4000);
  }

  /* ===== 社交链接 ===== */
  function initSocial() {
    var links = {
      'social-douyin': 'https://www.douyin.com/user/yourname',
      'social-email':  'mailto:your@email.com'
    };
    Object.keys(links).forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.href = links[id];
    });
  }

  /* ===== 刷新画廊（admin.html 修改后触发） ===== */
  function refreshGallery() {
    PHOTO_DATA = loadData();
    Portfolio.Gallery.setPhotos(PHOTO_DATA);
    initHero();
    // 用当前筛选标签重新渲染
    var tag = Portfolio.Gallery._currentTag || 'all';
    Portfolio.Gallery.filter(tag);
  }

  /* ===== 启动 ===== */
  function init() {
    PHOTO_DATA = loadData();

    // 首次没有localStorage时写入内置数据
    try {
      if (!localStorage.getItem('miracle_photos')) {
        localStorage.setItem('miracle_photos', JSON.stringify(BUILTIN_DATA));
      }
    } catch(e) {}

    Portfolio.Gallery.setPhotos(PHOTO_DATA);
    initHero();
    Portfolio.Gallery.init();
    Portfolio.Particles.init();
    Portfolio.Parallax.init();
    Portfolio.Transitions.init();
    initSocial();

    // 监听 admin.html 的修改（同源其他标签页）
    window.addEventListener('storage', function(e) {
      if (e.key === 'miracle_photos') {
        refreshGallery();
      }
    });
  }

  /* ===== DOM Ready ===== */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
