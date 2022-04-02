// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const RegistrateRouter = express.Router();

// IMPORTING CONSTROLLERS
const registrateController = require('../../controllers/login/registrate');

// ASSIGNING SPECIFIC FUNCTIONS IN CONTROLLERS TO SPECIFIC ROUTES
RegistrateRouter.post('/', registrateController.registrate);

// EXPORTING ROUTER
module.exports = { RegistrateRouter }