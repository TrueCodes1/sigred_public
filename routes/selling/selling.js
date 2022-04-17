// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const SellingRouter = express.Router();

// IMPORTING CONSTROLLERS
const sellingController = require('../../controllers/selling/selling');

// ASSIGNING SPECIFIC FUNCTIONS IN CONTROLLERS TO SPECIFIC ROUTES
SellingRouter.get('/:id', sellingController.getItem);
SellingRouter.post('/message-from-client-to-seller', sellingController.messageSeller)

// EXPORTING ROUTER
module.exports = { SellingRouter }