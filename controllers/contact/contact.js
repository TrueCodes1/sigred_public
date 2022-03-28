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
const getContact = async (req, res) => {

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
            res.render('contact', {title: 'Contact', status: 'in', info: info, message: '', admin: admin})
        })

    } else {

        res.render('contact', {title: 'Contact', status: 'out', message: ''})

    }
}

// POST
const postContact = async (req, res) => {
    // FINISH THE FUNCTION TO SEND THE EMAIL FRO CONTACT FORM
}

// EXPORTING ALL THE FUNCTIONS
module.exports = { getContact }
