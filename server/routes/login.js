const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario');



app.post('/login', (req,res)=>{

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        } 

        if(!usuarioBD){
            return res.status(400).json({
                                    ok: false,
                                    err: {
                                        message : 'Usuario o contraseña incorrectos'
                                    }
                                })
        }        

        if(!bcrypt.compareSync(body.password, usuarioBD.password)){
            return res.status(400).json({
                                ok: false,
                                err: {
                                    message: 'Contraseña no concuerda'
                                }
                            })
        }

        let token = jwt.sign({
            usuario: usuarioBD //Asigno el objeto usuario al paylod
        }, process.env.SEED, //Firma generada desde servidor
        { expiresIn : process.env.DATE_CADUCA_TOKEN }) //Tiempo de expiración

        res.json({
            ok:true,
            usuario: usuarioBD,
            token
        })

    })


   
})






module.exports = app;