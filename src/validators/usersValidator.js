const { body } = require("express-validator");

const registerUserValidator = () => {
    return [
        body("email", "Ingrese un email válido")
            .isEmail()
            .normalizeEmail()
            .trim()
            .escape(),
        body("password", "La contraseña debe tener como mínimo 6 carácteres")
            .trim()
            .escape()
            .isLength({ min: 6 })
    ]   
};

const loginUserValidator = () => {
    return [
        body("email", "Ingrese un email válido")
            .isEmail()
            .normalizeEmail()
            .trim()
            .escape(),
        body("password", "La contraseña debe tener como mínimo 6 carácteres")
            .trim()
            .escape()
            .isLength({ min: 6 })
    ]
};

const updatePasswordValidator= () => {
    return [
        body("password", "La contraseña debe tener como mínimo 6 carácteres")
            .trim()
            .escape()
            .isLength({ min: 6 })
    ]
};

module.exports = { registerUserValidator, loginUserValidator, updatePasswordValidator };