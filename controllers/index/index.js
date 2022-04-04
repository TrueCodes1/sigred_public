// IMPORTING NECCESSARY NODE MODULES
const htmlencode = require('htmlencode');

// IMPORTING ALL NECCESSARY FUNCTIONS
const firebase = require('../../databaseConnection');
const verifySessionCookie = require('../../functions/general/verifySessionCookie');
const checkAdmin = require('../../functions/general/checkAdmin');
const crypto = require('../../functions/general/crypto');

// IMPORTING OTHER NECCESSARY FILES
const adminUID = process.env.ADMIN_UID;
const adminPWD = process.env.ADMIN_PWD;

// DEFINING SPECIFIC PARTS OF IMPORTED FUNCTIONS
const db = firebase.db;
const admin = firebase.admin;
const bucket = firebase.bucket;

const encrypt = crypto.encrypt;
const decrypt = crypto.decrypt;


// GET 
const getIndex = (req, res) => {

    let sessionCookie = req.cookies.session || "";
    
    let info = {
        name: '',
        lastName: '',
        email: '',
        country: '',
        city: '',
        age: ''
    }

    let items = {};
    let first_nine = {};
    let disabled = [];
    let disabled_items = {};

    db.ref(`/admin/users`).get()
    .then((data) => {
        let val = data.val()
        for (let key of Object.keys(val)){
            disabled_items[key] = []
            if (decrypt(val[key].status.encrypted, adminPWD.repeat(5).substring(0, 32), val[key].status.iv) == 'disabled'){
                disabled.push(key)
            }
            for (let keyy of Object.keys(val[key].selling)) {
                if (decrypt(val[key].selling[keyy].availability.encrypted, adminPWD.repeat(5).substring(0, 32), val[key].selling[keyy].availability.iv) == 'disabled') {
                    disabled_items[key].push(keyy)
                }
            }
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
                    item.key = val[i].key;
        
                    let seller_id = val[i].item_seller_id;
                    if (disabled.includes(seller_id) != true) {
                        if (disabled_items[seller_id].includes(val[i].key) != true) {
                            items[i] = item;
                            if (Object.keys(first_nine).length<9){
                                first_nine[i] = item
                            }
                        }
                    }

            }
        })
        .then(
            admin
                .auth()
                .verifySessionCookie(sessionCookie, true)
                .then( (userRecord)=>{
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
                    .then(() =>{

                        // CHECKING IF THE USER ID IS THE SAME AS THE ONE OF THE ADMIN
                        // IF YES, TRUE IS SET AS VALUE OF ADMIN AND 
                        // THERE WILL BE ADMIN OPTION ON THE FINAL VIEW RENDERED
                        let admin = checkAdmin.checkAdmin(uid.toString());

                        res.render('index', {title: 'Home', status: 'in', info: info, items: items, first_nine: first_nine, admin: admin});
                    })
                })
                .catch((error)=>{
                    items = {};
                    first_nine = {};
                
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
                                item.key = val[i].key;
                    
                                let seller_id = val[i].item_seller_id;
                                if (disabled.includes(seller_id) != true) {
                                    if (disabled_items[seller_id].includes(val[i].key) != true) {
                                        items[i] = item;
                                        if (Object.keys(first_nine).length<9){
                                            first_nine[i] = item
                                        }
                                    }
                                }
                                
                        }

                        res.render('index', {title: 'Home', status: 'out', items: items, first_nine: first_nine, admin: admin});
                        return
                    })
                    .catch((error) => {
                        res.render('index', {title: 'Home', status: 'out', first_nine: ''})
                        return
                    }) /*FINISH THIS WITH NOT RENDERED ITEMS*/
                })
        )
        .catch((error)=>{
            items = {};
            first_nine = {};
        
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
                        item.key = val[i].key;
                    
                        let seller_id = val[i].item_seller_id;
                        if (disabled.includes(seller_id) != true) {
                            if (disabled_items[seller_id].includes(val[i].key) != true) {
                                items[i] = item;
                                if (Object.keys(first_nine).length<9){
                                    first_nine[i] = item
                                }
                            }
                        }
                        
                }
            })
            .then(() => {
                res.render('index', {title: 'Home', status: 'out', items: items, first_nine: first_nine})
                return
            })
            .catch((error) => {
                console.log(error)
                res.render('index', {title: 'Home', status: 'out', first_nine: ''})
                return
            }) /*FINISH THIS WITH NOT RENDERED ITEMS*/
        })
    }
    )
}

// EXPORTING ALL THE FUNCTIONS
module.exports = { getIndex }
