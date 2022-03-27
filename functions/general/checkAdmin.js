const checkAdmin = (uid) => {

    const adminUID = process.env.ADMIN_UID;
    
    let admin = false;
    uid == adminUID ? admin = true : admin = false;

    return(admin)

}

module.exports = { checkAdmin }