// ===== 複合アニメーションシステム =====

class AnimationSystem {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.init();
  }
  
  init() {
    // data-anim属性を持つ要素を監視
    const animatedElements = document.querySelectorAll('[data-anim]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.applyAnimations(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);
    
    animatedElements.forEach(element => {
      // 初期状態を設定
      element.classList.add('anim-init');
      observer.observe(element);
    });
  }
  
  applyAnimations(element) {
    const animations = element.dataset.anim.split(' ');
    const textAnim = element.dataset.textAnim;
    const delay = element.dataset.animDelay || 0;
    
    // 遅延実行
    setTimeout(() => {
      // テキストアニメーションの処理
      if (textAnim) {
        this.applyTextAnimation(element, textAnim);
      }
      
      // 通常のアニメーションを適用
      animations.forEach(anim => {
        if (anim && !anim.startsWith('text-')) {
          element.classList.add(`anim-${anim}`);
        }
      });
      
      // 初期状態クラスを削除
      element.classList.remove('anim-init');
    }, delay * 1000);
  }
  
  applyTextAnimation(element, animType) {
    let globalIndex = 0;
    
    // HTMLの構造を保持しながら文字を分割
    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const container = document.createDocumentFragment();
        
        text.split('').forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.textContent = char === ' ' ? '\u00A0' : char;
          charSpan.style.setProperty('--index', globalIndex++);
          charSpan.style.display = 'inline-block';
          container.appendChild(charSpan);
        });
        
        return container;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // BRタグの場合は特別処理
        if (node.tagName === 'BR') {
          const br = document.createElement('br');
          // BRタグの後に少し遅延を追加
          globalIndex += 3;
          return br;
        }
        
        // その他の要素は再帰的に処理
        const newElement = node.cloneNode(false);
        Array.from(node.childNodes).forEach(child => {
          const processed = processNode(child);
          if (processed) {
            newElement.appendChild(processed);
          }
        });
        
        return newElement;
      }
      return null;
    };
    
    // オリジナルの内容を保存
    const originalContent = element.cloneNode(true);
    
    // 既存の内容をクリア
    element.innerHTML = '';
    element.classList.add('text-anim-wrapper', `text-${animType}`);
    
    // 処理したコンテンツを追加
    Array.from(originalContent.childNodes).forEach(child => {
      const processed = processNode(child);
      if (processed) {
        element.appendChild(processed);
      }
    });
  }
}

// ===== 2. パーティクルエフェクト =====
class ParticleSystem {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    
    this.options = {
      particleCount: options.particleCount || 50,
      color: options.color || '#ff9933',
      maxSize: options.maxSize || 3,
      speed: options.speed || 0.5,
      ...options
    };
    
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    
    this.init();
  }
  
  init() {
    // キャンバスのスタイル設定
    this.canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    `;
    
    this.container.style.position = 'relative';
    this.container.appendChild(this.canvas);
    
    this.resize();
    this.createParticles();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }
  
  resize() {
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;
  }
  
  createParticles() {
    for (let i = 0; i < this.options.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * this.options.maxSize + 1,
        speedX: (Math.random() - 0.5) * this.options.speed,
        speedY: (Math.random() - 0.5) * this.options.speed,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      // 更新
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // 画面端で反対側から出現
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.y > this.canvas.height) particle.y = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      
      // 描画
      this.ctx.fillStyle = this.options.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// ===== 3. スクロールアニメーション =====
class ScrollAnimator {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.init();
  }
  
  init() {
    // 監視対象要素にdata-animation属性を付けておく
    const animatedElements = document.querySelectorAll('[data-animation]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const animationType = entry.target.dataset.animation;
          
          if (animationType === 'text-reveal') {
            this.textReveal(entry.target);
          } else {
            entry.target.classList.add('active');
          }
          
          // 一度アニメーションしたら監視を停止
          observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);
    
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }
  
  textReveal(element) {
    const text = element.textContent;
    element.textContent = '';
    element.classList.add('active');
    
    text.split('').forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.setProperty('--index', index);
      element.appendChild(span);
    });
  }
}

// ===== 4. インタラクティブ要素 =====
class InteractiveEffects {
  constructor() {
    this.init();
  }
  
  init() {
    this.initCursorGlow();
    this.initRipple();
  }
  
  initCursorGlow() {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    const updateGlow = () => {
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;
      
      glow.style.left = glowX - 10 + 'px';
      glow.style.top = glowY - 10 + 'px';
      
      requestAnimationFrame(updateGlow);
    };
    
    updateGlow();
  }
  
  initRipple() {
    document.querySelectorAll('.ripple-container').forEach(container => {
      container.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = container.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        container.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }
}

// ===== 5. ローディング演出 =====
class LoadingAnimation {
  constructor() {
    this.init();
  }
  
  init() {
    // ページ読み込み時のアニメーション
    document.addEventListener('DOMContentLoaded', () => {
      // ロゴアニメーション
      const logo = document.querySelector('.logo img');
      if (logo) {
        logo.classList.add('logo-assembly');
      }
      
      // ページ全体のフェードイン
      document.body.classList.add('page-fade-in');
    });
  }
}

// ===== 初期化 =====
document.addEventListener('DOMContentLoaded', () => {
  // 各エフェクトの初期化
  new AnimationSystem();
  new InteractiveEffects();
  new LoadingAnimation();
  new ScrollAnimator();
  
  // パーティクルは特定の要素にのみ適用
  // poster-sectionにIDを追加してからパーティクルを適用する場合
  const posterSection = document.querySelector('.poster-section');
  if (posterSection && posterSection.id === 'poster-particles') {
    new ParticleSystem('poster-particles', {
      particleCount: 20,
      color: '#ffaa33',
      maxSize: 2,
      speed: 0.3
    });
  }
});

// グローバルに公開
window.AnimationHelper = AnimationHelper;
