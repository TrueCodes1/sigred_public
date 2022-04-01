// IMPORTING NECCESSARY NODE MODULES
const htmlencode = require('htmlencode');

// IMPORTING ALL NECCESSARY FUNCTIONS
const firebase = require('../../databaseConnection');
const verifySessionCookie = require('../../functions/general/verifySessionCookie');
const crypto = require('../../functions/general/crypto');
const checkAdmin = require('../../functions/general/checkAdmin');
const adminCookie = require('../../functions/adminLogin/randomCookieString');

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
// GET DASHBOARD 
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
// GET USER
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

// EXPORTING ALL THE FUNCTIONS
module.exports = { getDashboard, getUser }
