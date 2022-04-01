// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const ErrorRouter = express.Router();

// IMPORTING CONSTROLLERS
const errorController = require('../../controllers/error/error');

// ASSIGNING SPECIFIC FUNCTIONS IN CONTROLLERS TO SPECIFIC ROUTES
ErrorRouter.use(errorController.errorHandler);

// EXPORTING ROUTER
module.exports = { ErrorRouter }