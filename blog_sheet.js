// blog_sheet.js

// 党員専用チェック
const email = localStorage.getItem("user_email");
const canBlog = localStorage.getItem("user_can_blog") === "1";

if (email && !canBlog) {
  // ログインはしてるけど党員権限なし → 追い出す
  window.location.replace("cantsee.html");
}

// ===== Googleスプレッドシート設定 =====
const SHEET_ID = "1UdhaCLRFxG-9390j1Cw04-Q6DFesedNMjzeS9rSUH5E"; // 自分のID
const SHEET_NAME = "Responses"; // タブ名（A:タイムスタンプ, B:ユーザーネーム, C:内容）

const SHEET_URL =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?` +
  `tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;

const threadBody = document.getElementById("blog-thread-body");

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

  // タイムスタンプは、f(フォーマット済み文字列)優先 → v をFallback
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
  const randomId = Math.random().toString(36).slice(2, 10);
  idSpan.textContent = `ID:${randomId}`;

  header.appendChild(numSpan);
  header.appendChild(document.createTextNode("："));
  header.appendChild(nameSpan);
  header.appendChild(dateSpan);
  header.appendChild(idSpan);

  const bodyDiv = document.createElement("div");
  bodyDiv.className = "blog-post-body";
  bodyDiv.innerHTML = (body || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/\n/g, "<br>");

  article.appendChild(header);
  article.appendChild(bodyDiv);

  threadBody.appendChild(article);
}

// シートから読み込み
async function loadPosts() {
  try {
    threadBody.textContent = "読み込み中...";

    const res = await fetch(SHEET_URL);
    const text = await res.text();

    // gvizのラッパーからJSON部分だけ抜き出す
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) {
      threadBody.textContent = "データの読み込みに失敗しました。";
      return;
    }

    const jsonStr = text.substring(start, end + 1);
    const data = JSON.parse(jsonStr);

    const rows = (data.table && data.table.rows) || [];

    threadBody.innerHTML = "";

    if (!rows.length) {
      threadBody.textContent = "まだ書き込みはありません。";
      return;
    }

    rows.forEach((row, idx) => {
      // A: タイムスタンプ, B: ユーザーネーム, C: 内容
      const c = row.c || [];
      const tsCell = c[0]; // A列
      const nameCell = c[1]; // B列
      const bodyCell = c[2]; // C列

      const timestamp =
        (tsCell && tsCell.f) || (tsCell && tsCell.v) || ""; // f優先
      const name = (nameCell && nameCell.v) || "";
      const body = (bodyCell && bodyCell.v) || "";

      // 1行目はヘッダーじゃなくて回答の1件目のはずだけど、
      // もしヘッダー行があるならここでスキップ条件を入れてもOK
      appendPost(idx + 1, timestamp, name, body);
    });
  } catch (err) {
    console.error(err);
    threadBody.textContent = "データの読み込みに失敗しました。";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadPosts();
});
