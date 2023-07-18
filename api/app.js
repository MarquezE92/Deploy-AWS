
const mongoose = require('mongoose');  //*  Biblioteca de modelado de objetos de MongoDB diseñada para Node.
const express = require('express');    //* Framework web para Node.js
const routes = require('./src/routes/index'); //En routes tenemos los endpoints de nuestra API

require("dotenv").config();     //*Para usar las variables de entorno de nuestro archivo .env

// INICIALIZACION
const app = express();  //* creo una instancia de la aplicación de Express

//MIDDLEWARES
    //* Son funciones que se ejecutan en el flujo de solicitud y respuesta y pueden realizar diversas tareas, 
    //*como manipular los datos de la solicitud, realizar validaciones, autenticar usuarios...

app.use(express.json());            //* Utilizamos el método json() para parsear las solicitudes entrantes con formato JSON.
                            //* Configuración personalizada de cors 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); //* para permitir solicitudes desde nuestro front
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //* tipos de encabezados permitidos
    res.header('Access-Control-Allow-Methods', 'GET, POST');            //* métodos HTTP permitidos
    next();                                                //* Pasa la solicitud al siguiente middleware en la cadena de manejo de solicitudes.
});

// CONFIGURACION DE PUERTO
app.set('port', process.env.PORT || 3002)

// APPLICATION CODE MONGO DB
const url =  process.env.MONGO_URL //* URL de conexión a la base de datos MongoDB en la nube = Atlas

// UNION DE MONGODB CON LA APLICACION
const connectionParams = {          //* definimos las opciones de configuración para la conexión de MongoDB.
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(url, connectionParams)     //* Usamos Mongoose para la conexión a la db de Mongo
    .then(() => {                           //* connect devuelve una promesa
        console.log('Connected to the database ')
    })
    .catch((err) => {
        console.error(`Error connecting to the database. n${err}`);
    })


app.use('/', routes);
//* Al establecer '/' como punto de montaje, este middleware se aplica a todas las solicitudes que lleguen.
//* 'routes' contiene la lógica para manejar las solicitudes GET y POST que definimos en la carpeta de routes.

module.exports = app