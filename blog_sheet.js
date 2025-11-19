// blog-sheet.js

// 党員専用チェック
const email = localStorage.getItem("user_email");
const canBlog = localStorage.getItem("user_can_blog") === "1";

if (email && !canBlog) {
  // ログインはしてるけど党員権限なし → 追い出す
  window.location.replace("cantsee.html");
}

// シートの設定
const SHEET_ID = "ここにシートID";   // 例: "1AbCdEfGhIjKlMnOpQrStUvWxYz1234567890"
const SHEET_NAME = "フォームの回答 1"; // シートタブ名そのまま（空白はOK）

// gviz形式のJSONを返してくれるURL
const SHEET_URL =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?` +
  `tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;

const threadBody = document.getElementById("blog-thread-body");

// 日付フォーマットを2ch風に
function formatDate(date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  const hh = `${date.getHours()}`.padStart(2, "0");
  const mm = `${date.getMinutes()}`.padStart(2, "0");
  const ss = `${date.getSeconds()}`.padStart(2, "0");
  const youbi = ["日","月","火","水","木","金","土"][date.getDay()];
  return `${y}/${m}/${d}(${youbi}) ${hh}:${mm}:${ss}`;
}

// レス1件をDOMに追加
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
  let dateObj = new Date(timestamp);
  if (isNaN(dateObj.getTime())) dateObj = new Date();
  dateSpan.textContent = `投稿日：${formatDate(dateObj)}`;

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

    // gvizのラッパーを外してJSONだけ取り出す
    const match = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/s);
    if (!match) {
      threadBody.textContent = "データの読み込みに失敗しました。";
      return;
    }

    const json = JSON.parse(match[1]);
    const rows = json.table.rows || [];

    threadBody.innerHTML = "";

    if (!rows.length) {
      threadBody.textContent = "まだ書き込みはありません。";
      return;
    }

    rows.forEach((row, idx) => {
      // A:タイムスタンプ, B:名前, C:本文 の想定
      const ts = row.c[0]?.v || "";
      const name = row.c[1]?.v || "";
      const body = row.c[2]?.v || "";

      appendPost(idx + 1, ts, name, body);
    });
  } catch (err) {
    console.error(err);
    threadBody.textContent = "データの読み込みに失敗しました。";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadPosts();
});
