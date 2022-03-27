// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const IndexRouter = express.Router();

// IMPORTING CONSTROLLERS
const indexController = require('../../controllers/index/index');

// ASSIGNING SPECIFIC FUNCTIONS IN CONTROLLERS TO SPECIFIC ROUTES
IndexRouter.get('/', indexController.getIndex);

// EXPORTING ROUTER
module.exports = { IndexRouter }