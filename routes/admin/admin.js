// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const AdminRouter = express.Router();

// IMPORTING CONSTROLLERS
const adminController = require('../../controllers/admin/admin');

// ASSIGNING SPECIFIC FUNCTIONS IN CONTROLLERS TO SPECIFIC ROUTES
AdminRouter.get('/', adminController.getAdmin);

// EXPORTING ROUTER
module.exports = { AdminRouter }