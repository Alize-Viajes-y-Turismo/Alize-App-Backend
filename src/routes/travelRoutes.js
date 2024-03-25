const express = require("express");
const router = express.Router();
const travelController = require("../controllers/travelsControllers.js");
const { validator } = require("../middlewares/validator.js");


//Rutas generales
router.post("/travel/create/:id", travelController.registerTravel); 

router.delete("/travel/delete/:id", travelController.deleteTravel); 

router.get("/travel", travelController.travels); 

module.exports = router;