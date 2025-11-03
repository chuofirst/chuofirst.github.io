// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyAEu-ZkQK6w1cGNSlMvtw3LywZ6qk1RtFs",
  authDomain: "chuo-first.firebaseapp.com",
  projectId: "chuo-first",
  storageBucket: "chuo-first.firebasestorage.app",
  messagingSenderId: "230624885405",
  appId: "1:230624885405:web:1e04aabb0497bcec88b274",
  measurementId: "G-1CMQMZYMKG"
};

// Firebase初期化
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 許可するドメイン
const ALLOWED_DOMAIN = '@edu-g.gsn.ed.jp';

// 暗号化キー
const ENCRYPTION_KEY = 'chuo-first-secret-key-2025';

// ★ 二重実行ガード（復号＆表示）
let __DECRYPTION_RUNNING = false;
let __DECRYPTION_DONE = false;
// ★ onAuthStateChanged 重複ガード
let __AUTH_HANDLED = false;

// 復号化関数（UTF-8対応）
function decryptContent(encrypted) {
  try {
    // ★ 既に平文（Data URI / http/https）なら、そのまま返す
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
    // UTF-8デコード
    const decrypted = new TextDecoder().decode(decryptedBytes);
    return decrypted;
  } catch (e) {
    console.error('復号化エラー:', e);
    return '';
  }
}

// 暗号化されたコンテンツを復号化して表示
function showDecryptedContent() {
  // ★ 二重実行と同時実行を抑止
  if (__DECRYPTION_DONE || __DECRYPTION_RUNNING) return;
  __DECRYPTION_RUNNING = true;

  try {
    // テキストコンテンツの復号化
    const encryptedElements = document.querySelectorAll('[data-encrypted]');
    encryptedElements.forEach(element => {
      const encrypted = element.getAttribute('data-encrypted');
      const decrypted = decryptContent(encrypted);
      if (decrypted) {
        element.textContent = decrypted;
        element.removeAttribute('data-encrypted');
      }
    });

    // 画像の復号化
    const encryptedImages = document.querySelectorAll('[data-encrypted-src]');
    encryptedImages.forEach(img => {
      const encrypted = img.getAttribute('data-encrypted-src');
      const decrypted = decryptContent(encrypted);
      if (decrypted) {
        img.src = decrypted;
        img.removeAttribute('data-encrypted-src');
      }
    });

    // コンテンツを表示
    document.body.style.visibility = 'visible';
    __DECRYPTION_DONE = true; // ★ 完了フラグ
  } finally {
    __DECRYPTION_RUNNING = false; // ★ 実行中フラグ解除
  }
}

// 認証状態チェック
const unsubscribe = onAuthStateChanged(auth, (user) => {
  // ★ 既に処理済みなら何もしない（多重発火防止）
  if (__AUTH_HANDLED) return;

  if (user) {
    const email = user.email;
    if (email.endsWith(ALLOWED_DOMAIN)) {
      const loginScreen = document.getElementById('login-screen');
      if (loginScreen) {
        loginScreen.remove();
      }
      showDecryptedContent();
      __AUTH_HANDLED = true; // ★ ハンドル済み
      // ★ 以降の発火は不要なので解除
      if (typeof unsubscribe === 'function') unsubscribe();
    } else {
      alert('アクセス権限がありません。@edu-g.gsn.ed.jp のメールアドレスでログインしてください。');
      signOut(auth);
      showLoginScreen();
    }
  } else {
    showLoginScreen();
  }
});

// ログイン画面表示
function showLoginScreen() {
  document.body.style.visibility = 'hidden';

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
    <img src="ChuoFirst.png" alt="中央中等生ファーストの会" style="max-width: 400px; margin-bottom: 40px;">
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
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Googleでログイン
    </button>
    <p style="color: white; margin-top: 30px; font-size: 1.1em; font-weight: 600;">
      @edu-g.gsn.ed.jp のアカウントでログインしてください
    </p>
  `;

  document.documentElement.appendChild(loginDiv);

  document.getElementById('google-login-btn').addEventListener('click', async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('ログインエラー:', error);
      alert('ログインに失敗しました。もう一度お試しください。');
    }
  });
}

// 初期状態
document.body.style.visibility = 'hidden';
