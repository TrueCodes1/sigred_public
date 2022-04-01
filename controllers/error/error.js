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
const errorHandler = async (req, res) => {

    let requested = req.url;
    requested = requested.replace('/', '')
    res.status(404).render('404', {title: 'Error', page: requested})

}

// EXPORTING ALL THE FUNCTIONS
module.exports = { errorHandler }
