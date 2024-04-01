const jwt = require("jsonwebtoken");

// Función para crear un token de acceso JWT con el ID de usuario
function createAccessToken(id) {
    // Generar el token JWT con el ID del usuario
    return jwt.sign({ id: id }, process.env.SECRET, {
        // Configurar la expiración del token a 1 día
        expiresIn: "1d",
    });
}

// Función para crear un token de acceso JWT con el correo electrónico del usuario (para enviar correos electrónicos de verificación)
function createAccessTokenSendEmail(email) {
    // Generar el token JWT con el correo electrónico del usuario
    return jwt.sign({ email: email }, process.env.SECRET, {
        // Configurar la expiración del token a 10 minutos
        expiresIn: "10m",
    });
}

// Exportar las funciones para su uso en otras partes de la aplicación
module.exports = { createAccessToken, createAccessTokenSendEmail };

