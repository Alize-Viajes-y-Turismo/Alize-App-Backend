const express = require("express");
const router = express.Router();
const passengersController = require("../controllers/passengersControllers.js");
const verifyMiddleware = require("../middlewares/verifyMiddleware.js");
const { registerPassengerValidator } = require("../validators/passengersValidator.js");
const { validator } = require("../middlewares/validator.js");


//Rutas generales
router.post("/passengers/register", [registerPassengerValidator(), validator], verifyMiddleware.verifyToken, passengersController.registerPassenger);

module.exports = router;