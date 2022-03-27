// IMPORTING ALL NECCESSARY FUNCTIONS
const firebase = require('../../databaseConnection');
const verifySessionCookie = require('../../functions/general/verifySessionCookie');
const checkAdmin = require('../../functions/general/checkAdmin');
const crypto = require('../../functions/general/crypto');

// IMPORTING OTHER NECCESSARY FILES
const adminUID = process.env.ADMIN_UID;
const loggedIn = require('../../loggedIn').loggedIn;

// DEFINING SINGLE SPECIFIC PARTS OF FIREBASE IMPORT
const db = firebase.db;
const admin = firebase.admin;
const bucket = firebase.bucket;

const encrypt = crypto.encrypt;
const decrypt = crypto.decrypt;


// GET 
const logIn = async (req, res) => {
    
    console.log('LOGIN NOW')

    let idToken = req.body.idToken.toString();
    let uid = req.body.uid.toString();

    const expiresIn = 60 * 60 * 24 * 1000;

    admin
        .auth()
        .createSessionCookie(idToken, { expiresIn })
        .then(
            (sessionCookie) => {
                const options = { maxAge: expiresIn, httpOnly: true};

                let decrypted = {};
                let pwd = req.body.password.toString().repeat(5).substr(0,32);

                //entering database to get decrypted email address
                db.ref('/users/'+uid+'/personal-info/email').get()
                .then((data) => {
                    let val = data.val();
                    let email = val.encrypted;
                    let iv = val.iv;
                    decrypted.email = decrypt(email, pwd, iv);
                })
                .then(
                    db.ref('/users/'+uid+'/wallet/current_balance').get()
                    .then((data) => {
                        let val = data.val();
                        let balance = val.encrypted;
                        let iv = val.iv;
                        decrypted.balance = decrypt(balance, pwd, iv);
                    })
                    .then(
                        db.ref('/users/'+uid+'/items').get()
                        .then((data) => {
                            let val = data.val();
                            let bought = val.bought.encrypted;
                            let bought_iv = val.bought.iv;
                            let sold = val.sold.encrypted;
                            let sold_iv = val.sold.iv;
                            decrypted.bought = decrypt(bought, pwd, bought_iv);
                            decrypted.sold = decrypt(sold, pwd, sold_iv);
                        })
                        .then(() => {
                            loggedIn[uid] = decrypted;
                            res.cookie("session", sessionCookie, options);
                            res.end(JSON.stringify({ status: "success" }));
                        })
                    )
                )
            },
            (error) => {
                res.status(401).send('unauthorized request');
            }
        );

}

// EXPORTING ALL THE FUNCTIONS
module.exports = { logIn }
