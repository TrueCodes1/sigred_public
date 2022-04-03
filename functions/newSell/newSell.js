
// IMPORTING ALL NECCESSARY NODE MODULES
const nodemailer = require('nodemailer');
const path = require('path');
const htmlencode = require('htmlencode/encoder');
const unicode_escape = require('unicode-escape');
const multer = require('multer');
const fs = require('fs');
const hbjs = require('handbrake-js');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// IMPORTING ALL NECCESSARY FUNCTIONS
const firebase = require('../../databaseConnection');

// DEFINING SINGLE SPECIFIC PARTS OF FIREBASE IMPORT
const db = firebase.db;
const admin = firebase.admin;
const bucket = firebase.bucket;

// IMPORTING ALL THE OTHER NECCESSARY FILES
const uploading = require('../../uploading');

// DEFINING SPECIFIC PARTS OF THE IMPORTED FILES
const currently_adding = uploading.currently_adding;
const queue_to_upload = uploading.queue_to_upload;

const upload_from_queue = () => {
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

const upload_single_item = (req, body, unique_video_name, uid, info) => {
    
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

const send_failure_mail = (body, uid, info) => {

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
            console.log(error);
            res.end()
        } else{
            console.log('Message sent!')
        }
    })

}

const send_upload_success_email = (body, uid, info) => {

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

    console.log(info.email);

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
            return console.log(error);
        } else{
            console.log('Message sent!')
        }
    })

}

module.exports = { upload_from_queue, upload_single_item, send_failure_mail, send_upload_success_email }