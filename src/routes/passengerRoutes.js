const express = require("express");
const router = express.Router();
const passengersController = require("../controllers/passengersControllers.js");
const verifyMiddleware = require("../middlewares/verifyMiddleware.js");

// Rutas generales

// Ruta para el registro de pasajeros
router.post("/passengers/register", verifyMiddleware.verifyToken, passengersController.registerPassenger);

// Ruta para eliminar un pasajero
router.delete("/passengers/deletepassenger", verifyMiddleware.verifyToken, passengersController.deletePassenger);

// Ruta para obtener los pasajeros de un usuario
router.get("/users/passengers", verifyMiddleware.verifyToken, passengersController.getUserPassengers);

module.exports = router;