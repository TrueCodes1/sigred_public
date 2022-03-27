// IMPORTING ALL NECCESSARY FUNCTIONS
const verifySessionCookie = require('../../functions/general/verifySessionCookie');

// IMPORTING OTHER NECCESSARY FILES
const loggedIn = require('../../loggedIn').loggedIn;


// GET 
const login = async (req, res) => {

    // USING VERIFY SESSION COOKIE FINCTION WITH REQUEST AS ARGUMENT
    // TO CHECK STATE OF THE USER IF THEY ARE LOGGED IN
    let userRecord = await verifySessionCookie.verifySessionCookie(req);
    if (userRecord) {
        
        let uid = userRecord.uid;
        if (loggedIn[uid]) {
            delete loggedIn[uid];
        }
        
        res.clearCookie('session');
        res.render('login', {title: 'Login', name: '', data: req,  password_state: 'ok', scroll: 'false', user: 'none'})
    
    } else {
        
        res.clearCookie('session');
        res.render('login', {title: 'Login', name: '', data: req,  password_state: 'ok', scroll: 'false', user: 'none'})

    }
}

// EXPORTING ALL THE FUNCTIONS
module.exports = { login }
