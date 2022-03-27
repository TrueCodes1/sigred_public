// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const PrivacyRouter = express.Router();

// IMPORTING CONSTROLLERS
const privacyController = require('../../controllers/privacy_policy/privacyPolicy');

// ASSIGNING SPECIFIC FUNCTIONS IN CONTROLLERS TO SPECIFIC ROUTES
PrivacyRouter.get('/', privacyController.getPrivacy);

// EXPORTING ROUTER
module.exports = { PrivacyRouter }