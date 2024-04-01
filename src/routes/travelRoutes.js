const express = require("express");
const router = express.Router();
const travelController = require("../controllers/travelsControllers.js");
const { validator } = require("../middlewares/validator.js");

// Rutas generales

// Ruta para crear un nuevo viaje
router.post("/travel/create/:id", travelController.registerTravel); 

// Ruta para eliminar un viaje por su ID
router.delete("/travel/delete/:id", travelController.deleteTravel); 

// Ruta para obtener todos los viajes
router.get("/travel", travelController.travels); 

module.exports = router;