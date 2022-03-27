// IMPORTIN ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const MainRouter = express.Router();

// IMPORTIN SPECIFIC ROUTERS FOR SPECIFIC ROUTES
const Index = require('./routes/index/index');
const About = require('./routes/about/about');
const Contact = require('./routes/contact/contact');
const Cookies = require('./routes/cookies_policy/cookies_policy');
const Privacy = require('./routes/privacy_policy/privacyPolicy');
const Terms = require('./routes/terms_of_use/terms');
const Help = require('./routes/help_centre/help_centre');
const GetLogin = require('./routes/login/get_login');
const LogIn = require('./routes/login/logIn');
const LogOut = require('./routes/login/logOut');
const Profile = require('./routes/profile/profile');
const Messages = require('./routes/messages/messages');

// *************************************************************************************************
// ASSIGNING SPECIFIC ROUTES TO SPECIFIC ROUTERS ***************************************************
// *************************************************************************************************

// BOTH '/' AND '/index' ROUTES ARE DIRECTING TO HOMEPAGE
MainRouter.use('/', Index.IndexRouter);
MainRouter.use('/index', Index.IndexRouter);
MainRouter.use('/about', About.AboutRouter);
MainRouter.use('/contact', Contact.ContactRouter);
MainRouter.use('/cookies-policy', Cookies.CookiesRouter);
MainRouter.use('/privacy-policy', Privacy.PrivacyRouter);
MainRouter.use('/terms-of-use', Terms.TermsRouter);
MainRouter.use('/help-centre', Help.HelpRouter);
MainRouter.use('/login', GetLogin.GetLogInRouter);
MainRouter.use('/sessionLogin', LogIn.LogInRouter);
MainRouter.use('/sessionLogout', LogOut.LogOutRouter);
MainRouter.use('/profile', Profile.ProfileRouter);
MainRouter.use('/messages', Messages.MessagesRouter);

// *************************************************************************************************
// ASSIGNING SPECIFIC ROUTES TO SPECIFIC ROUTERS ENDS HERE *****************************************
// *************************************************************************************************

//EXPORTING MAIN ROUTER
module.exports = MainRouter;