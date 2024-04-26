const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/usersControllers.js");
const verifyMiddleware = require("../middlewares/verifyMiddleware.js");

//Iniciar sesiòn

router.post("/users/login", usersControllers.loginUser);

//Cerrar sesiòn

router.get("/users/logout", verifyMiddleware.verifyToken, usersControllers.logoutUser);

//Cambiar contraseña

router.put("/users/updatepassword", verifyMiddleware.verifyToken, usersControllers.updatePassword);

//Cambiar nombre

router.put("/users/updatename", verifyMiddleware.verifyToken, usersControllers.updateName);

//Recuperar contraseña

router.put("/users/recoverypassword", usersControllers.recoveryPassword);

//Registrar usuario

router.post("/users/register", usersControllers.registerUser);

//Enviar email

router.post("/users/sendemailverificationcode", usersControllers.sendEmailVerificationCode);

//Verificación de código

router.post("/users/verifycode", usersControllers.verifyCode);

//Verificación de usuario

router.post("/users/verifyuser", usersControllers.verifyUser);

//Verificación de cookie

router.post("/users/verifytoken", usersControllers.verifyTokenNavigation);

//Obtener datos del usuario

router.get("/users/getprofiledata", verifyMiddleware.verifyToken, usersControllers.getProfileData);

module.exports = router;