// IMPORTING ALL NECCESSARY FUNCTIONS
const firebase = require('../../databaseConnection');
const verifySessionCookie = require('../../functions/general/verifySessionCookie');
const checkAdmin = require('../../functions/general/checkAdmin');

// IMPORTING OTHER NECCESSARY FILES
const adminUID = process.env.ADMIN_UID;
const usersLoggedIn = require('../../loggedIn').loggedIn;

// DEFINING SINGLE SPECIFIC PARTS OF FIREBASE IMPORT
const db = firebase.db;
const admin = firebase.admin;
const bucket = firebase.bucket;

// GET 
const getItem = async (req, res) => {
    
    let itemId = req.params.id;

    if (itemId) {

        // DEFINING THE ITEM AS AN EMPTY OBJECT, THAT WILL BE FILLED WITH THE DATA FROM DATABASE
        let item = {}
    
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
            
            // RETRIEVING THE DATA ABOUT THE USER AND FILLING THE OBJECT OF THE USER NFO WITH THEM  
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
            .then(
                db.ref(`/items_selling/${itemId}`).get()
                
            )
    
        } else {
            
            // IF THEY ARE NOT LOGGED IN, THE VERSION FOR A STANDARD VISITORS IS RENDERED
            res.clearCookie('session');
            res.render('login', {title: 'Login', name: '', data: req,  password_state: 'ok', scroll: 'false', user: 'none'})
    
        }

    } else {
        res.redirect(req.headers.referer)
    }
}

// EXPORTING ALL THE FUNCTIONS
module.exports = { getItem }
