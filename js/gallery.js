/* ==========================================
   gallery.js — 电影画幅画廊 + 标签筛选 + 灯箱
   ========================================== */

window.Portfolio = window.Portfolio || {};

Portfolio.Gallery = (function() {
  'use strict';

  var PHOTOS = [];
  var currentTag = 'all';
  var gridEl, lightboxEl, lightboxImg, lightboxCaption;
  var filterBtns = [];

  /* 标签中英文映射 */
  var TAG_LABELS = {
    'landscape': '风光',
    'portrait': '人像',
    'humanistic': '人文',
    'anime': '动漫',
    'drone': '航拍',
    'street': '街拍',
    'night': '夜景'
  };

  /* ---------- 渲染电影画幅画廊 ---------- */
  function renderGrid() {
    if (!gridEl) return;

    // 淡出
    gridEl.style.opacity = '0';

    setTimeout(function() {
      gridEl.innerHTML = '';

      var filtered = currentTag === 'all'
        ? PHOTOS
        : PHOTOS.filter(function(p) { return p.tag === currentTag; });

      if (filtered.length === 0) {
        gridEl.innerHTML = '<p style="text-align:center;color:var(--color-text-weak);grid-column:1/-1;padding:80px 0;font-family:var(--font-sans);font-size:12px;letter-spacing:2px;">暂无作品</p>';
        gridEl.style.opacity = '1';
        return;
      }

      filtered.forEach(function(photo, index) {
        var item = document.createElement('div');
        item.className = 'gallery-item';

        // 宽银幕照片跨双列 (aspect > 2.0)
        if (photo.aspectRatio && photo.aspectRatio > 2.0) {
          item.classList.add('widescreen');
        }

        item.style.transitionDelay = (index * 0.06) + 's';

        /* 照片容器 */
        var photoWrap = document.createElement('div');
        photoWrap.className = 'photo-wrap';

        var img = document.createElement('img');
        img.src = photo.thumb;
        img.alt = photo.title || '';
        img.loading = 'lazy';

        /* Hover暗金覆层 + 标题 */
        var overlay = document.createElement('div');
        overlay.className = 'photo-overlay';

        var title = document.createElement('span');
        title.className = 'photo-title';
        title.textContent = photo.title || '';

        overlay.appendChild(title);
        photoWrap.appendChild(img);
        photoWrap.appendChild(overlay);

        /* 底部信息栏 */
        var info = document.createElement('div');
        info.className = 'photo-info';

        var tag = document.createElement('span');
        tag.className = 'photo-tag';
        tag.textContent = TAG_LABELS[photo.tag] || photo.tag;

        var arrow = document.createElement('span');
        arrow.className = 'photo-arrow';
        arrow.innerHTML = '&#8594;';

        info.appendChild(tag);
        info.appendChild(arrow);

        item.appendChild(photoWrap);
        item.appendChild(info);

        // 点击灯箱
        item.addEventListener('click', (function(p) {
          return function() { openLightbox(p); };
        })(photo));

        gridEl.appendChild(item);
      });

      // 淡入 + 触发揭示动画
      requestAnimationFrame(function() {
        gridEl.style.opacity = '1';
        var items = gridEl.querySelectorAll('.gallery-item');
        for (var i = 0; i < items.length; i++) {
          (function(el, delay) {
            setTimeout(function() {
              el.classList.add('revealed');
            }, delay);
          })(items[i], i * 80);
        }
      });
    }, 300); // 与CSS transition匹配
  }

  /* ---------- 标签筛选 ---------- */
  function initFilters() {
    filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (this.classList.contains('active')) return;
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        currentTag = this.getAttribute('data-tag');
        renderGrid();
      });
    });
  }

  /* ---------- 灯箱 ---------- */
  function openLightbox(photo) {
    if (!lightboxEl || !lightboxImg) return;
    lightboxImg.src = photo.file;
    lightboxImg.alt = photo.title || '';
    if (lightboxCaption) {
      lightboxCaption.textContent = photo.title || '';
    }
    lightboxEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxEl) return;
    lightboxEl.classList.remove('open');
    document.body.style.overflow = '';
  }

  function initLightbox() {
    lightboxEl = document.getElementById('lightbox');
    lightboxImg = document.getElementById('lightbox-img');
    lightboxCaption = document.getElementById('lightbox-caption');

    if (!lightboxEl) return;

    var bg = lightboxEl.querySelector('.lightbox-bg');
    if (bg) bg.addEventListener('click', closeLightbox);

    var closeBtn = lightboxEl.querySelector('.lightbox-close');
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ---------- 设置照片数据 ---------- */
  function setPhotos(photos) {
    PHOTOS.length = 0;
    for (var i = 0; i < photos.length; i++) {
      PHOTOS.push(photos[i]);
    }
  }

  /* ---------- 动态更新标签映射 ---------- */
  function updateTags(tags, labels) {
    for (var i = 0; i < tags.length; i++) {
      if (labels[tags[i]]) {
        TAG_LABELS[tags[i]] = labels[tags[i]];
      }
    }
    // 重建筛选按钮
    initFilters();
  }

  /* ---------- 公共接口 ---------- */
  function init() {
    gridEl = document.getElementById('gallery-grid');
    initFilters();
    initLightbox();
    renderGrid();
  }

  function filter(tag) {
    currentTag = tag;
    // 同步到公开属性
    Portfolio.Gallery._currentTag = tag;
    filterBtns.forEach(function(b) {
      var isActive = b.getAttribute('data-tag') === tag;
      b.classList.toggle('active', isActive);
    });
    renderGrid();
  }

  var api = {
    init: init,
    filter: filter,
    setPhotos: setPhotos,
    updateTags: updateTags,
    _currentTag: currentTag
  };

  return api;
})();
