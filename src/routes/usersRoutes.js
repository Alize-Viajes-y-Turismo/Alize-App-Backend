const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/usersControllers.js");
const verifyMiddleware = require("../middlewares/verifyMiddleware.js");
const navigationControllers = require("../controllers/navigationControllers.js");
const { registerUserValidator, loginUserValidator, updatePasswordValidator } = require("../validators/usersValidator.js");
const { validator } = require("../middlewares/validator.js");

// Rutas generales

// Ruta para iniciar sesión de usuario
router.post("/users/login", [loginUserValidator(), validator], usersControllers.loginUser);

// Ruta para cerrar sesión de usuario
router.get("/users/logout", verifyMiddleware.verifyToken, usersControllers.logoutUser);

// Ruta para actualizar la contraseña del usuario
router.put("/users/password", [updatePasswordValidator(), validator], verifyMiddleware.verifyToken, usersControllers.updatePassword);

// Ruta para registrar un nuevo usuario
router.post("/users/register", [registerUserValidator(), validator], usersControllers.registerUser);

// Ruta para eliminar un usuario
router.delete("/users/delete", verifyMiddleware.verifyToken, usersControllers.deleteUser);

// Ruta para verificar la autenticación del usuario mediante una cookie
router.post("/verify", navigationControllers.verifyTokenNavigation);

// Ruta para verificar el código de verificación (PIN)
router.post("/users/verificacion", usersControllers.verification);

// Ruta para enviar correo electrónico de restablecimiento de contraseña
router.post('/sendEmail', verifyMiddleware.verifyToken, usersControllers.sendEmail);

// Ruta para restablecer la contraseña
router.post('/resetPassword', usersControllers.resetPassword);

module.exports = router;