// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// IMPORTING OTHER NECCESSARY FUNCTIONS
const firebase = require('../../databaseConnection');

// DEFINING SINGLE SPECIFIC PARTS OF FIREBASE IMPORT
const db = firebase.db;
const admin = firebase.admin;
const bucket = firebase.bucket;

// VERIFYING SESSION COOKIE OF THE USER, WHETHER THEY ARE LOGGED IN
const verifySessionCookie = async (req) => {

    let sessionCookie = req.cookies.session || '';

    // IF THE USER IS LOGGED IN, THEIR USER RECORD IS RETURNED
    try {

        let userRecord = await admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
    
        return userRecord

    // IF THE USER IS NOT LOGGED IN, FALSE IS RETURNED
    } catch (err) {

        return false

    }

}

// EXPORTING FUNCTION
module.exports = { verifySessionCookie }