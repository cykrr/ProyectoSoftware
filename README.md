# Sistema de Aula Virtual

## Backend

El Framework Backend a utilizar será NestJS. Para instalar la herramienta CLI
utilizar el comando:

```
npm i -g @nestjs/cli
```

## Frontend

El Framework Frontend a utilizar será Angular JS. Para instalar la herramienta
CLI utilizar el comando:

```
npm i -g @angular/cli
```

## Base de datos NoSQL (MongoDB)

Se optó por una base de datos no relacional debido a su facilidad para
almacenar grandes volúmenes de datos de distinto tipo.

Para instalar MongoDB `mongod.exe` puedes utilizar la siguiente página:
[MongoDB](https://www.mongodb.com/try/download/community)

Para instalar el Shell de MongoDB `mongosh.exe` (para tareas administrativas)
puedes utilizar la siguiente página
[MongoDB Shell](https://www.mongodb.com/try/download/shell)

Recuerda añadir ambas herramientas al $PATH.

Para acceder a esta BD desde el backend se utilizará la librería de NodeJS
`mongoose`

## Base de datos SQL (MariaDB)

Por otro lado se necesitará una BD de tipo relacional para poder almacenar
información como las cuentas de los usuarios y las asignaciones de Documentos
correspondientes. Para instalar MariaDB puedes utilizar el paquete 
[XAMPP](https://www.apachefriends.org/download.html)

Para acceder a esta BD se utilizará la librería `TypeORM`
