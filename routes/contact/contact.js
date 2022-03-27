// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const ContactRouter = express.Router();

// IMPORTING CONSTROLLERS
const contactController = require('../../controllers/contact/contact');

// ASSIGNING SPECIFIC FUNCTIONS IN CONTROLLERS TO SPECIFIC ROUTES
ContactRouter.get('/', contactController.getContact);

// EXPORTING ROUTER
module.exports = { ContactRouter }