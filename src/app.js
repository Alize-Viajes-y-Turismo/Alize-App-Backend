//Importar modulos
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const dotenv = require("dotenv");
const cors = require('cors');

//Importar rutas
const usersRoutes = require('./routes/usersRoutes.js');
const passengersRoutes = require("./routes/passengerRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const travelsRoutes = require("./routes/travelsRoutes.js"); // Asegúrate de tener este archivo

//Server
const server = express();

server.name = "API";

//Usar modulos
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(morgan("dev"));
server.use(express.json());
dotenv.config();
server.use(cors(
  {
      origin: "http://http://localhost:3001/", // Asegúrate de tener la URL correcta
      credentials: true,
  }
));
server.use(cookieParser());


//Rutas users
server.use('/api', usersRoutes);

//Rutas passengers
server.use("/api", passengersRoutes);

// Rutas de administrador
server.use("/api", adminRoutes);

// Rutas de viajes
server.use("/api", travelsRoutes);

//Middleware para manejo de errores
server.use((err, req, res, next) => { 
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;