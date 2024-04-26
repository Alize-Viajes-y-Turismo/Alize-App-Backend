const express = require("express");
const router = express.Router();
const travelController = require("../controllers/travelsControllers.js");
const verifyMiddleware = require("../middlewares/verifyMiddleware.js");

// Ruta para obtener todos los viajes (todos los usuarios)
router.get("/travel", verifyMiddleware.verifyToken, travelController.travels); 

module.exports = router;