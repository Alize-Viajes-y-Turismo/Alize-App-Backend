// Importación del módulo express-validator y destructuración de la función body
const { body } = require("express-validator");

// Función que retorna un array de validaciones para el registro de pasajeros
const registerPassengerValidator = () => {
    return [
        // Validación del campo "name"
        body("name", "Ingrese un nombre válido") // Mensaje de error si la validación falla
            .notEmpty() // El campo no debe estar vacío
            .trim() // Elimina los espacios en blanco del principio y del final
            .escape() // Escapa los caracteres especiales para evitar ataques XSS
            .isLength({ min: 2, max: 50 }) // La longitud del nombre debe estar entre 2 y 50 caracteres
            .withMessage('El nombre debe tener entre 2 y 50 caracteres'), // Mensaje de error personalizado

        // Validación del campo "surname"
        body("surname", "Ingrese un apellido válido")
            .notEmpty()
            .trim()
            .escape()
            .isLength({ min: 2, max: 50 })
            .withMessage('El apellido debe tener entre 2 y 50 caracteres'),

        // Validación del campo "dni"
        body("dni", "Ingrese un DNI válido")
            .notEmpty()
            .trim()
            .escape()
            .isLength({ min: 8, max: 8 }) // El DNI debe tener exactamente 8 dígitos
            .withMessage('El DNI debe tener 8 dígitos') // Mensaje de error si la longitud no es válida
            .matches(/^[0-9]+$/, "i") // El DNI debe contener solo números
            .withMessage('El DNI debe contener solo números'), // Mensaje de error personalizado

        // Validación del campo "phone"
        body("phone", "Ingrese un número de teléfono válido")
            .notEmpty()
            .trim()
            .escape()
            .isLength({ min: 10, max: 11 }) // El número de teléfono debe tener entre 10 y 11 dígitos
            .withMessage('El número de teléfono debe contener entre 10 a 11 dígitos') // Mensaje de error si la longitud no es válida
            .matches(/^[0-9]+$/, "i") // El número de teléfono debe contener solo números
            .withMessage('El número de teléfono debe contener solo números') // Mensaje de error personalizado
    ];  
};

module.exports = { registerPassengerValidator };