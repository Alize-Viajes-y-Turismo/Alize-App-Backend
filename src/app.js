const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const usersRoutes = require('./routes/usersRoutes.js');
const passengersRoutes = require("./routes/passengerRoutes.js");
const dotenv = require("dotenv");
const cors = require('cors');



const server = express();

server.name = "API";

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(morgan("dev"));
server.use(express.json());
dotenv.config();
server.use(cors(
  {
      origin: "http://http://localhost:3001/",
      credentials: true,
  }
));
server.use(cookieParser());


// Rutas users
server.use('/api', usersRoutes);

// Rutas passengers
server.use("/api", passengersRoutes);

// Middleware para manejo de errores
server.use((err, req, res, next) => { 
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;