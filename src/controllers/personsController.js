const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createAccesToken } = require("../libs/jwt.js"); 

const personsService = require("../services/usersService.js")
const service = new personsService();

