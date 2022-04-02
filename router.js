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
const Registrate = require('./routes/login/registrate');
const LogIn = require('./routes/login/logIn');
const LogOut = require('./routes/login/logOut');
const Profile = require('./routes/profile/profile');
const Messages = require('./routes/messages/messages');
const Items = require('./routes/items/items');
const Wallet = require('./routes/wallet/wallet');
const Admin = require('./routes/admin/admin');
const AdminLogin = require('./routes/admin/adminLogin');
const AdminDashboard = require('./routes/admin/adminDashboard');

const Error = require('./routes/error/error');

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
MainRouter.use('/registrate', Registrate.RegistrateRouter);
MainRouter.use('/login', GetLogin.GetLogInRouter);
MainRouter.use('/sessionLogin', LogIn.LogInRouter);
MainRouter.use('/sessionLogout', LogOut.LogOutRouter);
MainRouter.use('/profile', Profile.ProfileRouter);
MainRouter.use('/messages', Messages.MessagesRouter);
MainRouter.use('/items', Items.ItemsRouter);
MainRouter.use('/wallet', Wallet.WalletRouter);
MainRouter.use('/admin', Admin.AdminRouter);
MainRouter.use('/admin-login', AdminLogin.AdminLoginRouter);
MainRouter.use('/admin-dashboard', AdminDashboard.AdminDashboardRouter);

MainRouter.use(Error.ErrorRouter);

// *************************************************************************************************
// ASSIGNING SPECIFIC ROUTES TO SPECIFIC ROUTERS ENDS HERE *****************************************
// *************************************************************************************************

//EXPORTING MAIN ROUTER
module.exports = MainRouter;