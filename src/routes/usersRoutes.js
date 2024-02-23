const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/usersControllers.js");
const verifyMiddleware = require("../middlewares/verifyMiddleware.js");
const { registerUserValidator, loginUserValidator, updatePasswordValidator } = require("../validators/usersValidator.js");
const { validator } = require("../middlewares/validator.js");

//Rutas generales

//Login
router.post("/users/login", [ loginUserValidator(), validator ], usersControllers.loginUser);

router.get("/users/logout", verifyMiddleware.verifyToken, usersControllers.logoutUser);

//Update password

router.put("/users/password", [ updatePasswordValidator(), validator ], usersControllers.updatePassword);

//Register

router.post("/users/register", [registerUserValidator(), validator], usersControllers.registerUser);

router.delete("/users/delete", verifyMiddleware.verifyToken, usersControllers.deleteUser);

//Verificación de cookie

router.get("/verify", verifyMiddleware.verifyToken);

module.exports = router;