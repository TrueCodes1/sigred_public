
// IMPORTING OTHER NECCESSARY FUNCTIONS
const firebase = require('../../databaseConnection');
const crypto = require('../general/crypto');

// DEFINING SINGLE SPECIFIC PARTS OF FIREBASE IMPORT
const db = firebase.db;
const admin = firebase.admin;
const bucket = firebase.bucket;

// CHECKING IF THE USER HAS ALL THE DATABASE RECORDS
// ACCORDING TO THE LATEST DATABASE ARCHITECTURE
const updateDatabase = async (id, pwd) => {

    let userInAdmin = await db.ref(`/admin/users/${id}`).get();
    if (userInAdmin.val()) {
        // FINISH FROM NOW ON 
    }

}

// EXPORTING FUNCTION
module.exports = { updateDatabase }