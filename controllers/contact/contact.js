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

// POST
const postContact = async (req, res) => {

    let body = req.body;

    let output = `
        <body style='background-color: #FFE0C4; padding: 40px;'>
        <p style="font-size: 1.1rem">You have recieved new message from <span style="font-weight: 600; padding: .35em; background-color: #0a5a55; color: #FFE0C4">${body.name}</span>, one of your customers.</p>
        <h2 style='padding: .5em; background-color: #0a5a55; color: #FFE0C4; min-width: fit-content; max-width: fit-content'>Contact Details</h2>
        <ul style='list-style: none'>
            <li><b>Name:</b> <p style='font-size: 1.25rem; margin-left: 15px'>${body.name}</p> </li>
            <li><b>E-mail:</b> <p style='font-size: 1.25rem; margin-left: 15px'>${body.email}</p> </li>
            <li><b>Subject:</b> <p style='font-size: 1.25rem; margin-left: 15px'>${body.subject}</> </li>
        </ul>
        <h2 style='padding: .5em; background-color: #0a5a55; color: #FFE0C4; min-width: fit-content; max-width: fit-content'>Message</h2>
        <p style="padding: .5em; text-align: justify; font-size: 1.1rem; font-weight: 400">${body.message}</p>
        </body>
    `;

    let mailOptions = {
        from: '"New Contact" <sigred.inc@sigred.org>',
        to: 'sigred.inc@sigred.org',
        subject: 'New Contact Request',
        text: 'You have recieved new message from Sigred customer.',
        html: output
    }
    
    //Part for sending emails - nodemailer
    //create transporter
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, //true for 465
        auth: {
            user: 'sigred.inc@sigred.org',
            pass: 'nfcewbdavjpqgfho'
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    //send mail with defined transporter object
    transporter.sendMail(mailOptions, async (error, infoo) => {
        if (error){
            console.log(error);
            res.end()
        } else {

            // USING VERIFY SESSION COOKIE FINCTION WITH REQUEST AS ARGUMENT
            // TO CHECK STATE OF THE USER IF THEY ARE LOGGED IN
            let userRecord = await verifySessionCookie.verifySessionCookie(req);

            if (body.status == 'in' && userRecord != false){

                let uid = userRecord.uid;
                        
                let info = {
                    name: '',
                    lastName: '',
                    email: '',
                    country: '',
                    city: '',
                    age: ''
                }
                
                db.ref(`/users/${uid.toString()}/personal-info`).get()
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
                        res.render('contact', {title: 'Contact', message: 'E-mail sent!', status: 'in', info: info, admin: admin})
    
                    })
                })
                .catch((err) => {
                    console.log(err);
                    res.end()
                })
            } else {
                res.render('contact', {title: 'Contact', message: 'E-mail sent!', status: 'out'})
            }
        }
    })

}

// EXPORTING ALL THE FUNCTIONS
module.exports = { getContact, postContact }
