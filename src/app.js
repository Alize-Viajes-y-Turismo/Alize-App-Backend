const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan'); // Middleware para el registro de solicitudes HTTP
const usersRoutes = require('./routes/usersRoutes.js'); // Rutas relacionadas con los usuarios
const passengersRoutes = require("./routes/passengerRoutes.js"); // Rutas relacionadas con los pasajeros
const dotenv = require("dotenv"); // Para cargar variables de entorno desde un archivo .env
const cors = require('cors'); // Middleware para habilitar CORS
const travelRoutes = require("./routes/travelRoutes.js"); // Rutas relacionadas con los viajes
const adminRoutes = require("./routes/adminRoutes.js"); // Rutas relacionadas con los administradores

const server = express();

server.name = "API";

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" })); // Middleware para analizar cuerpos de solicitud codificados en URL
server.use(bodyParser.json({ limit: "50mb" })); // Middleware para analizar cuerpos de solicitud JSON
server.use(morgan("dev")); // Registro de solicitudes HTTP en la consola durante el desarrollo
server.use(express.json()); // Middleware para analizar cuerpos de solicitud JSON
dotenv.config(); // Carga las variables de entorno del archivo .env en process.env
server.use(cors(
  {
      origin: "http://http://localhost:3001/", // Permitir solicitudes desde este origen
      credentials: true, // Permitir el intercambio de cookies de autenticación
  }
));
server.use(cookieParser()); // Middleware para analizar cookies de las solicitudes entrantes

// Rutas users
server.use('/api', usersRoutes);

// Rutas passengers
server.use("/api", passengersRoutes); 

// Rutas travels
server.use("/api", travelRoutes);

// Rutas Admin
server.use('/api', adminRoutes);

// Middleware para manejo de errores
server.use((err, req, res, next) => { 
  const status = err.status || 500; // Código de estado predeterminado 500 (error del servidor)
  const message = err.message || err; // Mensaje de error predeterminado si no se proporciona un mensaje específico
  console.error(err); // Registro del error en la consola
  res.status(status).send(message); // Envío del mensaje de error al cliente con el código de estado adecuado
});

module.exports = server; // Exporta el servidor Express configurado