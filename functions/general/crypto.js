// IMPORTING NECCESSARY NODE MODULES
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

// DEFINING FUNCTIONS
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

// EXPORTING FUNCTIONS
module.exports = { encrypt, decrypt }