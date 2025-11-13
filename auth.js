// ========================================
// 設定
// ========================================
const ENCRYPTION_KEY = 'chuo-first-secret-key-2025';

// 承認済みドメインリスト（暗号化）
const APPROVED_DOMAINS_ENCRYPTED = 'QRlDDx5BWhkZABEEDUFYAh0dSRIXVgA=';

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
// 承認ドメインチェック
// ========================================
function getApprovedDomains() {
  try {
    const decrypted = decryptContent(APPROVED_DOMAINS_ENCRYPTED);
    return decrypted.split(',').map(d => d.trim()).filter(d => d);
  } catch (e) {
    console.error('ドメインリスト復号化エラー:', e);
    return [];
  }
}

function isEmailApproved(email) {
  const approvedDomains = getApprovedDomains();
  const emailLower = email.toLowerCase().trim();
  
  for (const domain of approvedDomains) {
    if (emailLower.endsWith(domain.toLowerCase())) {
      return true;
    }
  }
  return false;
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
    const email = document.getElementById('login-email-input').value.trim().toLowerCase();
    
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

    // 承認チェック
    if (isEmailApproved(email)) {
      // 承認済み
      localStorage.setItem('user_email', email);
      statusDiv.textContent = '✅ ログインしました';
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
      statusDiv.textContent = '';
      requestLink.style.display = 'block';
    }
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
  const savedEmail = localStorage.getItem('user_email');
  
  if (savedEmail && isEmailApproved(savedEmail)) {
    // 保存されたメールアドレスが承認済み
    showDecryptedContent();
    return;
  }
  
  // 未承認または初回アクセス
  if (savedEmail && !isEmailApproved(savedEmail)) {
    // 以前は承認されていたが、現在は未承認
    localStorage.removeItem('user_email');
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
