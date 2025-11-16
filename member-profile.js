// メンバープロフィールページ共通JavaScript

document.addEventListener('DOMContentLoaded', () => {
  document.body.style.visibility = 'visible';
});

const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const overlay = document.getElementById('overlay');

menuToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('active');
  overlay.classList.toggle('active');
  menuToggle.classList.toggle('active');
  menuToggle.setAttribute('aria-expanded', isOpen);
  menuToggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
});

overlay.addEventListener('click', () => {
  navMenu.classList.remove('active');
  overlay.classList.remove('active');
  menuToggle.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'メニューを開く');
});

// 右からスライドインのアニメーション
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // カード内のアイテムを順番にアニメーション
      const items = entry.target.querySelectorAll('.slide-in-item');
      items.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('slide-in-active');
        }, 200 + (index * 150)); // 200ms後から150msずつ遅延
      });
    }
  });
}, observerOptions);

// 全てのカードを監視
document.querySelectorAll('.slide-in-right').forEach(card => {
  cardObserver.observe(card);
});
