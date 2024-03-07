const jwt = require("jsonwebtoken");

function createAccesToken(id){

    return jwt.sign( { id: id }, process.env.SECRET, {
            expiresIn: "1d",
    });

};

function createAccesTokenSendEmail(email){
    
    return jwt.sign( { email: email }, process.env.SECRET, {
            expiresIn: "10m",
    });

};

module.exports = { createAccesToken, createAccesTokenSendEmail };

