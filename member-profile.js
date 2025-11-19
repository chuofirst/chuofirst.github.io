// メンバープロフィールページ共通JavaScript

document.addEventListener('DOMContentLoaded', () => {
  document.body.style.visibility = 'visible';
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
