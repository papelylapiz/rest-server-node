const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

//Validación de google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


const Usuario = require('../models/usuario');



app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
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
                { expiresIn: process.env.DATE_CADUCA_TOKEN }) //Tiempo de expiración

        res.json({
            ok: true,
            usuario: usuarioBD,
            token
        })

    })



})

//Configuraciones de Google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            })
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        //Si el usuario existe en base de datos
        if (usuarioDB && !usuarioDB.google) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Debe hacer la autenticación normal'
                }
            })
        }
        //Si el suaurio no existe en base de datos
        if (!usuarioDB) {
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';
            usuario.save((err1, usuarioDB1) => {
                if (err1) {
                    return res.status(400).json({
                        ok: false,
                        err1
                    })
                }

                token = jwt.sign({
                    usuario: usuarioDB1
                }, process.env.SEED, { expiresIn: process.env.DATE_CADUCA_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB1,
                    token
                })


            });
        }
        token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.DATE_CADUCA_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })

    })
})



module.exports = app;