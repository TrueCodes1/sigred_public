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
**********************************/
/*

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

}*//*
/*********************************
 * 
 * END OF OBFUSCATING JS SCRIPTS
 * 
**********************************/

let usersLoggedIn = {};

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

var port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log("Listening on port "+port+'...')
})

