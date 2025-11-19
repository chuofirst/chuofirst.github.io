// blog_sheet.js

// ===== 党員専用チェック =====
const email = localStorage.getItem("user_email");
const canBlog = localStorage.getItem("user_can_blog") === "1";

if (email && !canBlog) {
  // ログインはしてるけど党員権限なし → 追い出す
  window.location.replace("cantsee.html");
} else if (email && canBlog) {
  // 権限OK → bodyにauthorizedクラスを追加して表示
  document.body.classList.add('authorized');
}

// ===== Googleスプレッドシート設定 =====
const SHEET_ID = "1UdhaCLRFxG-9390j1Cw04-Q6DFesedNMjzeS9rSUH5E";
const SHEET_NAME = "Responses";

const SHEET_URL =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?` +
  `tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;

const threadBody = document.getElementById("blog-thread-body");
const postCountElement = document.getElementById("post-count");

// 日付をそれっぽい形に整形
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  const youbi = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
  return `${y}/${m}/${d}(${youbi}) ${hh}:${mm}:${ss}`;
}

// 1レス分をDOMに追加
function appendPost(index, timestamp, name, body) {
  const article = document.createElement("article");
  article.className = "blog-post";

  const header = document.createElement("div");
  header.className = "blog-post-header";

  const numSpan = document.createElement("span");
  numSpan.className = "blog-post-number";
  numSpan.textContent = index;

  const nameSpan = document.createElement("span");
  nameSpan.className = "blog-post-name";
  nameSpan.textContent = `名前：${name || "党員"}`;

  const dateSpan = document.createElement("span");
  dateSpan.className = "blog-post-date";

  let dateText = "";
  if (timestamp) {
    try {
      const d = new Date(timestamp);
      if (!isNaN(d.getTime())) {
        dateText = formatDate(d);
      }
    } catch (e) {
      // 失敗したら何もしない
    }
  }
  if (!dateText) {
    dateText = formatDate(new Date());
  }
  dateSpan.textContent = `投稿日：${dateText}`;

  const idSpan = document.createElement("span");
  idSpan.className = "blog-post-id";
  const randomId = Math.random().toString(36).slice(2, 10).toUpperCase();
  idSpan.textContent = `ID:${randomId}`;

  header.appendChild(numSpan);
  header.appendChild(nameSpan);
  header.appendChild(dateSpan);
  header.appendChild(idSpan);

  const bodyDiv = document.createElement("div");
  bodyDiv.className = "blog-post-body";
  bodyDiv.innerHTML = (body || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");

  article.appendChild(header);
  article.appendChild(bodyDiv);

  threadBody.appendChild(article);
}

// シートから読み込み
async function loadPosts() {
  try {
    threadBody.innerHTML = '<div class="blog-loading">読み込み中...</div>';

    const res = await fetch(SHEET_URL);
    const text = await res.text();

    // gvizのラッパーからJSON部分だけ抜き出す
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) {
      threadBody.innerHTML = '<div class="blog-loading">データの読み込みに失敗しました。</div>';
      return;
    }

    const jsonStr = text.substring(start, end + 1);
    const data = JSON.parse(jsonStr);

    const rows = (data.table && data.table.rows) || [];

    threadBody.innerHTML = "";

    if (!rows.length) {
      threadBody.innerHTML = '<div class="blog-loading">まだ書き込みはありません。</div>';
      if (postCountElement) {
        postCountElement.textContent = "0 レス";
      }
      return;
    }

    rows.forEach((row, idx) => {
      const c = row.c || [];
      const tsCell = c[0];
      const nameCell = c[1];
      const bodyCell = c[2];

      const timestamp = (tsCell && tsCell.f) || (tsCell && tsCell.v) || "";
      const name = (nameCell && nameCell.v) || "";
      const body = (bodyCell && bodyCell.v) || "";

      appendPost(idx + 1, timestamp, name, body);
    });

    // レス数を更新
    if (postCountElement) {
      postCountElement.textContent = `${rows.length} レス`;
    }

  } catch (err) {
    console.error(err);
    threadBody.innerHTML = '<div class="blog-loading">データの読み込みに失敗しました。</div>';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadPosts();
});
