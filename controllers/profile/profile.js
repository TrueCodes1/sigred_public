// IMPORTING ALL NECCESSARY FUNCTIONS
const firebase = require('../../databaseConnection');
const verifySessionCookie = require('../../functions/general/verifySessionCookie');
const checkAdmin = require('../../functions/general/checkAdmin');

// IMPORTING OTHER NECCESSARY FILES
const adminUID = process.env.ADMIN_UID;
const usersLoggedIn = require('../../loggedIn').loggedIn;

// DEFINING SINGLE SPECIFIC PARTS OF FIREBASE IMPORT
const db = firebase.db;
const admin = firebase.admin;
const bucket = firebase.bucket;

// GET 
const getProfile = async (req, res) => {
    
    // USING VERIFY SESSION COOKIE FINCTION WITH REQUEST AS ARGUMENT
    // TO CHECK STATE OF THE USER IF THEY ARE LOGGED IN
    let userRecord = await verifySessionCookie.verifySessionCookie(req);
    if (userRecord) {
        
        // IF THEY ARE LOGGED IN, FURTHER INFO ARE TAKEN FROM
        // DATABASE AND FINAL EJS VIEW IS RENDERED
        let uid = userRecord.uid;

        // DEFINING JSON FOR INFORMATION ABOUT USER THAT
        // WILL BE SENT TO THE VIEW RENDERED
        let info = {
            name: '',
            lastName: '',
            email: '',
            country: '',
            city: '',
            age: ''
        }
        
        let balance = {
            current: '',
            eur: ''
        }

        if (usersLoggedIn[uid]/*.email/* != '' && usersLoggedIn[uid].email != null && usersLoggedIn[uid].email != undefined*/) {

            db.ref('/users/'+uid.toString()+'/personal-info').get()
            .then((data) => {
                if (data.exists()){
                    let all = data.val();
                    info.name = all.name;
                    info.lastName = all.lastName;
                    info.email = usersLoggedIn[uid].email;
                    info.country = all.country;
                    info.city = all.city;
                    info.age = all.age;
                } else {
                    console.log("Data don't exist.")
                }
            })
            .then(() => {
                db.ref('/users/'+uid.toString()+'/wallet').get()
                .then((data) => {
                if (data.exists()){
                    let all = data.val();
                    balance.current = usersLoggedIn[uid].balance;
                    balance.eur = Number(balance.current * 2).toFixed();/*
                    balance = {
                        current: all.current_balance,
                        eur: Number(all.current_balance)*2
                    }*/
                    console.log(balance)
                } else {
                    console.log("Data don't exist.")
                }
                })
                .then(() => {

                    // CHECKING IF THE USER ID IS THE SAME AS THE ONE OF THE ADMIN
                    // IF YES, TRUE IS SET AS VALUE OF ADMIN AND 
                    // THERE WILL BE ADMIN OPTION ON THE FINAL VIEW RENDERED
                    let admin = checkAdmin.checkAdmin(uid.toString());
                    res.render('profile', {title: 'Profile', info: info, status: '', balance: balance, admin: admin})
                })
            })
            
        } else {

            res.clearCookie('session');
            res.render('login', {title: 'Login', name: '', data: req,  password_state: 'ok', scroll: 'false', user: 'none'})

        }

    } else {
        
        // IF THEY ARE NOT LOGGED IN, THE VERSION FOR A STANDARD VISITORS IS RENDERED
        res.clearCookie('session');
        res.render('login', {title: 'Login', name: '', data: req,  password_state: 'ok', scroll: 'false', user: 'none'})

    }
}

// EXPORTING ALL THE FUNCTIONS
module.exports = { getProfile }
