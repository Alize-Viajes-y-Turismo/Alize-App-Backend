const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersControllers.js");
const verifyMiddleware = require("../middlewares/verifyMiddleware.js");
const { registerUserValidator, loginUserValidator, updatePasswordValidator } = require("../validators/usersValidator.js");
const { validator } = require("../middlewares/validator.js");

//Rutas generales
router.post("/users/login", [ loginUserValidator(), validator ], usersController.loginUser);

router.put("/users/password", [ updatePasswordValidator(), validator ], verifyMiddleware.verifyToken, usersController.updatePassword);

router.post("/users/register", [registerUserValidator(), validator], usersController.registerUser);

router.get("/verify", verifyMiddleware.verifyToken);

module.exports = router;