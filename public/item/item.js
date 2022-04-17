
const scrollToMain = () => {
    window.scroll({
        top: (window.innerHeight)+240,
        behavior: 'smooth'
    })
}

const removeEventListener = () => {
    $(document).off('scroll', closeMessage)
}

const closeMessage = () => {
    $('#message').css('opacity', '0');
    setTimeout(() => {
        $('#message').css('display', 'none');
    }, 250)
    removeEventListener()
}

const openMessage = () => {
    if (window.pageYOffset != window.innerHeight + 240) {
        scrollToMain()
        $('#message').css('display', 'flex');
        $('#message').css('transition', 'all .25s ease');
        setTimeout(() => {
            $('#message').css('opacity', '1');
        }, 1)
        setTimeout(() => {
            $(document).on('scroll', closeMessage)
        }, 1000)
    } else {
        $('#message').css('display', 'flex');
        $('#message').css('transition', 'all .25s ease');
        setTimeout(() => {
            $('#message').css('opacity', '1');
        }, 1)
        $(document).on('scroll', closeMessage)
    }
}

const postContactSeller = () => {
    let itemName = $('#item-name').attr('value');
    let sellerId = $('#seller-id').attr('value');
    let sellerName = $('#input-name').attr('value');
    let subject = $('#input-subject').attr('value');
    let text = $('#input-text').attr('value');

    // DEFINING OBJECT THAT WILL BE SENT TO THE SERVER
    // IN CASE ALL THE FIELDS ARE FILLED IN
    let messageObject = {
        itemName: itemName, 
        sellerId: sellerId, 
        sellerName: sellerName, 
        subject: subject, 
        text: text
    }

    // DEFINING BOOOLEAN VARIABLE TO STORE THE PIECE
    // OF INGORMATION ABOUT WHETHER ALL THE FIELDS 
    // ARE FILLED IN
    let allFilled = true;

    // GOING THROUGH THE WHOLE OBJECT (DEFINED BEFORE)
    // AND USING ITS KEYS CHECKING ALL THE VALUES WHETHER
    // THEIR LENGTHS AFTER REMOVING ALL THE SPACES ARE
    // STILL > 0
    for (key of Object.keys(messageObject)) {
        // IF ANY OF THE FIELDS CHECKED BEFORE HAVE ALREADY BEEN
        // AN EMPTY STRING, NO OTHER CHECKS TAKE PLACE AND THE
        // BOOLEAN VARIABLE IS KEPT FALSE TILL THE END
        if (allFilled != false) {
            if (messageObject[key].replaceAll(' ', '').length > 0) {
                allFilled = true
            } else {
                allFilled = false
            }
        }
    }

    if (allFilled == true) {

        fetch('/selling/message-from-client-to-seller', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                messageObject
            )
        })
        .then(res => res.json())
        .then( res => {
            if (res.status == 'not-logged-in') {
                alert('Please, log in before contacting')
            } else if (res.error) {
                if (res.error == 'db-isue') {
                    alert('Sorry, a mistake occured on our side. Please, try to contact the seller again later.')
                } else if (res.error == 'no-such-item') {
                    alert('No such item has been found.')
                }
            }
        })

    } else {

        alert("sth's missing")

    }

}

$('#submit-message-button').on('click', postContactSeller)