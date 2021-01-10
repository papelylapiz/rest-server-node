const jwt = require('jsonwebtoken');

// ========================================
// Verificar Token
// ========================================
let verificaToken = (req,res,next) =>{
    let token = req.get('authorization');

    //Verificación de token authorization
    jwt.verify(token, process.env.SEED, (err, decoded)=>{
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }
        //Pasar los datos del payload a la solicitud
        req.usuario = decoded.usuario;
        next(); //Para indicar que continue con los otrosa procesos
    })
    console.log(token);
}


// ========================================
// Verificar ADMIN_ROLE
// ========================================
let verificaAdminRole = (req, res, next) =>{
    let usuario = req.usuario;

    if(usuario.role!=='ADMIN_ROLE'){
        return res.json({
            ok:false,
            err:{
                message: 'El usuario no es administrador'
            }
        })
    }
    next();
}

// ========================================
// Verificar Token URL
// ========================================
let verificaTokenUrl = (req,res,next) =>{
    let token = req.query.token;

    //Verificación de token authorization
    jwt.verify(token, process.env.SEED, (err, decoded)=>{
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }
        //Pasar los datos del payload a la solicitud
        req.usuario = decoded.usuario;
        next(); //Para indicar que continue con los otrosa procesos
    })
    
}

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenUrl
    };