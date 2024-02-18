const jwt = require("jsonwebtoken");

function createAccesToken(id){

    return jwt.sign( { id: id }, process.env.SECRET, {
            expiresIn: "1d",
    });

};

module.exports = { createAccesToken };

