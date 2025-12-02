// ===== アクセス権チェック（auth.js完了後に実行） =====
function checkThreadListAccess() {
  const email = localStorage.getItem("user_email");
  const role = localStorage.getItem("user_role");

  if (!email) return false;

  // レベル2（特別選抜）またはレベル3（党員）のみアクセス可能
  if (role !== '2' && role !== '3') {
    window.location.replace("cantsee.html");
    return false;
  }

  document.body.classList.add("authorized");
  return true;
}

// auth.jsの処理を待つ（最大3秒くらい）
let authCheckCount = 0;
function waitAuthAndLoad() {
  const timer = setInterval(() => {
    authCheckCount++;
    const ok = checkThreadListAccess();
    if (ok || authCheckCount > 10) {
      clearInterval(timer);
      if (ok) {
        loadThreadList();
      }
    }
  }, 300);
}

// ===== 日付フォーマット（相対時間表示） =====
function formatRelativeTime(timestamp) {
  if (!timestamp) return "不明";
  
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "不明";
    
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "たった今";
    if (diffMins < 60) return `${diffMins}分前`;
    if (diffHours < 24) return `${diffHours}時間前`;
    if (diffDays < 7) return `${diffDays}日前`;
    
    // 7日以上前は日付表示
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}/${m}/${d}`;
  } catch (e) {
    return "不明";
  }
}

// ===== スレッドカードをDOMに追加 =====
function appendThreadCard(title, url, lastUpdate, postCount) {
  const listBody = document.getElementById("thread-list-body");
  if (!listBody) return;

  const card = document.createElement("a");
  card.href = url;
  card.className = "thread-list-card";

  // スレッドタイトル
  const titleDiv = document.createElement("div");
  titleDiv.className = "thread-card-title";
  titleDiv.textContent = title;

  // メタ情報（更新時間 + レス数）
  const metaDiv = document.createElement("div");
  metaDiv.className = "thread-card-meta";

  const updateSpan = document.createElement("span");
  updateSpan.className = "thread-card-update";
  updateSpan.innerHTML = `🕒 ${formatRelativeTime(lastUpdate)}`;

  const countSpan = document.createElement("span");
  countSpan.className = "thread-card-count";
  countSpan.innerHTML = `💬 ${postCount} レス`;

  metaDiv.appendChild(updateSpan);
  metaDiv.appendChild(countSpan);

  // 矢印アイコン
  const arrowDiv = document.createElement("div");
  arrowDiv.className = "thread-card-arrow";
  arrowDiv.innerHTML = "→";

  card.appendChild(titleDiv);
  card.appendChild(metaDiv);
  card.appendChild(arrowDiv);

  listBody.appendChild(card);
}

// ===== スレッド一覧データを取得 =====
// スレッド管理用のスプレッドシートURL
// 【重要】このスプレッドシートには以下の列が必要です：
// A列: スレッドタイトル
// B列: スレッドURL（blog.html, blog1.html など）
// C列: 最終更新日時（Apps Scriptで自動更新）
// D列: レス数（Apps Scriptで自動更新）

// ！！！ここにあなたのスプレッドシートIDを設定してください！！！
const THREAD_LIST_SHEET_URL = "https://docs.google.com/spreadsheets/d/1MtFJOJ5pM6C5GgOAVr2uWSu9TLRfer2xTiRsxT297N8/gviz/tq?sheet=ThreadList";

async function loadThreadList() {
  const listBody = document.getElementById("thread-list-body");
  const countElement = document.getElementById("thread-count");

  if (!listBody) return;

  listBody.innerHTML = '<div class="blog-loading">読み込み中...</div>';
  if (countElement) {
    countElement.textContent = "";
  }

  // スプレッドシートURLが設定されていない場合
  if (!THREAD_LIST_SHEET_URL || THREAD_LIST_SHEET_URL.includes("YOUR_SHEET_ID_HERE")) {
    listBody.innerHTML = '<div class="blog-loading">スプレッドシートURLが設定されていません。<br>blog_list_sheet.js の THREAD_LIST_SHEET_URL を設定してください。</div>';
    return;
  }

  // スプレッドシートからデータを取得
  try {
    const res = await fetch(THREAD_LIST_SHEET_URL);
    const text = await res.text();

    const marker = "google.visualization.Query.setResponse(";
    const start = text.indexOf(marker);
    const end = text.lastIndexOf(");");

    if (start === -1 || end === -1) {
      listBody.innerHTML = '<div class="blog-loading">データの読み込みに失敗しました。<br>スプレッドシートのURLが正しいか確認してください。</div>';
      return;
    }

    const jsonStr = text.substring(start + marker.length, end);
    const data = JSON.parse(jsonStr);
    const rows = (data.table && data.table.rows) || [];

    listBody.innerHTML = "";

    if (!rows.length) {
      listBody.innerHTML = '<div class="blog-loading">まだスレッドがありません。<br>ThreadListシートにデータを追加してください。</div>';
      if (countElement) {
        countElement.textContent = "0 スレッド";
      }
      return;
    }

    // 有効なスレッドのみをカウント
    let validThreadCount = 0;

    rows.forEach((row) => {
      const c = row.c || [];

      const title = (c[0] && c[0].v) || "";
      const url = (c[1] && c[1].v) || "";
      
      // タイトルとURLの両方がある行のみ表示
      if (!title || !url) return;

      const lastUpdate = (c[2] && (c[2].f || c[2].v)) || "";
      const postCount = (c[3] && c[3].v) || 0;

      appendThreadCard(title, url, lastUpdate, postCount);
      validThreadCount++;
    });

    if (validThreadCount === 0) {
      listBody.innerHTML = '<div class="blog-loading">表示できるスレッドがありません。<br>ThreadListシートのA列とB列を確認してください。</div>';
    }

    if (countElement) {
      countElement.textContent = `${validThreadCount} スレッド`;
    }
  } catch (err) {
    console.error("スレッド一覧の読み込みエラー:", err);
    listBody.innerHTML = '<div class="blog-loading">データの読み込みに失敗しました。<br>コンソールを確認してください。</div>';
  }
}

// ===== 起動 =====
document.addEventListener("DOMContentLoaded", () => {
  waitAuthAndLoad();
});
