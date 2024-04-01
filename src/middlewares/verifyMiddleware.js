// Importación del módulo jsonwebtoken para la gestión de tokens JWT
const jwt = require("jsonwebtoken");
// Importación del servicio de usuarios
const UsersServices = require("../services/usersServices.js")
// Creación de una instancia del servicio de usuarios
const service = new UsersServices();

// Middleware para verificar la validez del token JWT en la solicitud
const verifyToken = async (req, res, next) => {
    // Extrae el token de las cookies de la solicitud
    const { token } = req.cookies;

    // Verifica si no hay token presente en las cookies
    if (!token) {
        return res.status(400).json({ message: "No hay token" });
    } else {
        // Verifica el token JWT utilizando la clave secreta
        jwt.verify(token, process.env.SECRET, async (err, user) => {
            // Manejo de errores de verificación del token
            if (err) return res.status(401).json({ message: "El token no es válido" });
            
            // Busca al usuario asociado al token en la base de datos
            const userFound = await service.findOneId(user.id);  
            
            // Verifica si el usuario asociado al token se encuentra en la base de datos
            if (!userFound) return res.status(401).json({ message: "No se encontró el usuario" });
            
            // Asigna el usuario encontrado a la solicitud para su uso posterior
            req.user = userFound;

            // Pasa al siguiente middleware
            next();
        });
    }
}

// Middleware para verificar si el usuario es administrador
const verifyAdmin = async (req, res, next) => {
    // Extrae el token de las cookies de la solicitud
    const { token } = req.cookies;

    try {
        // Verifica el token JWT utilizando la clave secreta
        jwt.verify(token, process.env.SECRET, async (err, user) => {
            // Busca al usuario asociado al token en la base de datos
            const userFound = await service.findOneId(user.id);  

            // Manejo de errores de verificación del token
            if (err) return res.status(401).json({ message: "El token no es válido" });

            // Verifica si el usuario tiene privilegios de administrador
            if (userFound.user_admin) {
                // Si el usuario es administrador, pasa al siguiente middleware
                next();
            } else {
                // Si el usuario no es administrador, devuelve un error
                return res.status(400).json({ message: "No eres administrador" });
            }
        });
    } catch (error) {
        // Manejo de errores generales
    }
}

module.exports = { verifyToken, verifyAdmin };