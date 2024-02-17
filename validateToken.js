import jwt from "jsonwebtoken"
import { pool } from "../db.js";

//Protección por verificación de token
const protect = async (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        res.status(404);
    }

    try {
            const decoded = jwt.verify(token, process.env.SECRET);

            const [result] = await pool.query('SELECT * FROM users WHERE user_id = ?', [decoded.id]);  
            req.user = result[0];

            next();

    } catch (error) {
            console.log(error);
            res.status(404);
    }
};

//Verificación si el usuario es admin
const admin = (req, res, next) => {

    if (req.user && req.user.user_admin) {
        next();
    } else {
        res.status(404);
        throw new Error("No es un admin");
    }

}

export { protect, admin };

