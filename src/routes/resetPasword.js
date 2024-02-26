const express = require("express");
const router = express.Router();
const sendEmail = require('../controllers/sendEmail.js')
const resetPassword = require('../controllers/resetPassword.js')

//Rutas generales


router.post('/sendEmail', sendEmail )
router.post('/resetPassword:token', resetPassword )

module.exports = router;