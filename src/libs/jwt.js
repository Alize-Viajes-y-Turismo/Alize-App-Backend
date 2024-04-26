const jwt = require("jsonwebtoken");

function createAccesToken(id, verified){

    return jwt.sign( { id: id, verified: verified }, process.env.SECRET, {
            expiresIn: "1d",
    });

};

module.exports = { createAccesToken };

