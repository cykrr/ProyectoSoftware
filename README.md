# Sistema de Aula Virtual

## Creación del Proyecto

Para instalar e ingresar a la carpeta del proyecto, puede abrir una terminal de Windows o de Visual Studio Code y escribir los comandos

```
git clone https://github.com/cykrr/ProyectoSoftware.git; cd ProyectoSoftware
```


## Backend

Para instalar las dependencias del backend, es necesario entrar a la carpeta que lo contiene.

```
cd backend; npm install
```

Este, además requiere que se esté ejecutando la base de datos MongoDB y MySQL/MariaDB

## Base de datos SQL (MariaDB)

Para instalar MariaDB es posible utilizar el paquete 
[XAMPP](https://www.apachefriends.org/download.html). El cual además posee la herramienta Phpmyadmin que se utilizará para crear una base de datos.

1. Instalar XAMPP
2. Abrir Panel de control XAMPP
3. Inicializar servidor Apache2 y MySQL
4. acceder a la opción "admin" de MySQL desde el panel de control o, acceder a la url http://localhost/phpmyadmin
5. En la barra de navegación del lado izquierdo, presionar el botón "New" para añadir una base de datos con el nombre `nest`.
![image](https://github.com/cykrr/ProyectoSoftware/assets/21285912/3502711b-8375-4773-a7e0-580f9149eb21)


## Base de datos NoSQL (MongoDB)

Para instalar MongoDB utilizar el siguiente enlace [MongoDB](https://www.mongodb.com/try/download/community), seleccionar
plataforma y arquitectura correspondientes.

Para ejecutar MongoDB utilizar el comando:

```
# Ruta en C:\Program Files\MongoDB (Notar que esto se selecciona al instalar, esta es la ruta predeterminada, puede variar).
'C:\Program Files\MongoDB\bin\mongod.exe'
```

Finalmente, es posible ejecutar el backend con

```
npm run start
# ó
npx nest start
# ó
nest start
```

## Frontend

Al igual que con el backend, instalamos las dependencias NodeJS

```
cd frontend; npm install
```

luego, podemos ejecutar el frontend con
```
npm run start
# ó
npx ng serve
# ó
ng serve
```

## Uso de la aplicación

Para ingresar a la aplicación, puede utilizar las siguientes credenciales:

### Profesor

- RUT: 21256405
- Contraseña: admin

### Alumno

- RUT: 12345678
- Contraseña: password