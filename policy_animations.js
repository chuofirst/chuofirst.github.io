// 政策ページ専用の圧倒的アニメーション

document.addEventListener('DOMContentLoaded', () => {
  
  // ===== パーティクル背景アニメーション =====
  createParticleBackground();
  
  // ===== スクロールトリガーアニメーション =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  // 各政策カードを監視
  document.querySelectorAll('.policy-pillar').forEach((pillar, index) => {
    pillar.style.animationDelay = `${index * 0.15}s`;
    observer.observe(pillar);
  });

  // ===== ホバーエフェクト =====
  document.querySelectorAll('.policy-pillar').forEach(pillar => {
    pillar.addEventListener('mouseenter', function() {
      this.style.transform = 'translateX(20px) scale(1.02)';
      
      // 詳細アイテムを順番にアニメーション
      const items = this.querySelectorAll('.detail-item');
      items.forEach((item, index) => {
        setTimeout(() => {
          item.style.transform = 'translateX(10px)';
          item.style.opacity = '1';
        }, index * 100);
      });
    });

    pillar.addEventListener('mouseleave', function() {
      this.style.transform = '';
      
      const items = this.querySelectorAll('.detail-item');
      items.forEach(item => {
        item.style.transform = '';
      });
    });
  });

  // ===== 番号サークルの回転アニメーション =====
  document.querySelectorAll('.number-circle').forEach(circle => {
    circle.addEventListener('mouseenter', function() {
      this.style.transform = 'rotate(360deg) scale(1.3)';
    });
    
    circle.addEventListener('mouseleave', function() {
      this.style.transform = 'rotate(0deg) scale(1)';
    });
  });

  // ===== ページヒーローのテキストアニメーション =====
  const heroTitle = document.querySelector('.policy-main-title');
  const heroSubtitle = document.querySelector('.policy-main-subtitle');
  const heroVision = document.querySelector('.policy-vision');

  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.innerHTML = text.split('').map((char, i) => 
      `<span style="animation-delay: ${i * 0.05}s">${char}</span>`
    ).join('');
  }

  // ===== スクロール進捗バー =====
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress-bar';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });

  // ===== カウントアップアニメーション =====
  const numberCircles = document.querySelectorAll('.number-circle');
  numberCircles.forEach(circle => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !circle.classList.contains('counted')) {
          circle.classList.add('counted');
          const targetNumber = parseInt(circle.textContent);
          animateCount(circle, 0, targetNumber, 1000);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(circle);
  });

  // ===== パララックス効果 =====
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    
    document.querySelectorAll('.policy-pillar').forEach((pillar, index) => {
      const speed = 0.1 + (index * 0.02);
      const yPos = -(scrolled * speed);
      pillar.style.transform = `translateY(${yPos}px)`;
    });
  });

  // ===== Intersection Observer for detail items =====
  const detailObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.detail-item');
        items.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('show');
          }, index * 150);
        });
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.pillar-details').forEach(details => {
    detailObserver.observe(details);
  });
});

// ===== ヘルパー関数 =====

function createParticleBackground() {
  const canvas = document.createElement('canvas');
  canvas.className = 'particle-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';
  document.querySelector('.policy-section').appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fill();
    });

    // 線で繋ぐ
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - distance / 500})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

function animateCount(element, start, end, duration) {
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const current = Math.floor(progress * (end - start) + start);
    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = end;
    }
  }

  requestAnimationFrame(step);
}

// ===== マウスフォロー効果 =====
document.addEventListener('mousemove', (e) => {
  const pillars = document.querySelectorAll('.policy-pillar');
  
  pillars.forEach(pillar => {
    const rect = pillar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const percentX = (x - centerX) / centerX;
      const percentY = (y - centerY) / centerY;
      
      pillar.style.transform = `
        perspective(1000px) 
        rotateY(${percentX * 5}deg) 
        rotateX(${-percentY * 5}deg)
        scale(1.02)
      `;
    } else {
      pillar.style.transform = '';
    }
  });
});
