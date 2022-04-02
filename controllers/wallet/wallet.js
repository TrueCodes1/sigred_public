// IMPORTING ALL NECCESSARY NODE MODULES
const nodemailer = require('nodemailer');

// IMPORTING ALL NECCESSARY FUNCTIONS
const firebase = require('../../databaseConnection');
const verifySessionCookie = require('../../functions/general/verifySessionCookie');
const checkAdmin = require('../../functions/general/checkAdmin');
const crypto = require('../../functions/general/crypto');

// IMPORTING OTHER NECCESSARY FILES
const adminUID = process.env.ADMIN_UID;
const adminPWD = process.env.ADMIN_PWD;

// DEFINING SINGLE SPECIFIC PARTS OF FIREBASE IMPORT
const db = firebase.db;
const admin = firebase.admin;
const bucket = firebase.bucket;

// GET 
const getWallet = async (req, res) => {

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
                info.country = all.country;
                info.city = all.city;
                info.age = all.age;
            } else {
                console.log("Data don't exist.")
            }
        })
        .then(
            db.ref(`/admin/users/${uid.toString()}/email`).get()
            .then((data) => {
                let val = data.val();
                let email = crypto.decrypt(val.encrypted, adminPWD.repeat(5).substring(0, 32), val.iv);
                info.email = email;
            })
            .then(() => {
    
                // CHECKING IF THE USER ID IS THE SAME AS THE ONE OF THE ADMIN
                // IF YES, TRUE IS SET AS VALUE OF ADMIN AND 
                // THERE WILL BE ADMIN OPTION ON THE FINAL VIEW RENDERED
                let admin = checkAdmin.checkAdmin(uid.toString());
                res.render('contact', {title: 'Contact', status: 'in', info: info, message: '', admin: admin})
            })
        )

    } else {

        res.render('contact', {title: 'Contact', status: 'out', message: ''})

    }
}


// EXPORTING ALL THE FUNCTIONS
module.exports = { getWallet }
