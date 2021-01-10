const express = require('express');
const fs = require('fs');
let app = express();
let {verificaTokenUrl} = require('../middlewares/authentication')
let path = require('path');

app.get('/imagen/:tipo/:img',verificaTokenUrl, (req,res)=>{
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${img}`) ;
    if(!fs.existsSync(pathImagen)){
        pathImagen = path.resolve(__dirname, '../assets/not_found.png');
    }
    res.sendFile(pathImagen);
})

module.exports = app;