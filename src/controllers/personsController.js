const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createAccesToken } = require("../libs/jwt.js"); 

const PersonsService = require("../services/usersService.js")
const service = new PersonsService();

