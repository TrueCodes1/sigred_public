// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const ProfileRouter = express.Router();

// IMPORTING CONSTROLLERS
const profileController = require('../../controllers/profile/profile');

// ASSIGNING SPECIFIC FUNCTIONS IN CONTROLLERS TO SPECIFIC ROUTES
ProfileRouter.get('/', profileController.getProfile);

// EXPORTING ROUTER
module.exports = { ProfileRouter }