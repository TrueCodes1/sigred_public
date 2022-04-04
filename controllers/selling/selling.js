// IMPORTING ALL NECCESSARY FUNCTIONS
const firebase = require('../../databaseConnection');
const verifySessionCookie = require('../../functions/general/verifySessionCookie');
const checkAdmin = require('../../functions/general/checkAdmin');
const decodeItems = require('../../functions/general/decodeItems');

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

// EXPORTING ALL THE FUNCTIONS
module.exports = { getItem }
