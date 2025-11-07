// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyAEu-ZkQK6w1cGNSlMvtw3LywZ6qk1RtFs",
  authDomain: "chuo-first.web.app",
  projectId: "chuo-first",
  storageBucket: "chuo-first.firebasestorage.app",
  messagingSenderId: "230624885405",
  appId: "1:230624885405:web:1e04aabb0497bcec88b274",
  measurementId: "G-1CMQMZYMKG"
};

console.log('[AUTH] スクリプト開始');

// Firebase初期化
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

console.log('[AUTH] Firebaseインポート完了');

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log('[AUTH] Firebase初期化完了');

// 認証状態の永続化
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log('[AUTH] 永続化設定成功'))
  .catch((error) => console.error('[AUTH] 永続化設定エラー:', error));

const provider = new GoogleAuthProvider();

// 許可するドメイン
const ALLOWED_DOMAIN = '@edu-g.gsn.ed.jp';

// 暗号化キー
const ENCRYPTION_KEY = 'chuo-first-secret-key-2025';

// 実行制御フラグ
let authChecked = false;
let decryptionStarted = false;

// 即座にbodyを表示
document.body.style.visibility = 'visible';
console.log('[AUTH] body表示設定完了');

// 復号化関数（UTF-8対応）
function decryptContent(encrypted) {
  try {
    if (!encrypted) return '';
    if (typeof encrypted === 'string') {
      const s = encrypted.trim();
      if (s.startsWith('data:image/') || s.startsWith('http://') || s.startsWith('https://')) {
        return s;
      }
    }
    const decoded = atob(encrypted);
    const len = decoded.length;
    const decryptedBytes = new Uint8Array(len);
    const keyLen = ENCRYPTION_KEY.length;
    
    for (let i = 0; i < len; i++) {
      decryptedBytes[i] = decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % keyLen);
    }
    
    return new TextDecoder().decode(decryptedBytes);
  } catch (e) {
    console.error('[DECRYPT] 復号化エラー:', e);
    return '';
  }
}

// 復号化・表示処理
function showDecryptedContent() {
  if (decryptionStarted) {
    console.log('[DECRYPT] 既に復号化開始済み');
    return;
  }
  decryptionStarted = true;
  console.log('[DECRYPT] 復号化開始');

  try {
    // テキストノード処理
    const textNodes = document.querySelectorAll('[data-encrypted]');
    console.log(`[DECRYPT] テキストノード数: ${textNodes.length}`);
    
    textNodes.forEach((el, index) => {
      const encrypted = el.getAttribute('data-encrypted');
      if (encrypted) {
        el.textContent = decryptContent(encrypted);
        el.removeAttribute('data-encrypted');
      }
      if (index % 10 === 0) {
        console.log(`[DECRYPT] テキスト処理中: ${index}/${textNodes.length}`);
      }
    });

    console.log('[DECRYPT] テキスト処理完了');

    // 画像処理
    const imgNodes = document.querySelectorAll('[data-encrypted-src]');
    console.log(`[DECRYPT] 画像ノード数: ${imgNodes.length}`);
    
    imgNodes.forEach((el, index) => {
      const encrypted = el.getAttribute('data-encrypted-src');
      if (encrypted) {
        setTimeout(() => {
          const decrypted = decryptContent(encrypted);
          if (decrypted) {
            el.src = decrypted;
          }
          el.removeAttribute('data-encrypted-src');
          console.log(`[DECRYPT] 画像処理: ${index + 1}/${imgNodes.length}`);
        }, index * 10);
      }
    });

    console.log('[DECRYPT] 復号化完了');
  } catch (e) {
    console.error('[DECRYPT] 復号処理エラー:', e);
  }
}

// ログイン画面表示
function showLoginScreen() {
  console.log('[LOGIN] ログイン画面表示開始');
  
  const existingLoginScreen = document.getElementById('login-screen');
  if (existingLoginScreen) {
    console.log('[LOGIN] 既にログイン画面あり');
    return;
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

  document.body.appendChild(loginDiv);
  console.log('[LOGIN] ログイン画面表示完了');

  document.getElementById('google-login-btn').addEventListener('click', async () => {
    console.log('[LOGIN] ログインボタンクリック');
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('[LOGIN] ログイン成功:', result.user.email);
      
      const email = result.user.email;
      
      if (!email.endsWith(ALLOWED_DOMAIN)) {
        console.log('[LOGIN] ドメイン不一致');
        alert('アクセス権限がありません。指定のメールアドレスでログインしてください。');
        await signOut(auth);
        return;
      }
      
      console.log('[LOGIN] 認証成功、コンテンツ表示へ');
      const loginScreen = document.getElementById('login-screen');
      if (loginScreen) {
        loginScreen.remove();
      }
      showDecryptedContent();
    } catch (error) {
      console.error('[LOGIN] ログインエラー:', error);
      alert('ログインに失敗しました。もう一度お試しください。');
    }
  });
}

// 認証状態監視
console.log('[AUTH] 認証状態監視開始');
onAuthStateChanged(auth, (user) => {
  console.log('[AUTH] onAuthStateChanged呼び出し', user ? user.email : 'ユーザーなし');
  
  if (authChecked) {
    console.log('[AUTH] 既にチェック済み');
    return;
  }
  authChecked = true;

  if (user && user.email && user.email.endsWith(ALLOWED_DOMAIN)) {
    console.log('[AUTH] 認証済みユーザー、コンテンツ表示');
    showDecryptedContent();
  } else {
    console.log('[AUTH] 未認証、ログイン画面表示');
    if (user && user.email && !user.email.endsWith(ALLOWED_DOMAIN)) {
      console.log('[AUTH] ドメイン不一致でサインアウト');
      signOut(auth);
    }
    showLoginScreen();
  }
}, (error) => {
  console.error('[AUTH] 認証エラー:', error);
  showLoginScreen();
});

console.log('[AUTH] スクリプト終了');
