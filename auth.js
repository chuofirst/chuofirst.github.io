// ========================================
// 設定
// ========================================
const ENCRYPTION_KEY = 'chuo-first-secret-key-2025';

// 承認済みメールアドレスリスト（暗号化）
const APPROVED_EMAILS_ENCRYPTED = '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';
// 党員専用ページ用メールアドレスリスト（暗号化）
const BLOG_ALLOWED_EMAILS_ENCRYPTED = 'AAAAAABUWUBARB9GJQYWEFlKRQIKQxxVVhsJGFkMRRMGX0FEH0BVUUIlEUkeSB4DVUNcGwYMWwVdSgoaBhsAQVVRQVVEGCsAHVgfVxxSEAZbCklIAwJfF0UGCk5AVUYeWlBJbVdURxgERhIcQ0gMFl0eXV8GCwcKWR9bV0ofBgByUAcdWAgDARocXRFJXQ8TXgYcWARISx0AAwEFUygQC1hLDlwUB0NdAAdcDwQBCA0MQh8CAgdQWURabQMNB14TAxQWDVwAEAMBFVVOWkVdGFFYR1wcVVwyFhBYXgJNFRYaAw4BV0dCHFFdFgdYXR1UWkJERG0WARZfAlpKGAtXSFYeWEU=';


// 申請フォームのURL
const REQUEST_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfPCE0NPFVj2zHACsSPznFX5ZFYuXsqeYDF_VXl_n7glEyiHg/viewform';

// ========================================
// 復号化関数
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

  // 認証画面を削除
  const loginScreen = document.getElementById('login-screen');
  if (loginScreen) loginScreen.remove();

  // bodyのスタイルをリセット
  document.body.style.cssText = '';
  document.body.style.setProperty('visibility', 'visible', 'important');
  document.body.classList.add('authorized');

  // 元のコンテンツを復元
  const wrapper = document.getElementById('original-content-wrapper');
  if (wrapper) {
    wrapper.style.display = '';
  }

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
// 承認メールアドレスチェック
// ========================================
function getApprovedEmails() {
  try {
    const decrypted = decryptContent(APPROVED_EMAILS_ENCRYPTED);
    return decrypted.split(',').map(e => e.trim().toLowerCase()).filter(e => e);
  } catch (e) {
    console.error('メールアドレスリスト復号化エラー:', e);
    return [];
  }
}

function isEmailApproved(email) {
  const approvedEmails = getApprovedEmails();
  const emailLower = email.toLowerCase().trim();
  
  return approvedEmails.includes(emailLower);
}

// ========================================
// 党員専用ページ用メールリストの復号
// ========================================
function getBlogAllowedEmails() {
  try {
    const decrypted = decryptContent(BLOG_ALLOWED_EMAILS_ENCRYPTED);
    return decrypted
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(e => e);
  } catch (e) {
    console.error('党員専用ページメールリスト復号化エラー:', e);
    return [];
  }
}

// ========================================
// ログイン画面
// ========================================
function showLoginScreen() {
  // bodyのコンテンツを完全に隠す
  document.body.style.cssText = `
    visibility: visible !important;
    overflow: hidden !important;
    position: fixed !important;
    width: 100% !important;
    height: 100% !important;
  `;

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
    z-index: 999999;
  `;

  loginDiv.innerHTML = `
    <div style="width: 400px; height: 100px; margin-bottom: 40px; display: flex; align-items: center; justify-content: center;">
      <div id="logo-placeholder-login" style="color: white; font-size: 1.5em; font-weight: bold;">中央中等生ファーストの会</div>
    </div>
    <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); max-width: 500px;">
      <h2 style="margin: 0 0 20px 0; color: #333;">ログイン</h2>
      <p style="margin: 0 0 30px 0; color: #666;">メールアドレスを入力してください。</p>
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
      <div id="login-status" style="margin-top: 20px; text-align: center; color: #999; font-size: 0.9em;"></div>
      <div id="request-link" style="margin-top: 20px; text-align: center; display: none;">
        <p style="color: #666; margin-bottom: 10px;">アクセス権限がありません。</p>
        <a href="${REQUEST_FORM_URL}" target="_blank" style="
          display: inline-block;
          background: #ccc;
          color: #666;
          padding: 10px 20px;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.3s ease;
        " onmouseover="this.style.background='#bbb'" onmouseout="this.style.background='#ccc'">
          アクセス申請フォームへ
        </a>
      </div>
    </div>
  `;

  document.documentElement.appendChild(loginDiv);

  // bodyの内容を隠す（認証画面は除く）
  if (!document.body.hasAttribute('data-original-content')) {
    document.body.setAttribute('data-original-content', 'true');
    const wrapper = document.createElement('div');
    wrapper.id = 'original-content-wrapper';
    wrapper.style.display = 'none';
    while (document.body.firstChild) {
      wrapper.appendChild(document.body.firstChild);
    }
    document.body.appendChild(wrapper);
  }

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
  const requestLink = document.getElementById('request-link');

loginBtn.addEventListener('click', () => {
  const raw = document.getElementById('login-email-input').value;
  const email = raw.trim().toLowerCase();
  
  if (!email) {
    statusDiv.textContent = 'メールアドレスを入力してください';
    statusDiv.style.color = '#dc3545';
    return;
  }

  // メールアドレスの形式チェック
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    statusDiv.textContent = '正しいメールアドレスを入力してください';
    statusDiv.style.color = '#dc3545';
    return;
  }

  const approved = isEmailApproved(email);              // サイト全体OK？
  const blogAllowedList = getBlogAllowedEmails();       // 党員OKリスト
  const canBlog = blogAllowedList.includes(email);      // blog OK？

  if (!approved) {
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_can_blog');
    window.location.href = REQUEST_FORM_URL;
    return;
  }

  localStorage.setItem('user_email', email);
  localStorage.setItem('user_can_blog', canBlog ? '1' : '0');

  statusDiv.textContent = canBlog
    ? '✅ ログインしました'
    : '✅ ログインしました';
  statusDiv.style.color = '#28a745';
  
  setTimeout(() => {
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) {
      loginScreen.remove();
    }
    showDecryptedContent();
  }, 500);
});

  // Enterキーでログイン
  document.getElementById('login-email-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      loginBtn.click();
    }
  });
}

// ========================================
// 認証チェック
// ========================================
function checkAuth() {
  const savedEmailRaw = localStorage.getItem('user_email');
  const savedEmail = savedEmailRaw ? savedEmailRaw.toLowerCase().trim() : '';

  if (savedEmail && isEmailApproved(savedEmail)) {
    const blogAllowedList = getBlogAllowedEmails();
    const canBlog = blogAllowedList.includes(savedEmail);
    localStorage.setItem('user_email', savedEmail);
    localStorage.setItem('user_can_blog', canBlog ? '1' : '0');

    // いま開いているページが blog.html かどうかを判定
    const path = window.location.pathname || '';
    const isBlogPage = path.endsWith('/blog.html') || path.endsWith('blog.html');

    // blog.html なのに blog 権限がない人 → 中身を見せずに即リダイレクト
    if (isBlogPage && !canBlog) {
      window.location.replace('cantsee.html');
      return;
    }

    // それ以外 → 普通にコンテンツ表示
    showDecryptedContent();
    return;
  }

  if (savedEmail && !isEmailApproved(savedEmail)) {
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_can_blog');
  }

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
