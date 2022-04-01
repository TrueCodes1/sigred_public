// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const AdminDashboardRouter = express.Router();

// IMPORTING CONSTROLLERS
const adminDashboardController = require('../../controllers/admin/adminDashboard');

// ASSIGNING SPECIFIC FUNCTIONS IN CONTROLLERS TO SPECIFIC ROUTES
AdminDashboardRouter.get('/', adminDashboardController.getDashboard);

// EXPORTING ROUTER
module.exports = { AdminDashboardRouter }