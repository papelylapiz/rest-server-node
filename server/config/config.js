// ===================================
// Puerto
// ===================================
process.env.PORT = process.env.PORT || 3000;

// ========================================
// Entorno
// ========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; 

// ========================================
// BAse de datos
// ========================================
let urlDB;
if(process.env.NODE_ENV ==='dev'){
    urlDB='mongodb://localhost:27017/cafe'
}else{
    urlDB = 'mongodb+srv://strike:1QfwzDaWymPzeZ0Q@cluster0.e4upd.mongodb.net/cafe';
}

process.env.urlDB = urlDB;