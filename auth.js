// ========================================
// 設定
// ========================================
const ENCRYPTION_KEY = 'chuo-first-secret-key-2025';

// 承認済みメールアドレスリスト（暗号化）→ レベル1以上
const APPROVED_EMAILS_ENCRYPTED = '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';

// 党員専用ページ用メールアドレスリスト（暗号化）→ レベル3
const BLOG_ALLOWED_EMAILS_ENCRYPTED = 'AAAAAABUWUBARB9GJQYWEFlKRQIKQxxVVhsJGFkMRRMGX0FEH0BVUUIlEUkeSB4DVUNcGwYMWwVdSgoaBhsAQVVRQVVEGCsAHVgfVxxSEAZbCklIAwJfF0UGCk5AVUYeWlBJbVdURxgERhIcQ0gMFl0eXV8GCwcKWR9bV0ofBgByUAcdWAgDARocXRFJXQ8TXgYcWARISx0AAwEFUygQC1hLDlwUB0NdAAdcDwQBCA0MQh8CAgdQWURabQMNB14TAxQWDVwAEAMBFVVOWkVdGFFYR1wcVVwyFhBYXgJNFRYaAw4BV0dCHFFdFgdYXR1UWkJERG0WARZfAlpKGAtXSFYeWEU=';

// レベル2（特別にスレッド利用可）※しばらく平文管理
const SPECIAL_THREAD_ACCESS = [
  'chuo-2023035@edu-g.gsn.ed.jp',
  'chuo-2023105@edu-g.gsn.ed.jp'
].map(e => e.toLowerCase().trim());

// 申請フォームのURL（承認リスト外ユーザー用）
const REQUEST_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeGNatochSVo3EmU0K2GB7IoAiHy5iMd3gOs0HnubaHgFyiIg/viewform';

// 党員用パスワード（暗号化済）
const PARTY_PASSWORD_ENCRYPTED = 'IAAAAEsPGwEH';

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

// 党員パスワード取得
function getPartyPassword() {
  return decryptContent(PARTY_PASSWORD_ENCRYPTED);
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

  const loginScreen = document.getElementById('login-screen');
  if (loginScreen) loginScreen.remove();

  document.body.style.cssText = '';
  document.body.style.setProperty('visibility', 'visible', 'important');
  document.body.classList.add('authorized');

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

    const SMALL_THRESHOLD = 60000;
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
// 党員専用ページ用メールリストの復号（レベル3）
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
        margin-bottom: 15px;
        box-sizing: border-box;
      ">
      <div id="password-block" style="margin-bottom: 20px; display: none;">
        <input type="password" id="login-password-input" placeholder="党員パスワード" style="
          width: 100%;
          padding: 15px;
          font-size: 1em;
          border: 2px solid #ddd;
          border-radius: 10px;
          box-sizing: border-box;
        ">
        <p style="font-size: 0.85em; color: #666; margin-top: 8px;">※党員のみ入力してください</p>
      </div>
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
  const emailInput = document.getElementById('login-email-input');
  const passwordBlock = document.getElementById('password-block');
  const passwordInput = document.getElementById('login-password-input');
  const requestLink = document.getElementById('request-link');

  loginBtn.addEventListener('click', () => {
    const raw = emailInput.value;
    const email = raw.trim().toLowerCase();
    
    statusDiv.textContent = '';
    statusDiv.style.color = '#999';
    requestLink.style.display = 'none';

    if (!email) {
      statusDiv.textContent = 'メールアドレスを入力してください';
      statusDiv.style.color = '#dc3545';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      statusDiv.textContent = '正しいメールアドレスを入力してください';
      statusDiv.style.color = '#dc3545';
      return;
    }

    const isApproved = isEmailApproved(email);
    const blogAllowedList = getBlogAllowedEmails();
    const isParty   = blogAllowedList.includes(email);
    const isSpecial = SPECIAL_THREAD_ACCESS.includes(email);

    if (!isApproved) {
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_can_blog');
      localStorage.removeItem('user_role');

      statusDiv.textContent = 'このメールアドレスにはアクセス権限がありません。フォームから申請してください。';
      statusDiv.style.color = '#dc3545';
      requestLink.style.display = 'block';
      window.open(REQUEST_FORM_URL, '_blank');
      return;
    }

    // 党員の場合はパスワード必須（暗号化された値と比較）
    if (isParty) {
      passwordBlock.style.display = 'block';
      const pwd = (passwordInput.value || '').trim();
      const realPwd = getPartyPassword();

      if (!pwd) {
        statusDiv.textContent = '党員の方はパスワードを入力してください';
        statusDiv.style.color = '#dc3545';
        return;
      }

      if (pwd !== realPwd) {
        statusDiv.textContent = 'パスワードが違います';
        statusDiv.style.color = '#dc3545';
        return;
      }
    } else {
      passwordBlock.style.display = 'none';
      passwordInput.value = '';
    }

    // ロール決定
    let role = '1';
    let roleLabel = '閲覧者';

    if (isParty) {
      role = '3';
      roleLabel = '党員';
    } else if (isSpecial) {
      role = '2';
      roleLabel = '閲覧者(スレッド投稿可)';
    }

    localStorage.setItem('user_email', email);
    localStorage.setItem('user_role', role);
    localStorage.setItem('user_can_blog', isParty ? '1' : '0');

    statusDiv.textContent = `✅ ${roleLabel}としてログインしました！`;
    statusDiv.style.color = '#28a745';
    
    setTimeout(() => {
      const loginScreen = document.getElementById('login-screen');
      if (loginScreen) {
        loginScreen.remove();
      }
      showDecryptedContent();
    }, 500);
  });

  emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      loginBtn.click();
    }
  });
  if (passwordInput) {
    passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        loginBtn.click();
      }
    });
  }

  // メール入力後に党員かどうかでパス欄の表示切り替え
  emailInput.addEventListener('blur', () => {
    const email = emailInput.value.trim().toLowerCase();
    if (!email) return;
    const blogAllowedList = getBlogAllowedEmails();
    const isParty = blogAllowedList.includes(email);
    passwordBlock.style.display = isParty ? 'block' : 'none';
    if (!isParty) {
      passwordInput.value = '';
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
    let role = localStorage.getItem('user_role');
    const blogAllowedList = getBlogAllowedEmails();
    const isParty   = blogAllowedList.includes(savedEmail);
    const isSpecial = SPECIAL_THREAD_ACCESS.includes(savedEmail);

    if (!role) {
      if (isParty) {
        role = '3';
      } else if (isSpecial) {
        role = '2';
      } else {
        role = '1';
      }
      localStorage.setItem('user_role', role);
    }

    localStorage.setItem('user_email', savedEmail);
    localStorage.setItem('user_can_blog', isParty ? '1' : '0');

    const path = window.location.pathname || '';
    const isBlog         = path.endsWith('/blog.html') || path.endsWith('blog.html');
    const isThread       = path.endsWith('/thread.html') || path.endsWith('thread.html');
    const isMemberThread = path.endsWith('/member_thread.html') || path.endsWith('member_thread.html');

    // blog.html / thread.html = レベル2 & 3のみ
    if ((isBlog || isThread) && role === '1') {
      window.location.replace('cantsee.html');
      return;
    }

    // member_thread.html = レベル3のみ
    if (isMemberThread && role !== '3') {
      window.location.replace('cantsee.html');
      return;
    }

    showDecryptedContent();
    return;
  }

  if (savedEmail && !isEmailApproved(savedEmail)) {
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_can_blog');
    localStorage.removeItem('user_role');
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
