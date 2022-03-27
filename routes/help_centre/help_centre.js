// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const HelpRouter = express.Router();

// IMPORTING CONSTROLLERS
const helpController = require('../../controllers/help_centre/help_centre');

// ASSIGNING SPECIFIC FUNCTIONS IN CONTROLLERS TO SPECIFIC ROUTES
HelpRouter.get('/', helpController.getHelp);

// EXPORTING ROUTER
module.exports = { HelpRouter }