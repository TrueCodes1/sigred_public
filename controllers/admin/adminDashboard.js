// IMPORTING NECCESSARY NODE MODULES
const htmlencode = require('htmlencode');

// IMPORTING ALL NECCESSARY FUNCTIONS
const firebase = require('../../databaseConnection');
const verifySessionCookie = require('../../functions/general/verifySessionCookie');
const crypto = require('../../functions/general/crypto');
const checkAdmin = require('../../functions/general/checkAdmin');
const adminCookie = require('../../functions/adminLogin/randomCookieString');

// IMPORTING OTHER NECCESSARY FILES
const adminUID = process.env.ADMIN_UID;
const adminPWD = process.env.ADMIN_PWD;
const adminsLoggedIn = require('../../adminLoggedIn').adminsLoggedIn;

// DEFINING SPECIFIC PARTS OF IMPORTED FUNCTIONS
const db = firebase.db;
const admin = firebase.admin;
const bucket = firebase.bucket;

const encrypt = crypto.encrypt;
const decrypt = crypto.decrypt;


// GET

const postAdminLogin = async (req, res) => {

    // USING VERIFY SESSION COOKIE FINCTION WITH REQUEST AS ARGUMENT
    // TO CHECK STATE OF THE USER IF THEY ARE LOGGED IN
    let userRecord = await verifySessionCookie.verifySessionCookie(req);

    if (userRecord) {
            
        let info = {
            name: '',
            lastName: '',
            email: '',
            country: '',
            city: '',
            age: ''
        }
        
        let uid = userRecord.uid;
        db.ref('/users/'+uid.toString()+'/personal-info').get()
        .then((data) => {
            if (data.exists()){
                let all = data.val();
                info.name = all.name;
                info.lastName = all.lastName;
                info.email = all.email;
                info.country = all.country;
                info.city = all.city;
                info.age = all.age;
            } else {
                console.log("Data don't exist.")
            }
        })
        .then(() => {
            // DEFINING VARIABLE ADMIN, RETURNED BOOLEAN VALUE
            let admin = checkAdmin.checkAdmin(uid.toString());
            // GRABBING PWD VALUE FROM REQUEST
            let pwd = req.body.password;
            // IF THE ID OF USER IS THE ONE OF ADMIN, FURTHER
            // ACTIONS HAPPEN. ELSEWAYS USER IS REDIRECTED TO HOMEPAGE
            if (admin == true) {
                // THE PWD IS CHECKED
                if (pwd == adminPWD) {
                    // IF PWD IS CORRECT, STRING FOR COOKIE IS CREATED VIA IMPORTED FUNCTION
                    const adminCookieString = adminCookie.randomCookieString().adminLoggedIn;
                    // COOKIE IS ASSIGNED TO THE RESPONSE
                    res.cookie(
                        'admin-logged-in', 
                        JSON.stringify(adminCookieString), 
                        adminCookie.randomCookieString().options 
                    )
                    // THE COOKIE STRING IS SAVED IN THE LIST OF LOGGED IN ADMINS
                    // AND IS DELETED AFTER 10 MINUTES. ADMIN THEN HAS TO LOG IN AGAIN.
                    adminsLoggedIn.push(adminCookieString);
                    // TIMEOUT FOR DELETING THE CURRENT SESSION STRING
                    setTimeout(() => {
                        adminsLoggedIn.splice(adminsLoggedIn.indexOf(adminCookieString), 1);
                    }, 1000 * 60 * 10)
                    // DASHBOARD IS FINALLY RENDERED AFTER SUCCESSFUL LOGIN
                    res.redirect('/admin-dashboard')
                } else {
                    // IF THE PWD IS WRONG, USER IS REDIRECTED TO THE ADMIN PAGE (BACK WHERE THEY WERE)
                    res.redirect('/admin')
                }
            } else {
                // IF THE USER'S ID IS NOT THE ONE OF THE ADMIN, USER IS REDIRECTED
                // TO THE HOMEPAGE
                res.redirect('/index')
            }
        })

    } else {
        res.clearCookie('session');
        res.render('login', {title: 'Login', name: '', data: req,  password_state: 'ok', scroll: 'false', user: 'none'})
    }
}

// EXPORTING ALL THE FUNCTIONS
module.exports = { postAdminLogin }
