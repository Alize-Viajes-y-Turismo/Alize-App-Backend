const jwt = require("jsonwebtoken");
const { User } = require("../db");

const verifyToken = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(400).json({ message: "No hay token" });
    } else {
        jwt.verify(token, process.env.SECRET, async (err, user) => {
            if (err) return res.status(401).json({ message: "El token no es válido" });

            try {
                const userFound = await User.findOne({ where: { id: user.id }, attributes: ['id'] });

                if (!userFound) return res.status(401).json({ message: "No se encontró el usuario" });

                req.user = userFound;
                next();
            } catch (error) {
                console.error("Error al verificar el token:", error);
                return res.status(500).json({ message: "Error interno del servidor" });
            }
        });
    }
};

const verifyAdmin = async (req, res, next) => {
    const { token } = req.cookies;

    try {
        jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
            if (err) return res.status(401).json({ message: "El token no es válido" });

            const user = await User.findByPk(decodedToken.id);

            if (!user) return res.status(401).json({ message: "No se encontró el usuario" });

            if (user.isAdmin) {
                next();
            } else {
                return res.status(400).json({ message: "No eres administrador" });
            }
        });
    } catch (error) {
        console.error("Error al verificar el token de administrador:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

module.exports = { verifyToken, verifyAdmin };