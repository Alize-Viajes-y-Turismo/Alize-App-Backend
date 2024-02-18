const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersControllers.js");
const verifyMiddleware = require("../middlewares/verifyMiddleware.js");
const { body } = require("express-validator");

//Rutas generales
router.post("/users/login", usersController.loginUser);

router.put("/users/password", verifyMiddleware.verifyToken, usersController.updatePassword);

router.post("/users/register",
body("name").isLength( {min: 6} ).withMessage("El nombre debe tener mínimo 6 carácteres"),
body("password").isLength( {min: 8} ).withMessage("La contraseña debe tener mínimo 8 carácteres"),
usersController.registerUser);

module.exports = router ;