const crypto = require('crypto');

// GENERATING RANDOM STRING TO USE AS COOKIE
// THAT WILL KEEP THE ADMIN LOGGED IN
const randomCookieString = () => {

    const string = crypto.randomBytes(50).toString('hex');
    return string

}

// DEFINING OPTIOND FOR THE COOKIE MENTIONED ABOVE
const options = {

}

module.exports = { randomCookieString, options }