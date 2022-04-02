// IMPORTING ALL NECCESSARY FUNCTIONS
const firebase = require('../../databaseConnection');
const verifySessionCookie = require('../../functions/general/verifySessionCookie');
const crypto = require('../../functions/general/crypto');
const registration = require('../../functions/login/registrate');

// IMPORTING OTHER NECCESSARY FILES
const adminUID = process.env.ADMIN_UID;
const adminPWD = process.env.ADMIN_PWD;

// DEFINING SINGLE SPECIFIC PARTS OF FIREBASE IMPORT
const db = firebase.db;

const encrypt = crypto.encrypt;
const decrypt = crypto.decrypt;


// GET 
const registrate = async (req, res) => {

    // USING VERIFY SESSION COOKIE FINCTION WITH REQUEST AS ARGUMENT
    // TO CHECK STATE OF THE USER IF THEY ARE LOGGED IN
    let userRecord = await verifySessionCookie.verifySessionCookie(req);
    if (userRecord) {
        
        res.end()
    
    } else {
        
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
                        
                        let userRecord = await registration.registerNewUser(email, password[1])

                        if (userRecord != false) {

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
                                    status: crypto.encrypt('enabled', adminPWD.repeat(5).substring(0, 32)),
                                    established: crypto.encrypt(new Date().toLocaleString(), adminPWD.repeat(5).substring(0, 32)),
                                    date: crypto.encrypt('', adminPWD.repeat(5).substring(0, 32)), 
                                    history: {
                                        disabled: crypto.encrypt('0', adminPWD.repeat(5).substring(0,32))
                                    },
                                    email: crypto.encrypt(email, adminPWD.repeat(5).substring(0, 32)),
                                    bought: crypto.encrypt('', adminPWD.repeat(5).substring(0, 32)),
                                    sold: crypto.encrypt('', adminPWD.repeat(5).substring(0, 32)),
                                    selling: ''
                                })
                                .then(
                                    db.ref('/users/'+(userRecord.uid).toString()+'/wallet').set({
                                        current_balance: crypto.encrypt('0', password[0].repeat(5).substr(0, 32))
                                    })
                                    .then(
                                        db.ref('/users/'+(userRecord.uid).toString()+'/items').set({
                                            selling: '',
                                            bought: crypto.encrypt('', password[0].repeat(5).substr(0, 32)),
                                            sold: crypto.encrypt('', password[0].repeat(5).substr(0, 32))
                                        })
                                        .then(
                                            res.render('login', {title: 'Login', data: req,  password_state: 'ok', password1: '', password2: '',  scroll: 'false', user: 'none', problem: '', privacy: '', ageC: ''})
                                        )
                                    )
                                )
                            )

                        } else {
                            res.redirect('login')
                        }

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

    }
}

// EXPORTING ALL THE FUNCTIONS
module.exports = { registrate }
