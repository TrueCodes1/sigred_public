// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const CookiesRouter = express.Router();

// IMPORTING CONSTROLLERS
const cookiesController = require('../../controllers/cookies_policy/cookies_policy');

// ASSIGNING SPECIFIC FUNCTIONS IN CONTROLLERS TO SPECIFIC ROUTES
CookiesRouter.get('/', cookiesController.getCookies);

// EXPORTING ROUTER
module.exports = { CookiesRouter }