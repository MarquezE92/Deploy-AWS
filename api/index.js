const app = require('./app')

//*  Toma dos argumentos: el puerto en el que se desea que el servidor escuche y una función de devolución de llamada
//* que se ejecutará una vez que el servidor esté escuchando.
// SERVIDOR ESCUCHANDO EN                           //* Usamos la instancia de Express para iniciar un servidor HTTP
const server = app.listen(app.get('port'), () => {  //* La propiedad 'port', que se configuró en la línea 33, nos da el número del puerto en el
                                                    //* que el servidor va a estar escuchando las solicitudes entrantes
  console.log("Server listening at", app.get('port'))
});
