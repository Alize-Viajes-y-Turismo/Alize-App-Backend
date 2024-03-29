const { validationResult } = require("express-validator");

const validator = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json(errors.errors);
    } else {
        next();
    }
}

module.exports = { validator };