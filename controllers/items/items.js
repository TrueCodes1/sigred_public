// IMPORTING NECCESSARY NODE MODULES
const htmlencode = require('htmlencode');

// IMPORTING ALL NECCESSARY FUNCTIONS
const firebase = require('../../databaseConnection');
const verifySessionCookie = require('../../functions/general/verifySessionCookie');
const crypto = require('../../functions/general/crypto');
const checkAdmin = require('../../functions/general/checkAdmin');

// IMPORTING OTHER NECCESSARY FILES
const adminUID = process.env.ADMIN_UID;
const adminPWD = process.env.ADMIN_PWD;
const usersLoggedIn = require('../../loggedIn');

// DEFINING SPECIFIC PARTS OF IMPORTED FUNCTIONS
const db = firebase.db;
const admin = firebase.admin;
const bucket = firebase.bucket;

const encrypt = crypto.encrypt;
const decrypt = crypto.decrypt;

// GET 
const getItems = async (req, res) => {

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
        
        let items = {};
        let selling = {};
        let bought = {};
        let sold = {};
        
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
            db.ref('/items_to_sell').get()
            .then((data) => {
                let val = data.val();
                
                for (i in val){
                    let item = {};
                    
                    let item_name = val[i].item_name;
                    item_name = htmlencode.htmlDecode(item_name);
                    item_name = JSON.parse('"'+item_name+'"');
                    let item_desc = val[i].item_desc;
                    item_desc = htmlencode.htmlDecode(item_desc);
                    item_desc = JSON.parse('"'+item_desc+'"');
                    let item_location = val[i].item_location;
                    item_location = htmlencode.htmlDecode(item_location);
                    item_location = JSON.parse('"'+item_location+'"');
                    let item_price = val[i].item_price;
                    item_price = htmlencode.htmlDecode(item_price);
                    item_price = JSON.parse('"'+item_price+'"');
                    let item_seller = val[i].item_seller;
                    item_seller = htmlencode.htmlDecode(item_seller);
                    item_seller = JSON.parse('"'+item_seller+'"');
                    let video_name = val[i].video_name;
                    video_name = htmlencode.htmlDecode(video_name);
                    video_name = JSON.parse('"'+video_name+'"');
                    let video_link = val[i].video_link;
        
                    item.item_name = item_name;
                    item.item_desc = item_desc;
                    item.item_location = item_location;
                    item.item_price = item_price;
                    item.item_seller = item_seller;
                    item.video_name = video_name;
                    item.video_link = video_link;
        
                    items[i] = item;
                }
            })
            .then(() => {
                db.ref('/users/'+uid.toString()+'/items/selling').get()
                .then((data) => {
                    let val = data.val();
                    
                    if (val!=''){
                        for (i in val){
                            let item = {};
                            
                            let item_name = val[i].item_name;
                            item_name = htmlencode.htmlDecode(item_name);
                            item_name = JSON.parse('"'+item_name+'"');
                            let item_desc = val[i].item_desc;
                            item_desc = htmlencode.htmlDecode(item_desc);
                            item_desc = JSON.parse('"'+item_desc+'"');
                            let item_location = val[i].item_location;
                            item_location = htmlencode.htmlDecode(item_location);
                            item_location = JSON.parse('"'+item_location+'"');
                            let item_price = val[i].item_price;
                            item_price = htmlencode.htmlDecode(item_price);
                            item_price = JSON.parse('"'+item_price+'"');
                            let item_seller = val[i].item_seller;
                            item_seller = htmlencode.htmlDecode(item_seller);
                            item_seller = JSON.parse('"'+item_seller+'"');
                            let video_name = val[i].video_name;
                            video_name = htmlencode.htmlDecode(video_name);
                            video_name = JSON.parse('"'+video_name+'"');
                            let video_link = val[i].video_link;
                
                            item.item_name = item_name;
                            item.item_desc = item_desc;
                            item.item_location = item_location;
                            item.item_price = item_price;
                            item.item_seller = item_seller;
                            item.video_name = video_name;
                            item.video_link = video_link;
                
                            selling[i] = item;
                        }
                    }
                })
                .then(() => {

                    val = usersLoggedIn[uid].bought;
                        
                    if (val!=''){
                            for (i in val){
                                let item = {};
                                
                                let item_name = val[i].item_name;
                                item_name = htmlencode.htmlDecode(item_name);
                                item_name = JSON.parse('"'+item_name+'"');
                                let item_desc = val[i].item_desc;
                                item_desc = htmlencode.htmlDecode(item_desc);
                                item_desc = JSON.parse('"'+item_desc+'"');
                                let item_location = val[i].item_location;
                                item_location = htmlencode.htmlDecode(item_location);
                                item_location = JSON.parse('"'+item_location+'"');
                                let item_price = val[i].item_price;
                                item_price = htmlencode.htmlDecode(item_price);
                                item_price = JSON.parse('"'+item_price+'"');
                                let item_seller = val[i].item_seller;
                                item_seller = htmlencode.htmlDecode(item_seller);
                                item_seller = JSON.parse('"'+item_seller+'"');
                                let video_name = val[i].video_name;
                                video_name = htmlencode.htmlDecode(video_name);
                                video_name = JSON.parse('"'+video_name+'"');
                                let video_link = val[i].video_link;
                    
                                item.item_name = item_name;
                                item.item_desc = item_desc;
                                item.item_location = item_location;
                                item.item_price = item_price;
                                item.item_seller = item_seller;
                                item.video_name = video_name;
                                item.video_link = video_link;
                    
                                bought[i] = item;
                            }
                    }

                        val = usersLoggedIn[uid].sold;
                        if (val!=''){
                            for (i in val){
                                let item = {};
                                    
                                let item_name = val[i].item_name;
                                item_name = htmlencode.htmlDecode(item_name);
                                item_name = JSON.parse('"'+item_name+'"');
                                let item_desc = val[i].item_desc;
                                item_desc = htmlencode.htmlDecode(item_desc);
                                item_desc = JSON.parse('"'+item_desc+'"');
                                let item_location = val[i].item_location;
                                item_location = htmlencode.htmlDecode(item_location);
                                item_location = JSON.parse('"'+item_location+'"');
                                let item_price = val[i].item_price;
                                item_price = htmlencode.htmlDecode(item_price);
                                item_price = JSON.parse('"'+item_price+'"');
                                let item_seller = val[i].item_seller;
                                item_seller = htmlencode.htmlDecode(item_seller);
                                item_seller = JSON.parse('"'+item_seller+'"');
                                let video_name = val[i].video_name;
                                video_name = htmlencode.htmlDecode(video_name);
                                video_name = JSON.parse('"'+video_name+'"');
                                let video_link = val[i].video_link;
                        
                                item.item_name = item_name;
                                item.item_desc = item_desc;
                                item.item_location = item_location;
                                item.item_price = item_price;
                                item.item_seller = item_seller;
                                item.video_name = video_name;
                                item.video_link = video_link;
                        
                                sold[i] = item;
                        }
        
                        }

                        // CHECKING IF THE USER ID IS THE SAME AS THE ONE OF THE ADMIN
                        // IF YES, TRUE IS SET AS VALUE OF ADMIN AND 
                        // THERE WILL BE ADMIN OPTION ON THE FINAL VIEW RENDERED
                        let admin = checkAdmin.checkAdmin(uid.toString());
                            res.render('items', {title: 'My Items', info: info, selling: selling, bought: bought, sold: sold, admin: admin})

                })
            })
        })


    } else {
        
        // IF THEY ARE NOT LOGGED IN, THE VERSION FOR A STANDARD VISITORS IS RENDERED
        res.clearCookie('session');
        res.render('login', {title: 'Login', name: '', data: req,  password_state: 'ok', scroll: 'false', user: 'none'})

    }
}

// EXPORTING ALL THE FUNCTIONS
module.exports = { getItems }
