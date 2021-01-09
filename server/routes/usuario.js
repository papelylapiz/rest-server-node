const express= require('express')
const bcrypt = require('bcrypt')
const _ = require('underscore')
const app = express();
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/authentication');

app.get('/', (req,res)=>{
    res.json('Hola mundo');
});

//Listar todos los usuarios
app.get('/usuario', verificaToken ,(req,res)=>{
    //Obtener el payload desde el token
    /*return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email
    });*/

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find(
        { estado: true }, // Para hacer filtros 
        'nombre email rol estado google img' // Para hacer exclusiones
        )
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios)=>{
            if(err){
                res.status(400).json({
                    ok:false,
                    err
                })
            }

            // Agregar campos al objeto de salida
            Usuario.countDocuments({ estado:true }, (err, conteo)=>{

                res.json({
                    ok:true,
                    usuarios,
                    cuantos: conteo
                })
            })


    })


});

app.post('/usuario', [verificaToken, verificaAdminRole ],(req,res)=>{
    
    let body = req.body;

    let usuario = new Usuario({
        nombre : body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    //usuarioDB.password = null;

    usuario.save( (err, usuarioDB) => {
       
        if( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

   /* if(body.nombre===undefined){
        res.status(400).json({
            ok:false,
            messaje:'El nombre es necesario'
        })
    }else{
        res.json({
            persona: body    
        })
    }*/
});

//Actualizar registros
app.put('/usuario/:id', [verificaToken, verificaAdminRole ], (req,res)=>{
    let id = req.params.id;
    
    let body = _.pick(req.body , ['nombre','email','img','role','estado']); // permite filtrar los campos que se quieres actualizar

    let opt = {
                new : true, // Esto es para que retorne la info actualizada
                runValidators: true // habilita la validación especificada en el modelo
            } 

    Usuario.findByIdAndUpdate(id, body // data filtrada
                                , opt
                                , (err, usuarioDB) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                msg: err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })

});


app.delete('/usuario/:id', [verificaToken, verificaAdminRole ],(req,res)  => {

    let id = req.params.id;

    let opt = {
        new : true
    }

    let cambiaEstado= {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, opt, (err, usuarioBD)=>{
        if(err){
            res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            usuario: usuarioBD
        })
    })

    /*Usuario.findByIdAndRemove(id,(err, usuarioBorrado)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        if(!usuarioBorrado){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })

    });   */

})

module.exports = app;
