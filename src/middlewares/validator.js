// Importación del módulo express-validator y destructuración de la función validationResult
const { validationResult } = require("express-validator");

// Middleware para validar los resultados de la validación de la solicitud
const validator = (req, res, next) => {
    // Obtiene los errores de validación de la solicitud
    const errors = validationResult(req);
    
    // Verifica si hay errores de validación
    if (!errors.isEmpty()) {
        // Si hay errores, envía una respuesta de error 400 con los errores encontrados
        res.status(400).json(errors.errors);
    } else {
        // Si no hay errores, pasa al siguiente middleware
        next();
    }
}

module.exports = { validator };