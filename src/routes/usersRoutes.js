import { Router } from "express";
import { loginUser, registerUser, updateProfile, deleteUser, verifyToken, updatePassword, getUsers } from "../controllers/usersControllers.js";
import { protect, admin } from "../middlewares/validateToken.js";
import { body } from "express-validator";

const router = Router();

//Rutas generales
router.post("/users/login", loginUser);
router.put("/users/profile", protect, updateProfile);
router.put("/users/password", protect, updatePassword);

//Rutas del administrador
router.post("/users/register",

body("name").isLength( {min: 8} ).withMessage("El nombre debe tener mínimo 8 carácteres"),

body("password").isLength( {min: 8} ).withMessage("La contraseña debe tener mínimo 8 carácteres"),

protect, admin, registerUser);

router.post("/users/login", loginUser);

router.delete("/users/:id", protect, admin, deleteUser);

router.get("/users", protect, admin, getUsers);

//Rutas de verificación para el front
router.get("/verify", verifyToken);

export default router;