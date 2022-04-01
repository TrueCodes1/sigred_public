const express = require('express');
const app = express();

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({path: '.env'})
}
/*
const StripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const StripeSecretKey = process.env.STRIPE_SECRET_KEY;*/
const StripeSecretKey = 'sk_test_51Jkuv6KGRqWv4exOF7qUh2grcbipPYYdrY1U4miDhUoFEZi6QMTKwRmoUT7tR1AfU38Vz7XUTpStXp0Gub7daPGs00bTVISGJs'    
const StripePublicKey = 'pk_test_51Jkuv6KGRqWv4exO19iQJxO3hUI17alrTGGYwjOJsLMFyubqvTGMPXpqYyJSSMypVHTQBpi9jsSuatzlHHtVyCS400fRqnQuh1'

const { O_APPEND } = require('constants');
const path = require('path');
const ejs = require('ejs')
const index = path.join(__dirname, '/public/index');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');/*
const get_storage = require('firebase-admin/storage');*/
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const unicode_escape = require('unicode-escape');
const htmlencode = require('htmlencode/encoder');
const multer = require('multer');
const fs = require('fs');
const hbjs = require('handbrake-js');/*
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);*/
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');
const obfuscator = require('javascript-obfuscator');
const force = require('express-sslify');
const crypto = require('crypto');
const algorithm = "aes-256-cbc"; 

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const stripe = require('stripe')(StripeSecretKey);

const csurfMiddleware = csurf({cookie: true})
//finish authentication from here

var serviceAccount = require("./sigred-try-firebase-adminsdk-i3qd7-62313bcebf.json");
const adminUID = process.env.ADMIN_UID;
const adminPWD = process.env.ADMIN_PWD;
const { fileURLToPath } = require('url');
const { copyFileSync } = require('fs');
const { connect } = require('http2');
const { addAbortSignal } = require('stream');
const { error } = require('console');
const { exec } = require('child_process');
const { htmlDecode } = require('htmlencode/encoder');
const MainRouter = require('./router');
const { adminsLoggedIn } = require('./adminLoggedIn');
/*
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://sigred-try-default-rtdb.europe-west1.firebasedatabase.app/',
  storageBucket: 'gs://sigred-try.appspot.com/'
});
*/
const db = admin.database();
const bucket = admin.storage().bucket();

app.set('view engine', 'ejs');
 
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(cookieParser());

app.use('/', MainRouter)
/*
app.use(force.HTTPS({trustProtoHeader: true}))/*
app.use(csurfMiddleware);*/

/*********************************
 * 
 * OBFUSCATING JS SCRIPTS
 * 
**********************************//*

const scripts = ['all.js', 'index.js', 'login.js', 'new_sell.js', 'wallet_2.js', 'wallet.js'];

for (let script of scripts){
    
    fs.readFile('./public/'+script, 'utf-8', (err, data) => {
        if (err){
            console.log(err)
        } else if (data){
            let obfuscated = obfuscator.obfuscate(data).getObfuscatedCode();
            obfuscated = obfuscator.obfuscate(obfuscated).getObfuscatedCode();
            obfuscated = obfuscator.obfuscate(obfuscated).getObfuscatedCode();
            /*
            fs.writeFile('./public/'+script, obfuscated, (err) => {
                if (err){
                    console.log('error')
                } else {
                    console.log('done');
                }
            })*//*

        }
    })

}*/

/*********************************
 * 
 * END OF OBFUSCATING JS SCRIPTS
 * 
**********************************/

let usersLoggedIn = {};

app.get("/profile", csurfMiddleware, function(req, res, next) {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next(); 
});
/*
app.get('/', /*csurfMiddleware,*//*function(req, res){
    res.redirect('index')
})

*//*
app.get('/index', csurfMiddleware, function(req, res){

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
        
                    let seller_id = val[i].item_seller_id;
                    if (disabled.includes(seller_id) != true) {
                        if (disabled_items[seller_id].includes(item_name.split(' ').join('')) != true) {
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
                        let admin = false;
                        uid == adminUID ? admin = true : admin = false;
                        res.render('index', {title: 'Home', status: 'in', info: info, items: items, first_nine: first_nine, admin: admin});
                        return
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
                    
                                let seller_id = val[i].item_seller_id;
                                if (disabled.includes(seller_id) != true) {
                                    items[i] = item;
                                    if (Object.keys(first_nine).length<9){
                                        first_nine[i] = item
                                    }
                                }
                                
                        }
                        res.render('index', {title: 'Home', status: 'out', items: items, first_nine: first_nine, admin: admin});
                        return
                    })
                    .catch((error) => {
                        res.render('index', {title: 'Home', status: 'out', first_nine: ''})
                        return
                    }) *//*FINISH THIS WITH NOT RENDERED ITEMS*//*
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
                    
                        let seller_id = val[i].item_seller_id;
                        if (disabled.includes(seller_id) != true) {
                            items[i] = item;
                            if (Object.keys(first_nine).length<9){
                                first_nine[i] = item
                            }
                        }
                        
                }
            })
            .then(() => {
                res.render('index', {title: 'Home', status: 'out', items: items, first_nine: first_nine})
                return
            }
            )
            .catch((error) => {
                res.render('index', {title: 'Home', status: 'out', first_nine: ''})
                return
            }) *//*FINISH THIS WITH NOT RENDERED ITEMS*//*
        })
    }
    )

})

app.get('/about', csurfMiddleware, function(req, res){

    let sessionCookie = req.cookies.session || "";
    
    let info = {
        name: '',
        lastName: '',
        email: '',
        country: '',
        city: '',
        age: ''
    }

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then( (userRecord)=>{
            let uid = userRecord.uid;
            console.log('from about: '+uid.toString())
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
                let admin = false;
                uid == adminUID ? admin = true : admin = false;
                res.render('about', {title: 'About', status: 'in', info: info, admin: admin})
                console.log(info)
            })
        })
        .catch((error)=>{
            res.render('about', {title: 'About', status: 'out'})
        })
})
*/
/*app.get('/login', function(req, res){
    res.clearCookie('session');
    res.render('login', {title: 'Login', name: '', data: req,  password_state: 'ok', scroll: 'false', user: 'none'})
})*/
/*
app.get('/contact', csurfMiddleware, function(req, res){

    let sessionCookie = req.cookies.session || "";
    
    let info = {
        name: '',
        lastName: '',
        email: '',
        country: '',
        city: '',
        age: ''
    }

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then( (userRecord)=>{
            let uid = userRecord.uid;
            console.log('from contact: '+uid.toString())
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
                let admin = false;
                uid == adminUID ? admin = true : admin = false;
                res.render('contact', {title: 'Contact', status: 'in', info: info, message: '', admin: admin})
            })
        })
        .catch((error)=>{
            res.render('contact', {title: 'Contact', status: 'out', message: ''})
        })
})*/

app.get('/wallet', (req, res) => {

    let sessionCookie = req.cookies.session || "";
    
    let info = {
        name: '',
        lastName: '',
        email: '',
        country: '',
        city: '',
        age: ''
    }
    let balance = {
        current: '',
        eur: ''
    }
    
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then( (userRecord)=>{
            let uid = userRecord.uid;
            console.log('from wallet: '+uid.toString())
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
                db.ref('/users/'+uid.toString()+'/wallet').get()
                .then((data) => {
                    if (data.exists()){
                        let all = data.val();
                        balance.current = all['current_balance'];
                        balance.eur = Number(balance.current * 2).toFixed();/*
                        balance = {
                            current: all.current_balance,
                            eur: Number(all.current_balance)*2
                        }*/
                        console.log('from wallet: '+balance.toString())
                    } else {
                        console.log("Data don't exist.")
                    }
                })
            })
            .then(() =>{
                let admin = false;
                uid == adminUID ? admin = true : admin = false;
                res.render('wallet', {title: 'My Wallet', info: info, stripePublicKey: StripePublicKey, topup_status: '', balance: balance, admin: admin})
                console.log(info)
            })
        })
        .catch((error)=>{
            res.clearCookie('session');
            res.render('login', {title: 'Login', name: '', data: req,  password_state: 'ok', scroll: 'false', user: 'none'})
        })

})

var topup_success = [];
app.get('/successful_topup', csurfMiddleware, (req, res) => {

    let sessionCookie = req.cookies.session || "";
    
    let info = {
        name: '',
        lastName: '',
        email: '',
        country: '',
        city: '',
        age: ''
    }
    let balance = {
        current: '',
        eur: ''
    }
    
    var success = false;

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then( (userRecord)=>{
            let uid = userRecord.uid;

            console.log(topup_success)
            console.log('above topup success')

            if (topup_success.includes(uid.toString())){
                console.log(topup_success)
                console.log('above topup success')
                success = true
                topup_success
            }

            console.log('from successful topup: '+uid.toString())
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
                db.ref('/users/'+uid.toString()+'/wallet').get()
                .then((data) => {
                    if (data.exists()){
                        let all = data.val();
                        balance.current = all['current_balance'];
                        balance.eur = Number(balance.current * 2).toFixed();/*
                        balance = {
                            current: all.current_balance,
                            eur: Number(all.current_balance)*2
                        }*/
                        console.log('from wallet: ')
                        console.log(balance)
                    } else {
                        console.log("Data don't exist.")
                    }
                })
            })
            .then(() =>{
                let admin = false;
                uid == adminUID ? admin = true : admin = false;
                if (success == true){
                    res.render('wallet', {title: 'My Wallet', info: info, stripePublicKey: StripePublicKey, topup_status: 'done', balance: balance, admin: admin})
                } else {
                    res.render('wallet', {title: 'My Wallet', info: info, stripePublicKey: StripePublicKey, topup_status: 'error', balance: balance, admin: admin})
                }
            })
        })
        .catch((error)=>{
            res.clearCookie('session');
            res.render('login', {title: 'Login', name: '', data: req,  password_state: 'ok', scroll: 'false', user: 'none'})
        })

})

app.post('/top_up', (req, res) => {
    let token = req.body.token.id;
    let amount = req.body.amount;/*
    let id = body.id;
    console.log(amount);
    console.log(id);
    stripe.paymentIntents.create({
        amount: amount,
        currency: 'eur',
        payment_method: id,
        confirm: true
    })
    .then(() => {
        console.log('charged successfuly')
    })
    .catch((error) => {
        console.log('ooops, error: '+error)
    })*/
    stripe.charges.create({
        amount: amount,
        source: token,
        currency: 'eur'
    })
    .then(() => {
        
        const sessionCookie = req.cookies.session || "";
        
        admin
            .auth()
            .verifySessionCookie(sessionCookie, true)
            .then( (userRecord) =>{
                let uid = userRecord.uid;
                topup_success.push(uid.toString())
                console.log(topup_success)
                console.log('1st topups success above')
                db.ref('/users/'+(uid.toString())+'/wallet').get()
                .then((data) =>{
                    if (data.exists()){
                        let val = data.val();
                        var current = Number(val.current_balance);
                        var new_balance = Number(current+Number(amount/100));
                        console.log('NEW BALANCE: '+new_balance.toString())
                        db.ref('/users/'+(uid.toString())+'/wallet/current_balance').set(
                            new_balance.toString()
                        )
                    }
                })
            })
        })

    .then(
        res.json({
            done: 'true'
        })/*
        () => {
            

            const sessionCookie = req.cookies.session || "";
            
            var info = {
                name: '',
                lastName: '',
                email: '',
                country: '',
                city: '',
                age: ''
            }
            var balance = {
                current: '',
                eur: ''
            }
            
            var success = false;

            admin
                .auth()
                .verifySessionCookie(sessionCookie, true)
                .then( (userRecord)=>{
                    var uid = userRecord.uid;

                    console.log(topup_success)
                    console.log('above topup success')

                    if (topup_success.includes(uid.toString())){
                        console.log(topup_success)
                        console.log('above topup success')
                        success = true
                    }

                    console.log('from successful topup: '+uid.toString())
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
                        db.ref('/users/'+uid.toString()+'/wallet').get()
                        .then((data) => {
                            if (data.exists()){
                                let all = data.val();
                                balance.current = all['current_balance'];
                                balance.eur = Number(balance.current * 2).toFixed();/*
                                balance = {
                                    current: all.current_balance,
                                    eur: Number(all.current_balance)*2
                                }*//*
                                console.log('from wallet: '+balance.toString())
                            } else {
                                console.log("Data don't exist.")
                            }
                        })
                    })
                    .then(() =>{
                        if (success == true){
                            res.render('wallet', {title: 'My Wallet', info: info, stripePublicKey: StripePublicKey, topup_status: 'done', balance: balance})
                        } else {
                            res.render('wallet', {title: 'My Wallet', info: info, stripePublicKey: StripePublicKey, topup_status: 'error', balance: balance})
                        }
                    })
                })
                .catch((error)=>{
                    res.clearCookie('session');
                    res.render('login', {title: 'Login', name: '', data: req,  password_state: 'ok', scroll: 'false', user: 'none'})
                })
                }*/
    )
    .catch((error) =>{
        console.log('error: '+error)
    })

    //finish res.render() !!!!!!!!!!!!!!!!!!!!!!!!!
    
})

/*
app.get('/items', (req, res) => {
    
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
    let selling = {};
    let bought = {};
    let sold = {};
    let uid;

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then( (userRecord)=>{
            uid = userRecord.uid;
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
                    .then(() => {*//*
                        db.ref('/users/'+uid.toString()+'/items/bought').get()
                        .then((data) => {
                            let val = data.val();*//*
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
                        *//*})
                        .then(() => {
                            db.ref('/users/'+uid.toString()+'/items/sold').get()
                            .then((data) => {
                                let val = data.val();*//*
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
                                    *//*}*//*
                                }
            
                            }*//*)
                            .then(() => {*//*
                                let admin = false;
                                uid == adminUID ? admin = true : admin = false;
                                res.render('items', {title: 'My Items', info: info, selling: selling, bought: bought, sold: sold, admin: admin})
                            *//*})
                        })*//*
                    })
                })
            })
        })
        .catch((error)=>{
            res.clearCookie('session');
            res.render('login', {title: 'Login', name: '', data: req,  password_state: 'ok', scroll: 'false', user: 'none'})
        })
})*/
/*
app.get('/help-centre', csurfMiddleware,(req, res) => {

    let sessionCookie = req.cookies.session || "";
    
    let info = {
        name: '',
        lastName: '',
        email: '',
        country: '',
        city: '',
        age: ''
    }

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then( (userRecord)=>{
            let uid = userRecord.uid;
            console.log('from contact: '+uid.toString())
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
                let admin = false;
                uid == adminUID ? admin = true : admin = false;
                res.render('help-centre', {title: 'Help Centre', status: 'in',info: info, admin: admin})
            })
        })
        .catch((error)=>{
            res.render('help-centre', {title: 'Help Centre', status: 'out'})
        })
})
*/
/*
app.get('/messages', csurfMiddleware, (req, res) => {

    let sessionCookie = req.cookies.session || "";
    
    let info = {
        name: '',
        lastName: '',
        email: '',
        country: '',
        city: '',
        age: ''
    }

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then( (userRecord)=>{
            let uid = userRecord.uid;
            console.log('from contact: '+uid.toString())
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
                let admin = false;
                uid == adminUID ? admin = true : admin = false;
                res.render('messages', {title: 'Messages', info: info, admin: admin})
            })
        })
        .catch((error)=>{
            res.clearCookie('session');
            res.render('login', {title: 'Login', name: '', data: req,  password_state: 'ok', scroll: 'false', user: 'none'})
        })
})
*/
/*
app.get('/terms-of-use', csurfMiddleware, (req, res) => {

    let sessionCookie = req.cookies.session || "";
    
    let info = {
        name: '',
        lastName: '',
        email: '',
        country: '',
        city: '',
        age: ''
    }

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then( (userRecord)=>{
            let uid = userRecord.uid;
            console.log('from contact: '+uid.toString())
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
                let admin = false;
                uid == adminUID ? admin = true : admin = false;
                res.render('terms-of-use', {title: 'Terms of Use', status: 'in', info: info, admin: admin})
            })
        })
        .catch((error)=>{
            res.clearCookie('session');
            res.render('terms-of-use', {title: 'Terms of Use', status: 'out'})
        })
})
*/
/*
app.get('/privacy-policy', csurfMiddleware, (req, res) => {

    let sessionCookie = req.cookies.session || "";
    
    let info = {
        name: '',
        lastName: '',
        email: '',
        country: '',
        city: '',
        age: ''
    }

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then( (userRecord)=>{
            let uid = userRecord.uid;
            console.log('from contact: '+uid.toString())
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
                let admin = false;
                uid == adminUID ? admin = true : admin = false;
                res.render('privacy-policy', {title: 'Privacy Policy', status: 'in', info: info, admin: admin})
            })
        })
        .catch((error)=>{
            res.clearCookie('session');
            res.render('privacy-policy', {title: 'Privacy Policy', status: 'out'})
        })
})

app.get('/cookies-policy', csurfMiddleware, (req, res) => {

    let sessionCookie = req.cookies.session || "";
    
    let info = {
        name: '',
        lastName: '',
        email: '',
        country: '',
        city: '',
        age: ''
    }

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then( (userRecord)=>{
            let uid = userRecord.uid;
            console.log('from contact: '+uid.toString())
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
                let admin = false;
                uid == adminUID ? admin = true : admin = false;
                res.render('cookies-policy', {title: 'Cookies Policy', status: 'in', info: info, admin: admin})
            })
        })
        .catch((error)=>{
            res.clearCookie('session');
            res.render('cookies-policy', {title: 'Cookies Policy', status: 'out'})
        })
})
*/

app.get('/change-personal', csurfMiddleware, (req, res) => {

    let sessionCookie = req.cookies.session || "";
    
    let info = {
        name: '',
        lastName: '',
        email: '',
        country: '',
        city: '',
        age: ''
    }

    let balance = {
        current: '',
        eur: ''
    }
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then( (userRecord)=>{
            let uid = userRecord.uid;
            console.log('from contact: '+uid.toString())
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
            .then(
                db.ref('/users/'+uid.toString()+'/wallet').get()
                .then((data) => {
                if (data.exists()){
                    let all = data.val();
                    balance.current = all['current_balance'];
                    balance.eur = Number(balance.current * 2).toFixed();/*
                    balance = {
                        current: all.current_balance,
                        eur: Number(all.current_balance)*2
                    }*/
                    console.log(balance)
                } else {
                    console.log("Data don't exist.")
                }
                })
            )
            .then(() => {
                let admin = false;
                uid == adminUID ? admin = true : admin = false;
                res.render('profile', {title: 'Profile', info: info, status: 'change', balance: balance, admin: admin})
            })
        })
        .catch((error)=>{
            res.clearCookie('session');
            res.render('login', {title: 'Login', name: '', data: req,  password_state: 'ok', scroll: 'false', user: 'none'})
        })
})

var currently_adding = {};
app.get('/new-sell', csurfMiddleware, (req, res) => {

    let sessionCookie = req.cookies.session || "";
    
    let info = {
        name: '',
        lastName: '',
        email: '',
        country: '',
        city: '',
        age: ''
    }

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then( (userRecord)=>{
            let uid = userRecord.uid;
            console.log('from contact: '+uid.toString())
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
                /*
                if (currently_adding[uid.toString()] != null && currently_adding[uid.toString()] != undefined /*&& currently_adding[uid.toString()]*//*){
                    if (currently_adding[uid.toString()] == 'true'){
                        delete currently_adding[uid.toString()]
                        res.render('new-sell', {title: 'New Sale', info: info, video_status: '', adding_status: 'done'})
                    } else {
                        delete currently_adding[uid.toString()]
                        res.render('new-sell', {title: 'New Sale', info: info, video_status: '', adding_status: 'problem'})
                    }
                } else {*/
                    let admin = false;
                    uid == adminUID ? admin = true : admin = false;
                    res.render('new-sell', {title: 'New Sale', info: info, video_status: '', adding_status: '', upload_status: '', admin: admin})/*
                }*/
            })
        })
        .catch((error)=>{
            res.clearCookie('session');
            res.render('login', {title: 'Login', name: '', data: req,  password_state: 'ok', scroll: 'false', user: 'none'})
        })
})

var queue_to_upload = [];

app.post('/new-sell', (req, res) => {
    
    let sessionCookie = req.cookies.session || "";
    
    let info = {
        name: '',
        lastName: '',
        email: '',
        country: '',
        city: '',
        age: ''
    }

    let unique_video_name = Date.now();

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then( (userRecord)=>{
            console.log('here')
            let uid = userRecord.uid;
            let admin = false;
            uid == adminUID ? admin = true : admin = false;
            console.log('post new-sell: '+uid.toString())
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
                    info.email = decrypt(val.encrypted, adminPWD.repeat(5).substring(0, 32), val.iv)
                })
                .then(() => {
    
                    let storage = multer.diskStorage({
                        destination: (req, file, cb) => {
                            cb (null, 'public/')
                        }, 
                        filename: (req, file, cb) => {
                            cb(null, unique_video_name+'.mp4')
                        }
                    })
                    
                    let upload = multer({
                        storage: storage
                    }).single('video')
                
                    upload(req, res, (err) => {
                        if (err){
                            console.log(err)
                        } else {
                            
                            console.log('WORKING')
                            let file_size = req.file.size;
    
                            let name_to_check = req.file.originalname;/*
                            let accepted_formats = ['.mov', '.mp4', '.MOV', '.avi', '.mkv'];*/
                            let suffix = name_to_check.split('.')[1];
                            if (name_to_check.split('.').length == 2){
                                if (suffix == 'mov' || suffix == 'mp4' || suffix == 'MOV' || suffix == 'avi' || suffix == 'mkv'){
                                    if (name_to_check.replace('.', '').includes('.')){
                                        res.render('new-sell', {title: 'New Sale', info: info, video_status: '', adding_status: '', upload_status: 'bad_suffix'})
                                    } else {
        
                                        if (Number(file_size) > 26214400){
                                            res.render('new-sell', {title: 'New Sale', info: info, video_status: '', adding_status: '', upload_status: 'too_large_video'})
                                        } else {
                                            let to_upload = {
                                                req: req,
                                                body: req.body,
                                                video_name: unique_video_name,
                                                uid: uid,
                                                info: info
                                            };
                
                                            queue_to_upload.push(to_upload);
                
                                            res.render('new-sell', {title: 'New Sale', info: info, video_status: '', adding_status: '', upload_status: 'pending', admin: admin});
                
                                            upload_from_queue();
                                        }
                                    } 
                                } else {
                                    res.render('new-sell', {title: 'New Sale', info: info, video_status: '', adding_status: '', upload_status: 'bad_suffix', admin: admin})
                                }
                            } else {
                                res.render('new-sell', {title: 'New Sale', info: info, video_status: '', adding_status: '', upload_status: 'bad_suffix', admin: admin})
                            }
    /*
                            fs.unlink('public/.jpg', () => {*/
    /*
                            })*/
                            
                        }
                    })
                })
            )
        })
        .catch((error)=>{
            res.clearCookie('session');
            res.render('login', {title: 'Login', name: '', data: req,  password_state: 'ok', scroll: 'false', user: 'none'})
        })
})

function upload_from_queue(){
    for (key of Object.keys(queue_to_upload)){
        let upload = queue_to_upload[key];
        queue_to_upload.splice(queue_to_upload.indexOf(upload), 1);

        let req = upload.req;
        let body = upload.body;
        let unique_video_name = upload.video_name;
        let uid = upload.uid;
        let info = upload.info;
        
        upload_single_item(req, body, unique_video_name, uid, info)
    }
}

function upload_single_item(req, body, unique_video_name, uid, info){
    
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
    
            cb(null, "public/")
        },
        filename: function (req, file, cb) {
        cb(null, unique_video_name+".mp4")
        }
    })
        
    let upload = multer({ 
        storage: storage
    }).single("video");       

    upload(req, unique_video_name, function(err) {

        if(err) {
            console.log('ERRROR')
            console.log(err)
        }
        else {
            console.log('uploaded')
            let mp4_file_name = unique_video_name+'.mp4';
            let mkv_file_name = mp4_file_name.replace('.mp4', 'a.mp4');
            console.log(mkv_file_name)
            let proc = new ffmpeg({source: './public/'+mp4_file_name})
                .toFormat('mp4') //TRYING IF THE FORMAT WILL BE CHANGED
                .output('./public/'+mkv_file_name)/*
                .size('1280x720')*/
                .size('720x1280')
                .on('progress', ()=>{
                    console.log('progress')
                })
                .on('end', ()=>{
                    console.log('CONVERTED');
                    console.log('DONE')
                    fs.unlink('public/'+mp4_file_name, () => {
                        console.log('DELETED')
                        console.log(mkv_file_name)
                        let webm_file_name = mkv_file_name.replace('mkv', 'webm')
                        bucket.upload('public/'+mkv_file_name, {destination: 'items_videos/static_videos/'+mkv_file_name})
                        .then(() => {
                            console.log('UPLOADED')
/*
                            let body = req.body;*/
            
                            currently_adding[uid.toString()] = 'false';
            
                            let harmful = ['<', '>','&#60;','&#62;','script','scripT','scriPT','scrIPT','scRIPT','sCRIPT','SCRIPt','scrIpt',
                            'scRIpt','sCRIpt','SCRIpt','scRipt','sCRipt','SCRipt','sCript','SCript','Script','SCRIPT','ScRiPt','sCrIpT',
                            'SCriPT','ScripT','html','htmL', 'htML', 'hTML', 'HTML', 'htMl', 'hTMl', 'HTMl', 'hTmL', 'HTmL']
            
                            let video_name = mkv_file_name;
                            for (harm of harmful){
                                video_name = video_name.replace(harm, '')
                            }
                    
                            let item_name = body.item_name;
                            for (harm of harmful){
                                item_name = item_name.replace(harm, '')
                            }
                            let item_desc = body.item_desc;
                            for (harm of harmful){
                                item_desc = item_desc.replace(harm, '')
                            }
                            let item_location = body.item_location;
                            for (harm of harmful){
                                item_location = item_location.replace(harm, '')
                            }
                            let item_price = body.item_price;
                            for (harm of harmful){
                                item_name = item_name.replace(harm, '')
                            }
                            let price_allowed = ['0','1','2','3','4','5','6','7','8','9','.']
                            item_price = item_price.replace(',', '.');
                            for (char of item_price){
                                if (!price_allowed.includes(char.toString())){
                                    item_price.replace(char, '')
                                }
                            }
                            let seller = info.name+' '+info.lastName;
                            
            
                            bucket.file( 'items_videos/static_videos/'+mkv_file_name ).getSignedUrl({
                                action: "read",
                                expires: '03-17-2025'
                            })
                            .then((url) => {

                                video_name = unicode_escape(video_name);
                                video_name = htmlencode.htmlEncode(video_name);
                                
                                item_name = unicode_escape(item_name);
                                item_name = htmlencode.htmlEncode(item_name);
                                
                                item_desc = unicode_escape(item_desc);
                                item_desc = htmlencode.htmlEncode(item_desc);
                                
                                item_location = unicode_escape(item_location);
                                item_location = htmlencode.htmlEncode(item_location);
                                
                                item_price = unicode_escape(item_price);
                                item_price = htmlencode.htmlEncode(item_price);
                                
                                seller = unicode_escape(seller);
                                seller = htmlencode.htmlEncode(seller);
            
                                let item = {
                                    video_name: video_name.toString(),
                                    video_link: url[0].toString(),
                                    item_name: item_name.toString(),
                                    item_desc: item_desc.toString(),
                                    item_location: item_location.toString(),
                                    item_price: item_price.toString(),
                                    item_seller: seller.toString(),
                                    item_seller_id: uid.toString(),
                                    item_selling_time: new Date().toLocaleString()
                                }
                                db.ref('/items_to_sell/'+video_name.toString()+'/').set(
                                    item
                                )
                                .then(
                                    db.ref('/users/'+uid.toString()+'/items/selling/'+video_name+'/').set(
                                        item
                                    )
                                    .then(
                                        fs.unlink('public/'+mkv_file_name, ()=>{
                                            console.log('DELETED .MOV')
                                        })
                                    )
                                    .then(
                                        
                                        console.log('WE ARE DONE')
                                        
                                        /*
                                        () => {
                                            currently_adding[uid.toString()] = 'true'
                                        }*/
                                    )
                                    .then(() => {
                                        send_upload_success_email(body, uid, info)
                                    })/*
                                    .then(
                                        () => {
                                            if (currently_adding[uid.toString()] == 'true'){
                                                res.redirect('/new-sell')
                                            }
                                        }
                                    )*/
                                )
                            })
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                    
                    })
                })
                .on('error', (err) => {
                    console.log('ERROR')
                    console.log(err.message)

                    fs.unlink('public/'+mp4_file_name)

                    send_failure_mail(body, uid, info)
                })
            .run()
        }
    })
}

function send_failure_mail(body, uid, info){

    let output = `
    <body style='background-color: #FFE0C4; padding: 40px;'>
    <p style="font-size: 1.1rem">Your item <span style="font-weight: 600; padding: .35em; background-color: #0a5a55; color: #FFE0C4">${body.item_name}</span> failed to upload. :-/</p>
    <h2 style='padding: .5em; background-color: #0a5a55; color: #FFE0C4; min-width: fit-content; max-width: fit-content'>Item details</h2>
    <ul style='list-style: none'>
    <li><b>Name:</b> <p style='font-size: 1.25rem; margin-left: 15px'>${body.item_name}</p> </li>
    <li><b>Description:</b> <p style='font-size: 1.25rem; margin-left: 15px'>${body.item_desc}</p> </li>
    <li><b>Price:</b> <p style='font-size: 1.25rem; margin-left: 15px'>${body.item_price}</> </li>
    </ul>
    <h2 style='padding: .5em; background-color: #0a5a55; color: #FFE0C4; min-width: fit-content; max-width: fit-content'>We are sorry for this. Please, 
    try it again later. Thanks!</h2>
    </body>
    `;

    let mailOptions = {
        from: '"Sigred" <sigred.inc@sigred.org>',
        to: info.email,
        subject: 'Item failed to upload',
        text: 'Sigred - Item Upload Status',
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
            return console.log(error)
        } else{
            console.log('Message sent!')
        }
    })

}

function send_upload_success_email(body, uid, info){

    let output = `
    <body style='background-color: #FFE0C4; padding: 40px;'>
    <p style="font-size: 1.1rem">Your item <span style="font-weight: 600; padding: .35em; background-color: #0a5a55; color: #FFE0C4">${body.item_name}</span> has been uploaded successfuly.</p>
    <h2 style='padding: .5em; background-color: #0a5a55; color: #FFE0C4; min-width: fit-content; max-width: fit-content'>Item details</h2>
    <ul style='list-style: none'>
        <li><b>Name:</b> <p style='font-size: 1.25rem; margin-left: 15px'>${body.item_name}</p> </li>
        <li><b>Description:</b> <p style='font-size: 1.25rem; margin-left: 15px'>${body.item_desc}</p> </li>
        <li><b>Price:</b> <p style='font-size: 1.25rem; margin-left: 15px'>${body.item_price}</> </li>
    </ul>
    <h2 style='padding: .5em; background-color: #0a5a55; color: #FFE0C4; min-width: fit-content; max-width: fit-content'>Thank you for your trust.
    In case of any question, contact us on <span style="color: #0a5a55">sigred.inc@sigred.org</span> or via our contact page <span style="color: #0a5a55">www.sigred.org/contact</span></h2>
    </body>
    `;

    let mailOptions = {
        from: '"Contact" <sigred.inc@sigred.org>',
        to: info.email,
        subject: 'Item uploaded successfuly.',
        text: 'Sigred - Item Upload Status',
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
            return console.log(error)
        } else{
            console.log('Message sent!')
        }
    })

}

app.post('/contact', function(req, res){
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
        }
    })
    //send mail with defined transporter object
    transporter.sendMail(mailOptions, (error, infoo) => {
        if (error){
            return console.log(error)
        } else{
            console.log('Message sent!')
            if (body.status == 'in'){
                let admin = false;
                uid == adminUID ? admin = true : admin = false;
                res.render('contact', {title: 'Contact', message: 'E-mail sent!', status: 'in', info: info, admin: admin})
            } else {
                res.render('contact', {title: 'Contact', message: 'E-mail sent!', status: 'out'})
            }
        }
    })

})

const encrypt = (text, pwd) => {

    let iv = crypto.randomBytes(16).toString('hex').substring(0,16);

    let cipher = crypto.createCipheriv(algorithm, pwd, iv);

    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted+=cipher.final('hex');

    return ({
        encrypted: encrypted,
        iv: iv
    })

}

const decrypt = (text, pwd, iv) => {

    let decipher = crypto.createDecipheriv(algorithm, pwd, iv);

    let decrypted = decipher.update(text, 'hex', 'utf-8');
    decrypted+=decipher.final('utf-8');

    return decrypted

}

app.post('/registrate', function(req, res){
    let body = req.body;
    let password = body.password;
    let name = body.name;
    let lastName = body.lastName;
    let email = body.email;
    let country = body.country;
    let city = body.city;
    let username = body.username;
    let age = body.age;
    let privacy = body['privacy-confirm'];
    let ageC = body['age-confirm'];
    let user = {
        name: name,
        lastName: lastName,
        email: email,
        country: country,
        city: city,
        username: username,
        age: age
    }
    if (privacy == 'on'){
        if (ageC == 'on'){
            if (password[0] == password[1] && (password[0].length > 8 || password[0].length == 8)){
                if (name!= '' && lastName!= '' && email != '' && country!=''&& city!='' && username!=''&& password != '' &&  age!= '') {
                    var wholeName = name+' '+lastName;
                    admin.auth().createUser({
                        email: email,
                        password: password[0]
                    }).then((userRecord)=>{/*
                        email = encryptEmail(email, password[0])*/
                        db.ref('/users/'+(userRecord.uid).toString()+'/personal-info').set({
                            name: name,
                            lastName: lastName,
                            username: username, 
                            email: encrypt(email, password[0].repeat(5).substr(0, 32)),
                            country: country, 
                            city: city,
                            age: age
                        })
                        .then(
                            //saving to admin section in database
                            db.ref('/admin/users/'+(userRecord.uid).toString()).set({
                                status: encrypt('enabled', adminPWD.repeat(5).substring(0, 32)),
                                established: encrypt(new Date().toLocaleString(), adminPWD.repeat(5).substring(0, 32)),
                                date: encrypt('', adminPWD.repeat(5).substring(0, 32)), 
                                history: {
                                    disabled: encrypt('0', adminPWD.repeat(5).substring(0,32))
                                },
                                email: encrypt(email, adminPWD.repeat(5).substring(0, 32)),
                                bought: encrypt('', adminPWD.repeat(5).substring(0, 32)),
                                sold: encrypt('', adminPWD.repeat(5).substring(0, 32)),
                                selling: ''
                            })
                            .then(
                                db.ref('/users/'+(userRecord.uid).toString()+'/wallet').set({
                                    current_balance: encrypt('0', password[0].repeat(5).substr(0, 32))
                                })
                                .then(
                                    db.ref('/users/'+(userRecord.uid).toString()+'/items').set({
                                        selling: '',
                                        bought: encrypt('', password[0].repeat(5).substr(0, 32)),
                                        sold: encrypt('', password[0].repeat(5).substr(0, 32))
                                    })
                                    .then(
                                        res.render('login', {title: 'Login', data: req,  password_state: 'ok', password1: '', password2: '',  scroll: 'false', user: 'none', problem: '', privacy: '', ageC: ''})
                                    )
                                )
                            )
                        )
                    })
                } else {
                    console.log('Sth not filled')
                }
            } else if (password[0] == password[1] && password[0].length < 8){
                res.render('login', {title: 'Login', password_state: 'longer', password1: '', password2: '',  scroll: 'true', user: user, problem: '', privacy: 'ok', ageC: 'ok'})
            } else if (password[0]  != password[1] && (password[0].length > 8 || password[0].length == 8)){
                user.password = password[0];
                res.render('login', {title: 'Login', password_state: 'reconfirm', password1: password[0], password2: '',  scroll: 'true', user: user, problem: '', privacy: 'ok', ageC: 'ok'})
            } else if (password[0]  != password[1] && password[0].length < 8){
                res.render('login', {title: 'Login', password_state: 'change_whole', password1: '', password2: '', scroll: 'true', user: user, problem: '', privacy: 'ok', ageC: 'ok'})
            }
        } else {
            res.render('login', {title: 'Login', password_state: 'ok', password1: password[0], password2: password[1], scroll: 'true', user: user, problem: 'age-confirm', privacy: 'ok', ageC: ''})
        }
    } else if (privacy != 'on' && ageC == 'on'){
        res.render('login', {title: 'Login', password_state: 'ok', password1: password[0], password2: password[1], scroll: 'true', user: user, problem: 'privacy-confirm', privacy: '', ageC: 'ok'})
    } else if (privacy != 'on' && ageC != 'on'){
        res.render('login', {title: 'Login', password_state: 'ok', password1: password[0], password2: password[1], scroll: 'true', user: user, problem: 'both', privacy: '', ageC: ''})
    }
})

app.post('/update_personal', (req, res) => {

    let sessionCookie = req.cookies.session || "";
    
    let info = {
        name: '',
        lastName: '',
        email: '',
        country: '',
        city: '',
        age: ''
    }

    let balance = {
        current: '',
        eur: ''
    }

    let body = req.body;

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then( (userRecord)=>{
            let uid = userRecord.uid;
            db.ref('/users/'+uid.toString()+'/personal-info').update(
                body
            )
            .then(
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
                    db.ref('/users/'+uid.toString()+'/wallet').get()
                    .then((data) => {
                    if (data.exists()){
                        let all = data.val();
                        balance.current = all['current_balance'];
                        balance.eur = Number(balance.current * 2).toFixed();/*
                        balance = {
                            current: all.current_balance,
                            eur: Number(all.current_balance)*2
                        }*/
                        console.log(balance)
                    } else {
                        console.log("Data don't exist.")
                    }
                    })
                    .then(() => {
                        if (first_time){
                            res.redirect('index');
                            first_time = false;
                        } else {
                            let admin = false;
                            uid == adminUID ? admin = true : admin = false;
                            res.render('profile', {title: 'Profile', info: info, status: '', balance: balance, admin: admin})
                        }
                    })
                })
        
            )
                .catch((error) => {
                res.render(/*finish!!!*/)
            })
        })
})

var videos = {};
/*
var temp_video;
var file = '';
*/
app.post('/upload_video', (req, res) => {
    
    let sessionCookie = req.cookies.session || "";

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then( (userRecord)=>{
            let uid = userRecord.uid;

            let body = req.body;
            file = body.file;
            let link = body.unique_date;
            temp_video = link;
        
        
            var index = Number(file.toString().lastIndexOf('.'));
            var format = '';
            for (i = index; i<file.length; i++){
                format+=file[i].toString()
            }
            if (format == '.mp4' || format == '.mov'){
                video_format = 'ok';
                let to_add = {
                    uid: uid,
                    file: file,
                    temp_video: link,
                    format: 'ok'
                }
                videos[uid.toString()] = to_add;
            } else {
                video_format = 'wrong';
                let to_add = {
                    uid: uid,
                    file: file,
                    temp_video: link,
                    format: 'wrong'
                }
                videos[uid.toString()] = to_add;
            }
        })
        .catch((error)=>{
            res.clearCookie('session');
            res.render('login', {title: 'Login', name: '', data: req,  password_state: 'ok', scroll: 'false', user: 'none'})
        })
})

app.get('/video-checked', (req, res) => {

    let sessionCookie = req.cookies.session || "";
    
    let info = {
        name: '',
        lastName: '',
        email: '',
        country: '',
        city: '',
        age: ''
    }

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then( (userRecord)=>{
            let uid = userRecord.uid;
            console.log('from contact: '+uid.toString())
            
            var video_whole = videos[uid.toString()];
            var format = video_whole['format'];
            var file = video_whole['file'];
            var temp_video = video_whole['temp_video'];

            if (format == 'ok'){
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
                        bucket.file( 'items_videos/temp_videos/'+temp_video.toString() ).getSignedUrl({
                            action: "read",
                            expires: '03-17-2025'
                        })
                        .then((url) => {
                            let admin = false;
                            uid == adminUID ? admin = true : admin = false;
                            res.render('new-sell', {title: 'New Sale', info: info, video_status: 'ok', temp_video: file, url: url, admin: admin})
                        })
                    }
                )
            } else {
                console.log('not correct format')
            }
        })
        .catch((error)=>{
            res.clearCookie('session');
            res.render('login', {title: 'Login', name: '', data: req,  password_state: 'ok', scroll: 'false', user: 'none'})
        })
})

/*
var first_time = true;
app.get('/profile', csurfMiddleware, function(req, res){
    let sessionCookie = req.cookies.session || "";
    
    let info = {
        name: '',
        lastName: '',
        email: '',
        country: '',
        city: '',
        age: ''
    }
    let balance = {
        current: '',
        eur: ''
    }

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then((userRecord) => {
            let uid = userRecord.uid;
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
                db.ref('/users/'+uid.toString()+'/wallet').get()
                .then((data) => {
                if (data.exists()){
                    let all = data.val();
                    balance.current = usersLoggedIn[uid].balance;
                    balance.eur = Number(balance.current * 2).toFixed();*//*
                    balance = {
                        current: all.current_balance,
                        eur: Number(all.current_balance)*2
                    }*//*
                    console.log(balance)
                } else {
                    console.log("Data don't exist.")
                }
                })
                .then(() => {
                    if (first_time){
                        res.redirect('index');
                        first_time = false;
                    } else {
                        let admin = false;
                        uid == adminUID ? admin = true : admin = false;
                        res.render('profile', {title: 'Profile', info: info, status: '', balance: balance, admin: admin})
                    }
                })
            })
        }

        )
        .catch((error)=>{
            res.clearCookie('session');
            res.render('login', {title: 'Login', name: '', data: req,  password_state: 'ok', scroll: 'false', user: 'none'})
        })
})*/
/*
app.get('/admin', csurfMiddleware, function(req, res){
    let sessionCookie = req.cookies.session || "";
    
    let info = {
        name: '',
        lastName: '',
        email: '',
        country: '',
        city: '',
        age: ''
    }

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then((userRecord) => {
            let uid = userRecord.uid;
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
                if (uid == adminUID) {
                    console.log('now')
                    res.render('admin', {title: 'Admin', info: info, status: 'in', admin: admin})
                } else {
                    res.redirect(req.headers.referer)
                }
            })
        })
        .catch((error)=>{
            res.clearCookie('session');
            res.render('login', {title: 'Login', name: '', data: req,  password_state: 'ok', scroll: 'false', user: 'none'})
        })
})*/
/*
app.post('/admin-login', (req, res) => {
    
    let sessionCookie = req.cookies.session || "";

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then((userRecord) => {
            let uid = userRecord.uid;
            let pwd = req.body.password;
            
            if (uid == adminUID) {
                if (pwd == adminPWD) {
                    res.redirect('/admin-dashboard')
                } else {
                    res.redirect('/admin')
                }
            } else {
                res.redirect('/admin')
            }
        })
})*/

app.get('/admin-dashboard', (req, res) => {

    let sessionCookie = req.cookies.session || "";

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then((userRecord) => {
            let uid = userRecord.uid;
            
            if (uid == adminUID) {
                let adminLoggedInCookie = req.cookies['admin-logged-in'];
                if (adminLoggedInCookie) {
                    adminLoggedInCookie = adminLoggedInCookie.toString().substr(1, adminLoggedInCookie.length-2);
                    if (adminsLoggedIn.includes(adminLoggedInCookie)) {
                        let users = [];
                        db.ref('/admin/users/').get()
                        .then((data) => {
                            let val = data.val();
                            for (let user in val){
                                //decrypting email address of a user
                                let personal = {
                                    name: '',
                                    lastName: '',
                                    userName: '',
                                    age: '',
                                    country: '',
                                    city: '',
                                    email: decrypt(val[user].email.encrypted, adminPWD.repeat(5).substring(0, 32), val[user].email.iv)
                                }
                                let bought = [];
                                let sold = [];
                                let selling = [];
                                let status = '';
                                //decrypting status of user
                                status = decrypt(val[user].status.encrypted, adminPWD.repeat(5).substring(0, 32), val[user].status.iv);
                                //getting info about bought items of every user
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
                                //getting info about sold items of every user
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
            } else {
                res.redirect('/admin')
            }
        })
})

const decodeItems = (items) => {
    let decoded = [];
    for (let key of Object.keys(items)) {
        let current = items[key];
        decoded.push({
            item_desc: JSON.parse('"'+htmlencode.htmlDecode(current.item_desc)+'"'),
            item_location: JSON.parse('"'+htmlencode.htmlDecode(current.item_location)+'"'),
            item_name: JSON.parse('"'+htmlencode.htmlDecode(current.item_name)+'"'),
            item_price: JSON.parse('"'+htmlencode.htmlDecode(current.item_price)+'"'),
            item_seller: JSON.parse('"'+htmlencode.htmlDecode(current.item_seller)+'"'),
            video_link: current.video_link,
            video_name: JSON.parse('"'+htmlencode.htmlDecode(current.video_name)+'"')
        })
    }
    return decoded
}

app.post('/data-for-admin-search-engine', (req, res) => {
    
    let sessionCookie = req.cookies.session || "";

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then((userRecord) => {
            let uid = userRecord.uid;
            
            if (uid == adminUID) {
                let usersSearchEngine = [];
                let productsSearchEngine = [];/*
                let adminsSearchEngine = [];*/
                db.ref('/users').get()
                .then((data) => {
                    let val = data.val();
                    for (let user in val){
                        let userName = val[user]['personal-info'].name + ' ' + val[user]['personal-info'].lastName;
                        let userID = user;
                        usersSearchEngine.push({
                            userName: userName,
                            userID: userID,
                            userWarned: ''
                        })
                    }
                })
                .then(
                    db.ref(`/admin/users`).get()
                    .then((data) => {
                        let val = data.val();
                        for (let user in usersSearchEngine) {
                            console.log(decrypt(val[usersSearchEngine[user].userID].history.disabled.encrypted, adminPWD.repeat(5).substring(0, 32), val[usersSearchEngine[user].userID].history.disabled.iv));
                            usersSearchEngine[user].userWarned = decrypt(val[usersSearchEngine[user].userID].history.disabled.encrypted, adminPWD.repeat(5).substring(0, 32), val[usersSearchEngine[user].userID].history.disabled.iv);
                        }
                    })
                    .then(
                        db.ref('/items_to_sell').get()
                        .then((data) => {
                            productsSearchEngine = decodeItems(data.val())
                        })
                        .then(() => {
                            res.send({
                                users: usersSearchEngine, 
                                products: productsSearchEngine
                            })
                        }
                        )
                    )
                )
            } else {
                res.redirect('/admin')
            }
        })
})

app.get('/admin-dashboard/user/:id', (req, res) => {

    let sessionCookie = req.cookies.session || "";
    
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then((userRecord) => {
            let uid = userRecord.uid;
                   
            if (uid == adminUID) {

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
                    //retrieving all information about user except for email (encrypted)
                    userInfo.info.name = val['personal-info'].name;
                    userInfo.info.lastName = val['personal-info'].lastName;
                    userInfo.info.age = val['personal-info'].age;
                    userInfo.info.city = val['personal-info'].city;
                    userInfo.info.country = val['personal-info'].country;
                    userInfo.info.userName = val['personal-info'].username;
                    //retrieving info about what is user selling
                    //userInfo.selling = val.items.selling;
                    let selling = val.items.selling;
                    for (let item in selling) {
                        let key = JSON.parse('"'+htmlencode.htmlDecode(item)+'"');
                        let toAdd = {};
                        for (let prop in selling[item]) {
                            toAdd[prop] = JSON.parse('"'+htmlencode.htmlDecode(selling[item][prop])+'"')
                        };
                        toAdd.video_link = selling[item].video_link;
                        userInfo.selling[key] = toAdd
                    }
                })
                .then(
                    db.ref('/admin/users/'+userID).get()
                    .then((data) => {
                        let val = data.val();
                        if (val.status){
                            userInfo.status = decrypt(val.status.encrypted, adminPWD.repeat(5).substring(0, 32), val.status.iv);
                        } else {
                            //saving user's status to database, if none exists
                            db.ref('/admin/users/'+(userID).toString()+'/status').set(
                                encrypt('enabled', adminPWD.repeat(5).substring(0, 32))
                            )
                            userInfo.status = 'enabled';
                        }
                        userInfo.date = decrypt(val.date.encrypted, adminPWD.repeat(5).substring(0, 32), val.date.iv);
                        userInfo.established = decrypt(val.established.encrypted, adminPWD.repeat(5).substring(0, 32), val.established.iv);
                        userInfo.info.email = decrypt(val.email.encrypted, adminPWD.repeat(5).substring(0, 32), val.email.iv);
                        userInfo.bought = decrypt(val.bought.encrypted, adminPWD.repeat(5).substring(0, 32), val.bought.iv);
                        userInfo.sold = decrypt(val.sold.encrypted, adminPWD.repeat(5).substring(0, 32), val.sold.iv);
                    })
                    .then(() => {           
                        console.log(userInfo);
                        res.render('admin-user', {title: 'User', status: 'in', admin: true, userInfo: userInfo})
                    })
                )

            } else {
                res.redirect('/admin')
            }
        })
        .catch((err) => {
            console.log(err)
            res.redirect('/sessionLogout')
        })
})

app.get('/admin-dashboard/item/:id', (req, res) => {

    let sessionCookie = req.cookies.session || "";
    
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then((userRecord) => {
            let uid = userRecord.uid;
                   
            if (uid == adminUID) {

                let itemInfo = {}

                db.ref('/items_to_sell').get()
                .then((data) => {
                    let val = data.val();
                    let found = false;
                    for (let item of Object.keys(val)){
                        if (found != true) {
                            let itemName = JSON.parse('"'+htmlencode.htmlDecode(val[item].item_name)+'"');
                            if (itemName.toString().split(' ').join('') == req.params.id.toString()) {
                                itemInfo = val[item];
                                found = true;
                            }
                        }
                    }
                    for (let key of Object.keys(itemInfo)) {
                        itemInfo[key] = JSON.parse('"'+htmlencode.htmlDecode(itemInfo[key].toString())+'"');
                    }  

                    db.ref(`/admin/users/${itemInfo.item_seller_id.toString()}/selling/${itemInfo.item_name.split(' ').join('')}`).get()
                    .then((data) => {
                        let val = data.val()
                        if (val) {
                            itemInfo.status = decrypt(val.availability.encrypted, adminPWD.repeat(5).substring(0, 32), val.availability.iv);
                            itemInfo.disabled = decrypt(val.disabled.encrypted, adminPWD.repeat(5).substring(0, 32), val.disabled.iv);
                            if (val.history) {
                                itemInfo.history = decrypt(val.history.encrypted, adminPWD.repeat(5).substring(0, 32), val.history.iv);
                            } else {
                                itemInfo.history = 0
                            }
                            res.render('admin-item', {title: 'Item', status: 'in', admin: true, itemInfo: itemInfo})
                        } else {
                            itemInfo.status = 'available';
                            itemInfo.disabled = '';
                            db.ref(`/admin/users/${itemInfo.item_seller_id.toString()}/selling/${itemInfo.item_name.split(' ').join('')}`).set({
                                availability: encrypt('available', adminPWD.repeat(5).substring(0, 32)),
                                disabled: encrypt('', adminPWD.repeat(5).substring(0, 32))
                            })
                            .then(
                                res.render('admin-item', {title: 'Item', status: 'in', admin: true, itemInfo: itemInfo})
                            )
                        }
                    })
                })

            } else {
                res.redirect('/admin')
            }
        })
        .catch((err) => {
            console.log(err)
            res.redirect('/sessionLogout')
        })
})

app.post('/message-from-admin-to-user', (req, res) => {

    let sessionCookie = req.cookies.session || "";
    
    let originURL = req.headers.referer;

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then((userRecord) => {
            let uid = userRecord.uid;
                   
            if (uid == adminUID) {

                let output = `
                <body style='background-color: #FFE0C4; padding: 40px;'>
                <p style="font-size: 1.1rem; font-weight: 700">Hey, ${req.body.name}, we contact you on behalf of Sigred team.</p>
                <p style="font-size: 1.1rem">${req.body.text}</p>
                <h2 style='padding: .5em; background-color: #0a5a55; color: #FFE0C4; min-width: fit-content; max-width: fit-content'>Thank you for your trust.
                In case of any question, contact us on <span style="color: #0a5a55">sigred.inc@sigred.org</span> or via our contact page <span style="color: #0a5a55">www.sigred.org/contact</span></h2>
                </body>
                `;
            
                let mailOptions = {
                    from: '"Sigred team" <sigred.inc@sigred.org>',
                    to: req.body.email,
                    subject: req.body.subject,
                    text: 'Sigred - message from admin',
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
                        return console.log(error)
                    } else{
                        res.status(200).redirect(originURL)
                    }
                })
            }
        })
})

app.post('/message-from-admin-to-seller', (req, res) => {

    let sessionCookie = req.cookies.session || "";
    
    let originURL = req.headers.referer;

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then((userRecord) => {
            let uid = userRecord.uid;

            let id = req.body.seller_id

            db.ref(`/admin/users/${id}/email`).get()
            .then((data) => {
                let val = data.val()
                let email = decrypt(val.encrypted, adminPWD.repeat(5).substring(0, 32), val.iv)
                
                if (uid == adminUID) {

                    let output = `
                        <body style='background-color: #FFE0C4; padding: 40px;'>
                        <p style="font-size: 1.1rem; font-weight: 700">Hey, ${req.body.name}, we contact you on behalf of Sigred team about the item <i>${req.body.item_name}</i>, that you're currently selling.</p>
                        <p style="font-size: 1.1rem">${req.body.text}</p>
                        <h2 style='padding: .5em; background-color: #0a5a55; color: #FFE0C4; min-width: fit-content; max-width: fit-content'>Thank you for your trust.
                        In case of any question, contact us on <span style="color: #0a5a55">sigred.inc@sigred.org</span> or via our contact page <span style="color: #0a5a55">www.sigred.org/contact</span></h2>
                        </body>
                    `;
                
                    let mailOptions = {
                        from: '"Sigred team" <sigred.inc@sigred.org>',
                        to: email,
                        subject: req.body.subject,
                        text: 'Sigred - message from admin',
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
                            return console.log(error)
                        } else{
                            res.status(200).redirect(originURL)
                        }
                    })
                }
            })
        })
})

app.post('/disable-account', (req, res) => {

    let sessionCookie = req.cookies.session || "";
    
    let originURL = req.headers.referer;

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then((userRecord) => {
            let uid = userRecord.uid;
                   
            if (uid == adminUID) {

                let body = req.body;
                if (body.adminPWD == adminPWD) {

                    let email = '';
                    let name = '';

                    db.ref('/admin/users/'+body.userID+'/status').set(
                        encrypt('disabled', adminPWD.repeat(5).substring(0, 32))
                    )
                    .then(
                        db.ref('/admin/users/'+body.userID+'/date').set(
                            encrypt(body.time,  adminPWD.repeat(5).substring(0, 32))
                        )
                    )
                    .then(
                        db.ref(`/admin/users/${body.userID}/history/disabled`).get()
                        .then((data) => {
                            let val = data.val();
                            let num = decrypt(val.encrypted, adminPWD.repeat(5).substring(0, 32), val.iv);
                            num = Number(num)   
                            num+=1;
                            db.ref(`/admin/users/${body.userID}/history/disabled`).set(
                                encrypt(num.toString(), adminPWD.repeat(5).substring(0, 32))
                            )
                            .then(
                                db.ref(`/admin/users/${body.userID}/email`).get()
                                .then((data) => {
                                    let val = data.val();
                                    email = decrypt(val.encrypted, adminPWD.repeat(5).substring(0, 32), val.iv);
                                })
                                .then(
                                    db.ref(`/users/${req.body.userID}/personal-info/name`).get()
                                    .then((data) => {
                                        name = data.val()
                                    })
                                    .then(() => {
                                        
                                        let time = req.body.time;
                
                                        let output = `
                                            <body style='background-color: #FFE0C4; padding: 40px;'>
                                            <p style="font-size: 1.1rem; font-weight: 700">Hey, ${name}, today, ${time.split(',')[0].replace(' ', '')} at ${time.split(',')[1].replace(' ', '').substr(0, time.split(',')[1].replace(' ', '').lastIndexOf(':'))} your account was disabled.
                                            </p>
                                            <p style="font-size: 1.1rem">${req.body.message}</p>
                                            <h2 style='padding: .5em; background-color: #0a5a55; color: #FFE0C4; min-width: fit-content; max-width: fit-content'>Thank you for your trust.
                                            In case of any question, contact us on <span style="color: #0a5a55">sigred.inc@sigred.org</span> or via our contact page <span style="color: #0a5a55">www.sigred.org/contact</span></h2>
                                            </body>
                                        `;
                                    
                                        let mailOptions = {
                                            from: '"Sigred team" <sigred.inc@sigred.org>',
                                            to: email,
                                            subject: 'ACCOUNT DISABILITY',
                                            text: 'Sigred - account disability',
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
                                                return console.log(error)
                                            } else{
                                                res.json({success: true}).end()
                                            }
                                        })
                                    })
                            ))        
                        })
                    )
                } else {
                    res.json({
                        error: 'wrong_pwd'
                    }).end()
                }

            }
        })
})

app.post('/enable-account', (req, res) => {

    let sessionCookie = req.cookies.session || "";
    
    let originURL = req.headers.referer;

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then((userRecord) => {
            let uid = userRecord.uid;
                   
            if (uid == adminUID) {

                let body = req.body;
                if (body.adminPWD == adminPWD) {

                    let email = '';
                    let name = '';

                    db.ref('/admin/users/'+body.userID+'/status').set(
                        encrypt('enabled', adminPWD.repeat(5).substring(0, 32))
                    )
                    .then(
                        db.ref('/admin/users/'+body.userID+'/date').set(
                            encrypt(body.time,  adminPWD.repeat(5).substring(0, 32))
                        )
                    )
                    .then(
                        db.ref(`/admin/users/${body.userID}/email`).get()
                        .then((data) => {
                            let val = data.val();
                            email = decrypt(val.encrypted, adminPWD.repeat(5).substring(0, 32), val.iv);
                        })
                        .then(
                            db.ref(`/users/${req.body.userID}/personal-info/name`).get()
                            .then((data) => {
                                name = data.val()
                            })
                            .then(() => {
                                
                                let time = req.body.time;
        
                                let output = `
                                <body style='background-color: #FFE0C4; padding: 40px;'>
                                <p style="font-size: 1.1rem; font-weight: 700">Hey, ${name}, today, ${time.split(',')[0].replace(' ', '')} at ${time.split(',')[1].replace(' ', '').substr(0, time.split(',')[1].replace(' ', '').lastIndexOf(':'))} your account was enabled again.
                                </p>
                                <p style="font-size: 1.1rem">${req.body.message}</p>
                                <h2 style='padding: .5em; background-color: #0a5a55; color: #FFE0C4; min-width: fit-content; max-width: fit-content'>Thank you for your trust.
                                In case of any question, contact us on <span style="color: #0a5a55">sigred.inc@sigred.org</span> or via our contact page <span style="color: #0a5a55">www.sigred.org/contact</span></h2>
                                </body>
                                `;
                            
                                let mailOptions = {
                                    from: '"Sigred team" <sigred.inc@sigred.org>',
                                    to: email,
                                    subject: 'ACCOUNT ENABLED AGAIN',
                                    text: 'Sigred - account enabled',
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
                                        return console.log(error)
                                    } else{
                                        res.json({success: true}).end()
                                    }
                                })
                            })
                        )
                    )

                } else {
                    res.json({
                        error: 'wrong_pwd'
                    }).end()
                }

            }
        })
})

app.post('/disable-item', (req, res) => {

    let sessionCookie = req.cookies.session || "";
    
    let originURL = req.headers.referer;

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then((userRecord) => {
            let uid = userRecord.uid;
                   
            if (uid == adminUID) {

                let body = req.body;
                if (body.adminPWD == adminPWD) {

                    let email = '';
                    let name = '';

                    db.ref(`/admin/users/${body.userID}/selling/${req.body.itemName.toString().split(' ').join('')}/availability`).set(
                        encrypt('disabled', adminPWD.repeat(5).substring(0, 32))
                    )
                    .then(
                        db.ref(`/admin/users/${body.userID}/selling/${req.body.itemName.toString().split(' ').join('')}/disabled`).set(
                            encrypt(body.time, adminPWD.repeat(5).substring(0, 32))
                        )
                        .then(
                            db.ref(`/admin/users/${body.userID}/selling/${req.body.itemName.toString().split(' ').join('')}/history`).get()
                            .then((data) => {
                                let val = data.val();
                                if (val) {
                                    let num = decrypt(val.encrypted, adminPWD.repeat(5).substring(0, 32), val.iv);
                                    num = Number(num)   
                                    num+=1;
                                    db.ref(`/admin/users/${body.userID}/selling/${req.body.itemName.toString().split(' ').join('')}/history`).set(
                                        encrypt(num.toString(), adminPWD.repeat(5).substring(0, 32))
                                    )
                                    .then(
                                        db.ref(`/admin/users/${body.userID}/email`).get()
                                        .then((data) => {
                                            let val = data.val();
                                            console.log(body.userID)
                                            email = decrypt(val.encrypted, adminPWD.repeat(5).substring(0, 32), val.iv);
                                        })
                                        .then(
                                            db.ref(`/users/${req.body.userID}/personal-info/name`).get()
                                            .then((data) => {
                                                name = data.val()
                                            })
                                            .then(() => {
                                                
                                                let time = req.body.time;
                        
                                                let output = `
                                                    <body style='background-color: #FFE0C4; padding: 40px;'>
                                                    <p style="font-size: 1.1rem; font-weight: 700">Hey, ${name}, today, ${time.split(',')[0].replace(' ', '')} at ${time.split(',')[1].replace(' ', '').substr(0, time.split(',')[1].replace(' ', '').lastIndexOf(':'))} ${req.body.itemName}, item that you're selling was disabled.
                                                    </p>
                                                    <p style="font-size: 1.1rem">${req.body.message}</p>
                                                    <h2 style='padding: .5em; background-color: #0a5a55; color: #FFE0C4; min-width: fit-content; max-width: fit-content'>Thank you for your trust.
                                                    In case of any question, contact us on <span style="color: #0a5a55">sigred.inc@sigred.org</span> or via our contact page <span style="color: #0a5a55">www.sigred.org/contact</span></h2>
                                                    </body>
                                                `;
                                            
                                                let mailOptions = {
                                                    from: '"Sigred team" <sigred.inc@sigred.org>',
                                                    to: email,
                                                    subject: 'ITEM DISABILITY',
                                                    text: 'Sigred - item disability',
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
                                                        return console.log(error)
                                                    } else{
                                                        res.json({success: true}).end()
                                                    }
                                                })
                                            })
                                    ))  
                                } else {
                                    let num = 0;
                                    num = Number(num)   
                                    num+=1;
                                    db.ref(`/admin/users/${body.userID}/selling/${req.body.itemName.toString().split(' ').join('')}/history`).set(
                                        encrypt(num.toString(), adminPWD.repeat(5).substring(0, 32))
                                    )
                                    .then(
                                        db.ref(`/admin/users/${body.userID}/email`).get()
                                        .then((data) => {
                                            let val = data.val();
                                            email = decrypt(val.encrypted, adminPWD.repeat(5).substring(0, 32), val.iv);
                                            console.log(email)
                                        })
                                        .then(
                                            db.ref(`/users/${req.body.userID}/personal-info/name`).get()
                                            .then((data) => {
                                                name = data.val()
                                            })
                                            .then(() => {
                                                
                                                let time = req.body.time;
                        
                                                let output = `
                                                    <body style='background-color: #FFE0C4; padding: 40px;'>
                                                    <p style="font-size: 1.1rem; font-weight: 700">Hey, ${name}, today, ${time.split(',')[0].replace(' ', '')} at ${time.split(',')[1].replace(' ', '').substr(0, time.split(',')[1].replace(' ', '').lastIndexOf(':'))} ${req.body.itemName}, item that you're selling was disabled.
                                                    </p>
                                                    <p style="font-size: 1.1rem">${req.body.message}</p>
                                                    <h2 style='padding: .5em; background-color: #0a5a55; color: #FFE0C4; min-width: fit-content; max-width: fit-content'>Thank you for your trust.
                                                    In case of any question, contact us on <span style="color: #0a5a55">sigred.inc@sigred.org</span> or via our contact page <span style="color: #0a5a55">www.sigred.org/contact</span></h2>
                                                    </body>
                                                `;
                                            
                                                let mailOptions = {
                                                    from: '"Sigred team" <sigred.inc@sigred.org>',
                                                    to: email,
                                                    subject: 'ITEM DISABILITY',
                                                    text: 'Sigred - item disability',
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
                                                        return console.log(error)
                                                    } else{
                                                        res.json({success: true}).end()
                                                    }
                                                })
                                            })
                                    ))  
                                }      
                            })
                        )
                    )
                } else {
                    res.json({
                        error: 'wrong_pwd'
                    }).end()
                }

            }
        })
})

app.post('/enable-item', (req, res) => {

    let sessionCookie = req.cookies.session || "";
    
    let originURL = req.headers.referer;

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then((userRecord) => {
            let uid = userRecord.uid;
                   
            if (uid == adminUID) {

                let body = req.body;
                if (body.adminPWD == adminPWD) {

                    let email = '';
                    let name = '';

                    db.ref(`/admin/users/${body.userID}/selling/${body.itemName.toString().split(' ').join('')}/availability`).set(
                        encrypt('available', adminPWD.repeat(5).substring(0, 32))
                    )
                    .then(
                        db.ref(`/admin/users/${body.userID}/email`).get()
                        .then((data) => {
                            let val = data.val();
                            email = decrypt(val.encrypted, adminPWD.repeat(5).substring(0, 32), val.iv);
                        })
                        .then(
                            db.ref(`/users/${req.body.userID}/personal-info/name`).get()
                            .then((data) => {
                                name = data.val()
                            })
                            .then(() => {
                                
                                let time = req.body.time;
        
                                let output = `
                                    <body style='background-color: #FFE0C4; padding: 40px;'>
                                    <p style="font-size: 1.1rem; font-weight: 700">Hey, ${name}, today, ${time.split(',')[0].replace(' ', '')} at ${time.split(',')[1].replace(' ', '').substr(0, time.split(',')[1].replace(' ', '').lastIndexOf(':'))} ${body.itemName}, item that you're selling was enabled again.
                                    </p>
                                    <p style="font-size: 1.1rem">${req.body.message}</p>
                                    <h2 style='padding: .5em; background-color: #0a5a55; color: #FFE0C4; min-width: fit-content; max-width: fit-content'>Thank you for your trust.
                                    In case of any question, contact us on <span style="color: #0a5a55">sigred.inc@sigred.org</span> or via our contact page <span style="color: #0a5a55">www.sigred.org/contact</span></h2>
                                    </body>
                                `;
                            
                                let mailOptions = {
                                    from: '"Sigred team" <sigred.inc@sigred.org>',
                                    to: email,
                                    subject: 'ITEM ENABLED AGAIN',
                                    text: 'Sigred - item enabled',
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
                                        return console.log(error)
                                    } else{
                                        res.json({success: true}).end()
                                    }
                                })
                            })
                        )
                    )

                } else {
                    res.json({
                        error: 'wrong_pwd'
                    }).end()
                }

            }
        })
})
/*
app.post("/sessionLogin", (req, res) => {
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
                        .then(
                            usersLoggedIn[uid] = decrypted
                        )
                    )
                )

                res.cookie("session", sessionCookie, options);
                res.end(JSON.stringify({ status: "success" }));
            },
            (error) => {
                res.status(401).send('unauthorized request');
            }
        );
});

app.get('/sessionLogout', csurfMiddleware, function(req, res){

    let sessionCookie = req.cookies.session || "";

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then( (userRecord)=>{
            let uid = userRecord.uid;
            delete usersLoggedIn[uid];
        })
        .then(
            res.clearCookie('session')
        )
        .then(
            res.render('login', {title: 'Login', name: '', data: req,  password_state: 'ok', scroll: 'false', user: 'none'})
        )
})
*/

//404 page
app.use((req, res) => {
    let requested = req.url;
    requested = requested.replace('/', '')
    res.status(404).render('404', {title: 'Error', page: requested})
})

/*
app.listen(3000, ()=>{
    console.log("Listening on port 3000...")
})*/


var port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log("Listening on port "+port+'...')
})

