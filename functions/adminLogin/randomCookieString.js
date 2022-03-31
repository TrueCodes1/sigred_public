const crypto = require('crypto');

// GENERATING RANDOM STRING TO USE AS COOKIE
// THAT WILL KEEP THE ADMIN LOGGED IN
const randomCookieString = () => {

    const string = crypto.randomBytes(50).toString('hex');
    
    return({
        adminLoggedIn: string
    })

}

// DEFINING OPTIOND FOR THE COOKIE MENTIONED ABOVE
const options = {
    secure: false, // FOR LIVE WEBSITE RUNNING ON HTTPS, SET TO 'true'
    httpOnly: true,
    expires: 60 * 10,
}

module.exports = { randomCookieString, options }