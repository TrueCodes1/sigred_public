const itemsAll = $('#user-items');

const itemsSelling = $('#user-items-selling');
const itemsSold = $('#user-items-sold');
const itemsBought = $('#user-items-bought');

const messagePattern = $('#message');

const openMessage = () => {
    $(messagePattern).css('display', 'flex');
}

//FUNCTIONS FOR DISABLING USER'S ACCOUNT
const disableItem = () => {
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
    let itemName = $('#item-name-hidden-input').attr('value');
    let userID = $('#seller-id-hidden-input').attr('value');
    let message = $('#disable-message').attr('value');
    let time = new Date().toLocaleString();
    let adminPWD = $('#disable-password-input').attr('value');
    if (message.replaceAll(' ', '').length > 0) {
    
        fetch('/disable-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                userID: userID,
                itemName: itemName,
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
const enableItem = () => {
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
    let itemName = $('#item-name-hidden-input').attr('value');
    let userID = $('#seller-id-hidden-input').attr('value');
    let message = $('#disable-message').attr('value');
    let time = new Date().toLocaleString();
    let adminPWD = $('#disable-password-input').attr('value');
    if (message.replaceAll(' ', '').length > 0) {
    
        fetch('/enable-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                userID: userID,
                itemName: itemName,
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