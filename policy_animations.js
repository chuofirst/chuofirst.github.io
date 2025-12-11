// policy_animations.js - タイプライター効果

document.addEventListener('DOMContentLoaded', () => {
  
  // ===== タイプライター効果の実装 =====
  
  class Typewriter {
    constructor(element, speed = 30) {
      this.element = element;
      this.speed = speed;
      this.text = element.textContent;
      this.element.textContent = '';
      this.index = 0;
      this.isTyping = false;
    }

    type() {
      if (this.isTyping) return;
      this.isTyping = true;
      
      const typeChar = () => {
        if (this.index < this.text.length) {
          this.element.textContent += this.text.charAt(this.index);
          this.index++;
          setTimeout(typeChar, this.speed);
        } else {
          this.isTyping = false;
          // タイピング完了後カーソル削除
          const cursor = this.element.querySelector('.typing-cursor');
          if (cursor) cursor.remove();
        }
      };
      
      // カーソル追加
      const cursor = document.createElement('span');
      cursor.className = 'typing-cursor';
      cursor.textContent = '|';
      this.element.appendChild(cursor);
      
      typeChar();
    }
  }

  // ===== スクロール監視 =====
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
        entry.target.classList.add('typed');
        entry.target.classList.add('visible');
        
        // タイトルのタイプライター
        const title = entry.target.querySelector('.policy-title');
        if (title) {
          const titleTyper = new Typewriter(title, 40);
          setTimeout(() => titleTyper.type(), 200);
        }

        // リード文のタイプライター
        const lead = entry.target.querySelector('.policy-lead');
        if (lead) {
          const leadTyper = new Typewriter(lead, 20);
          setTimeout(() => leadTyper.type(), 800);
        }

        // 各ポイントのタイプライター
        const points = entry.target.querySelectorAll('.policy-point p');
        points.forEach((point, index) => {
          const pointTyper = new Typewriter(point, 15);
          setTimeout(() => {
            point.closest('.policy-point').style.opacity = '1';
            pointTyper.type();
          }, 1500 + (index * 600));
        });

        // 番号のカウントアップ
        const number = entry.target.querySelector('.policy-number');
        if (number) {
          animateNumber(number);
        }
      }
    });
  }, observerOptions);

  // 各政策アイテムを監視
  document.querySelectorAll('.policy-item').forEach(item => {
    observer.observe(item);
  });

  // ===== 締めセクションのタイプライター =====
  const closingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
        entry.target.classList.add('typed');
        entry.target.classList.add('visible');
        
        const closingTitle = entry.target.querySelector('.closing-title');
        const closingText = entry.target.querySelector('.closing-text');
        
        if (closingTitle) {
          const titleTyper = new Typewriter(closingTitle, 50);
          titleTyper.type();
        }
        
        if (closingText) {
          const textTyper = new Typewriter(closingText, 25);
          setTimeout(() => textTyper.type(), 800);
        }
      }
    });
  }, observerOptions);

  const closing = document.querySelector('.policy-closing');
  if (closing) {
    closingObserver.observe(closing);
  }

  // ===== スクロール進捗バー =====
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

  // ===== 番号のカウントアップ =====
  function animateNumber(element) {
    const text = element.textContent;
    const targetNumber = parseInt(text);
    let currentNumber = 0;
    const duration = 1000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      currentNumber = Math.floor(targetNumber * progress);
      element.textContent = String(currentNumber).padStart(2, '0');

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = text;
      }
    }

    requestAnimationFrame(update);
  }

  // ===== CSSアニメーション追加 =====
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .typing-cursor {
      animation: blink 0.7s infinite;
      color: var(--text-light);
      font-weight: 400;
      margin-left: 2px;
    }

    @keyframes blink {
      0%, 49% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }

    .policy-point {
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .point-icon {
      animation: iconPop 0.5s ease-out;
    }

    @keyframes iconPop {
      0% { transform: scale(0); }
      50% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(styleElement);
});
