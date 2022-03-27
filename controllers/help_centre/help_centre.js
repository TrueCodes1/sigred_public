// IMPORTING ALL NECCESSARY FUNCTIONS
const firebase = require('../../databaseConnection');
const verifySessionCookie = require('../../functions/general/verifySessionCookie');
const checkAdmin = require('../../functions/general/checkAdmin');

// IMPORTING OTHER NECCESSARY FILES
const adminUID = process.env.ADMIN_UID;

// DEFINING SINGLE SPECIFIC PARTS OF FIREBASE IMPORT
const db = firebase.db;
const admin = firebase.admin;
const bucket = firebase.bucket;

// GET 
const getHelp = async (req, res) => {

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
            res.render('help-centre', {title: 'Help Centre', status: 'in',info: info, admin: admin})
        })

    } else {
        
        // IF THEY ARE NOT LOGGED IN, THE VERSION FOR A STANDARD VISITORS IS RENDERED
        res.render('help-centre', {title: 'Help Centre', status: 'out'})

    }
}

// EXPORTING ALL THE FUNCTIONS
module.exports = { getHelp }
