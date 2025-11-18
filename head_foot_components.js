document.addEventListener("DOMContentLoaded", () => {
  // ヘッダー
  fetch("header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header-container").innerHTML = data;
    });

  // フッター
  fetch("footer.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("footer-container").innerHTML = data;
    });
});
