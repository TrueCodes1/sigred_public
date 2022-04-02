// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const AdminDashboardRouter = express.Router();

// IMPORTING CONSTROLLERS
const adminDashboardController = require('../../controllers/admin/adminDashboard');

// ASSIGNING SPECIFIC FUNCTIONS IN CONTROLLERS TO SPECIFIC ROUTES

// GET REQUESTS
AdminDashboardRouter.get('/', adminDashboardController.getDashboard);
AdminDashboardRouter.get('/user/:id', adminDashboardController.getUser);

// POST REQUESTS
AdminDashboardRouter.post('/data-for-admin-search-engine', adminDashboardController.fetchSearchEngineData);

// EXPORTING ROUTER
module.exports = { AdminDashboardRouter }