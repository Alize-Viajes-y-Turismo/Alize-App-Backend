// Importación del módulo jsonwebtoken para la gestión de tokens JWT
const jwt = require("jsonwebtoken");
// Importación del servicio de usuarios
const UsersServices = require("../services/usersServices.js");
// Creación de una instancia del servicio de usuarios
const service = new UsersServices();

// Middleware para verificar la validez del token JWT recibido en el cuerpo de la solicitud
const verifyTokenNavigation = async (req, res, next) => {
    // Extrae el token del cuerpo de la solicitud
    const { token } = req.body;

    // Verifica si no hay token presente en el cuerpo de la solicitud
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

            // Si el token es válido y el usuario existe, devuelve los datos del usuario
            res.json({ data: {
                id: userFound.id,
                email: userFound.email
            }});
        });
    }
}

module.exports = { verifyTokenNavigation };
