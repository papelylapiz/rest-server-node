// ===================================
// Puerto
// ===================================
process.env.PORT = process.env.PORT || 3000;

// ========================================
// Entorno
// ========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ========================================
// Fecha de vencimiento Token
// ========================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.DATE_CADUCA_TOKEN = '48h';

// ========================================
// SEED de authentication
// ========================================
process.env.SEED = process.env.SEED || 'Este-es-ambiente-desarrollo';



// ========================================
// Base de datos
// ========================================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.urlDB = urlDB;

// ========================================
// Google Client ID
// ========================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '575333234595-6sqk9ck84g3u9fmhkv5fi0du50dmcerh.apps.googleusercontent.com';