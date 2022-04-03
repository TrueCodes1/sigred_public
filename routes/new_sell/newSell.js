// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const SellRouter = express.Router();

// IMPORTING CONSTROLLERS
const sellController = require('../../controllers/new_sell/newSell');

// ASSIGNING SPECIFIC FUNCTIONS IN CONTROLLERS TO SPECIFIC ROUTES
SellRouter.get('/', sellController.getSell);

// EXPORTING ROUTER
module.exports = { SellRouter }