/* ==========================================
   particles.js — Canvas金色微粒漂浮系统
   ========================================== */

window.Portfolio = window.Portfolio || {};

Portfolio.Particles = (function() {
  'use strict';

  var CONFIG = {
    count: 70,            // 桌面端粒子数
    countMobile: 35,      // 移动端粒子数
    minSize: 0.5,
    maxSize: 2.5,
    minSpeed: 0.15,
    maxSpeed: 0.5,
    minOpacity: 0.15,
    maxOpacity: 0.5,
    color: '200, 169, 110' // RGB of --color-gold
  };

  var canvas, ctx, particles = [], animId = null;
  var w, h;

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function() {
    this.x = Math.random() * w;
    this.y = h + Math.random() * 100; // 从底部出发
    this.size = CONFIG.minSize + Math.random() * (CONFIG.maxSize - CONFIG.minSize);
    this.speed = CONFIG.minSpeed + Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed);
    this.opacity = CONFIG.minOpacity + Math.random() * (CONFIG.maxOpacity - CONFIG.minOpacity);
    this.drift = (Math.random() - 0.5) * 0.3; // 水平飘移
    this.flickerSpeed = 0.005 + Math.random() * 0.015;
    this.flickerOffset = Math.random() * Math.PI * 2;
  };

  Particle.prototype.update = function(time) {
    this.y -= this.speed;
    this.x += this.drift + Math.sin(time * 0.001 + this.flickerOffset) * 0.1;

    // 超出顶部或左右边界时重置
    if (this.y < -10 || this.x < -10 || this.x > w + 10) {
      this.reset();
      this.y = h + 10;
    }
  };

  Particle.prototype.draw = function(time) {
    var alpha = this.opacity * (0.7 + 0.3 * Math.sin(time * this.flickerSpeed + this.flickerOffset));
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + CONFIG.color + ',' + alpha + ')';
    ctx.fill();
  };

  function getParticleCount() {
    return window.innerWidth < 768 ? CONFIG.countMobile : CONFIG.count;
  }

  function createParticles() {
    var count = getParticleCount();
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function loop(timestamp) {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < particles.length; i++) {
      particles[i].update(timestamp);
      particles[i].draw(timestamp);
    }
    animId = requestAnimationFrame(loop);
  }

  function resize() {
    if (!canvas) return;
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    createParticles();
  }

  /* ---------- 公共接口 ---------- */
  function init() {
    canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    if (!ctx) return;

    resize();
    window.addEventListener('resize', resize);
    animId = requestAnimationFrame(loop);
  }

  function destroy() {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    window.removeEventListener('resize', resize);
    if (ctx) {
      ctx.clearRect(0, 0, w, h);
    }
    particles = [];
  }

  return {
    init: init,
    destroy: destroy,
    resize: resize
  };
})();
