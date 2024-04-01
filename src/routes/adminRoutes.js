const express = require("express");
const router = express.Router();
const adminControllers = require("../controllers/adminControllers.js");

// Rutas generales

// Obtener información de un usuario específico por su ID
router.get("/admin/user/:id", adminControllers.getUsers);

// Eliminar un usuario específico por su ID
router.delete("/admin/user/:id", adminControllers.deleteUser);

// Obtener información de un pasajero específico por su ID
router.get("/admin/passengers/:id", adminControllers.getPassenger);

// Eliminar un pasajero específico por su ID
router.delete("/admin/passengers/:id", adminControllers.deletePassenger);

// Crear un nuevo administrador
router.put("/admin/user/createAdmin", adminControllers.createAdmin);

// Pagar un pasajero
router.put("/admin/passengers/pay", adminControllers.passengerPay);

module.exports = router;