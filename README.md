# Deploy-AWS
## Guía completa de cómo desplegar tu web app MERN en una instancia EC2 de AWS

### ✔ ¿Todavía no tenés una cuenta en AWS?

- Podés buscar AWS en google (Las primeras opciones son publcidades de cursos).
- En la opción de amazon.com, hacer click en Amazon EC2.
- Hacer click en nivel gratuito -> Comience de forma gratuita.
- Completar formulario con mail (método de comunicación de Amazon) y nombre de la cuenta.
- Se enviará un mail con un código de verificación.
- Una vez verificado el mail, creamos una contraseña para nuestra cuenta.
- Después verificamos que no seamos un robot.
- Ingresamos nuestros datos personales y cómo vamos a utilizar la cuenta (personal/empresarial)
- Completar con los datos de nuestra tarjeta de crédito/débito.
NOTA: No se cobrará el uso que esté por debajo de los límites del nivel gratuito de AWS. Puede retenerse temporalmente hasta 1 USD (o una cantidad equivalente en moneda local) como transacción pendiente durante 3-5 días para verificar su identidad.
- Completamos la verificación vía teléfono (mensaje de texto) y volvemos a verificar que somos humanos.
NOTA: Puede demorarse un poco el verificar la tarjeta y no se puede continuar con el proceso de registro hasta que añada un método de pago válido.
- Por último elegimos plan de soporte (en este caso el gratuito) y finalizamos el registro.
- Ya podemos comenzar a usar los servicios de AWS.

### ✔ Ahora creamos una instancia EC2
- Nos logueamos en Amazon.
- Una vez ingresamos a AWS Management Console, buscamos EC2 ("Elastic Compute Cloud") en el buscador.
- ¿Qué es esto? -> Básicamente vamos a estar alquilando instancias de servidores virtuales de Amazon en función de nuestra demanda. Al ser tan flexible y escalable, esta opción es muy popular.
- Hacemos click en "Lanzar la instancia"
- Vamos a elegir Ubuntu como sistema operativo, asegurándonos de que el servidor elegido sea **Apto para la capa gratuita**.
- Hacemos click en crear un nuevo par de claves.
- Nombramos nuestro par de claves, elegimos la opción '.ppk' y damos click en crear.
- Automáticamente se nos descargan nuestro par de claves, que vamos a guardar en un lugar seguro que recordemos.
- Lo siguiente es la configuración del grupo de seguridad y vamos a permitir:
    - Tráfico SSH desde cualquier lugar (nos va a permitr la comunicación desde nuestra terminal con el servidor Ec2, usado el puerto 22)
    - Tráfico HTTP (puerto 80, para poder acceder a nuestra aplicación web)
- Y finalmente lanzamos la instancia.
- Podemos verla haciendo click en ver instancia o en el botón "Instancias" del menú lateral.

### ✔ ¿Cómo nos conectamos a una instancia de Linux desde Windows? -> PuTTY
- Instalamos PuTTY en nuestro equipo siguiendo las mismas instrucciones de la página de AWS.
- Las podemos encontrar ingresando PuTTY en el buscador.
- Una vez instalado, abrimos PuTTY, en Host Name vamos a escribir 'ubuntu@[nuestra DNS de IPv4 pública]'
- De manera opcional, nos dicen que en la sección de Conexión, podemos determinar (en cantidad de segundos) el intervalo para que se envíen datos para mantener la sesión activa (Esto es útil para evitar desconectarse de su instancia por inactividad en la sesión).
- Dentro de Conexión, vamos a expandir SSH, después Autenticación y entrar a credenciales. Acá vamos a buscar el archivo con el par de claves que creamos en el paso anterior.
- Por último seleccionamos abrir y al ser la primera vez que nos conectamos a esta instancia, PuTTY muestra un cuadro de diálogo de alerta de seguridad que le pregunta si tiene confianza en el host al que se está conectando. Aceptamos y ya estamos conectados a la instancia. 

### ✔ Ya está corriendo nuestra instancia, ya nos conectamos a la misma ¿Qué sigue?
- Vamos a usar Nginx, un servidor web de código abierto, para que se quede escuchando nuestras solicitudes.
- Si ingresamos **pwd** en la consola, vamos a ver en qué carpeta estamos: home/ubuntu
- Lo primero que vamos a hacer es un **sudo apt-get update** (paso previo a instalar cualquier programa en el server)
- Con **sudo apt-get upgrade** nos encargamos de actualizar los paquetes de software instalados en el sistema, puede usarse regularmente para asegurarnos de que el sistema esté actualizado con las últimas mejoras y parches disponibles.
- Ahora ya podemos instalar git y nginx **sudo apt install git nginx**
- Y una vez instalados podemos iniciar nginx con un **sudo service nginx start**
- Ahora si volvemos a dirigirnos a la dirección IPv4 pública de nuestra instancia, nos vamos a encontrar con un mensaje de que nginx está funcionando.
- Lo que vemos en pantalla es el contenido del archivo que se encuentra en /var/www/html.
- Ahora ya sabemos dónde va a tener que ir el build de nuestra aplicación, ahora traigámosla con un **sudo git clone**
- Lo siguiente es instalar Node con: **sudo curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - &&\sudo apt-get install -y nodejs**
- Lo siguiente es instalar todas las dependencias necesarias para nuestra aplicación.
- Vamos a hacer un **cd [nombre de nuestro archivo back]** y un **sudo npm install**
- Lo mismo con nuestro front.
- Y ahora con un **sudo npm run build** vamos a crear el archivo de build que nginx muestre nuestra página.
- Nos dirigimos a **cd /var/wwww/** donde estaba el html de nginx y vamos a crear nuestra carpeta **sudo mkdir deployAws** por ejemplo.
- Vamos a usar esa carpeta para poner todos los archivos de nuestro build ahí.
- Con un **sudo chown -R ubuntu deployAws** nos olvidamos de tener problemas de permisos cuando estemos manipulando el contenido de esta carpeta.
- Ahora copiamos los archivos con un **sudo cp -r ~/Deploy-AWS/client/build/* /var/www/deployAws**.
- Ahora tenemos que modificar el archivo de configuración para que apunte a nuestra nueva carpeta **cd /etc/nginx/sites-enabled/**, luego **sudo nano default**.
-  Cambiamos el /var/www/html por /var/www/depoyAws.
- Recargamos **sudo service nginx reload**
- Ya tenemos nuestro front desplegado!
- Pero nos falta la conexión con nuestro back.
- Así que tenemos que volver a **cd ~** e instalar **sudo npm install pm2 -g**
- pm2 va a mantener nuestro back corriendo.
- Nos posicionamos en la carpeta de nuestro back y hacemos **sudo pm2 start index.js --name "api"**
- Ahora ya podemos volver a nuestro archivo de configuración.
- **cd /etc/nginx/sites-enabled/**, luego **sudo nano default**
- Y vamos a configurar el reverse proxy:
<br>
location / {
            root /var/www/deployAws;
            index index.html;
            try_files $uri /index.html$is_args$args =404;
    }

location /api/ {
	proxy_pass http://localhost:3002/;
}
- Ahora bien, nuestro back está levantado, pero para conectarlo solo falta crear los .env y agregar la url de nuestro back.
- Recordemos que el ip desde donde se hace el pedido a nuestra basede datos tiene que estar en la whiteList para que nos permita realizar las consultas.



