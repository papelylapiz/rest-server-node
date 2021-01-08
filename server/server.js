const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('./config/config');

//Configuro middleware para la recepción de datos desde las peticiones http
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'));
mongoose.connect(process.env.urlDB
                            , {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
                            ,(err, client) => {
    if(err) throw err;
    console.log('Conectado a la BD cafe MONGO');
});

app.listen(process.env.PORT , ()=>{
    console.log(`Escuchando en el puerto ${process.env.PORT }`);
})