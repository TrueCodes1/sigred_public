// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const ItemsRouter = express.Router();

// IMPORTING CONSTROLLERS
const itemsController = require('../../controllers/items/items');

// ASSIGNING SPECIFIC FUNCTIONS IN CONTROLLERS TO SPECIFIC ROUTES
ItemsRouter.get('/', itemsController.getItems);

// EXPORTING ROUTER
module.exports = { ItemsRouter }