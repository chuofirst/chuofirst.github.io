// ===== 党員専用チェック（auth.js完了後に実行） =====
function checkBlogAccess() {
  const email = localStorage.getItem("user_email");
  const canBlog = localStorage.getItem("user_can_blog") === "1";

  // まだログイン情報が入ってない（auth.jsが未完了）の場合
  if (!email) return false;

  // ログイン済みだが権限なし → 追い出す
  if (email && !canBlog) {
    window.location.replace("cantsee.html");
    return false;
  }

  // 権限OK → bodyにクラスを付けて表示
  document.body.classList.add("authorized");
  return true;
}

// auth.jsの処理を待つ（最大3秒くらい）
let authCheckCount = 0;
function waitAuthAndLoad() {
  const timer = setInterval(() => {
    authCheckCount++;
    const ok = checkBlogAccess();
    if (ok || authCheckCount > 10) {
      clearInterval(timer);
      if (ok) {
        loadPosts();
      }
    }
  }, 300);
}

// ===== 日付フォーマット =====
function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}/${m}/${day} ${hh}:${mm}`;
}

// ===== 1レス分をDOMに追加 =====
function appendPost(index, timestamp, name, body, imageUrls) {
  const threadBody = document.getElementById("blog-thread-body");
  if (!threadBody) return;

  const article = document.createElement("article");
  article.className = "blog-post";

  // ヘッダー（番号・名前・日付・ID）
  const header = document.createElement("div");
  header.className = "blog-post-header";

  const numSpan = document.createElement("span");
  numSpan.className = "blog-post-number";
  numSpan.textContent = index;

  const nameSpan = document.createElement("span");
  nameSpan.className = "blog-post-name";
  nameSpan.textContent = name || "党員";

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
      // 失敗したら現在時刻でフォールバック
    }
  }
  if (!dateText) {
    dateText = formatDate(new Date());
  }
  dateSpan.textContent = dateText;

  const idSpan = document.createElement("span");
  idSpan.className = "blog-post-id";
  const randomId = Math.random().toString(36).slice(2, 10).toUpperCase();
  idSpan.textContent = `ID:${randomId}`;

  header.appendChild(numSpan);
  header.appendChild(nameSpan);
  header.appendChild(dateSpan);
  header.appendChild(idSpan);

  // 本文
  const bodyDiv = document.createElement("div");
  bodyDiv.className = "blog-post-body";
  const safeBody = (body || "")
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
  bodyDiv.innerHTML = safeBody;

  article.appendChild(header);
  article.appendChild(bodyDiv);

  // 画像（あれば投稿の一番下に表示）
  if (imageUrls && imageUrls.trim() !== "") {
    const imagesDiv = document.createElement("div");
    imagesDiv.className = "blog-post-images";

    // URLがカンマ区切りで入っている想定
    const urls = imageUrls.split(/\s*,\s*/);

    urls.forEach(url => {
      if (!url) return;

      // Google Drive の open?id=形式を画像URLに変換
      const match = url.match(/(?:id=|\/d\/)([^&/]+)/);
      const displayUrl = match
  　　　? `https://drive.google.com/uc?export=view&id=${match[1]}`
  　　　: url;

      const img = document.createElement("img");
      img.src = displayUrl;
      img.loading = "lazy";
      img.className = "blog-post-image";
      imagesDiv.appendChild(img);
    });

    article.appendChild(imagesDiv);
  }


  threadBody.appendChild(article);
}

// ===== Googleスプレッドシートから読み込み =====
const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1UdhaCLRFxG-9390j1Cw04-Q6DFesedNMjzeS9rSUH5E/gviz/tq?sheet=Responses";

async function loadPosts() {
  const threadBody = document.getElementById("blog-thread-body");
  const postCountElement = document.getElementById("post-count");

  if (!threadBody) return;

  threadBody.innerHTML =
    '<div class="blog-loading">読み込み中...</div>';
  if (postCountElement) {
    postCountElement.textContent = "";
  }

  try {
    const res = await fetch(SHEET_URL);
    const text = await res.text();

    const marker = "google.visualization.Query.setResponse(";
    const start = text.indexOf(marker);
    const end = text.lastIndexOf(");");

    if (start === -1 || end === -1) {
      threadBody.innerHTML =
        '<div class="blog-loading">データの読み込みに失敗しました。</div>';
      return;
    }

    const jsonStr = text.substring(start + marker.length, end);
    const data = JSON.parse(jsonStr);
    const rows = (data.table && data.table.rows) || [];

    threadBody.innerHTML = "";

    if (!rows.length) {
      threadBody.innerHTML =
        '<div class="blog-loading">まだ書き込みはありません。</div>';
      if (postCountElement) {
        postCountElement.textContent = "0 レス";
      }
      return;
    }

    // 新しい順に並んでいるならそのまま / 逆順にしたいなら rows.slice().reverse()
    rows.forEach((row, idx) => {
  　const c = row.c || [];

  　const timestamp = (c[0] && (c[0].f || c[0].v)) || "";
  　const name      = (c[1] && c[1].v) || "";
  　const body      = (c[2] && c[2].v) || "";

  　const imageCell = c[6] || {};
  　let imageUrls = "";

  　// HYPERLINK式からURLを抜く
  　if (imageCell.f && typeof imageCell.f === "string") {
     const imageCell = c[6] || {};
     let imageUrls = "";

     // ✅ HYPERLINK式からURL抽出（Googleフォーム確定仕様）
     if (imageCell.f && typeof imageCell.f === "string") {
       const m = imageCell.f.match(/HYPERLINK\(\\"([^\\"]+)\\"/i);
       if (m) imageUrls = m[1];
     } else if (imageCell.v) {
       imageUrls = imageCell.v.toString();
     }

     appendPost(idx + 1, timestamp, name, body, imageUrls);
　});



    if (postCountElement) {
      postCountElement.textContent = `${rows.length} レス`;
    }
  } catch (err) {
    console.error(err);
    threadBody.innerHTML =
      '<div class="blog-loading">データの読み込みに失敗しました。</div>';
  }
}

// ===== 起動 =====
document.addEventListener("DOMContentLoaded", () => {
  waitAuthAndLoad();
});
