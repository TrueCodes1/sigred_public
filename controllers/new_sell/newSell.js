// IMPORTING ALL NECCESSARY NODE MODULES
const nodemailer = require('nodemailer');
const path = require('path');
const htmlencode = require('htmlencode/encoder');
const multer = require('multer');
const fs = require('fs');
const hbjs = require('handbrake-js');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// IMPORTING ALL NECCESSARY FUNCTIONS
const firebase = require('../../databaseConnection');
const verifySessionCookie = require('../../functions/general/verifySessionCookie');
const checkAdmin = require('../../functions/general/checkAdmin');
const crypto = require('../../functions/general/crypto');
const sell = require('../../functions/newSell/newSell');

// IMPORTING OTHER NECCESSARY FILES
const adminUID = process.env.ADMIN_UID;
const adminPWD = process.env.ADMIN_PWD;
const uploading = require('../../uploading');

// DEFINING SPECIFIC PARTS OF THE IMPORTED FILES
const currently_adding = uploading.currently_adding;
const queue_to_upload = uploading.queue_to_upload;

// DEFINING SINGLE SPECIFIC PARTS OF FIREBASE IMPORT
const db = firebase.db;
const admin = firebase.admin;
const bucket = firebase.bucket;

// GET 
const getSell = async (req, res) => {

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
            res.render('new-sell', {title: 'New Sell', info: info, video_status: '', adding_status: '', upload_status: '', admin: admin})
    
        })

    } else {

        res.redirect('/sessionLogout');

    }
}

// POST
const makeSell = async (req, res) => {

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
                info.email = crypto.decrypt(val.encrypted, adminPWD.repeat(5).substring(0, 32), val.iv)
            })
            .then(() => {
    
                let unique_video_name = Date.now();
                
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
            
                                        let admin = checkAdmin.checkAdmin(uid.toString());
                                        res.render('new-sell', {title: 'New Sell', info: info, video_status: '', adding_status: '', upload_status: 'pending', admin: admin});
            
                                        sell.upload_from_queue();
                                    }
                                } 
                            } else {
                                let admin = checkAdmin.checkAdmin(uid.toString());
                                res.render('new-sell', {title: 'New Sell', info: info, video_status: '', adding_status: '', upload_status: 'bad_suffix', admin: admin})
                            }
                        } else {
                            let admin = checkAdmin.checkAdmin(uid.toString());
                            res.render('new-sell', {title: 'New Sell', info: info, video_status: '', adding_status: '', upload_status: 'bad_suffix', admin: admin})
                        }
                        
                    }
                })
        
            })
        )

    } else {

        res.redirect('/sessionLogout').end();

    }
}

// EXPORTING ALL THE FUNCTIONS
module.exports = { getSell, makeSell }
