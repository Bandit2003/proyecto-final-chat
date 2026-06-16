/**
 * ChatFlow — app.js
 * Firebase Auth + Firestore | Cloudinary Storage (gratuito)
 */

// ============================================================
// 🔥 FIREBASE IMPORTS — Solo Auth y Firestore (ambos GRATIS)
// ============================================================
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
  doc,
  setDoc
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// ============================================================
// ⚙️ CONFIG
// ============================================================
import { firebaseConfig, cloudinaryConfig } from './firebase-config.js';

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// ============================================================
// 🌎 CÓDIGOS DE PAÍS
// ============================================================
const COUNTRIES = [
  { flag:'🇦🇷', name:'Argentina',            code:'+54'  },
  { flag:'🇦🇺', name:'Australia',             code:'+61'  },
  { flag:'🇦🇹', name:'Austria',              code:'+43'  },
  { flag:'🇧🇪', name:'Bélgica',              code:'+32'  },
  { flag:'🇧🇴', name:'Bolivia',              code:'+591' },
  { flag:'🇧🇷', name:'Brasil',               code:'+55'  },
  { flag:'🇨🇦', name:'Canadá',              code:'+1'   },
  { flag:'🇨🇱', name:'Chile',                code:'+56'  },
  { flag:'🇨🇳', name:'China',                code:'+86'  },
  { flag:'🇨🇴', name:'Colombia',             code:'+57'  },
  { flag:'🇰🇷', name:'Corea del Sur',        code:'+82'  },
  { flag:'🇨🇷', name:'Costa Rica',           code:'+506' },
  { flag:'🇨🇺', name:'Cuba',                 code:'+53'  },
  { flag:'🇩🇰', name:'Dinamarca',            code:'+45'  },
  { flag:'🇩🇴', name:'Rep. Dominicana',      code:'+1809'},
  { flag:'🇪🇨', name:'Ecuador',              code:'+593' },
  { flag:'🇪🇬', name:'Egipto',               code:'+20'  },
  { flag:'🇸🇻', name:'El Salvador',          code:'+503' },
  { flag:'🇦🇪', name:'Emiratos Árabes',      code:'+971' },
  { flag:'🇪🇸', name:'España',               code:'+34'  },
  { flag:'🇺🇸', name:'Estados Unidos',       code:'+1'   },
  { flag:'🇫🇮', name:'Finlandia',            code:'+358' },
  { flag:'🇫🇷', name:'Francia',              code:'+33'  },
  { flag:'🇬🇷', name:'Grecia',               code:'+30'  },
  { flag:'🇬🇹', name:'Guatemala',            code:'+502' },
  { flag:'🇭🇳', name:'Honduras',             code:'+504' },
  { flag:'🇭🇺', name:'Hungría',              code:'+36'  },
  { flag:'🇮🇳', name:'India',                code:'+91'  },
  { flag:'🇮🇩', name:'Indonesia',            code:'+62'  },
  { flag:'🇮🇱', name:'Israel',               code:'+972' },
  { flag:'🇮🇹', name:'Italia',               code:'+39'  },
  { flag:'🇯🇵', name:'Japón',                code:'+81'  },
  { flag:'🇰🇪', name:'Kenia',                code:'+254' },
  { flag:'🇲🇾', name:'Malasia',              code:'+60'  },
  { flag:'🇲🇽', name:'México',               code:'+52'  },
  { flag:'🇳🇮', name:'Nicaragua',            code:'+505' },
  { flag:'🇳🇬', name:'Nigeria',              code:'+234' },
  { flag:'🇳🇴', name:'Noruega',              code:'+47'  },
  { flag:'🇳🇿', name:'Nueva Zelanda',        code:'+64'  },
  { flag:'🇵🇦', name:'Panamá',              code:'+507' },
  { flag:'🇵🇾', name:'Paraguay',             code:'+595' },
  { flag:'🇵🇪', name:'Perú',                 code:'+51'  },
  { flag:'🇵🇭', name:'Filipinas',            code:'+63'  },
  { flag:'🇵🇱', name:'Polonia',              code:'+48'  },
  { flag:'🇵🇹', name:'Portugal',             code:'+351' },
  { flag:'🇵🇷', name:'Puerto Rico',          code:'+1787'},
  { flag:'🇬🇧', name:'Reino Unido',          code:'+44'  },
  { flag:'🇨🇿', name:'Rep. Checa',           code:'+420' },
  { flag:'🇷🇴', name:'Rumania',              code:'+40'  },
  { flag:'🇷🇺', name:'Rusia',                code:'+7'   },
  { flag:'🇸🇦', name:'Arabia Saudita',       code:'+966' },
  { flag:'🇸🇬', name:'Singapur',             code:'+65'  },
  { flag:'🇿🇦', name:'Sudáfrica',            code:'+27'  },
  { flag:'🇸🇪', name:'Suecia',               code:'+46'  },
  { flag:'🇨🇭', name:'Suiza',                code:'+41'  },
  { flag:'🇹🇭', name:'Tailandia',            code:'+66'  },
  { flag:'🇹🇷', name:'Turquía',              code:'+90'  },
  { flag:'🇺🇦', name:'Ucrania',              code:'+380' },
  { flag:'🇺🇾', name:'Uruguay',              code:'+598' },
  { flag:'🇻🇪', name:'Venezuela',            code:'+58'  },
  { flag:'🇻🇳', name:'Vietnam',              code:'+84'  },
  { flag:'🇭🇹', name:'Haití',                code:'+509' },
  { flag:'🇳🇱', name:'Países Bajos',         code:'+31'  },
];

// ============================================================
// 📌 ESTADO GLOBAL
// ============================================================
let currentUser     = null;
let currentRoomId   = null;
let unsubMessages   = null;
let unsubRooms      = null;
let pendingFile     = null; // { file, type: 'image'|'file' }
let isRecording     = false;
let mediaRecorder   = null;
let audioChunks     = [];
let recInterval     = null;
let recSeconds      = 0;
let lastSenderId    = null;

// ============================================================
// 📍 REFERENCIAS DOM
// ============================================================
const authScreen       = document.getElementById('auth-screen');
const chatScreen       = document.getElementById('chat-screen');
const tabLogin         = document.getElementById('tab-login');
const tabRegister      = document.getElementById('tab-register');
const loginForm        = document.getElementById('login-form');
const registerForm     = document.getElementById('register-form');
const loginEmail       = document.getElementById('login-email');
const loginPassword    = document.getElementById('login-password');
const loginError       = document.getElementById('login-error');
const loginSubmitBtn   = document.getElementById('login-submit-btn');
const forgotBtn        = document.getElementById('forgot-password-btn');
const regName          = document.getElementById('reg-name');
const regUsername      = document.getElementById('reg-username');
const regEmail         = document.getElementById('reg-email');
const regPassword      = document.getElementById('reg-password');
const regConfirmPwd    = document.getElementById('reg-confirm-password');
const regPhone         = document.getElementById('reg-phone');
const countrySelect    = document.getElementById('country-code-select');
const regBirthday      = document.getElementById('reg-birthday');
const regAvatar        = document.getElementById('reg-avatar');
const avatarPreview    = document.getElementById('avatar-preview-wrapper');
const registerError    = document.getElementById('register-error');
const registerSubmitBtn = document.getElementById('register-submit-btn');

const sidebarEl        = document.getElementById('sidebar');
const sidebarAvatar    = document.getElementById('sidebar-avatar');
const sidebarAvatarTxt = document.getElementById('sidebar-avatar-text');
const sidebarName      = document.getElementById('sidebar-username');
const logoutBtn        = document.getElementById('logout-btn');
const roomsList        = document.getElementById('rooms-list');
const createRoomBtn    = document.getElementById('create-room-btn');
const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
const sidebarOverlay   = document.getElementById('sidebar-overlay');

const welcomeScreen     = document.getElementById('welcome-screen');
const chatRoomArea      = document.getElementById('chat-room-area');
const messagesEl        = document.getElementById('messages-container');
const currentRoomNameEl = document.getElementById('current-room-name');
const currentRoomDescEl = document.getElementById('current-room-desc');
const headerRoomIcon    = document.getElementById('header-room-icon');
const welcomeCreateBtn  = document.getElementById('welcome-create-btn');

const messageInput    = document.getElementById('message-input');
const sendMsgBtn      = document.getElementById('send-message-btn');
const photoInput      = document.getElementById('photo-input');
const fileInput       = document.getElementById('file-input');
const emojiBtn        = document.getElementById('emoji-btn');
const emojiPickerWrap = document.getElementById('emoji-picker-wrapper');
const emojiPicker     = document.getElementById('emoji-picker');
const audioRecordBtn  = document.getElementById('audio-record-btn');

const filePreviewBar  = document.getElementById('file-preview-bar');
const fpIcon          = document.getElementById('fp-icon');
const fpName          = document.getElementById('fp-name');
const fpSize          = document.getElementById('fp-size');
const cancelFileBtn   = document.getElementById('cancel-file-btn');
const recordingBar    = document.getElementById('recording-bar');
const recordingTime   = document.getElementById('recording-time');
const cancelAudioBtn  = document.getElementById('cancel-audio-btn');
const sendAudioBtn    = document.getElementById('send-audio-btn');
const uploadIndicator = document.getElementById('upload-indicator');
const uploadBarFill   = document.getElementById('upload-bar-fill');
const uploadPercent   = document.getElementById('upload-percent');
const uploadLabel     = document.getElementById('upload-label');

const createRoomModal   = document.getElementById('create-room-modal');
const createRoomForm    = document.getElementById('create-room-form');
const roomNameInput     = document.getElementById('room-name-input');
const roomDescInput     = document.getElementById('room-desc-input');
const cancelRoomBtn     = document.getElementById('cancel-room-btn');
const radioPublicLabel  = document.getElementById('radio-public-label');
const radioPrivateLabel = document.getElementById('radio-private-label');

const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const toastContainer = document.getElementById('toast-container');

// ============================================================
// 🌍 CÓDIGOS DE PAÍS — Inicializar select
// ============================================================
function populateCountryCodes() {
  COUNTRIES.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.code;
    opt.textContent = `${c.flag} ${c.name} (${c.code})`;
    countrySelect.appendChild(opt);
  });
  const veIdx = COUNTRIES.findIndex(c => c.name === 'Venezuela');
  if (veIdx >= 0) countrySelect.selectedIndex = veIdx;
}

// ============================================================
// 🔐 AUTH — Escuchar cambios de sesión
// ============================================================
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    await enterChat(user);
  } else {
    currentUser = null;
    showAuthScreen();
  }
});

function showAuthScreen() {
  authScreen.style.display = 'flex';
  chatScreen.style.display = 'none';
  if (unsubRooms)    { unsubRooms();    unsubRooms = null; }
  if (unsubMessages) { unsubMessages(); unsubMessages = null; }
}

async function enterChat(user) {
  authScreen.style.display = 'none';
  chatScreen.style.display = 'flex';

  const name = user.displayName || user.email.split('@')[0];
  sidebarName.textContent      = name;
  sidebarAvatarTxt.textContent = name.charAt(0).toUpperCase();

  if (user.photoURL) {
    const img = document.createElement('img');
    img.src = user.photoURL;
    img.alt = name;
    sidebarAvatar.innerHTML = '';
    sidebarAvatar.appendChild(img);
  }

  loadRooms();
}

// ============================================================
// 📝 TABS Login / Register
// ============================================================
tabLogin.addEventListener('click', () => {
  tabLogin.classList.add('active');
  tabRegister.classList.remove('active');
  loginForm.style.display    = 'flex';
  registerForm.style.display = 'none';
  clearErrors();
});

tabRegister.addEventListener('click', () => {
  tabRegister.classList.add('active');
  tabLogin.classList.remove('active');
  registerForm.style.display = 'flex';
  loginForm.style.display    = 'none';
  clearErrors();
});

function clearErrors() {
  loginError.classList.remove('show');
  registerError.classList.remove('show');
}

document.querySelectorAll('.toggle-pwd-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
    btn.textContent = input.type === 'password' ? '👁️' : '🙈';
  });
});

// ============================================================
// 🔑 LOGIN
// ============================================================
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = loginEmail.value.trim();
  const pwd   = loginPassword.value;
  if (!email || !pwd) return showAuthError(loginError, 'Completa todos los campos.');

  setLoading(loginSubmitBtn, true);
  try {
    await signInWithEmailAndPassword(auth, email, pwd);
  } catch (err) {
    showAuthError(loginError, translateAuthError(err.code));
    setLoading(loginSubmitBtn, false);
  }
});

// ============================================================
// 📬 OLVIDÉ CONTRASEÑA
// ============================================================
forgotBtn.addEventListener('click', async () => {
  const email = loginEmail.value.trim();
  if (!email) return showAuthError(loginError, 'Ingresa tu correo primero.');
  try {
    await sendPasswordResetEmail(auth, email);
    showToast('📧 Correo de recuperación enviado.', 'success');
  } catch (err) {
    showAuthError(loginError, translateAuthError(err.code));
  }
});

// ============================================================
// 📝 REGISTRO
// ============================================================
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name       = regName.value.trim();
  const username   = regUsername.value.trim();
  const email      = regEmail.value.trim();
  const pwd        = regPassword.value;
  const confirmPwd = regConfirmPwd.value;
  const phone      = regPhone.value.trim();
  const birthday   = regBirthday.value;

  if (!name || !username || !email || !pwd || !confirmPwd)
    return showAuthError(registerError, 'Completa todos los campos obligatorios (*).');
  if (pwd !== confirmPwd)
    return showAuthError(registerError, 'Las contraseñas no coinciden.');
  if (pwd.length < 6)
    return showAuthError(registerError, 'La contraseña debe tener al menos 6 caracteres.');

  setLoading(registerSubmitBtn, true);

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pwd);
    const user = cred.user;

    // Subir avatar a Cloudinary si se seleccionó
    let photoURL = '';
    if (regAvatar.files[0]) {
      try {
        photoURL = await uploadToCloudinary(regAvatar.files[0], 'avatars');
      } catch (_) { /* no fatal */ }
    }

    await updateProfile(user, { displayName: name, photoURL });

    await setDoc(doc(db, 'users', user.uid), {
      uid:         user.uid,
      displayName: name,
      username,
      email,
      phone:    phone ? `${countrySelect.value} ${phone}` : '',
      birthday: birthday || '',
      photoURL: photoURL || '',
      createdAt: serverTimestamp()
    });

  } catch (err) {
    showAuthError(registerError, translateAuthError(err.code));
    setLoading(registerSubmitBtn, false);
  }
});

// ============================================================
// 🚪 LOGOUT
// ============================================================
logoutBtn.addEventListener('click', async () => {
  if (unsubMessages) { unsubMessages(); unsubMessages = null; }
  if (unsubRooms)    { unsubRooms();    unsubRooms = null; }
  currentRoomId = null;
  welcomeScreen.style.display = 'flex';
  chatRoomArea.style.display  = 'none';
  await signOut(auth);
});

// ============================================================
// 🖼️ PREVIEW DE AVATAR EN REGISTRO
// ============================================================
regAvatar.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showToast('❌ La foto no puede superar 5MB.', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = (ev) => {
    avatarPreview.innerHTML = `<img src="${ev.target.result}" alt="Preview" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
  };
  reader.readAsDataURL(file);
});
avatarPreview.addEventListener('click', () => regAvatar.click());

// ============================================================
// 🏠 SALAS — Tiempo real con Firestore
// ============================================================
function loadRooms() {
  if (unsubRooms) unsubRooms();

  const q = query(collection(db, 'rooms'), orderBy('createdAt', 'asc'));

  unsubRooms = onSnapshot(q,
    (snapshot) => {
      roomsList.innerHTML = '';
      if (snapshot.empty) {
        const hint = document.createElement('div');
        hint.style.cssText = 'padding:16px;font-size:12px;color:var(--text-3);text-align:center;line-height:1.6;';
        hint.textContent = '¡No hay salas aún! Crea la primera.';
        roomsList.appendChild(hint);
        return;
      }
      snapshot.forEach(snap => renderRoomItem({ id: snap.id, ...snap.data() }));
    },
    (err) => {
      console.error('Firestore rooms error:', err.code, err.message);
      if (err.code === 'permission-denied') {
        showToast('⚠️ Reglas de Firestore bloqueando. Actualiza las reglas (ver consola).', 'error');
      } else {
        showToast('Error al cargar salas: ' + err.message, 'error');
      }
    }
  );
}

function renderRoomItem(room) {
  const item = document.createElement('div');
  item.className = `room-item${room.id === currentRoomId ? ' active' : ''}${room.type === 'private' ? ' private' : ''}`;
  item.dataset.roomId = room.id;
  item.setAttribute('role', 'button');
  item.setAttribute('tabindex', '0');
  item.setAttribute('aria-label', `Sala ${room.name}`);
  item.innerHTML = `
    <span class="room-hash">${room.type === 'private' ? '🔒' : '#'}</span>
    <span class="room-name">${escHtml(room.name)}</span>
  `;
  item.addEventListener('click', () => {
    selectRoom(room.id, room.name, room.description || '', room.type);
    closeSidebarMobile();
  });
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
  });
  roomsList.appendChild(item);
}

// ============================================================
// 🚀 SELECCIONAR SALA
// ============================================================
function selectRoom(roomId, name, desc, type) {
  if (currentRoomId === roomId) return;
  if (unsubMessages) { unsubMessages(); unsubMessages = null; }

  currentRoomId = roomId;
  lastSenderId  = null;

  welcomeScreen.style.display  = 'none';
  chatRoomArea.style.display   = 'flex';
  currentRoomNameEl.textContent = name;
  currentRoomDescEl.textContent = desc || 'Sala de chat';
  headerRoomIcon.textContent    = type === 'private' ? '🔒' : '#';

  document.querySelectorAll('.room-item').forEach(el => {
    el.classList.toggle('active', el.dataset.roomId === roomId);
  });

  // Limpiar mensajes
  Array.from(messagesEl.children).forEach(el => {
    if (!el.classList.contains('messages-start-spacer')) el.remove();
  });

  appendSystemMsg(`Bienvenido a #${name}`);
  loadMessages(roomId);
}

// ============================================================
// 💬 MENSAJES — Tiempo real
// ============================================================
function loadMessages(roomId) {
  const q = query(
    collection(db, 'rooms', roomId, 'messages'),
    orderBy('timestamp', 'asc'),
    limit(80)
  );

  unsubMessages = onSnapshot(q,
    (snapshot) => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') renderMessage({ id: change.doc.id, ...change.doc.data() });
      });
      scrollBottom();
    },
    (err) => {
      console.error('Messages error:', err.code);
    }
  );
}

// ============================================================
// 🎨 RENDERIZAR MENSAJE
// ============================================================
function renderMessage(msg) {
  const isSelf    = msg.sender?.uid === currentUser?.uid;
  const isGrouped = msg.sender?.uid === lastSenderId;
  lastSenderId    = msg.sender?.uid;

  const wrap = document.createElement('div');
  wrap.className = `msg-wrapper${isSelf ? ' sent' : ' received'}${isGrouped ? ' grouped' : ''}`;

  const av = document.createElement('div');
  av.className = `msg-avatar${isGrouped ? ' hidden' : ''}`;
  if (msg.sender?.photoURL) {
    av.innerHTML = `<img src="${msg.sender.photoURL}" alt="${escHtml(msg.sender.displayName || 'U')}">`;
  } else {
    av.textContent = (msg.sender?.displayName || 'U').charAt(0).toUpperCase();
  }

  const body = document.createElement('div');
  body.className = 'msg-body';

  if (!isGrouped && !isSelf) {
    const sn = document.createElement('div');
    sn.className  = 'msg-sender';
    sn.textContent = msg.sender?.displayName || 'Usuario';
    body.appendChild(sn);
  }

  let content;
  switch (msg.type) {
    case 'image': {
      content = document.createElement('div');
      content.className = 'msg-image msg-bubble';
      content.style.cssText = 'padding:0;overflow:hidden;cursor:zoom-in;';
      const img = document.createElement('img');
      img.src = msg.fileUrl;
      img.alt = 'Imagen';
      img.loading = 'lazy';
      img.style.cssText = 'width:100%;display:block;border-radius:inherit;';
      img.addEventListener('click', () => openLightbox(msg.fileUrl));
      content.appendChild(img);
      break;
    }
    case 'file': {
      content = document.createElement('a');
      content.className = 'msg-file';
      content.href = msg.fileUrl;
      content.target = '_blank';
      content.rel = 'noopener noreferrer';
      content.innerHTML = `
        <div class="file-icon-badge">${fileIcon(msg.mimeType)}</div>
        <div class="file-info">
          <div class="file-name">${escHtml(msg.fileName || 'Archivo')}</div>
          <div class="file-size">${fmtBytes(msg.fileSize || 0)}</div>
        </div>
        <span style="font-size:18px;color:var(--accent)">⬇️</span>
      `;
      break;
    }
    case 'audio': {
      content = document.createElement('div');
      content.className = 'msg-bubble msg-audio-player';
      content.innerHTML = `
        <span style="font-size:20px;">🎙️</span>
        <audio controls preload="metadata" style="flex:1;height:32px;">
          <source src="${msg.fileUrl}" type="${msg.mimeType || 'audio/webm'}">
        </audio>
      `;
      break;
    }
    default: {
      content = document.createElement('div');
      content.className = 'msg-bubble';
      content.textContent = msg.content || '';
    }
  }

  body.appendChild(content);

  const ts = document.createElement('div');
  ts.className  = 'msg-time';
  ts.textContent = fmtTime(msg.timestamp);
  body.appendChild(ts);

  wrap.appendChild(av);
  wrap.appendChild(body);
  messagesEl.appendChild(wrap);
}

function appendSystemMsg(text) {
  const el = document.createElement('div');
  el.className  = 'system-msg';
  el.textContent = text;
  messagesEl.appendChild(el);
}

function scrollBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// ============================================================
// ✉️ ENVIAR (unificado — texto o archivo)
// ============================================================
async function handleSend() {
  if (!currentRoomId) {
    showToast('⚠️ Selecciona una sala primero.', 'info');
    return;
  }

  if (pendingFile) {
    await sendFileMessage();
    return;
  }

  const content = messageInput.value.trim();
  if (!content) return;

  messageInput.value = '';
  autoResizeTA();

  try {
    await addDoc(collection(db, 'rooms', currentRoomId, 'messages'), {
      type: 'text',
      content,
      sender: senderInfo(),
      timestamp: serverTimestamp()
    });
  } catch (err) {
    console.error('Send error:', err);
    showToast('Error al enviar. Comprueba tu conexión.', 'error');
  }
}

sendMsgBtn.addEventListener('click', handleSend);
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
});

function autoResizeTA() {
  messageInput.style.height = 'auto';
  messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
}
messageInput.addEventListener('input', autoResizeTA);

function senderInfo() {
  return {
    uid:         currentUser.uid,
    displayName: currentUser.displayName || currentUser.email,
    photoURL:    currentUser.photoURL || ''
  };
}

// ============================================================
// 📁 ARCHIVOS — Foto y general
// ============================================================
photoInput.addEventListener('change', (e) => fileSelected(e.target.files[0], 'image'));
fileInput.addEventListener('change',  (e) => fileSelected(e.target.files[0], 'file'));

function fileSelected(file, type) {
  if (!file) return;
  const max = type === 'image' ? 10 * 1024 * 1024 : 25 * 1024 * 1024;
  if (file.size > max) {
    showToast(`❌ El archivo supera el límite (${type === 'image' ? '10MB' : '25MB'}).`, 'error');
    return;
  }
  pendingFile = { file, type };
  showFileBar(file, type);
}

function showFileBar(file, type) {
  filePreviewBar.style.display = 'flex';
  fpName.textContent = file.name;
  fpSize.textContent = fmtBytes(file.size);
  fpIcon.innerHTML   = '';
  if (type === 'image') {
    const thumb = document.createElement('img');
    thumb.className = 'file-preview-thumb';
    thumb.alt = 'Preview';
    const r = new FileReader();
    r.onload = ev => { thumb.src = ev.target.result; };
    r.readAsDataURL(file);
    fpIcon.appendChild(thumb);
  } else {
    fpIcon.textContent = fileIcon(file.type);
  }
}

cancelFileBtn.addEventListener('click', () => {
  pendingFile = null;
  filePreviewBar.style.display = 'none';
  photoInput.value = '';
  fileInput.value  = '';
});

async function sendFileMessage() {
  if (!pendingFile || !currentRoomId) return;
  const { file, type } = pendingFile;

  pendingFile = null;
  filePreviewBar.style.display = 'none';
  photoInput.value = '';
  fileInput.value  = '';

  const folder = `rooms/${currentRoomId}/${type === 'image' ? 'images' : 'files'}`;
  showUpload(type === 'image' ? '📷 Subiendo imagen…' : '📎 Subiendo archivo…');

  try {
    const fileUrl = await uploadToCloudinary(file, folder, updateUpload);
    hideUpload();

    await addDoc(collection(db, 'rooms', currentRoomId, 'messages'), {
      type:     type === 'image' ? 'image' : 'file',
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      sender:    senderInfo(),
      timestamp: serverTimestamp()
    });
  } catch (err) {
    hideUpload();
    showToast(`❌ Error al subir: ${err.message}`, 'error');
    console.error(err);
  }
}

// ============================================================
// 🎙️ GRABACIÓN DE AUDIO
// ============================================================
audioRecordBtn.addEventListener('click', () => {
  isRecording ? stopRecording() : startRecording();
});

async function startRecording() {
  if (!navigator.mediaDevices?.getUserMedia) {
    showToast('❌ Tu navegador no soporta grabación de audio.', 'error');
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream, { mimeType: supportedAudioMime() });
    audioChunks   = [];
    mediaRecorder.ondataavailable = e => { if (e.data.size > 0) audioChunks.push(e.data); };
    mediaRecorder.start(200);
    isRecording = true;
    recSeconds  = 0;

    audioRecordBtn.classList.add('recording-active');
    audioRecordBtn.setAttribute('aria-pressed', 'true');
    recordingBar.style.display = 'flex';
    recordingTime.textContent  = '0:00';

    recInterval = setInterval(() => {
      recSeconds++;
      const m = Math.floor(recSeconds / 60);
      const s = recSeconds % 60;
      recordingTime.textContent = `${m}:${String(s).padStart(2, '0')}`;
      if (recSeconds >= 300) stopRecording();
    }, 1000);
  } catch (err) {
    showToast('❌ No se pudo acceder al micrófono.', 'error');
  }
}

function stopRecording() {
  if (!mediaRecorder || !isRecording) return;
  clearInterval(recInterval);
  isRecording = false;
  audioRecordBtn.classList.remove('recording-active');
  audioRecordBtn.setAttribute('aria-pressed', 'false');
  mediaRecorder.stop();
  mediaRecorder.stream.getTracks().forEach(t => t.stop());
}

function cancelRecording() {
  if (mediaRecorder) {
    mediaRecorder.stop();
    mediaRecorder.stream?.getTracks().forEach(t => t.stop());
  }
  clearInterval(recInterval);
  isRecording = false;
  audioChunks = [];
  mediaRecorder = null;
  recordingBar.style.display = 'none';
  audioRecordBtn.classList.remove('recording-active');
  audioRecordBtn.setAttribute('aria-pressed', 'false');
}

cancelAudioBtn.addEventListener('click', cancelRecording);

sendAudioBtn.addEventListener('click', async () => {
  stopRecording();
  await new Promise(r => setTimeout(r, 350));

  if (!audioChunks.length || !currentRoomId) {
    recordingBar.style.display = 'none';
    audioChunks = [];
    return;
  }

  recordingBar.style.display = 'none';
  const mime = supportedAudioMime();
  const blob = new Blob(audioChunks, { type: mime });
  const ext  = mime.includes('ogg') ? 'ogg' : 'webm';
  audioChunks  = [];
  mediaRecorder = null;

  showUpload('🎙️ Enviando audio…');
  try {
    const fileUrl = await uploadToCloudinary(blob, `rooms/${currentRoomId}/audios`, updateUpload);
    hideUpload();
    await addDoc(collection(db, 'rooms', currentRoomId, 'messages'), {
      type:      'audio',
      fileUrl,
      fileName:  `audio_${Date.now()}.${ext}`,
      mimeType:  mime,
      sender:    senderInfo(),
      timestamp: serverTimestamp()
    });
  } catch (err) {
    hideUpload();
    showToast(`❌ Error enviando audio: ${err.message}`, 'error');
  }
});

function supportedAudioMime() {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/ogg'];
  return types.find(t => MediaRecorder.isTypeSupported(t)) || 'audio/webm';
}

// ============================================================
// ☁️ CLOUDINARY — Subida de archivos (100% GRATIS)
// ============================================================
function uploadToCloudinary(file, folder, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    formData.append('folder', `chatflow/${folder}`);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`, true);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        if (data.error) reject(new Error(data.error.message));
        else resolve(data.secure_url);
      } else {
        reject(new Error(`Cloudinary error ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Error de red al subir a Cloudinary'));
    xhr.send(formData);
  });
}

function showUpload(label) {
  uploadIndicator.style.display = 'flex';
  uploadLabel.textContent       = label;
  uploadBarFill.style.width     = '0%';
  uploadPercent.textContent     = '0%';
}
function updateUpload(pct) {
  uploadBarFill.style.width = pct + '%';
  uploadPercent.textContent = pct + '%';
}
function hideUpload() {
  uploadIndicator.style.display = 'none';
}

// ============================================================
// 😀 SELECTOR DE EMOJIS
// ============================================================
emojiBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const open = emojiPickerWrap.style.display !== 'none';
  emojiPickerWrap.style.display = open ? 'none' : 'block';
  emojiBtn.classList.toggle('emoji-active', !open);
  emojiBtn.setAttribute('aria-expanded', String(!open));
});

emojiPicker.addEventListener('emoji-click', (e) => {
  const emoji = e.detail.unicode;
  const pos   = messageInput.selectionStart ?? messageInput.value.length;
  const val   = messageInput.value;
  messageInput.value = val.slice(0, pos) + emoji + val.slice(pos);
  const np = pos + emoji.length;
  messageInput.setSelectionRange(np, np);
  messageInput.focus();
  autoResizeTA();
});

document.addEventListener('click', (e) => {
  if (!emojiPickerWrap.contains(e.target) && e.target !== emojiBtn) {
    emojiPickerWrap.style.display = 'none';
    emojiBtn.classList.remove('emoji-active');
    emojiBtn.setAttribute('aria-expanded', 'false');
  }
});

// ============================================================
// ➕ MODAL CREAR SALA
// ============================================================
function openModal() {
  createRoomModal.style.display = 'flex';
  roomNameInput.value = '';
  roomDescInput.value = '';
  document.querySelector('input[name="room-type"][value="public"]').checked = true;
  radioPublicLabel.classList.add('selected');
  radioPrivateLabel.classList.remove('selected');
  setTimeout(() => roomNameInput.focus(), 50);
}
function closeModal() {
  createRoomModal.style.display = 'none';
}

createRoomBtn.addEventListener('click', openModal);
welcomeCreateBtn.addEventListener('click', openModal);
cancelRoomBtn.addEventListener('click', closeModal);
createRoomModal.querySelector('.modal-overlay').addEventListener('click', (e) => {
  if (e.target === createRoomModal.querySelector('.modal-overlay')) closeModal();
});

document.querySelectorAll('input[name="room-type"]').forEach(r => {
  r.addEventListener('change', () => {
    radioPublicLabel.classList.toggle('selected',  r.value === 'public');
    radioPrivateLabel.classList.toggle('selected', r.value === 'private');
  });
});

createRoomForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = roomNameInput.value.trim();
  const desc = roomDescInput.value.trim();
  const type = document.querySelector('input[name="room-type"]:checked').value;
  if (!name) return;

  if (!currentUser) {
    showToast('⚠️ Debes iniciar sesión primero.', 'error');
    return;
  }

  const btn = document.getElementById('create-room-submit-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Creando…';

  try {
    const ref = await addDoc(collection(db, 'rooms'), {
      name,
      description: desc,
      type,
      createdBy:  currentUser.uid,
      createdAt:  serverTimestamp()
    });
    closeModal();
    selectRoom(ref.id, name, desc, type);
    showToast(`✅ Sala "${name}" creada.`, 'success');
  } catch (err) {
    console.error('Create room error:', err.code, err.message);
    if (err.code === 'permission-denied') {
      showToast('❌ Firestore bloqueó la operación. Actualiza las reglas de seguridad.', 'error');
    } else {
      showToast(`❌ Error: ${err.message}`, 'error');
    }
  } finally {
    btn.disabled = false;
    btn.textContent = 'Crear Sala';
  }
});

// ============================================================
// 🔍 LIGHTBOX
// ============================================================
function openLightbox(url) {
  lightboxImg.src = url;
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.style.display = 'none';
  lightboxImg.src = '';
  document.body.style.overflow = '';
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target === lightboxImg) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeLightbox(); closeModal(); }
});

// ============================================================
// 📱 SIDEBAR MÓVIL
// ============================================================
function checkLayout() {
  if (toggleSidebarBtn) toggleSidebarBtn.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
}
if (toggleSidebarBtn) {
  toggleSidebarBtn.addEventListener('click', () => {
    sidebarEl.classList.toggle('open');
    sidebarOverlay.classList.toggle('show');
  });
}
if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebarMobile);
function closeSidebarMobile() {
  sidebarEl.classList.remove('open');
  sidebarOverlay.classList.remove('show');
}
window.addEventListener('resize', checkLayout);

// ============================================================
// 🔔 TOASTS
// ============================================================
function showToast(msg, type = 'info') {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const icons = { success:'✅', error:'❌', info:'ℹ️' };
  t.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
  toastContainer.appendChild(t);
  setTimeout(() => {
    t.style.transition = 'opacity 0.3s';
    t.style.opacity = '0';
    setTimeout(() => t.remove(), 350);
  }, 4500);
}

// ============================================================
// 🛠️ UTILIDADES
// ============================================================
function showAuthError(el, msg) { el.textContent = msg; el.classList.add('show'); }

function setLoading(btn, on) {
  if (on) {
    btn.dataset.orig = btn.innerHTML;
    btn.classList.add('loading');
    btn.innerHTML = '<span class="spinner"></span><span>Cargando…</span>';
  } else {
    btn.classList.remove('loading');
    btn.innerHTML = btn.dataset.orig || btn.innerHTML;
  }
}

function translateAuthError(code) {
  const m = {
    'auth/invalid-email':          'Correo electrónico inválido.',
    'auth/user-not-found':         'No existe cuenta con ese correo.',
    'auth/wrong-password':         'Contraseña incorrecta.',
    'auth/invalid-credential':     'Correo o contraseña incorrectos.',
    'auth/email-already-in-use':   'Ya existe una cuenta con ese correo.',
    'auth/weak-password':          'Contraseña demasiado débil (mínimo 6 caracteres).',
    'auth/too-many-requests':      'Demasiados intentos. Espera un momento.',
    'auth/network-request-failed': 'Sin conexión a internet.',
    'auth/user-disabled':          'Esta cuenta fue deshabilitada.',
  };
  return m[code] || `Error: ${code}`;
}

function fmtTime(ts) {
  if (!ts) return '';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
  } catch { return ''; }
}

function fmtBytes(b) {
  if (!b) return '0 B';
  const k = 1024, s = ['B','KB','MB','GB'];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return (b / Math.pow(k, i)).toFixed(1) + ' ' + s[i];
}

function fileIcon(mime = '') {
  if (mime.startsWith('image/'))  return '🖼️';
  if (mime.startsWith('video/'))  return '🎬';
  if (mime.startsWith('audio/'))  return '🎵';
  if (mime.includes('pdf'))       return '📕';
  if (mime.includes('word') || mime.includes('document')) return '📝';
  if (mime.includes('excel') || mime.includes('sheet'))   return '📊';
  if (mime.includes('zip') || mime.includes('rar'))       return '📦';
  if (mime.includes('text/'))     return '📃';
  return '📄';
}

function escHtml(s) {
  const d = document.createElement('div');
  d.textContent = s || '';
  return d.innerHTML;
}

// ============================================================
// 🚀 INICIALIZAR
// ============================================================
function init() {
  populateCountryCodes();
  checkLayout();
  loginForm.style.display    = 'flex';
  registerForm.style.display = 'none';
}

init();
