const express = require('express');
const app = express();

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./producto'));

app.get('/', (req,res)=>{
    res.render('index'//Indica cual es el nombre del archivo  
    , {
        idClient: process.env.CLIENT_ID //Envia el dato para ser recuperado en la vista {{ idClient }}
    }); //va renderizar el archivo 
})

module.exports = app;