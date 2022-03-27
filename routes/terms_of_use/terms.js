// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const TermsRouter = express.Router();

// IMPORTING CONSTROLLERS
const termsController = require('../../controllers/terms_of_use/terms');

// ASSIGNING SPECIFIC FUNCTIONS IN CONTROLLERS TO SPECIFIC ROUTES
TermsRouter.get('/', termsController.getTerms);

// EXPORTING ROUTER
module.exports = { TermsRouter }