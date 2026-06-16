/**
 * ChatFlow — app.js
 * Firebase v10 Modular — Auth, Firestore, Storage, Emojis, Audio, Archivos
 */

// ============================================================
// 🔥 FIREBASE IMPORTS (CDN — Modular v10)
// ============================================================
import { initializeApp }                     from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
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
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';

// ============================================================
// 🔧 FIREBASE CONFIG
// ============================================================
import { firebaseConfig } from './firebase-config.js';

const firebaseApp = initializeApp(firebaseConfig);
const auth        = getAuth(firebaseApp);
const db          = getFirestore(firebaseApp);
const storage     = getStorage(firebaseApp);

// ============================================================
// 🌎 COUNTRY CODES (phone selector)
// ============================================================
const COUNTRIES = [
  { flag:'🇦🇷', name:'Argentina',             code:'+54'  },
  { flag:'🇦🇺', name:'Australia',              code:'+61'  },
  { flag:'🇦🇹', name:'Austria',               code:'+43'  },
  { flag:'🇧🇪', name:'Bélgica',               code:'+32'  },
  { flag:'🇧🇴', name:'Bolivia',               code:'+591' },
  { flag:'🇧🇷', name:'Brasil',                code:'+55'  },
  { flag:'🇨🇦', name:'Canadá',               code:'+1'   },
  { flag:'🇨🇱', name:'Chile',                 code:'+56'  },
  { flag:'🇨🇳', name:'China',                 code:'+86'  },
  { flag:'🇨🇴', name:'Colombia',              code:'+57'  },
  { flag:'🇰🇷', name:'Corea del Sur',         code:'+82'  },
  { flag:'🇨🇷', name:'Costa Rica',            code:'+506' },
  { flag:'🇨🇺', name:'Cuba',                  code:'+53'  },
  { flag:'🇩🇰', name:'Dinamarca',             code:'+45'  },
  { flag:'🇩🇴', name:'República Dominicana',  code:'+1809'},
  { flag:'🇪🇨', name:'Ecuador',               code:'+593' },
  { flag:'🇪🇬', name:'Egipto',                code:'+20'  },
  { flag:'🇸🇻', name:'El Salvador',           code:'+503' },
  { flag:'🇦🇪', name:'Emiratos Árabes',       code:'+971' },
  { flag:'🇪🇸', name:'España',                code:'+34'  },
  { flag:'🇺🇸', name:'Estados Unidos',        code:'+1'   },
  { flag:'🇫🇮', name:'Finlandia',             code:'+358' },
  { flag:'🇫🇷', name:'Francia',               code:'+33'  },
  { flag:'🇬🇷', name:'Grecia',                code:'+30'  },
  { flag:'🇬🇹', name:'Guatemala',             code:'+502' },
  { flag:'🇭🇳', name:'Honduras',              code:'+504' },
  { flag:'🇭🇺', name:'Hungría',               code:'+36'  },
  { flag:'🇮🇳', name:'India',                 code:'+91'  },
  { flag:'🇮🇩', name:'Indonesia',             code:'+62'  },
  { flag:'🇮🇱', name:'Israel',                code:'+972' },
  { flag:'🇮🇹', name:'Italia',                code:'+39'  },
  { flag:'🇯🇵', name:'Japón',                 code:'+81'  },
  { flag:'🇰🇪', name:'Kenia',                 code:'+254' },
  { flag:'🇲🇾', name:'Malasia',               code:'+60'  },
  { flag:'🇲🇽', name:'México',                code:'+52'  },
  { flag:'🇳🇮', name:'Nicaragua',             code:'+505' },
  { flag:'🇳🇬', name:'Nigeria',               code:'+234' },
  { flag:'🇳🇴', name:'Noruega',               code:'+47'  },
  { flag:'🇳🇿', name:'Nueva Zelanda',         code:'+64'  },
  { flag:'🇵🇦', name:'Panamá',               code:'+507' },
  { flag:'🇵🇾', name:'Paraguay',              code:'+595' },
  { flag:'🇵🇪', name:'Perú',                  code:'+51'  },
  { flag:'🇵🇭', name:'Filipinas',             code:'+63'  },
  { flag:'🇵🇱', name:'Polonia',               code:'+48'  },
  { flag:'🇵🇹', name:'Portugal',              code:'+351' },
  { flag:'🇵🇷', name:'Puerto Rico',           code:'+1787'},
  { flag:'🇬🇧', name:'Reino Unido',           code:'+44'  },
  { flag:'🇨🇿', name:'Rep. Checa',            code:'+420' },
  { flag:'🇷🇴', name:'Rumania',               code:'+40'  },
  { flag:'🇷🇺', name:'Rusia',                 code:'+7'   },
  { flag:'🇸🇦', name:'Arabia Saudita',        code:'+966' },
  { flag:'🇸🇬', name:'Singapur',              code:'+65'  },
  { flag:'🇿🇦', name:'Sudáfrica',             code:'+27'  },
  { flag:'🇸🇪', name:'Suecia',                code:'+46'  },
  { flag:'🇨🇭', name:'Suiza',                 code:'+41'  },
  { flag:'🇹🇭', name:'Tailandia',             code:'+66'  },
  { flag:'🇹🇷', name:'Turquía',               code:'+90'  },
  { flag:'🇺🇦', name:'Ucrania',               code:'+380' },
  { flag:'🇺🇾', name:'Uruguay',               code:'+598' },
  { flag:'🇻🇪', name:'Venezuela',             code:'+58'  },
  { flag:'🇻🇳', name:'Vietnam',               code:'+84'  },
  { flag:'🇭🇹', name:'Haití',                 code:'+509' },
  { flag:'🇳🇱', name:'Países Bajos',          code:'+31'  },
];

// ============================================================
// 📌 STATE
// ============================================================
let currentUser       = null;
let currentRoomId     = null;
let currentRoomName   = null;
let unsubMessages     = null;
let unsubRooms        = null;
let pendingFile       = null; // { file, type: 'image'|'file' }
let isRecording       = false;
let mediaRecorder     = null;
let audioChunks       = [];
let recordingInterval = null;
let recordingSeconds  = 0;
let lastMsgSenderId   = null;

// ============================================================
// 📍 DOM REFERENCES
// ============================================================
// Auth
const authScreen        = document.getElementById('auth-screen');
const chatScreen        = document.getElementById('chat-screen');
const tabLogin          = document.getElementById('tab-login');
const tabRegister       = document.getElementById('tab-register');
const loginForm         = document.getElementById('login-form');
const registerForm      = document.getElementById('register-form');
const loginEmail        = document.getElementById('login-email');
const loginPassword     = document.getElementById('login-password');
const loginError        = document.getElementById('login-error');
const loginSubmitBtn    = document.getElementById('login-submit-btn');
const forgotBtn         = document.getElementById('forgot-password-btn');
const regName           = document.getElementById('reg-name');
const regUsername       = document.getElementById('reg-username');
const regEmail          = document.getElementById('reg-email');
const regPassword       = document.getElementById('reg-password');
const regConfirmPwd     = document.getElementById('reg-confirm-password');
const regPhone          = document.getElementById('reg-phone');
const countrySelect     = document.getElementById('country-code-select');
const regBirthday       = document.getElementById('reg-birthday');
const regAvatar         = document.getElementById('reg-avatar');
const avatarPreview     = document.getElementById('avatar-preview-wrapper');
const registerError     = document.getElementById('register-error');
const registerSubmitBtn = document.getElementById('register-submit-btn');

// Sidebar
const sidebarEl        = document.getElementById('sidebar');
const sidebarAvatar    = document.getElementById('sidebar-avatar');
const sidebarAvatarTxt = document.getElementById('sidebar-avatar-text');
const sidebarName      = document.getElementById('sidebar-username');
const logoutBtn        = document.getElementById('logout-btn');
const roomsList        = document.getElementById('rooms-list');
const createRoomBtn    = document.getElementById('create-room-btn');
const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
const sidebarOverlay   = document.getElementById('sidebar-overlay');

// Main Chat
const welcomeScreen     = document.getElementById('welcome-screen');
const chatRoomArea      = document.getElementById('chat-room-area');
const messagesEl        = document.getElementById('messages-container');
const currentRoomNameEl = document.getElementById('current-room-name');
const currentRoomDescEl = document.getElementById('current-room-desc');
const headerRoomIcon    = document.getElementById('header-room-icon');
const welcomeCreateBtn  = document.getElementById('welcome-create-btn');

// Input
const messageInput    = document.getElementById('message-input');
const sendMsgBtn      = document.getElementById('send-message-btn');
const photoInput      = document.getElementById('photo-input');
const fileInput       = document.getElementById('file-input');
const emojiBtn        = document.getElementById('emoji-btn');
const emojiPickerWrap = document.getElementById('emoji-picker-wrapper');
const emojiPicker     = document.getElementById('emoji-picker');
const audioRecordBtn  = document.getElementById('audio-record-btn');

// Bars
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

// Modal
const createRoomModal   = document.getElementById('create-room-modal');
const createRoomForm    = document.getElementById('create-room-form');
const roomNameInput     = document.getElementById('room-name-input');
const roomDescInput     = document.getElementById('room-desc-input');
const cancelRoomBtn     = document.getElementById('cancel-room-btn');
const radioPublicLabel  = document.getElementById('radio-public-label');
const radioPrivateLabel = document.getElementById('radio-private-label');

// Lightbox
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

// Toast container
const toastContainer = document.getElementById('toast-container');

// ============================================================
// 🌍 POPULATE COUNTRY CODES
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
// 🔐 AUTH — onAuthStateChanged
// ============================================================
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    await enterChat(user);
  } else {
    currentUser = null;
    showAuth();
  }
});

function showAuth() {
  authScreen.style.display = 'flex';
  chatScreen.style.display = 'none';
  if (unsubRooms)    { unsubRooms();    unsubRooms = null; }
  if (unsubMessages) { unsubMessages(); unsubMessages = null; }
}

async function enterChat(user) {
  authScreen.style.display = 'none';
  chatScreen.style.display = 'flex';

  const displayName = user.displayName || user.email.split('@')[0];
  sidebarName.textContent    = displayName;
  sidebarAvatarTxt.textContent = displayName.charAt(0).toUpperCase();

  if (user.photoURL) {
    const img = document.createElement('img');
    img.src = user.photoURL;
    img.alt = displayName;
    sidebarAvatar.innerHTML = '';
    sidebarAvatar.appendChild(img);
  }

  loadRooms();
}

// ============================================================
// 📝 AUTH — Tab switching
// ============================================================
tabLogin.addEventListener('click', () => {
  tabLogin.classList.add('active');
  tabRegister.classList.remove('active');
  loginForm.style.display = 'flex';
  registerForm.style.display = 'none';
  clearErrors();
});

tabRegister.addEventListener('click', () => {
  tabRegister.classList.add('active');
  tabLogin.classList.remove('active');
  registerForm.style.display = 'flex';
  loginForm.style.display = 'none';
  clearErrors();
});

function clearErrors() {
  loginError.classList.remove('show');
  registerError.classList.remove('show');
}

// Toggle password visibility
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
// 📬 FORGOT PASSWORD
// ============================================================
forgotBtn.addEventListener('click', async () => {
  const email = loginEmail.value.trim();
  if (!email) {
    showAuthError(loginError, 'Ingresa tu correo electrónico primero.');
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    showToast('📧 Correo de restablecimiento enviado. Revisa tu bandeja de entrada.', 'success');
  } catch (err) {
    showAuthError(loginError, translateAuthError(err.code));
  }
});

// ============================================================
// 📝 REGISTER
// ============================================================
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name       = regName.value.trim();
  const username   = regUsername.value.trim();
  const email      = regEmail.value.trim();
  const pwd        = regPassword.value;
  const confirmPwd = regConfirmPwd.value;
  const phone      = regPhone.value.trim();
  const countryCode = countrySelect.value;
  const birthday   = regBirthday.value;

  if (!name || !username || !email || !pwd || !confirmPwd) {
    return showAuthError(registerError, 'Completa todos los campos obligatorios (*).');
  }
  if (pwd !== confirmPwd) {
    return showAuthError(registerError, 'Las contraseñas no coinciden.');
  }
  if (pwd.length < 6) {
    return showAuthError(registerError, 'La contraseña debe tener al menos 6 caracteres.');
  }

  setLoading(registerSubmitBtn, true);

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pwd);
    const user = cred.user;

    let photoURL = '';
    if (regAvatar.files[0]) {
      try {
        photoURL = await uploadFileToStorage(
          regAvatar.files[0],
          `avatars/${user.uid}/avatar`
        );
      } catch (_) { /* non-fatal */ }
    }

    await updateProfile(user, {
      displayName: name,
      photoURL: photoURL || ''
    });

    await setDoc(doc(db, 'users', user.uid), {
      uid:         user.uid,
      displayName: name,
      username:    username,
      email:       email,
      phone:       phone ? `${countryCode} ${phone}` : '',
      birthday:    birthday || '',
      photoURL:    photoURL || '',
      createdAt:   serverTimestamp()
    });

    // onAuthStateChanged triggers enterChat automatically
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
  welcomeScreen.style.display  = 'flex';
  chatRoomArea.style.display   = 'none';
  await signOut(auth);
});

// ============================================================
// 🖼️ AVATAR PREVIEW
// ============================================================
regAvatar.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showToast('❌ La foto no puede superar los 5MB.', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = (ev) => {
    avatarPreview.innerHTML = `<img src="${ev.target.result}" alt="Vista previa" style="width:100%;height:100%;object-fit:cover;">`;
  };
  reader.readAsDataURL(file);
});

avatarPreview.addEventListener('click', () => regAvatar.click());

// ============================================================
// 🏠 ROOMS — Real-time Firestore
// ============================================================
function loadRooms() {
  if (unsubRooms) unsubRooms();

  const q = query(collection(db, 'rooms'), orderBy('createdAt', 'asc'));

  unsubRooms = onSnapshot(q, (snapshot) => {
    roomsList.innerHTML = '';

    if (snapshot.empty) {
      const hint = document.createElement('div');
      hint.style.cssText = 'padding:16px;font-size:12px;color:var(--text-3);text-align:center;line-height:1.6;';
      hint.textContent = 'No hay salas todavía. ¡Crea la primera!';
      roomsList.appendChild(hint);
      return;
    }

    snapshot.forEach(docSnap => {
      const room = { id: docSnap.id, ...docSnap.data() };
      const item = document.createElement('div');
      item.className = `room-item${room.id === currentRoomId ? ' active' : ''}${room.type === 'private' ? ' private' : ''}`;
      item.dataset.roomId = room.id;
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', `Sala ${room.name}`);

      const hashIcon = room.type === 'private' ? '🔒' : '#';
      item.innerHTML = `
        <span class="room-hash">${hashIcon}</span>
        <span class="room-name">${escapeHtml(room.name)}</span>
      `;

      item.addEventListener('click', () => {
        selectRoom(room.id, room.name, room.description || '', room.type);
        closeSidebarMobile();
      });

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });

      roomsList.appendChild(item);
    });
  }, (err) => {
    console.error('Error cargando salas:', err);
    showToast('Error al cargar las salas. Verifica Firebase.', 'error');
  });
}

// ============================================================
// 🚀 SELECT ROOM
// ============================================================
function selectRoom(roomId, name, desc, type) {
  if (currentRoomId === roomId) return;

  if (unsubMessages) { unsubMessages(); unsubMessages = null; }

  currentRoomId   = roomId;
  currentRoomName = name;
  lastMsgSenderId = null;

  welcomeScreen.style.display  = 'none';
  chatRoomArea.style.display   = 'flex';
  currentRoomNameEl.textContent = name;
  currentRoomDescEl.textContent = desc || 'Sala de chat';
  headerRoomIcon.textContent    = type === 'private' ? '🔒' : '#';

  // Highlight active room
  document.querySelectorAll('.room-item').forEach(el => {
    el.classList.toggle('active', el.dataset.roomId === roomId);
  });

  // Clear messages (keep spacer)
  Array.from(messagesEl.children).forEach(el => {
    if (!el.classList.contains('messages-start-spacer')) el.remove();
  });

  appendSystemMsg(`Bienvenido a #${name}`);
  loadMessages(roomId);
}

// ============================================================
// 💬 MESSAGES — Real-time listener
// ============================================================
function loadMessages(roomId) {
  const q = query(
    collection(db, 'rooms', roomId, 'messages'),
    orderBy('timestamp', 'asc'),
    limit(80)
  );

  unsubMessages = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        renderMessage({ id: change.doc.id, ...change.doc.data() });
      }
    });
    scrollToBottom();
  }, (err) => {
    console.error('Error cargando mensajes:', err);
  });
}

// ============================================================
// 🎨 RENDER MESSAGE
// ============================================================
function renderMessage(msg) {
  const isSelf    = msg.sender?.uid === currentUser?.uid;
  const isGrouped = msg.sender?.uid === lastMsgSenderId;
  lastMsgSenderId = msg.sender?.uid;

  const wrapper = document.createElement('div');
  wrapper.className = `msg-wrapper${isSelf ? ' sent' : ' received'}${isGrouped ? ' grouped' : ''}`;

  // Avatar
  const avatarEl = document.createElement('div');
  avatarEl.className = `msg-avatar${isGrouped ? ' hidden' : ''}`;
  if (msg.sender?.photoURL) {
    avatarEl.innerHTML = `<img src="${msg.sender.photoURL}" alt="${escapeHtml(msg.sender.displayName || 'U')}">`;
  } else {
    avatarEl.textContent = (msg.sender?.displayName || 'U').charAt(0).toUpperCase();
  }

  // Body
  const bodyEl = document.createElement('div');
  bodyEl.className = 'msg-body';

  if (!isGrouped && !isSelf) {
    const senderEl = document.createElement('div');
    senderEl.className = 'msg-sender';
    senderEl.textContent = msg.sender?.displayName || 'Usuario';
    bodyEl.appendChild(senderEl);
  }

  // Message content by type
  let contentEl;

  switch (msg.type) {
    case 'image': {
      contentEl = document.createElement('div');
      contentEl.className = 'msg-image msg-bubble';
      contentEl.style.cssText = 'padding:0;overflow:hidden;cursor:zoom-in;';
      const img = document.createElement('img');
      img.src = msg.fileUrl;
      img.alt = 'Imagen enviada';
      img.loading = 'lazy';
      img.style.cssText = 'width:100%;display:block;border-radius:inherit;';
      img.addEventListener('click', () => openLightbox(msg.fileUrl));
      contentEl.appendChild(img);
      break;
    }
    case 'file': {
      contentEl = document.createElement('a');
      contentEl.className = 'msg-file';
      contentEl.href = msg.fileUrl;
      contentEl.target = '_blank';
      contentEl.rel = 'noopener noreferrer';
      contentEl.setAttribute('aria-label', `Descargar ${msg.fileName}`);
      contentEl.innerHTML = `
        <div class="file-icon-badge">${getFileIcon(msg.mimeType || '')}</div>
        <div class="file-info">
          <div class="file-name">${escapeHtml(msg.fileName || 'Archivo')}</div>
          <div class="file-size">${formatBytes(msg.fileSize || 0)}</div>
        </div>
        <span style="font-size:18px;color:var(--accent)">⬇️</span>
      `;
      break;
    }
    case 'audio': {
      contentEl = document.createElement('div');
      contentEl.className = 'msg-bubble msg-audio-player';
      // Use both webm and ogg sources for compatibility
      contentEl.innerHTML = `
        <span style="font-size:20px;">🎙️</span>
        <audio controls preload="metadata" aria-label="Nota de audio" style="flex:1;height:32px;">
          <source src="${msg.fileUrl}" type="${msg.mimeType || 'audio/webm'}">
          Tu navegador no soporta la reproducción de audio.
        </audio>
      `;
      break;
    }
    default: {
      contentEl = document.createElement('div');
      contentEl.className = 'msg-bubble';
      contentEl.textContent = msg.content || '';
      break;
    }
  }

  bodyEl.appendChild(contentEl);

  // Timestamp
  const timeEl = document.createElement('div');
  timeEl.className = 'msg-time';
  timeEl.textContent = formatTimestamp(msg.timestamp);
  bodyEl.appendChild(timeEl);

  wrapper.appendChild(avatarEl);
  wrapper.appendChild(bodyEl);
  messagesEl.appendChild(wrapper);
}

function appendSystemMsg(text) {
  const el = document.createElement('div');
  el.className = 'system-msg';
  el.textContent = text;
  messagesEl.appendChild(el);
}

function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// ============================================================
// ✉️ UNIFIED SEND HANDLER — Text or File
// ============================================================
async function handleSend() {
  if (!currentRoomId) return;

  // Priority: file > text
  if (pendingFile) {
    await sendFileMessage();
    return;
  }

  const content = messageInput.value.trim();
  if (!content) return;

  messageInput.value = '';
  autoResizeTextarea();

  try {
    await addDoc(collection(db, 'rooms', currentRoomId, 'messages'), {
      type: 'text',
      content,
      sender: {
        uid:         currentUser.uid,
        displayName: currentUser.displayName || currentUser.email,
        photoURL:    currentUser.photoURL || ''
      },
      timestamp: serverTimestamp()
    });
  } catch (err) {
    showToast('Error al enviar el mensaje.', 'error');
    console.error(err);
  }
}

// Single send button listener
sendMsgBtn.addEventListener('click', handleSend);

// Enter to send (Shift+Enter = new line)
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});

// Auto-resize textarea
function autoResizeTextarea() {
  messageInput.style.height = 'auto';
  messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
}
messageInput.addEventListener('input', autoResizeTextarea);

// ============================================================
// 📁 FILE HANDLING
// ============================================================
photoInput.addEventListener('change', (e) => handleFileSelected(e.target.files[0], 'image'));
fileInput.addEventListener('change',  (e) => handleFileSelected(e.target.files[0], 'file'));

function handleFileSelected(file, type) {
  if (!file) return;
  const maxSize = type === 'image' ? 10 * 1024 * 1024 : 25 * 1024 * 1024;
  if (file.size > maxSize) {
    showToast(`❌ El archivo supera el límite (${type === 'image' ? '10MB' : '25MB'}).`, 'error');
    return;
  }
  pendingFile = { file, type };
  showFilePreviewBar(file, type);
}

function showFilePreviewBar(file, type) {
  filePreviewBar.style.display = 'flex';
  fpName.textContent = file.name;
  fpSize.textContent = formatBytes(file.size);
  fpIcon.innerHTML   = '';

  if (type === 'image') {
    const thumb = document.createElement('img');
    thumb.className = 'file-preview-thumb';
    thumb.alt = 'Vista previa';
    const reader = new FileReader();
    reader.onload = ev => { thumb.src = ev.target.result; };
    reader.readAsDataURL(file);
    fpIcon.appendChild(thumb);
  } else {
    fpIcon.textContent = getFileIcon(file.type);
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

  const path = `rooms/${currentRoomId}/${type === 'image' ? 'images' : 'files'}/${Date.now()}_${file.name}`;
  showUploadIndicator(type === 'image' ? '📷 Subiendo imagen…' : '📎 Subiendo archivo…');

  try {
    const fileUrl = await uploadFileToStorage(file, path, updateUploadProgress);
    hideUploadIndicator();

    await addDoc(collection(db, 'rooms', currentRoomId, 'messages'), {
      type:     type === 'image' ? 'image' : 'file',
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      sender: {
        uid:         currentUser.uid,
        displayName: currentUser.displayName || currentUser.email,
        photoURL:    currentUser.photoURL || ''
      },
      timestamp: serverTimestamp()
    });
  } catch (err) {
    hideUploadIndicator();
    showToast('❌ Error al subir el archivo.', 'error');
    console.error(err);
  }
}

// ============================================================
// 🎙️ AUDIO RECORDING
// ============================================================
audioRecordBtn.addEventListener('click', () => {
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
});

async function startRecording() {
  if (!navigator.mediaDevices?.getUserMedia) {
    showToast('❌ Tu navegador no soporta grabación de audio.', 'error');
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream, { mimeType: getSupportedAudioMime() });
    audioChunks   = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.push(e.data);
    };

    mediaRecorder.start(200);
    isRecording    = true;
    recordingSeconds = 0;

    audioRecordBtn.classList.add('recording-active');
    audioRecordBtn.setAttribute('aria-pressed', 'true');
    recordingBar.style.display = 'flex';
    recordingTime.textContent  = '0:00';

    recordingInterval = setInterval(() => {
      recordingSeconds++;
      const m = Math.floor(recordingSeconds / 60);
      const s = recordingSeconds % 60;
      recordingTime.textContent = `${m}:${String(s).padStart(2, '0')}`;
      if (recordingSeconds >= 300) stopRecording();
    }, 1000);

  } catch (err) {
    showToast('❌ No se pudo acceder al micrófono.', 'error');
    console.error(err);
  }
}

function stopRecording() {
  if (!mediaRecorder || !isRecording) return;
  clearInterval(recordingInterval);
  isRecording = false;
  audioRecordBtn.classList.remove('recording-active');
  audioRecordBtn.setAttribute('aria-pressed', 'false');
  mediaRecorder.stop();
  mediaRecorder.stream.getTracks().forEach(t => t.stop());
}

function cancelRecording() {
  if (mediaRecorder) {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(t => t.stop());
  }
  clearInterval(recordingInterval);
  isRecording  = false;
  audioChunks  = [];
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
  const mimeType = getSupportedAudioMime();
  const blob = new Blob(audioChunks, { type: mimeType });
  const ext  = mimeType.includes('ogg') ? 'ogg' : 'webm';
  audioChunks  = [];
  mediaRecorder = null;

  const path = `rooms/${currentRoomId}/audios/${Date.now()}.${ext}`;
  showUploadIndicator('🎙️ Enviando audio…');

  try {
    const fileUrl = await uploadFileToStorage(blob, path, updateUploadProgress);
    hideUploadIndicator();
    await addDoc(collection(db, 'rooms', currentRoomId, 'messages'), {
      type:      'audio',
      fileUrl,
      fileName:  `audio_${Date.now()}.${ext}`,
      mimeType,
      sender: {
        uid:         currentUser.uid,
        displayName: currentUser.displayName || currentUser.email,
        photoURL:    currentUser.photoURL || ''
      },
      timestamp: serverTimestamp()
    });
  } catch (err) {
    hideUploadIndicator();
    showToast('❌ Error al enviar el audio.', 'error');
    console.error(err);
  }
});

function getSupportedAudioMime() {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/ogg'
  ];
  return types.find(t => MediaRecorder.isTypeSupported(t)) || 'audio/webm';
}

// ============================================================
// ☁️ UPLOAD TO FIREBASE STORAGE
// ============================================================
function uploadFileToStorage(file, path, onProgress) {
  return new Promise((resolve, reject) => {
    const sRef = storageRef(storage, path);
    const task = uploadBytesResumable(sRef, file);

    task.on('state_changed',
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (onProgress) onProgress(pct);
      },
      (err) => reject(err),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

function showUploadIndicator(label) {
  uploadIndicator.style.display = 'flex';
  uploadLabel.textContent       = label;
  uploadBarFill.style.width     = '0%';
  uploadPercent.textContent     = '0%';
}

function updateUploadProgress(pct) {
  uploadBarFill.style.width = pct + '%';
  uploadPercent.textContent = pct + '%';
}

function hideUploadIndicator() {
  uploadIndicator.style.display = 'none';
}

// ============================================================
// 😀 EMOJI PICKER
// ============================================================
emojiBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = emojiPickerWrap.style.display !== 'none';
  emojiPickerWrap.style.display = isOpen ? 'none' : 'block';
  emojiBtn.classList.toggle('emoji-active', !isOpen);
  emojiBtn.setAttribute('aria-expanded', String(!isOpen));
});

emojiPicker.addEventListener('emoji-click', (e) => {
  const emoji = e.detail.unicode;
  const pos   = messageInput.selectionStart || messageInput.value.length;
  const val   = messageInput.value;
  messageInput.value = val.slice(0, pos) + emoji + val.slice(pos);
  const newPos = pos + emoji.length;
  messageInput.setSelectionRange(newPos, newPos);
  messageInput.focus();
  autoResizeTextarea();
});

document.addEventListener('click', (e) => {
  if (!emojiPickerWrap.contains(e.target) && e.target !== emojiBtn) {
    emojiPickerWrap.style.display = 'none';
    emojiBtn.classList.remove('emoji-active');
    emojiBtn.setAttribute('aria-expanded', 'false');
  }
});

// ============================================================
// 🏠 CREATE ROOM MODAL
// ============================================================
function openCreateRoomModal() {
  createRoomModal.style.display = 'flex';
  roomNameInput.value = '';
  roomDescInput.value = '';
  document.querySelector('input[name="room-type"][value="public"]').checked = true;
  radioPublicLabel.classList.add('selected');
  radioPrivateLabel.classList.remove('selected');
  setTimeout(() => roomNameInput.focus(), 50);
}

function closeCreateRoomModal() {
  createRoomModal.style.display = 'none';
}

createRoomBtn.addEventListener('click', openCreateRoomModal);
welcomeCreateBtn.addEventListener('click', openCreateRoomModal);
cancelRoomBtn.addEventListener('click', closeCreateRoomModal);

createRoomModal.querySelector('.modal-overlay').addEventListener('click', (e) => {
  if (e.target === createRoomModal.querySelector('.modal-overlay')) closeCreateRoomModal();
});

document.querySelectorAll('input[name="room-type"]').forEach(radio => {
  radio.addEventListener('change', () => {
    radioPublicLabel.classList.toggle('selected',  radio.value === 'public');
    radioPrivateLabel.classList.toggle('selected', radio.value === 'private');
  });
});

createRoomForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = roomNameInput.value.trim();
  const desc = roomDescInput.value.trim();
  const type = document.querySelector('input[name="room-type"]:checked').value;
  if (!name) return;

  const submitBtn = document.getElementById('create-room-submit-btn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner"></span> Creando…';

  try {
    const docRef = await addDoc(collection(db, 'rooms'), {
      name,
      description: desc,
      type,
      createdBy:  currentUser.uid,
      createdAt:  serverTimestamp()
    });
    closeCreateRoomModal();
    selectRoom(docRef.id, name, desc, type);
    showToast(`✅ Sala "${name}" creada con éxito.`, 'success');
  } catch (err) {
    showToast('❌ Error al crear la sala. Verifica Firebase.', 'error');
    console.error(err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Crear Sala';
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
  if (e.key === 'Escape') {
    closeLightbox();
    closeCreateRoomModal();
  }
});

// ============================================================
// 📱 MOBILE SIDEBAR
// ============================================================
function checkMobileLayout() {
  const isMobile = window.innerWidth <= 768;
  if (toggleSidebarBtn) toggleSidebarBtn.style.display = isMobile ? 'flex' : 'none';
}

if (toggleSidebarBtn) {
  toggleSidebarBtn.addEventListener('click', () => {
    sidebarEl.classList.toggle('open');
    sidebarOverlay.classList.toggle('show');
  });
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener('click', closeSidebarMobile);
}

function closeSidebarMobile() {
  sidebarEl.classList.remove('open');
  sidebarOverlay.classList.remove('show');
}

window.addEventListener('resize', checkMobileLayout);

// ============================================================
// 🔔 TOAST NOTIFICATIONS
// ============================================================
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease';
    toast.style.opacity    = '0';
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

// ============================================================
// 🛠️ UTILITIES
// ============================================================
function showAuthError(el, msg) {
  el.textContent = msg;
  el.classList.add('show');
}

function setLoading(btn, loading) {
  if (loading) {
    btn.dataset.origHtml = btn.innerHTML;
    btn.classList.add('loading');
    btn.innerHTML = '<span class="spinner"></span><span>Cargando…</span>';
  } else {
    btn.classList.remove('loading');
    btn.innerHTML = btn.dataset.origHtml || btn.innerHTML;
  }
}

function translateAuthError(code) {
  const map = {
    'auth/invalid-email':          'El correo electrónico no es válido.',
    'auth/user-disabled':          'Esta cuenta ha sido deshabilitada.',
    'auth/user-not-found':         'No existe una cuenta con ese correo.',
    'auth/wrong-password':         'Contraseña incorrecta.',
    'auth/email-already-in-use':   'Ya existe una cuenta con ese correo electrónico.',
    'auth/weak-password':          'La contraseña es demasiado débil (mínimo 6 caracteres).',
    'auth/too-many-requests':      'Demasiados intentos fallidos. Intenta más tarde.',
    'auth/network-request-failed': 'Error de red. Verifica tu conexión a internet.',
    'auth/invalid-credential':     'Correo o contraseña incorrectos.',
    'auth/operation-not-allowed':  'Este método de acceso no está habilitado en Firebase.',
    'auth/popup-closed-by-user':   'Proceso cancelado.',
  };
  return map[code] || `Error (${code}). Intenta de nuevo.`;
}

function formatTimestamp(ts) {
  if (!ts) return '';
  try {
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getFileIcon(mimeType = '') {
  if (mimeType.startsWith('image/'))        return '🖼️';
  if (mimeType.startsWith('video/'))        return '🎬';
  if (mimeType.startsWith('audio/'))        return '🎵';
  if (mimeType.includes('pdf'))             return '📕';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📊';
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) return '📦';
  if (mimeType.includes('text/'))           return '📃';
  return '📄';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

// ============================================================
// 🚀 INIT
// ============================================================
function init() {
  populateCountryCodes();
  checkMobileLayout();
  loginForm.style.display    = 'flex';
  registerForm.style.display = 'none';
}

init();
