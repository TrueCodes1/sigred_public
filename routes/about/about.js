// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const AboutRouter = express.Router();

// IMPORTING CONSTROLLERS
const aboutController = require('../../controllers/about/about');

// ASSIGNING SPECIFIC FUNCTIONS IN CONTROLLERS TO SPECIFIC ROUTES
AboutRouter.get('/', aboutController.getAbout);

// EXPORTING ROUTER
module.exports = { AboutRouter }