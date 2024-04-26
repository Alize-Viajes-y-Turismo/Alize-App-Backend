const express = require("express");
const router = express.Router();
const travelController = require("../controllers/travelsControllers.js");
const verifyMiddleware = require("../middlewares/verifyMiddleware.js");

// Rutas para administradores

// Ruta para crear un nuevo viaje (solo administradores)
router.post("/admin/travel/create", verifyMiddleware.verifyToken, verifyMiddleware.verifyAdmin, travelController.registerTravel); 

// Ruta para eliminar un viaje por su ID (solo administradores)
router.delete("/admin/travel/delete", verifyMiddleware.verifyToken, verifyMiddleware.verifyAdmin, travelController.deleteTravel); 

module.exports = router;