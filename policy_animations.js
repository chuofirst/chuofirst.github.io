// policy_animations.js - ダイナミックなアニメーション

document.addEventListener('DOMContentLoaded', () => {
  
  // ===== スクロール監視でダイナミック出現 =====
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // 番号のカウントアップアニメーション
        const number = entry.target.querySelector('.policy-number');
        if (number && !number.classList.contains('counted')) {
          number.classList.add('counted');
          animateNumber(number);
        }
      }
    });
  }, observerOptions);

  // 各政策アイテムを監視
  document.querySelectorAll('.policy-item').forEach(item => {
    observer.observe(item);
  });

  // 締めのセクションも監視
  const closing = document.querySelector('.policy-closing');
  if (closing) {
    observer.observe(closing);
  }

  // ===== スクロール進捗インジケーター =====
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: var(--header-h);
    left: 0;
    height: 4px;
    background: linear-gradient(90deg, #ffd700, var(--primary-light));
    z-index: 9999;
    transition: width 0.1s ease-out;
    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.5);
  `;
  document.body.appendChild(progressBar);

  const updateProgress = () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
  };

  window.addEventListener('scroll', updateProgress);
  updateProgress();

  // ===== パララックス効果 =====
  let ticking = false;

  const parallaxEffect = () => {
    const scrolled = window.scrollY;
    
    // 番号のパララックス
    document.querySelectorAll('.policy-number').forEach((num, index) => {
      const speed = 0.08;
      const yPos = scrolled * speed;
      num.style.transform = `translateY(${yPos}px)`;
    });

    // タイトルのパララックス（逆方向）
    document.querySelectorAll('.policy-title').forEach((title, index) => {
      const speed = -0.03;
      const yPos = scrolled * speed;
      title.style.transform = `translateY(${yPos}px)`;
    });

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(parallaxEffect);
      ticking = true;
    }
  });

  // ===== アイコンのバウンスアニメーション =====
  document.querySelectorAll('.point-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function() {
      this.style.animation = 'iconBounce 0.6s ease';
    });
    
    icon.addEventListener('animationend', function() {
      this.style.animation = '';
    });
  });

  // ===== 線の伸びるアニメーション =====
  const lineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const main = entry.target.querySelector('.policy-main');
        if (main) {
          main.style.animation = 'lineGrow 0.8s ease-out forwards';
        }
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.policy-item').forEach(item => {
    lineObserver.observe(item);
  });

  // ===== ビューポートに入ったら背景パルス =====
  const pulseObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'backgroundPulse 2s ease-in-out';
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.policy-item').forEach(item => {
    pulseObserver.observe(item);
  });
});

// ===== ヘルパー関数 =====

// 番号のカウントアップ
function animateNumber(element) {
  const text = element.textContent;
  const targetNumber = parseInt(text);
  let currentNumber = 0;
  const duration = 800;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // イージング関数（バウンス効果）
    const easeOutBounce = (t) => {
      if (t < 1 / 2.75) {
        return 7.5625 * t * t;
      } else if (t < 2 / 2.75) {
        return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
      } else if (t < 2.5 / 2.75) {
        return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
      } else {
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
      }
    };

    currentNumber = Math.floor(targetNumber * easeOutBounce(progress));
    element.textContent = String(currentNumber).padStart(2, '0');

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = text;
    }
  }

  requestAnimationFrame(update);
}

// CSSアニメーションを動的に追加
const style = document.createElement('style');
style.textContent = `
  @keyframes iconBounce {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(1.3) rotate(-10deg); }
    50% { transform: scale(1.1) rotate(10deg); }
    75% { transform: scale(1.2) rotate(-5deg); }
  }

  @keyframes lineGrow {
    from { 
      border-left-width: 0;
      padding-left: 0;
    }
    to { 
      border-left-width: 5px;
      padding-left: 40px;
    }
  }

  @keyframes backgroundPulse {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.15); }
  }
`;
document.head.appendChild(style);
