// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const AdminLoginRouter = express.Router();

// IMPORTING CONSTROLLERS
const adminLoginController = require('../../controllers/admin/adminLogin');

// ASSIGNING SPECIFIC FUNCTIONS IN CONTROLLERS TO SPECIFIC ROUTES
AdminLoginRouter.post('/', adminLoginController.postAdminLogin);

// EXPORTING ROUTER
module.exports = { AdminLoginRouter }