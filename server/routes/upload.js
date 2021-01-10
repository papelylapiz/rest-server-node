const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

app.use( fileUpload({ useTempFiles: true }) );

app.put('/upload/:tipo/:id/', (req,res)=>{

    if(!req.files)
        return res.status(400).json({
            ok:false,
            err: {
                message: 'No se envio archivo'
            }
        })

    let tipo = req.params.tipo;
    let id = req.params.id;

    //Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    
    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok:false,
            err: {
                message: `Los tipos permitidos son: ${tiposValidos.join()}`
            }
        })
    }


    let archivo = req.files.archivo;
    let nombreSplit = archivo.name.split('.');
    let extension = nombreSplit[nombreSplit.length-1];

    //Extensiones validas
    let extensionesValidas= ['png', 'jpg', 'gif', 'jpeg']

    if(extensionesValidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok:false,
            err: {
                message: `Las extensiones permitidas son: ${ extensionesValidas.join(', ') } ` ,
                ext : extension
            }
        })
    }

    // Cambiar nombre al archivo
    let nombreArchivo= `${ id }-${ new Date().getMilliseconds() }.${extension}`;

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err)=>{
       
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        //Aqui la imagen esta cargada
        if(tipo==='usuarios'){
            imagenUsuario(id, res, nombreArchivo);
        }else{
            imagenProducto(id,res,nombreArchivo);
        }
    })
})

function imagenUsuario(id, res, nombreArchivo){
    Usuario.findById(id,(err,usuarioDB)=>{
        if(err){

            borrarArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!usuarioDB){

            borrarArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        //Eliminar archivo existente
        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img= nombreArchivo;
        usuarioDB.save((err, usuarioSave)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok:true,
                usuario: usuarioSave,
                img: nombreArchivo,
                message: 'Imagen subida correctamente'
            })

        })


    })
}

function imagenProducto(id, res, nombreArchivo){
    Producto.findById(id, (err, productoDB)=>{
        if(err){
            borrarArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!productoDB){

            borrarArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Producto no existe'
                }
            })
        }

          //Eliminar archivo existente
        borrarArchivo(productoDB.img, 'productos');

        productoDB.img= nombreArchivo;
        productoDB.save((err, productoSave)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok:true,
                producto: productoSave,
                img: nombreArchivo,
                message: 'Imagen subida correctamente'
            })

        })

         

    })
}

function borrarArchivo(nombreImagen, tipo){
    //Verificar que la ruta exista
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${nombreImagen}`) ;
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;