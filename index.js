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
/*
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

})*/

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
/*
var currently_adding = {};
*/
/*
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
                } else {*//*
                    let admin = false;
                    uid == adminUID ? admin = true : admin = false;
                    res.render('new-sell', {title: 'New Sell', info: info, video_status: '', adding_status: '', upload_status: '', admin: admin})/*
                }*//*
            })
        })
        .catch((error)=>{
            res.clearCookie('session');
            res.render('login', {title: 'Login', name: '', data: req,  password_state: 'ok', scroll: 'false', user: 'none'})
        })
})*/
/*
var queue_to_upload = [];
*/
/*
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
                            let accepted_formats = ['.mov', '.mp4', '.MOV', '.avi', '.mkv'];*//*
                            let suffix = name_to_check.split('.')[1];
                            if (name_to_check.split('.').length == 2){
                                if (suffix == 'mov' || suffix == 'mp4' || suffix == 'MOV' || suffix == 'avi' || suffix == 'mkv'){
                                    if (name_to_check.replace('.', '').includes('.')){
                                        res.render('new-sell', {title: 'New Sell', info: info, video_status: '', adding_status: '', upload_status: 'bad_suffix'})
                                    } else {
        
                                        if (Number(file_size) > 26214400){
                                            res.render('new-sell', {title: 'New Sell', info: info, video_status: '', adding_status: '', upload_status: 'too_large_video'})
                                        } else {
                                            let to_upload = {
                                                req: req,
                                                body: req.body,
                                                video_name: unique_video_name,
                                                uid: uid,
                                                info: info
                                            };
                
                                            queue_to_upload.push(to_upload);
                
                                            res.render('new-sell', {title: 'New Sell', info: info, video_status: '', adding_status: '', upload_status: 'pending', admin: admin});
                
                                            upload_from_queue();
                                        }
                                    } 
                                } else {
                                    res.render('new-sell', {title: 'New Sell', info: info, video_status: '', adding_status: '', upload_status: 'bad_suffix', admin: admin})
                                }
                            } else {
                                res.render('new-sell', {title: 'New Sell', info: info, video_status: '', adding_status: '', upload_status: 'bad_suffix', admin: admin})
                            }
    /*
                            fs.unlink('public/.jpg', () => {*/
    /*
                            })*//*
                            
                        }
                    })
                })
            )
        })
        .catch((error)=>{
            res.clearCookie('session');
            res.render('login', {title: 'Login', name: '', data: req,  password_state: 'ok', scroll: 'false', user: 'none'})
        })
})*/

/*
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
}*/
/*
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
                .size('1280x720')*//*
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
                            let body = req.body;*//*
            
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
                                db.ref('/items_to_sell').push(
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
                                        }*//*
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
                                    )*//*
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
}*/
/*
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

}*/
/*
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

}*/
/*
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
            console.log(error);
            res.end()
        } else{
            if (body.status == 'in'){
                let admin = false;
                uid == adminUID ? admin = true : admin = false;
                res.render('contact', {title: 'Contact', message: 'E-mail sent!', status: 'in', info: info, admin: admin})
            } else {
                res.render('contact', {title: 'Contact', message: 'E-mail sent!', status: 'out'})
            }
        }
    })

})*/

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
})*/
/*
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
})*/


var port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log("Listening on port "+port+'...')
})

