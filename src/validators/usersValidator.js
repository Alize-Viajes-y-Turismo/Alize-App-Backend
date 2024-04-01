const { body } = require("express-validator");

// Validador para el registro de usuarios
const registerUserValidator = () => {
    return [
        // Validación del campo de correo electrónico
        body("email", "Ingrese un email válido")
            .isEmail() // Verifica si el valor es un correo electrónico válido
            .normalizeEmail() // Normaliza el correo electrónico eliminando espacios en blanco y caracteres especiales
            .trim() // Elimina espacios en blanco al principio y al final
            .escape(), // Escapa los caracteres especiales

        // Validación del campo de contraseña
        body("password", "La contraseña debe tener como mínimo 6 caracteres")
            .trim() // Elimina espacios en blanco al principio y al final
            .escape() // Escapa los caracteres especiales
            .isLength({ min: 6 }) // Verifica si la longitud de la contraseña es al menos 6 caracteres
    ];
};

// Validador para el inicio de sesión de usuarios
const loginUserValidator = () => {
    return [
        // Validación del campo de correo electrónico
        body("email", "Ingrese un email válido")
            .isEmail() // Verifica si el valor es un correo electrónico válido
            .normalizeEmail() // Normaliza el correo electrónico eliminando espacios en blanco y caracteres especiales
            .trim() // Elimina espacios en blanco al principio y al final
            .escape(), // Escapa los caracteres especiales

        // Validación del campo de contraseña
        body("password", "La contraseña debe tener como mínimo 6 caracteres")
            .trim() // Elimina espacios en blanco al principio y al final
            .escape() // Escapa los caracteres especiales
            .isLength({ min: 6 }) // Verifica si la longitud de la contraseña es al menos 6 caracteres
    ];
};

// Validador para actualizar la contraseña del usuario
const updatePasswordValidator = () => {
    return [
        // Validación del campo de contraseña
        body("password", "La contraseña debe tener como mínimo 6 caracteres")
            .trim() // Elimina espacios en blanco al principio y al final
            .escape() // Escapa los caracteres especiales
            .isLength({ min: 6 }) // Verifica si la longitud de la contraseña es al menos 6 caracteres
    ];
};
module.exports = { registerUserValidator, loginUserValidator, updatePasswordValidator };