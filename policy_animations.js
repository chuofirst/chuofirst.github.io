// 政策ページ専用アニメーション - シンプル＆ダイナミック

document.addEventListener('DOMContentLoaded', () => {
  
  // ===== スクロール監視でかっこよく出現 =====
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
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

  // ===== 番号のフェードイン効果強化 =====
  const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const number = entry.target.querySelector('.policy-number');
      if (entry.isIntersecting && number) {
        number.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        number.style.transform = 'scale(1)';
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.policy-item').forEach(item => {
    const number = item.querySelector('.policy-number');
    if (number) {
      number.style.transform = 'scale(0.8)';
    }
    numberObserver.observe(item);
  });

  // ===== パララックス効果（控えめ） =====
  let ticking = false;

  const parallaxEffect = () => {
    const scrolled = window.scrollY;
    
    document.querySelectorAll('.policy-number').forEach((num, index) => {
      const speed = 0.05;
      const yPos = scrolled * speed;
      num.style.transform = `translateY(${yPos}px) scale(1)`;
    });

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(parallaxEffect);
      ticking = true;
    }
  });
});
