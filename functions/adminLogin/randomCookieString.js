const crypto = require('crypto');


// DEFINING OPTIONS FOR THE COOKIE MENTIONED ABOVE
let options = {
    secure: false, // FOR LIVE WEBSITE RUNNING ON HTTPS, SET TO 'true'
    httpOnly: true,
    maxAge: 20 * 1000,
}

// GENERATING RANDOM STRING TO USE AS COOKIE
// THAT WILL KEEP THE ADMIN LOGGED IN
const randomCookieString = () => {

    const string = crypto.randomBytes(50).toString('hex');
    
    let date = new Date();

    return({
        adminLoggedIn: string,
        options: options
    })

}

module.exports = { randomCookieString }