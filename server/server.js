const express = require('express');
const app= express();

const bodyParser = require('body-parser');

require('./config/config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.get('/', (req,res)=>{
    res.json('Hola mundo');
});

app.get('/usuario', (req,res)=>{
    res.json('Consultar Usuario');
});

app.post('/usuario',(req,res)=>{
    let body = req.body;
    if(body.nombre===undefined){
        res.status(400).json({
            ok:false,
            messaje:'El nombre es necesario'
        })
    }else{
        res.json({
            persona: body    
        })
    }
});
//Actualizar registros
app.put('/usuario/:id', (req,res)=>{
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario', (req,res)  => {
    res.json('Cambio de estado');
})

app.listen(process.env.PORT , ()=>{
    console.log(`Escuchando en el puerto ${process.env.PORT }`);
})