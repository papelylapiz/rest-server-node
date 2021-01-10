const express = require('express');
const app = express();
const _ = require('underscore')
const {verificaToken, verificaAdminRole} = require('../middlewares/authentication');

let Categoria = require('../models/categoria');

// ========================================
// Mostrar todas las categorias
// ========================================
app.get('/categoria', verificaToken, (req,res)=>{

    let limite = req.params.limite || 10;
    let desde = req.params.desde || 0;

    Categoria.find({ }, // Para hacer filtros 
            'descripcion' // Para hacer exclusiones
            )
            .sort('descripcion')
            .populate('usuario', 'nombre email')//para poblar las referencias definidas en el modelo de Categoria
            .skip(desde)
            .limit(limite)
            .exec((err,categorias)=>{

                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }
                
                res.json({
                    ok:true,
                    categorias
                })
    })
});

// ========================================
// Mostrar categorias por ID
// ========================================
app.get('/categoria/:id', verificaToken,(req,res)=>{
    
    let id = req.params.id;

    Categoria.findById(id, (err,categoria)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!categoria){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            })
        }
        res.json({
            ok: true,
            categoria
        })
    })
});

// ========================================
// Crear nueva categoria
// ========================================
app.post('/categoria', verificaToken, (req, res)=>{
    
    let body = _.pick(req.body, ['descripcion']); // permite filtrar los campos que se quieres actualizar

    let categoria =  new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario
    });
    console.log(categoria);
    categoria.save((err,categoriaBD)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!categoriaBD){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok:true,
            categoria: categoriaBD
        })
    })
});

// ========================================
// Actualizar categoria
// ========================================
app.put('/categoria/:id', [verificaToken, verificaAdminRole],(req,res)=>{
    let id = req.params.id;
    
    let body = _.pick(req.body, ['descripcion'] ); // permite filtrar los campos que se quieres actualizar

    let opt = {
        new: true, // Esto es para que retorne la info actualizada
        runValidators: true // habilita la validación especificada en el modelo
    }

    Categoria.findByIdAndUpdate(id, body ,opt ,(err,categoriaBD)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!categoriaBD){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            })
        }
        res.json({
            ok:true,
            categoria: categoriaBD
        })
    })
});

// ========================================
// Eliminar la categoria
// ========================================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole],(req,res)=>{

    let id= req.params.id;
    
    Categoria.findByIdAndRemove(id, (err,categoria)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!categoria){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            })
        }
        res.json({
            ok:true,
            categoria
        })
    });
})
module.exports = app;