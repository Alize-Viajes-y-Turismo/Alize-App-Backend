const express = require("express");
const router = express.Router();
const personsController = require("../controllers/personsController.js");
const verifyMiddleware = require("../middlewares/verifyMiddleware.js");


//Rutas generales
router.post("/persons ", personsController.registerPerson);
router.delete("/persons ", personsController.registerPerson);
router.put("/persons ", personsController.registerPerson);

module.exports = router;