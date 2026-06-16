// ============================================================
// 🔥 CONFIGURACIÓN DE FIREBASE — PROYECTO CHATFLOW
// ============================================================
// Proyecto: proyecto-final-chat-3d146
// ============================================================

export const firebaseConfig = {
    apiKey:            "AIzaSyDT_mQ8VCJtZiSMJrhSNV0dT9DdpwnJu2M",
    authDomain:        "proyecto-final-chat-3d146.firebaseapp.com",
    projectId:         "proyecto-final-chat-3d146",
    storageBucket:     "proyecto-final-chat-3d146.firebasestorage.app",
    messagingSenderId: "678356812425",
    appId:             "1:678356812425:web:c5bbacff478cdf4ce17c58",
    measurementId:     "G-46E5TLB4PC"
};

// ============================================================
// ☁️ CLOUDINARY CONFIG — Alternativa GRATUITA a Firebase Storage
// ============================================================
// Cloudinary es 100% GRATIS sin tarjeta de crédito (25GB incluidos)
//
// PASOS PARA CONFIGURAR (5 minutos):
// 1. Ve a https://cloudinary.com y crea una cuenta gratis
// 2. En el Dashboard copia tu "Cloud name"
// 3. Ve a Settings → Upload → Add upload preset
//    → Signing Mode: "Unsigned" → Save
// 4. Copia el nombre del preset y pégalo abajo
// ============================================================

export const cloudinaryConfig = {
    cloudName:    "TU_CLOUD_NAME_AQUI",   // Ej: "dxyz12345"
    uploadPreset: "TU_UPLOAD_PRESET_AQUI" // Ej: "chatflow_unsigned"
};

