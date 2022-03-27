const itemsAll = $('#user-items');

const itemsSelling = $('#user-items-selling');
const itemsSold = $('#user-items-sold');
const itemsBought = $('#user-items-bought');

const messagePattern = $('#message');

const switchBetweenItems = (id) => {
    switch (id) {
        case 'user-items-selling':
            $(itemsSold).removeClass('start');
            $(itemsSold).removeClass('shown');
            $(itemsSold).addClass('hide');
            $(itemsBought).removeClass('start');
            $(itemsBought).removeClass('shown');
            $(itemsBought).addClass('hide');
            $(itemsSelling).removeClass('start');
            $(itemsSelling).removeClass('hide');
            $(itemsSelling).addClass('shown');
            break
        case 'user-items-sold':
            $(itemsSelling).removeClass('start');
            $(itemsSelling).removeClass('shown');
            $(itemsSelling).addClass('hide');
            $(itemsBought).removeClass('start');
            $(itemsBought).removeClass('shown');
            $(itemsBought).addClass('hide');
            $(itemsSold).removeClass('start');
            $(itemsSold).removeClass('hide');
            $(itemsSold).addClass('shown');
            break
        case 'user-items-bought':
            $(itemsSold).removeClass('start');
            $(itemsSold).removeClass('shown');
            $(itemsSold).addClass('hide');
            $(itemsSelling).removeClass('start');
            $(itemsSelling).removeClass('shown');
            $(itemsSelling).addClass('hide');
            $(itemsBought).removeClass('start');
            $(itemsBought).removeClass('hide');
            $(itemsBought).addClass('shown');
            break
    }
}

const neutralizeItems = () => {
    let list = [itemsSelling, itemsSold, itemsBought];
    for (let category of list) {
        $(category).removeClass('hide');
        $(category).removeClass('shown');
        $(category).addClass('start');
    }
}

const openMessage = () => {
    $('#input-email').attr('value', $('#user-email').html().replaceAll(',', ''));
    $('#input-name').attr('value', $('#user-name').html().replaceAll(',', '').split(' ')[0]);
    $('#submit-message-button').html('Message '+$('#user-name').html().replaceAll(',', '').split(' ')[0]);
    $(messagePattern).css('display', 'flex')
}

//FUNCTIONS FOR DISABLING USER'S ACCOUNT
const disableAccount = () => {
    $('#disable-form').css('display', 'flex');
    $('#disable-message').attr('value', '');
}

const disableAskForPassword = () => {
    $('#disable-pwd').css('visibility', 'visible');
    $('#disable-pwd').css('opacity', '1');
}

const goBackToDisable = () => {
    $('#disable-pwd').css('opacity', '0');
    $('#disable-pwd').css('visibility', 'hidden');
}

const finalFinishDisable = () => {
    let userID = window.location.toString();
    userID = userID.substring(userID.lastIndexOf('/')+1, userID.length);
    let message = $('#disable-message').attr('value');
    let time = new Date().toLocaleString();
    let adminPWD = $('#disable-password-input').attr('value');
    if (message.replaceAll(' ', '').length > 0) {
    
        fetch('/disable-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                userID: userID,
                message: message,
                time: time,
                adminPWD: adminPWD
            })
        })
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                switch (res.error){
                    case 'wrong_pwd':
                        $('#disable-password-input').attr('value', '');
                        alert('Wrong admin password. Please try again.')
                }
            } else if (res.success) {
                location.reload()
            }
        })

    } else {
        alert(`You need to write a message to the user before disabling their account.`)
    }
}

//FUNCTIONS FOR ENABLING USER'S ACCOUNT
const enableAccount = () => {
    $('#disable-form').css('display', 'flex');
    $('#disable-message').attr('value', '');
}

const enableAskForPassword = () => {
    $('#disable-pwd').css('visibility', 'visible');
    $('#disable-pwd').css('opacity', '1');
}

const goBackToEnable = () => {
    $('#disable-pwd').css('opacity', '0');
    $('#disable-pwd').css('visibility', 'hidden');
}

const finalFinishEnable = () => {
    let userID = window.location.toString();
    userID = userID.substring(userID.lastIndexOf('/')+1, userID.length);
    let message = $('#disable-message').attr('value');
    let time = new Date().toLocaleString();
    let adminPWD = $('#disable-password-input').attr('value');
    if (message.replaceAll(' ', '').length > 0) {
    
        fetch('/enable-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                userID: userID,
                message: message,
                time: time,
                adminPWD: adminPWD
            })
        })
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                switch (res.error){
                    case 'wrong_pwd':
                        $('#disable-password-input').attr('value', '');
                        alert('Wrong admin password. Please try again.')
                }
            } if (res.success) {
                location.reload()
            }
        })

    } else {
        alert(`You need to write a message to the user before enabling their account.`)
    }
}