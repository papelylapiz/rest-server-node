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
process.env.DATE_CADUCA_TOKEN = 60 * 60 * 24 * 30;

// ========================================
// SEED de authentication
// ========================================
process.env.SEED = process.env.SEED || 'Este-es-ambiente-desarrollo';



// ========================================
// Base de datos
// ========================================
let urlDB;
if(process.env.NODE_ENV ==='dev'){
    urlDB='mongodb://localhost:27017/cafe'
}else{
    urlDB = process.env.MONGO_URL;
}

process.env.urlDB = urlDB;