
// IMPORTING ALL NECCESSARY NODE MODULES
const htmlencode = require('htmlencode');
const nodemailer = require('nodemailer');

// IMPORTING ALL NECCESSARY FUNCTIONS
const firebase = require('../../databaseConnection');
const verifySessionCookie = require('../../functions/general/verifySessionCookie');
const checkAdmin = require('../../functions/general/checkAdmin');
const decodeItems = require('../../functions/general/decodeItems');
const crypto = require('../../functions/general/crypto')

// IMPORTING OTHER NECCESSARY FILES
const adminUID = process.env.ADMIN_UID;
const adminPWD = process.env.ADMIN_PWD;
const usersLoggedIn = require('../../loggedIn').loggedIn;

// DEFINING SINGLE SPECIFIC PARTS OF FIREBASE IMPORT
const db = firebase.db;
const admin = firebase.admin;
const bucket = firebase.bucket;

// GET 
const getItem = async (req, res) => {
    
    let itemId = req.params.id;

    if (itemId.indexOf('.')>-1){
        res.redirect('/index')
    } else {
        if (itemId) {
    
            // DEFINING THE ITEM AS AN EMPTY OBJECT, THAT WILL BE FILLED WITH THE DATA FROM DATABASE
            let item;
        
            // RETRIEVING THE DATA ABOUT THE USER AND FILLING THE OBJECT OF THE USER NFO WITH THEM  

            db.ref(`/items_to_sell/${itemId}`).get()
            .then((data) => {
                let val = data.val();
                item = decodeItems.decodeItem(val);
            })
            .then( async () => {

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
                            info.email = usersLoggedIn[uid].email;
                            info.country = all.country;
                            info.city = all.city;
                            info.age = all.age;
                        } else {
                            console.log("Data don't exist.")
                        }
                    })
                    .then(() => {

                        // CHECKING IF THE USER ID IS THE SAME AS THE ONE OF THE ADMIN
                        // IF YES, TRUE IS SET AS VALUE OF ADMIN AND 
                        // THERE WILL BE ADMIN OPTION ON THE FINAL VIEW RENDERED
                        let admin = checkAdmin.checkAdmin(uid.toString());

                        res.render('item', {info: info, item: item, title: `${item.item_name}`, status: 'in', admin: admin})
                    
                    })
        
                } else {
                    
                    res.render('item', {item: item, title: `${item.item_name}`, status: 'out'})
            
                }

            })
    
        } else {
            res.redirect(req.headers.referer)
        }
    }
}

// POST 

// MESSAGE SELLER

const messageSeller = async (req, res) => {

    const originURL = req.headers.referer;

    // USING VERIFY SESSION COOKIE FINCTION WITH REQUEST AS ARGUMENT
    // TO CHECK STATE OF THE USER IF THEY ARE LOGGED IN
    let userRecord = await verifySessionCookie.verifySessionCookie(req);

    if (userRecord) {
            
        let uid = userRecord.uid;
        // CHECKING IF THE USER ID IS THE ONE OF THE ADMIN

        let body = req.body;

        let sellerId = body.sellerId;
        let clientId = uid;
        let subject = body.subject;
        let text = body.text;
        let itemName = body.itemName;

        let itemNameExists = false;

        let itemNameCheck = await db.ref(`/users/${sellerId}/items/selling`).get()

        if (itemNameCheck.val()) {
            itemNameCheck = itemNameCheck.val();
            for (let key of Object.keys(itemNameCheck)) {
                if (itemNameExists == false) {
                    let itemNameEncoded = itemNameCheck[key].item_name;
                    let itemNameDecoded = JSON.parse('"'+htmlencode.htmlDecode(itemNameEncoded)+'"');
                    if (itemNameDecoded == itemName) {
                        itemNameExists = true
                    }
                }
            }
        }

        if (itemNameExists == true) {

            let sellerEmail;
            let sellerName;
            let clientEmail;
            let clientName;
    
            sellerSideOk = true;
            clientSideOk = true;
    
            sellerEmail = await db.ref(`/admin/users/${sellerId}/email`).get()
            if (sellerEmail.val()) {
                sellerEmail = crypto.decrypt(sellerEmail.val().encrypted, adminPWD.repeat(5).substring(0, 32), sellerEmail.val().iv);
            } else {
                sellerSideOk = false
            }
            sellerName = await db.ref(`/users/${sellerId}/personal-info`).get()
            if (sellerName.val()) {
                sellerName = `${sellerName.val().name} ${sellerName.val().lastName}`
            } else {
                sellerSideOk = false
            }
            clientEmail = await db.ref(`/admin/users/${clientId}/email`).get()
            if (clientEmail.val()) {
                clientEmail = crypto.decrypt(clientEmail.val().encrypted, adminPWD.repeat(5).substring(0, 32), clientEmail.val().iv)
            } else {
                clientSideOk = false
            }
            clientName = await db.ref(`/users/${clientId}/personal-info`).get()
            if (clientName.val()) {
                clientName = `${clientName.val().name} ${clientName.val().lastName}`
            } else {
                clientSideOk = false
            }
    
            if (sellerSideOk != false && clientSideOk != false) {
    
                let output = `
                    <body style='background-color: #FFE0C4; padding: 40px;'>
                    <p style="font-size: 1.1rem; font-weight: 700">Hey, ${sellerName}, we contact you on behalf of Sigred user <i>${clientName}</i>, that would like to conatact you
                     regarding item ${itemName}, that is currently offered by you. Please, continue further conversation with ${clientName} on his address ${clientEmail}.</p>
                    <p style="font-size: 1.1rem">${text}</p>
                    <h2 style='padding: .5em; background-color: #0a5a55; color: #FFE0C4; min-width: fit-content; max-width: fit-content'>Thank you for your trust.
                    In case of any question, contact us on <span style="color: #0a5a55">sigred.inc@sigred.org</span> or via our contact page <span style="color: #0a5a55">www.sigred.org/contact</span></h2>
                    </body>
                `;
                
                let mailOptions = {
                    from: '"Sigred team" <sigred.inc@sigred.org>',
                    to: sellerEmail,
                    subject: subject,
                    text: `Sigred - message from client ${clientName}`,
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
                transporter.sendMail(mailOptions, (error, infoo) => {
                    if (error){
                        console.log(error);
                        res.end()
                    } else {
                        res.json({
                            success: 'success'
                        }).end()
                    }
                })
            } else {
                res.json({
                    error: 'db-issue'
                }).end()
            }
        } else {
            res.json({
                error: 'no-such-item'
            }).end()
        }

    } else {
        res.json({
            status: 'not-logged-in'
        }).end()
    }
}

// EXPORTING ALL THE FUNCTIONS
module.exports = { getItem, messageSeller }
