// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const AdminDashboardRouter = express.Router();

// IMPORTING CONSTROLLERS
const adminDashboardController = require('../../controllers/admin/adminDashboard');

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ASSIGNING SPECIFIC FUNCTIONS IN CONTROLLERS TO SPECIFIC ROUTES ------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// GET REQUESTS

AdminDashboardRouter.get('/', adminDashboardController.getDashboard);
AdminDashboardRouter.get('/user/:id', adminDashboardController.getUser);

// POST REQUESTS

AdminDashboardRouter.post('/data-for-admin-search-engine', adminDashboardController.fetchSearchEngineData);

/**************************************
 * POST REQUEST ABOUT USER START HERE *
 * ***********************************/

AdminDashboardRouter.post('/message-from-admin-to-user', adminDashboardController.messageUser);
AdminDashboardRouter.post('/disable-account', adminDashboardController.disableAccount);
AdminDashboardRouter.post('/enable-account', adminDashboardController.enableAccount);

/**************************************
 * POST REQUEST ABOUT USER END HERE *
 * ***********************************/

/*****************************************************************************************************
 * **************************************************************************************************/

/**************************************
 * POST REQUEST ABOUT ITEM START HERE *
 * ***********************************/

 AdminDashboardRouter.post('/message-from-admin-to-seller', adminDashboardController.messageSeller);
 AdminDashboardRouter.post('/disable-item', adminDashboardController.disableItem);
 AdminDashboardRouter.post('/enable-item', adminDashboardController.enableItem);

/**************************************
 * POST REQUEST ABOUT ITEM START HERE *
 * ***********************************/

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// EXPORTING ROUTER
module.exports = { AdminDashboardRouter }