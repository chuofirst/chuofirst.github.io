// ========================================
// 設定
// ========================================
const WORKER_URL = 'https://auth-worker.xxxxx.workers.dev'; // ← ここを変更！
const ALLOWED_DOMAIN = '@edu-g.gsn.ed.jp';
const ENCRYPTION_KEY = 'chuo-first-secret-key-2025';

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
// ログイン画面
// ========================================
function showLoginScreen() {
  document.body.style.setProperty('visibility','visible','important');

  const existingLoginScreen = document.getElementById('login-screen');
  if (existingLoginScreen) {
    existingLoginScreen.remove();
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
      <div id="logo-placeholder" style="color: white; font-size: 1.5em; font-weight: bold;">中央中等生ファーストの会</div>
    </div>
    <button id="google-login-btn" style="
      background: white;
      color: #333;
      font-size: 1.2em;
      font-weight: 700;
      padding: 15px 40px;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      gap: 15px;
      transition: all 0.3s ease;
    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98 .66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Googleでログイン
    </button>
    <p style="color: white; margin-top: 30px; font-size: 1.1em; font-weight: 600;">
      学校のアカウントでログインしてください
    </p>
  `;

  document.documentElement.appendChild(loginDiv);

  const img = new Image();
  img.onload = () => {
    const placeholder = document.getElementById('logo-placeholder');
    if (placeholder) {
      placeholder.parentElement.innerHTML = `<img src="ChuoFirst.png" alt="中央中等生ファーストの会" style="max-width: 400px;">`;
    }
  };
  img.src = 'ChuoFirst.png';

  document.getElementById('google-login-btn').addEventListener('click', async () => {
    try {
      const response = await fetch(`${WORKER_URL}/auth/login`);
      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error('ログインエラー:', error);
      alert('ログインに失敗しました。もう一度お試しください。');
    }
  });
}

// ========================================
// 認証チェック
// ========================================
async function checkAuth() {
  const session = localStorage.getItem('session');
  
  if (!session) {
    showLoginScreen();
    return;
  }

  try {
    const response = await fetch(`${WORKER_URL}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${session}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.valid) {
        const loginScreen = document.getElementById('login-screen');
        if (loginScreen) {
          loginScreen.remove();
        }
        showDecryptedContent();
        return;
      }
    }
  } catch (e) {
    console.error('認証確認エラー:', e);
  }

  localStorage.removeItem('session');
  localStorage.removeItem('user');
  showLoginScreen();
}

// ========================================
// ページ読み込み時に実行
// ========================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkAuth);
} else {
  checkAuth();
}
