const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const usersRoutes = require('./routes/usersRoutes.js');
const UserPasswordRoutes = require('./routes/user-password.js');
const passengersRoutes = require("./routes/passengerRoutes.js");
const dotenv = require("dotenv");


require("./db.js");

const server = express();

server.name = "API";

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
server.use(express.json());
dotenv.config();
server.use(express.static("./public"));

// Rutas users
server.use('/api', usersRoutes);
server.use('/api', UserPasswordRoutes);

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