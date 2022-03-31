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
            let admin = checkAdmin.checkAdmin(uid.toString());
            let pwd = req.body.password;
            if (admin == true) {
                if (pwd == adminPWD) {
                    const adminCookieString = adminCookie.randomCookieString().adminLoggedIn;
                    res.cookie(
                        'adminLoggedIn', 
                        JSON.stringify(adminCookieString), 
                        adminCookie.randomCookieString().options 
                    )
                    adminsLoggedIn.push(adminCookieString);
                    setTimeout(() => {
                        adminsLoggedIn.splice(adminsLoggedIn.indexOf(adminCookieString), 1);
                    }, 1000 * 60 * 10)
                    // FINSIH FROM HERE ON, MAKE EVERY ADMIN ROUTE CHECK THE COOKIE
                    res.redirect('/admin-dashboard')
                } else {
                    res.redirect('/admin')
                }
            } else {
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
