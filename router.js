// IMPORTIN ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const MainRouter = express.Router();

// IMPORTIN SPECIFIC ROUTERS FOR SPECIFIC ROUTES
const Index = require('./routes/index/index');
const About = require('./routes/about/about');
const Contact = require('./routes/contact/contact');
const Cookies = require('./routes/cookies_policy/cookies_policy');
const Help = require('./routes/help_centre/help_centre');
const LogIn = require('./routes/login/logIn');
const LogOut = require('./routes/login/logOut');
const Profile = require('./routes/profile/profile');

// *************************************************************************************************
// ASSIGNING SPECIFIC ROUTES TO SPECIFIC ROUTERS ***************************************************
// *************************************************************************************************

// BOTH '/' AND '/index' ROUTES ARE DIRECTING TO HOMEPAGE
MainRouter.use('/', Index.IndexRouter);
MainRouter.use('/index', Index.IndexRouter);
MainRouter.use('/about', About.AboutRouter);
MainRouter.use('/contact', Contact.ContactRouter);
MainRouter.use('/cookies-policy', Cookies.CookiesRouter);
MainRouter.use('/help-centre', Help.HelpRouter);
MainRouter.use('/sessionLogin', LogIn.LogInRouter);
MainRouter.use('/sessionLogout', LogOut.LogOutRouter);
MainRouter.use('/profile', Profile.ProfileRouter);

// *************************************************************************************************
// ASSIGNING SPECIFIC ROUTES TO SPECIFIC ROUTERS ENDS HERE *****************************************
// *************************************************************************************************

//EXPORTING MAIN ROUTER
module.exports = MainRouter;