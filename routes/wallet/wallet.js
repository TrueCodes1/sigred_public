// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const WalletRouter = express.Router();

// IMPORTING CONSTROLLERS
const walletController = require('../../controllers/wallet/wallet');

// ASSIGNING SPECIFIC FUNCTIONS IN CONTROLLERS TO SPECIFIC ROUTES
WalletRouter.get('/', walletController.getWallet);
WalletRouter.post('/show-my-balance', walletController.showBalance);

// EXPORTING ROUTER
module.exports = { WalletRouter }