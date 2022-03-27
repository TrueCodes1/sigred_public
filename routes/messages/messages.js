// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const MessagesRouter = express.Router();

// IMPORTING CONSTROLLERS
const messagesController = require('../../controllers/messages/messages');

// ASSIGNING SPECIFIC FUNCTIONS IN CONTROLLERS TO SPECIFIC ROUTES
MessagesRouter.get('/', messagesController.getMessages);

// EXPORTING ROUTER
module.exports = { MessagesRouter }