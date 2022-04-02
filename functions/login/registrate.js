// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// IMPORTING OTHER NECCESSARY FUNCTIONS
const firebase = require('../../databaseConnection');

// DEFINING SINGLE SPECIFIC PARTS OF FIREBASE IMPORT
const db = firebase.db;
const admin = firebase.admin;
const bucket = firebase.bucket;

// VERIFYING SESSION COOKIE OF THE USER, WHETHER THEY ARE LOGGED IN
const registerNewUser = async (email, password) => {

    // IF USER CAN BE CREATED 
    try {

        let userRecord = await admin.auth().createUser({
            email: email,
            password: password
        })
    
        return userRecord

    // IF THE USER CANNOT BE CREATED DUE TO AN ERROR
    } catch (err) {

        return false

    }

}

// EXPORTING FUNCTION
module.exports = { registerNewUser }