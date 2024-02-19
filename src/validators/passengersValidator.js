const { body } = require("express-validator");

const registerPassengerValidator = () => {
    return [
        body("name", "Ingrese un nombre válido")
        .notEmpty()
        .trim()
        .escape()
        .isLength({ min: 2, max: 50 })
        .withMessage('El nombre debe tener entre 2 y 50 caracteres'),

        body("surname", "Ingrese un apellido válido")
        .notEmpty()
        .trim()
        .escape()
        .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres'),

        body("dni", "Ingrese un DNI válido")
        .notEmpty()
        .trim()
        .escape()
        .isLength({ min: 8, max: 8 })
        .matches(/^[0-9]+$/, "i")
        .withMessage('El DNI debe contener solo números')
        .withMessage('El DNI debe tener 8 dígitos'),

        body("phone", "Ingrese un número de teléfono válido")
        .notEmpty()
        .trim()
        .escape()
        .isLength({ min: 10, max: 11 })
        .matches(/^[0-9]+$/, "i")
        .withMessage('El número de teléfono debe contener solo números')
        .withMessage('El número de teléfono debe contener entre 10 a 11 dígitos'),
    ]  
};

module.exports = { registerPassengerValidator };