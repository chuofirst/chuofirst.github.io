// ========================================
// 設定
// ========================================
const ADMIN_EMAIL = 'chuo-2023025@edu-g.gsn.ed.jp';
const ENCRYPTION_KEY = 'chuo-first-secret-key-2025';

// ★★★ ここにApps ScriptのWebアプリURLを入れてください ★★★
const APPS_SCRIPT_URL = 'https://script.google.com/a/macros/edu-g.gsn.ed.jp/s/AKfycbyaWXvAv3pAZaAN5K6xUFmyPu7Qz6tntIFHwrhCoySNmtNnuqT-xdYJJ_b26mJY3RRO/exec';

// Google FormのURL
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfPCE0NPFVj2zHACsSPznFX5ZFYuXsqeYDF_VXl_n7glEyiHg/viewform';

// ========================================
// 復号化関数（変更なし）
// ========================================
let __DECRYPTION_RUNNING = false;
let __DECRYPTION_DONE = false;

function decryptContent(encrypted) {
  try {
    if (typeof encrypted === 'string') {
      const s = encrypted.trim();
      if (s.startsWith('data:image/')) return s;
      if (s.startsWith('http://') || s.startsWith('https://')) return s;
    }
    const decoded = atob(encrypted);
    const decryptedBytes = new Uint8Array(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
      decryptedBytes[i] = decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
    }
    const decrypted = new TextDecoder().decode(decryptedBytes);
    return decrypted;
  } catch (e) {
    console.error('復号化エラー:', e);
    return '';
  }
}

const __DECRYPT_CACHE = new Map();
function decryptWithCache(encrypted) {
  if (!encrypted) return '';
  if (__DECRYPT_CACHE.has(encrypted)) return __DECRYPT_CACHE.get(encrypted);
  const out = decryptContent(encrypted);
  __DECRYPT_CACHE.set(encrypted, out);
  return out;
}

const schedule = (cb) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(cb, { timeout: 200 });
  } else {
    setTimeout(cb, 0);
  }
}

function showDecryptedContent() {
  if (__DECRYPTION_DONE || __DECRYPTION_RUNNING) return;
  __DECRYPTION_RUNNING = true;

  try {
    const textNodes = Array.from(document.querySelectorAll('[data-encrypted]'));
    const imgNodes  = Array.from(document.querySelectorAll('[data-encrypted-src]'));

    const byLenAsc = (attr) => (a, b) =>
      (a.getAttribute(attr)?.length || 0) - (b.getAttribute(attr)?.length || 0);
    textNodes.sort(byLenAsc('data-encrypted'));
    imgNodes.sort(byLenAsc('data-encrypted-src'));

    const SMALL_THRESHOLD = 60_000;
    const smallImgs = [];
    const largeImgs = [];
    for (const el of imgNodes) {
      const L = el.getAttribute('data-encrypted-src')?.length || 0;
      (L <= SMALL_THRESHOLD ? smallImgs : largeImgs).push(el);
    }

    const queue = [
      ...textNodes.map(el => ({ el, kind: 'text' })),
      ...smallImgs.map(el => ({ el, kind: 'img' })),
      ...largeImgs.map(el => ({ el, kind: 'img' }))
    ];

    const CHUNK_COUNT = 25;
    const TIME_BUDGET = 12;

    const processChunk = () => {
      const start = performance.now();
      let processed = 0;

      while (queue.length && processed < CHUNK_COUNT && (performance.now() - start) < TIME_BUDGET) {
        const task = queue.shift();
        if (!task) break;

        if (task.kind === 'text') {
          const enc = task.el.getAttribute('data-encrypted');
          const dec = decryptWithCache(enc);
          if (dec) {
            task.el.textContent = dec;
            task.el.removeAttribute('data-encrypted');
          }
        } else {
          const enc = task.el.getAttribute('data-encrypted-src');
          const dec = decryptWithCache(enc);
          if (dec && task.el.src !== dec) {
            task.el.src = dec;
          }
          task.el.removeAttribute('data-encrypted-src');
        }

        processed++;
      }

      if (queue.length) {
        schedule(processChunk);
      } else {
        document.body.style.setProperty('visibility','visible','important');
        __DECRYPTION_DONE = true;
        __DECRYPTION_RUNNING = false;
      }
    };

    schedule(processChunk);
  } catch (e) {
    console.error('復号処理中に例外:', e);
    document.body.style.setProperty('visibility','visible','important');
    __DECRYPTION_DONE = true;
    __DECRYPTION_RUNNING = false;
  }
}

// ========================================
// 申請画面（Google Form埋め込み）
// ========================================
function showRequestScreen() {
  document.body.style.setProperty('visibility','visible','important');

  const existingScreen = document.getElementById('request-screen');
  if (existingScreen) {
    existingScreen.remove();
  }

  const requestDiv = document.createElement('div');
  requestDiv.id = 'request-screen';
  requestDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #cc6600 0%, #ee7800 50%, #ff9933 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    overflow-y: auto;
    padding: 20px;
  `;

  requestDiv.innerHTML = `
    <div style="width: 400px; height: 100px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center;">
      <div id="logo-placeholder" style="color: white; font-size: 1.5em; font-weight: bold;">中央中等生ファーストの会</div>
    </div>
    <div style="background: white; padding: 30px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); max-width: 700px; width: 100%;">
      <h2 style="margin: 0 0 20px 0; color: #333; text-align: center;">アクセス申請</h2>
      <p style="margin: 0 0 20px 0; color: #666; text-align: center;">このサイトを閲覧するには申請が必要です。</p>
      
      <iframe src="${GOOGLE_FORM_URL}?embedded=true" width="100%" height="500" frameborder="0" marginheight="0" marginwidth="0" style="border-radius: 10px;">読み込んでいます…</iframe>
      
      <div style="margin-top: 20px; text-align: center;">
        <button id="already-applied-btn" style="
          background: #ccc;
          color: #666;
          font-size: 1em;
          padding: 12px 30px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        " onmouseover="this.style.background='#bbb'" onmouseout="this.style.background='#ccc'">
          すでに申請済みの方はこちら
        </button>
      </div>
    </div>
  `;

  document.documentElement.appendChild(requestDiv);

  const img = new Image();
  img.onload = () => {
    const placeholder = document.getElementById('logo-placeholder');
    if (placeholder) {
      placeholder.parentElement.innerHTML = `<img src="ChuoFirst.png" alt="中央中等生ファーストの会" style="max-width: 400px; height: auto;">`;
    }
  };
  img.src = 'ChuoFirst.png';

  document.getElementById('already-applied-btn').addEventListener('click', () => {
    const requestScreen = document.getElementById('request-screen');
    if (requestScreen) {
      requestScreen.remove();
    }
    showLoginScreen();
  });
}

// ========================================
// ログイン画面（Apps Scriptでチェック）
// ========================================
function showLoginScreen() {
  document.body.style.setProperty('visibility','visible','important');

  const existingScreen = document.getElementById('login-screen');
  if (existingScreen) {
    existingScreen.remove();
  }

  const loginDiv = document.createElement('div');
  loginDiv.id = 'login-screen';
  loginDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #cc6600 0%, #ee7800 50%, #ff9933 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;

  loginDiv.innerHTML = `
    <div style="width: 400px; height: 100px; margin-bottom: 40px; display: flex; align-items: center; justify-content: center;">
      <div id="logo-placeholder-login" style="color: white; font-size: 1.5em; font-weight: bold;">中央中等生ファーストの会</div>
    </div>
    <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); max-width: 500px;">
      <h2 style="margin: 0 0 20px 0; color: #333;">ログイン</h2>
      <p style="margin: 0 0 30px 0; color: #666;">承認済みのメールアドレスでログインしてください。</p>
      <input type="email" id="login-email-input" placeholder="メールアドレス" style="
        width: 100%;
        padding: 15px;
        font-size: 1em;
        border: 2px solid #ddd;
        border-radius: 10px;
        margin-bottom: 20px;
        box-sizing: border-box;
      ">
      <button id="login-btn" style="
        width: 100%;
        background: #ee7800;
        color: white;
        font-size: 1.2em;
        font-weight: 700;
        padding: 15px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        margin-bottom: 15px;
        transition: all 0.3s ease;
      " onmouseover="this.style.background='#ff9933'" onmouseout="this.style.background='#ee7800'">
        ログイン
      </button>
      <button id="back-to-request-btn" style="
        width: 100%;
        background: #ccc;
        color: #666;
        font-size: 1em;
        padding: 10px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
      ">
        まだ申請していない方はこちら
      </button>
      <div id="login-status" style="margin-top: 20px; text-align: center; color: #999; font-size: 0.9em;"></div>
    </div>
  `;

  document.documentElement.appendChild(loginDiv);

  const img = new Image();
  img.onload = () => {
    const placeholder = document.getElementById('logo-placeholder-login');
    if (placeholder) {
      placeholder.parentElement.innerHTML = `<img src="ChuoFirst.png" alt="中央中等生ファーストの会" style="max-width: 400px; height: auto;">`;
    }
  };
  img.src = 'ChuoFirst.png';

  const loginBtn = document.getElementById('login-btn');
  const statusDiv = document.getElementById('login-status');

  loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('login-email-input').value.trim().toLowerCase();
    
    if (!email) {
      alert('メールアドレスを入力してください');
      return;
    }

    // ログインボタンを無効化
    loginBtn.disabled = true;
    loginBtn.style.background = '#ccc';
    loginBtn.textContent = '確認中...';
    statusDiv.textContent = 'サーバーに問い合わせています...';

    try {
      // Apps Scriptに問い合わせ
      const response = await fetch(`${APPS_SCRIPT_URL}?action=check&email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (data.approved) {
        // 承認済み
        localStorage.setItem('user_email', email);
        statusDiv.textContent = '✅ 承認されました!';
        statusDiv.style.color = '#28a745';
        
        setTimeout(() => {
          const loginScreen = document.getElementById('login-screen');
          if (loginScreen) {
            loginScreen.remove();
          }
          showDecryptedContent();
        }, 500);
      } else {
        // 未承認
        statusDiv.textContent = '❌ このメールアドレスは承認されていません';
        statusDiv.style.color = '#dc3545';
        loginBtn.disabled = false;
        loginBtn.style.background = '#ee7800';
        loginBtn.textContent = 'ログイン';
        
        setTimeout(() => {
          alert('このメールアドレスは承認されていません。\n申請をお願いします。');
        }, 500);
      }
    } catch (error) {
      console.error('承認チェックエラー:', error);
      statusDiv.textContent = '❌ エラーが発生しました';
      statusDiv.style.color = '#dc3545';
      loginBtn.disabled = false;
      loginBtn.style.background = '#ee7800';
      loginBtn.textContent = 'ログイン';
      alert('サーバーとの通信に失敗しました。\nもう一度お試しください。');
    }
  });

  document.getElementById('back-to-request-btn').addEventListener('click', () => {
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) {
      loginScreen.remove();
    }
    showRequestScreen();
  });
}

// ========================================
// 認証チェック
// ========================================
async function checkAuth() {
  const savedEmail = localStorage.getItem('user_email');
  
  if (savedEmail) {
    // 保存されたメールアドレスがある場合、Apps Scriptで確認
    try {
      const response = await fetch(`${APPS_SCRIPT_URL}?action=check&email=${encodeURIComponent(savedEmail)}`);
      const data = await response.json();
      
      if (data.approved) {
        // 承認済み
        showDecryptedContent();
        return;
      } else {
        // 承認が取り消された場合
        localStorage.removeItem('user_email');
        showLoginScreen();
        return;
      }
    } catch (error) {
      console.error('承認チェックエラー:', error);
      // エラーの場合はログイン画面へ
      showLoginScreen();
      return;
    }
  }
  
  // 初回または未承認の場合は申請画面
  showRequestScreen();
}

// ========================================
// ページ読み込み時に実行
// ========================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkAuth);
} else {
  checkAuth();
}
