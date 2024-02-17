import jwt from "jsonwebtoken"

export function createAccesToken(id){

    return jwt.sign( { id: id }, process.env.SECRET, {
            expiresIn: "1d",
    });

};

