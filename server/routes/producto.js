const express = require('express');
const _ = require('underscore');
const { verificaToken } = require('../middlewares/authentication');
const app = express();
let Producto = require('../models/producto');


// ========================================
// Listar Productos
// ========================================
app.get('/productos',verificaToken,(req,res)=>{
    //todos
    //populate usuario, categoria
    //paginado

    let desde = req.params.desde || 0;
    desde = Number(desde);
    let hasta = req.params.limite || 10;
    hasta = Number(hasta);

    Producto.find({})
                .populate('categoria', 'descripcion')
                .populate('usuario', 'nombre email img')
                .skip(desde)
                .limit(hasta)
                .exec((err,productoBD)=>{
                    if(err){
                        return res.status(400).json({
                            ok: false,
                            err
                        })
                    }
                    res.json({
                        ok: true,
                        producto: productoBD
                    })
    })


});

// ========================================
// Obtener un producto
// ========================================
app.get('/productos/:id',verificaToken, (req,res)=>{
    let id = req.params.id;
    
    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoBD)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            if(!productoBD){
                return res.status(400).json({
                    ok:false,
                    err: {
                        message: 'No se encontro el producto'
                    }
                })
            }
            res.json({
                ok:true,
                producto: productoBD
            })
    })

});


// ========================================
// Buscar producto
// ========================================
app.get('/productos/buscar/:termino', verificaToken, (req,res)=>{
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i'); // i es para que sea insencible a mayusculas y minusculas
    Producto.find({ nombre: regex })
            .populate('categoria', 'descripcion')
            .exec((err,productos)=>{
                if(err){
                    res.status(500).json({
                        ok:false,
                        err
                    })
                }

                res.json({
                    ok: true,
                    producto:productos
                })


            })
})

// ========================================
// Crear un producto
// ========================================
app.post('/productos', verificaToken ,(req,res)=>{
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err,productoBD)=>{
        if(err){
            res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productoBD){
            res.status(400).json({
                ok:false,
                err: {
                    message: 'No se pudo insertar producto'
                }
            })
        }

        res.status(201).json({
            ok: true,
            producto:productoBD
        })
    })

});

// ========================================
// Actualizar un producto
// ========================================
app.put('/productos/:id',verificaToken, (req,res)=>{
    //guardar usuario
    //save categoria
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoBD)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!productoBD){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'No se pudo encontrar el producto'
                }
            })
        }

        productoBD.nombre=body.nombre;
        productoBD.precioUni=body.precioUni;
        productoBD.descripcion=body.descripcion;
        productoBD.disponible=body.disponible;
        productoBD.categoria=body.categoria;
        //productoBD.usuario=body.usuario;

        productoBD.save((err,productoSave)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if(!productoSave){
                return res.status(400).json({
                    ok:false,
                    err: {
                        message: 'No se pudo actualizar el producto'
                    }
                })
            }
            res.json({
                ok:true,
                producto: productoSave
            })
        })
        

    })

});

// ========================================
// Eliminar un producto
// ========================================
app.delete('/productos/:id', verificaToken,(req,res)=>{
    let id = req.params.id;
    
    Producto.findById(id, (err, productoBD)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productoBD){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro el producto'
                }
            })
        }

        productoBD.disponible=false;

        productoBD.save((err,productoBorrado)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            if(!productoBorrado){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se pudo eliminar el producto'
                    }
                })
            }
            res.json({
                ok: true,
                producto: productoBorrado
            })

        })

    })
   
});

module.exports = app;