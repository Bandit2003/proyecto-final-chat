# 💬 ChatFlow — Chat en Tiempo Real

Aplicación de chat en tiempo real construida con **Firebase**, **Socket.io** y **Vanilla JS**.

## ✨ Características

- 🔐 **Autenticación** — Registro con foto de perfil, selector de país para teléfono, login y recuperación de contraseña vía Firebase Auth
- 🏠 **Salas dinámicas** — Crea salas públicas o privadas y chatea en tiempo real
- 😀 **Emojis** — Selector de emojis integrado (emoji-picker-element)
- 🖼️ **Fotos** — Envía imágenes con vista previa; se visualizan inline en el chat
- 📎 **Archivos** — Envía cualquier tipo de archivo con icono y botón de descarga
- 🎙️ **Audios** — Graba y envía notas de voz directamente desde el navegador
- 💾 **Persistencia** — Todos los mensajes se guardan en Firebase Firestore
- ☁️ **Almacenamiento** — Fotos, audios y archivos se alojan en Firebase Storage
- 📱 **Responsive** — Funciona en escritorio y móvil

## 🚀 Instalación

### 1. Clona el repositorio
```bash
git clone https://github.com/doiko892/proyecto-final-chat.git
cd proyecto-final-chat
npm install
```

### 2. Configura Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un nuevo proyecto
3. Activa estos servicios:
   - **Authentication** → Email/Contraseña
   - **Firestore** → Modo de prueba
   - **Storage** → Modo de prueba
4. Ve a Configuración del Proyecto → Tu app web → copia el `firebaseConfig`
5. Edita `public/firebase-config.js` con tus credenciales

### 3. Reglas de Firestore recomendadas

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rooms/{roomId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      match /messages/{messageId} {
        allow read, write: if request.auth != null;
      }
    }
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

### 4. Reglas de Storage recomendadas

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Inicia el servidor

```bash
npm start
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| Firebase Auth | Autenticación de usuarios |
| Firebase Firestore | Base de datos en tiempo real |
| Firebase Storage | Almacenamiento de archivos |
| Socket.io | Servidor de archivos estáticos |
| Express.js | Servidor HTTP |
| emoji-picker-element | Selector de emojis |
| MediaRecorder API | Grabación de audio |

## 📁 Estructura del Proyecto

```
proyecto-final-chat/
├── public/
│   ├── index.html          # HTML principal
│   ├── app.js              # Lógica de la aplicación
│   ├── elstyleeschat.css   # Estilos premium
│   └── firebase-config.js  # Configuración de Firebase
├── server.js               # Servidor Express
├── package.json
└── README.md
```

## 📝 Licencia

MIT — Proyecto Final de Chat · 2026
