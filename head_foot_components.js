document.addEventListener("DOMContentLoaded", () => {
  // ヘッダーを読み込む
  fetch("header.html")
    .then(res => res.text())
    .then(html => {
      const headerContainer = document.getElementById("header-container");
      if (!headerContainer) return;

      headerContainer.innerHTML = html;

      // ここでメニューのイベントをセット
      const menuToggle = document.getElementById("menu-toggle");
      const navMenu = document.getElementById("nav-menu");
      const overlay = document.getElementById("overlay");

      if (menuToggle && navMenu && overlay) {
        menuToggle.addEventListener("click", () => {
          const isOpen = navMenu.classList.toggle("active");
          overlay.classList.toggle("active", isOpen);
          menuToggle.classList.toggle("active", isOpen);
          menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
          menuToggle.setAttribute(
            "aria-label",
            isOpen ? "メニューを閉じる" : "メニューを開く"
          );
        });

        overlay.addEventListener("click", () => {
          navMenu.classList.remove("active");
          overlay.classList.remove("active");
          menuToggle.classList.remove("active");
          menuToggle.setAttribute("aria-expanded", "false");
          menuToggle.setAttribute("aria-label", "メニューを開く");
        });

        // メニュー内リンクを押したときも閉じる
        navMenu.querySelectorAll("a").forEach(link => {
          link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            overlay.classList.remove("active");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "メニューを開く");
          });
        });
      }
    });

  // フッターを読み込む
  fetch("footer.html")
    .then(res => res.text())
    .then(html => {
      const footerContainer = document.getElementById("footer-container");
      if (!footerContainer) return;
      footerContainer.innerHTML = html;
    });
});
