// IMPORTING NECCESSARY NODE MODULES
const htmlencode = require('htmlencode');

// IMPORTING ALL NECCESSARY FUNCTIONS
const firebase = require('../../databaseConnection');
const verifySessionCookie = require('../../functions/general/verifySessionCookie');
const crypto = require('../../functions/general/crypto');
const checkAdmin = require('../../functions/general/checkAdmin');
const adminCookie = require('../../functions/adminLogin/randomCookieString');
const decodeItems = require('../../functions/general/decodeItems');

// IMPORTING OTHER NECCESSARY FILES
const adminUID = process.env.ADMIN_UID;
const adminPWD = process.env.ADMIN_PWD;
const adminsLoggedIn = require('../../adminLoggedIn').adminsLoggedIn;

// DEFINING SPECIFIC PARTS OF IMPORTED FUNCTIONS
const db = firebase.db;
const admin = firebase.admin;
const bucket = firebase.bucket;

const encrypt = crypto.encrypt;
const decrypt = crypto.decrypt;


// GET

// DASHBOARD 
const getDashboard = async (req, res) => {

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
            // CHECKING IF THE USER ID IS THE ONE OF THE ADMIN
            if (uid == adminUID) {
                // GRABBING THE REQUEST COOKIE OF ADMIN LOGGED IN 
                let adminLoggedInCookie = req.cookies['admin-logged-in'];
                // IF THE COOKIE EXISTS, REMOVE THE FIRST AND LAST SYMBOL OF " USING SUBSTR()
                if (adminLoggedInCookie) {
                    adminLoggedInCookie = adminLoggedInCookie.toString().substr(1, adminLoggedInCookie.length-2);
                    // IF THE COOKIE STRING EXISTS IN THE LIST OF COOKIE STRINGS OF ADMIN SESSIONS, TAKE FURTHER
                    // ACTIONS AND FINALLY SERVE THE ADMIN WITH THE ADMIN DASHBOARD SUBPAGE WITH ALL DATA FROM DB
                    if (adminsLoggedIn.includes(adminLoggedInCookie)) {
                        let users = [];
                        db.ref('/admin/users/').get()
                        .then((data) => {
                            let val = data.val();
                            for (let user in val){
                                // DEFINING VARIABLE AS OBJECT TO BE FILLED IN LATER ON WITH PERSONAL INFO OF THE USER
                                let personal = {
                                    name: '',
                                    lastName: '',
                                    userName: '',
                                    age: '',
                                    country: '',
                                    city: '',
                                    email: decrypt(val[user].email.encrypted, adminPWD.repeat(5).substring(0, 32), val[user].email.iv)
                                    // DECRPYTING THE EMAIL ADDRESS OF THE USER
                                }
                                // DEFINING EMPTY LISTS FOR BOUGHT, SOLD AND SELLING ITEMS OF THE USER
                                // DEFINING AN EMPTY STRING AS STATUS OF THE USER (ENABLED/DISABLED)
                                let bought = [];
                                let sold = [];
                                let selling = [];
                                let status = '';
                                // DECRYPTING THE STATUS OF THE USER
                                status = decrypt(val[user].status.encrypted, adminPWD.repeat(5).substring(0, 32), val[user].status.iv);
                                // RECIEVING DATA ABOUT BOUGHT ITEMS OF EVERY USER
                                if (val[user].bought.encrypted != undefined && val[user].bought.encrypted != null) {
                                    for (let b of val[user].bought) {
                                        let new_bought = {
                                            buyer: decrypt(b.buyer.encrypted, adminPWD.repeat(5).substring(0, 32), b.buyer.iv),
                                            seller: decrypt(b.seller.encrypted, adminPWD.repeat(5).substring(0, 32), b.seller.iv),
                                            price: decrypt(b.price.encrypted, adminPWD.repeat(5).substring(0, 32), b.price.iv),
                                            item: decrypt(b.item.encrypted, adminPWD.repeat(5).substring(0, 32), b.item.iv),
                                            date: decrypt(b.date.encrypted, adminPWD.repeat(5).substring(0, 32), b.date.iv),
                                            state: decrypt(b.state.encrypted, adminPWD.repeat(5).substring(0, 32), b.state.iv),
                                        };
                                        bought.push(new_bought)
                                    }
                                }
                                // RECIEVING DATA ABOUT SOLD ITEMS OF EVERY USER
                                if (val[user].sold.encrypted != undefined && val[user].sold.encrypted != null) {
                                    for (let s of val[user].sold) {
                                        let new_sold = {
                                            buyer: decrypt(s.buyer.encrypted, adminPWD.repeat(5).substring(0, 32), s.buyer.iv),
                                            seller: decrypt(s.seller.encrypted, adminPWD.repeat(5).substring(0, 32), s.seller.iv),
                                            price: decrypt(s.price.encrypted, adminPWD.repeat(5).substring(0, 32), s.price.iv),
                                            item: decrypt(s.item.encrypted, adminPWD.repeat(5).substring(0, 32), s.item.iv),
                                            date: decrypt(s.date.encrypted, adminPWD.repeat(5).substring(0, 32), s.date.iv),
                                            state: decrypt(s.state.encrypted, adminPWD.repeat(5).substring(0, 32), s.state.iv),
                                        };
                                        sold.push(new_sold)
                                    }
                                }
                                db.ref('/users/'+user+'/personal-info').get()
                                .then((data) => {
                                    // 'FILLING' THE SO FAR (ALMOST) EMPTY OBJECT OF PERSONAL INFO OF THE USER
                                    let vall = data.val();
                                    personal.name = vall.name;
                                    personal.lastName = vall.lastName;
                                    personal.userName = vall.userName;
                                    personal.age = vall.age;
                                    personal.country = vall.country;
                                    personal.city = vall.city;
                                })
                                .then(
                                    db.ref('/users/'+user+'/selling').get()
                                    .then((data) => {
                                        // RETRIEVING DATA ABOUT ITEMS THAT ARE BEING OFFERED BY THE USER
                                        let vall = data.val();
                                        if (vall != '' && vall != ' ') {
                                            for (let sl of vall.selling) {
                                                let new_selling = {
                                                    buyer: sl.buyer,
                                                    seller: sl.seller,
                                                    price: sl.price,
                                                    item: sl.item,
                                                    date: sl.date,
                                                    state: sl.state
                                                };
                                                selling.push(new_selling)
                                            }
                                        }
                                    })
                                    .then(
                                        // PUSHING THE CREATED OBJECT OF A USER TO THE LIST OF USERS
                                        users.push({
                                            status: status,
                                            personal: personal,
                                            bought: bought,
                                            sold: sold,
                                            selling: selling
                                        })
                                    )
                                )
                            }
                        })
                        .then(
                            res.render('admin-dashboard', {title: 'Dashboard', status: 'in', admin: true, users: users})
                        )
                    } else {
                        res.redirect('/admin')
                    }
                } else {
                    res.redirect('/admin')
                }
            // IF THE USER ID IS NOT THE ONE OF ADMIN, USER IS REDIRECTED TO THE HOMEPAGE
            } else {
                res.redirect('/admin')
            }
        })

    } else {
        res.clearCookie('session');
        res.render('login', {title: 'Login', name: '', data: req,  password_state: 'ok', scroll: 'false', user: 'none'})
    }
}
// USER
const getUser = async (req, res) => {

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
            // CHECKING IF THE USER ID IS THE ONE OF THE ADMIN
            if (uid == adminUID) {
                // GRABBING THE REQUEST COOKIE OF ADMIN LOGGED IN 
                let adminLoggedInCookie = req.cookies['admin-logged-in'];
                // IF THE COOKIE EXISTS, REMOVE THE FIRST AND LAST SYMBOL OF " USING SUBSTR()
                if (adminLoggedInCookie) {
                    adminLoggedInCookie = adminLoggedInCookie.toString().substr(1, adminLoggedInCookie.length-2);
                    // IF THE COOKIE STRING EXISTS IN THE LIST OF COOKIE STRINGS OF ADMIN SESSIONS, TAKE FURTHER
                    // ACTIONS AND FINALLY SERVE THE ADMIN WITH THE ADMIN DASHBOARD SUBPAGE WITH ALL DATA FROM DB
                    if (adminsLoggedIn.includes(adminLoggedInCookie)) {

                        let userID = req.params.id;
                        
                        let userInfo = {
                            info: {
                                name: '',
                                lastName: '',
                                email: '',
                                city: '',
                                country: '',
                                age: '',
                                userName: ''
                            },
                            status: '',
                            date: '',
                            established: '',
                            selling: {},
                            bought: {},
                            sold: {}
                        }
        
                        db.ref('/users/'+userID).get()
                        .then((data) => {
                            let val = data.val();

                            // RETRIEVING ALL DATA OF THE USER EXCEPT FOR EMAIL ADDRESS (WHICH IS ENCRYPTED)
                            userInfo.info.name = val['personal-info'].name;
                            userInfo.info.lastName = val['personal-info'].lastName;
                            userInfo.info.age = val['personal-info'].age;
                            userInfo.info.city = val['personal-info'].city;
                            userInfo.info.country = val['personal-info'].country;
                            userInfo.info.userName = val['personal-info'].username;

                            // RETRIEVING DATA ABOUT WHAT IS THE USER SELLING
                            let selling = val.items.selling;
                            for (let item in selling) { // FOR EACH ITEM
                                // DECODING KEY OF THE ITEM
                                let key = JSON.parse('"'+htmlencode.htmlDecode(item)+'"');
                                // DEFINING EMPTY OBJECT, WHICH WILL TURN INTO DECODED VERSION
                                // OF THE CURRENT ITEM
                                let toAdd = {};
                                for (let prop in selling[item]) { // FOR EACH PROPERTY OF THE CURRENT ITEM
                                    // THE PROPERTY IS ADDED TO THE 'toAdd' OBJECT AND ITS VALUE IS DECODED
                                    toAdd[prop] = JSON.parse('"'+htmlencode.htmlDecode(selling[item][prop])+'"')
                                };
                                // VIDEO LINK IS THE ONLY PROPERTY THAT IS NOT SAVED ENCODED
                                toAdd.video_link = selling[item].video_link;
                                // FINALLY, ADDING THE FINAL OBJECT - DECODED ITEM - INTO THE LIST OF ALL ITEMS
                                userInfo.selling[key] = toAdd
                            }
                        })
                        .then(
                            db.ref('/admin/users/'+userID).get()
                            .then((data) => {
                                let val = data.val();
                                // IF THE STATUS IS SAVED FOR THE USER IN THE DB, TAKE FURTHER ACTIONS
                                if (val.status){
                                    // DECRYPT THE STATUS OF THE USER FROM THE DB
                                    userInfo.status = decrypt(val.status.encrypted, adminPWD.repeat(5).substring(0, 32), val.status.iv);
                                } else { // IF THERE IS NO STATUS SAVED FOR THE USER IN THE DATABASE
                                    // SAVE THE STATUS OF THE USER TO THE DATABASE
                                    db.ref('/admin/users/'+(userID).toString()+'/status').set(
                                        encrypt('enabled', adminPWD.repeat(5).substring(0, 32))
                                    )
                                    // THERE IS NO NEED TO READ THE STATUS FROM THE DATABASE AND DECRYPT IT
                                    // AFTERWARDS, AS IT HAS JUST BEEN SET TO 'enabled'. THAT'S WHY THE STATUS
                                    // IS SET TO 'enabled' INSTEAD
                                    userInfo.status = 'enabled';
                                }
                                // ALL THE PROPERTIES OF THE USER INFO OBJECT ARE SET TO ITS DECRYPTED VALUE FROM THE DATABASE
                                userInfo.date = decrypt(val.date.encrypted, adminPWD.repeat(5).substring(0, 32), val.date.iv);
                                userInfo.established = decrypt(val.established.encrypted, adminPWD.repeat(5).substring(0, 32), val.established.iv);
                                userInfo.info.email = decrypt(val.email.encrypted, adminPWD.repeat(5).substring(0, 32), val.email.iv);
                                userInfo.bought = decrypt(val.bought.encrypted, adminPWD.repeat(5).substring(0, 32), val.bought.iv);
                                userInfo.sold = decrypt(val.sold.encrypted, adminPWD.repeat(5).substring(0, 32), val.sold.iv);
                            })
                            .then(() => {           
                                res.render('admin-user', {title: 'User', status: 'in', admin: true, userInfo: userInfo})
                            })
                        )
                    } else {
                        res.redirect('/admin')
                    }
                } else {
                    res.redirect('/admin')
                }
            // IF THE USER ID IS NOT THE ONE OF ADMIN, USER IS REDIRECTED TO THE HOMEPAGE
            } else {
                res.redirect('/admin')
            }
        })

    } else {
        res.redirect('/sessionLogout')
    }
}


// POST

// DATA FOR ADMIN SEARCH ENGINE
const fetchSearchEngineData = async (req, res) => {

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
        // CHECKING IF THE USER ID IS THE ONE OF THE ADMIN
        if (uid == adminUID) {
                // GRABBING THE REQUEST COOKIE OF ADMIN LOGGED IN 
                let adminLoggedInCookie = req.cookies['admin-logged-in'];
                // IF THE COOKIE EXISTS, REMOVE THE FIRST AND LAST SYMBOL OF " USING SUBSTR()
                if (adminLoggedInCookie) {
                    adminLoggedInCookie = adminLoggedInCookie.toString().substr(1, adminLoggedInCookie.length-2);
                    // IF THE COOKIE STRING EXISTS IN THE LIST OF COOKIE STRINGS OF ADMIN SESSIONS, TAKE FURTHER
                    // ACTIONS AND FINALLY SERVE THE ADMIN WITH THE ADMIN DASHBOARD SUBPAGE WITH ALL DATA FROM DB
                    if (adminsLoggedIn.includes(adminLoggedInCookie)) {
                        // DEFINING EMPTY LISTS FOR USERS AND PRODUCTS FOR ADMIN SEARCH ENGINE
                        let usersSearchEngine = [];
                        let productsSearchEngine = [];/*
                        let adminsSearchEngine = [];*/ // TO BE USED IN THE FUTURE WHEN MULTIPLE ADMINS EXIST
                        db.ref('/users').get()
                        .then((data) => {
                            // RETRIEVING ALL DATA ABOUT USERS FROM DATABASE
                            let val = data.val();
                            for (let user in val){ // FOR EACH USER OF THE USERS FROM DATABASE
                                let userName = val[user]['personal-info'].name + ' ' + val[user]['personal-info'].lastName;
                                let userID = user;
                                // ALL NEED-TO-BE-FORMATED STRINGS ARE FORMATED AND 
                                usersSearchEngine.push({ // PUSHED TO THE FINAL LIST OF THE USERS
                                    userName: userName,
                                    userID: userID,
                                    userWarned: ''
                                })
                            }
                        })
                        .then(
                            db.ref(`/admin/users`).get()
                            .then((data) => {
                                // FOR EACH USER ONE MORE PULL FROM THE DATABASE IS NEEDED TO
                                // GRAB THE EMAIL ADDRESSES OF THE USER, AS ITS VALUE IS DECRYPTED 
                                let val = data.val();
                                for (let user in usersSearchEngine) {
                                    // DECRYPTING THE VALUE OF THE EMAIL ADDRESS
                                    usersSearchEngine[user].userWarned = decrypt(val[usersSearchEngine[user].userID].history.disabled.encrypted, adminPWD.repeat(5).substring(0, 32), val[usersSearchEngine[user].userID].history.disabled.iv);
                                }
                            })
                            .then(
                                db.ref('/items_to_sell').get()
                                .then((data) => {
                                    // RETRIEVING DATA ABOUT EACH ITEM THAT IS BEING OFFERED AT THE MOMENT FROM THE DATABASE
                                    productsSearchEngine = decodeItems.decodeItems(data.val()) // DECODING WHOLE VALUE AT ONCE USING FUNCTION DECODE ITEMS
                                })
                                .then(() => {
                                    // SENDING RESPONSE IN FORM OF OBJECT, USERS + PRODUCTS
                                    res.send({
                                        users: usersSearchEngine, 
                                        products: productsSearchEngine
                                    })
                                }
                                )
                            )
                        )
                    } else {
                        res.end()
                    }
                } else {
                    res.end()
                }
            // IF THE USER ID IS NOT THE ONE OF ADMIN, USER IS REDIRECTED TO THE HOMEPAGE
        } else {
            res.end()
        }

    } else {
        res.end()
    }
}

/*******************************/
// POSTS ABOUT USER START HERE //
/*******************************/

// MESSAGE USER

const messageUser = async (req, res) => {



}

// DISABLE ACCOUNT

const disableAccount = async (req, res) => {

    

}

// ENABLE ACCOUNT

const enableAccount = async (req, res) => {

    

}

/*******************************/
// POSTS ABOUT USER END HERE //
/*******************************/

/***************************************************************************************************************
/***************************************************************************************************************
 * 
/*******************************/
// POSTS ABOUT ITEM START HERE //
/*******************************/

// MESSAGE SELLER

const messageSeller = async (req, res) => {

    

}

// DISABLE ITEM

const disableItem = async (req, res) => {

    

}

// ENABLE ITEM

const enableItem = async (req, res) => {

    

}

/*******************************/
// POSTS ABOUT ITEM START HERE //
/*******************************/

// EXPORTING ALL THE FUNCTIONS
module.exports = { getDashboard, getUser, fetchSearchEngineData, messageUser, disableAccount, enableAccount, messageSeller, disableItem, enableItem }
