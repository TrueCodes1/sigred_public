/*var stripeHandler = StripeCheckout.configure({
    key: StripePublicKey,
    locale: 'auto',
    token: (token) => {
        var amountOfSigc = document.getElementById('card-amount').innerHTML;
        amountOfSigc = amountOfSigc.toString().replace('€', '');
        amountOfSigc = Number(amountOfSigc);
        fetch('/top_up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                stripeTokenId: token.id,
                amountOfSigc: amountOfSigc
            })
        })
        .then(
            console.log('Nicely done')
        )
    }
})*/


var elements = stripe.elements();

function create_card(){
    if (screen.width >640){
        var card = elements.create('card', options = {
            style : {
                base: {
                    '::placeholder':{
                        color: '#ffe0c4b0',
                        fontSize : '12.5px',
                        textAlign: 'center'
                    },
                    fontSize : '12.5px',
                    color: '#FFE0C4',
                    backgroundColor: 'transparent',
                    fontFamily: 'Montserrat',
                    textAlign: 'center'
                }
            }
        })
        return card
    } else {
        var card = elements.create('card', options = {
            style : {
                base: {
                    '::placeholder':{
                        color: '#ffe0c4b0',
                        fontSize : '5vw',
                        textAlign: 'center'
                    },
                    fontSize : '5vw',
                    color: '#FFE0C4',
                    backgroundColor: 'transparent',
                    fontFamily: 'Montserrat',
                    textAlign: 'center',
                }
            }
        })
        return card
    }
}

var card = create_card()
;/*
var card_number = elements.create('cardNumber', options = {
    style : {
        base: {
            '::placeholder':{
                color: '#ffe0c4b0',
                fontSize : '20px',
                textAlign: 'center'
            },
            fontSize : '20px',
            color: '#FFE0C4',
            backgroundColor: 'transparent',
            fontFamily: 'Montserrat',
            textAlign: 'center'
        }
    }
});
var card_expiry = elements.create('cardExpiry', options = {
    style : {
        base: {
            '::placeholder':{
                color: '#ffe0c4b0',
                fontSize : '20px'
            },
            fontSize : '20px',
            color: '#FFE0C4',
            backgroundColor: 'transparent',
            fontFamily: 'Montserrat',
            textAlign: 'center'
        }
    }
});
var card_cvc = elements.create('cardCvc', options = {
    style : {
        base: {
            '::placeholder':{
                color: '#ffe0c4b0',
                fontSize : '20px'
            },
            fontSize : '20px',
            color: '#FFE0C4',
            backgroundColor: 'transparent',
            fontFamily: 'Montserrat',
            textAlign: 'center'
        }
    }
});*/
/*
card_number.mount('#card-number');
card_expiry.mount('#card-expiry');
card_cvc.mount('#card-cvc');
*/
var card_whole = document.getElementById('card-payment');
var card_bg = document.getElementById('card-bg');
card.mount('#card')

function card_come(){
    let amount = document.getElementById('eur1').value;
    document.getElementById('card-amount').innerHTML = amount.toString()+' €';
    if ((amount.toString()).length>0 && amount != '0'){
        card_whole.style.display = 'flex';
        card_whole.style.visibility = 'visible';
        card_bg.style.display = 'flex';
        card_whole.classList.add('card-come');
        card_bg.classList.add('card-come');
        setTimeout(() =>{
            card_whole.classList.remove('card-come');
            card_whole.style.opacity = '1';
            if (screen.width > 640){
                card_whole.style.transform = 'translateY(-200px)';
            } else {
                card_whole.style.margniBottom = '0';
            }
        }, 500)
    }
    }

function card_leave(){
    card_whole.classList.add('card-leave');
    card_bg.classList.add('card-leave');
    setTimeout(() => {
        card_whole.classList.remove('card-leave');
        card_bg.classList.remove('card-leave');
        card_whole.style.opacity = '0';
        card_whole.style.display = 'none';
        card_bg.style.display = 'none';
        if (screen.width > 640){
            card_whole.style.transform = 'translateY(-180px)';
        } else {
            card_whole.style.margniBottom = '-30px';
            card_whole.style.visibility = 'hidden';
        }
    }, 500)
}

function stripeTokenHandler(token) {
    var amount_to_post = document.getElementById('eur1').value;
    amount_to_post = (Number(amount_to_post)*100).toFixed();
    document.getElementById('processing').style.visibility = 'visible';/*
    document.getElementById('processing').classList.add('appear');*/
    document.getElementById('processing').addEventListener('animationend', () => {
        document.getElementById('processing').classList.remove('appear');
    })
    setTimeout(() => {
        fetch('/top_up', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                token: token,
                amount: amount_to_post
            })
        })
        .then(() =>{
            var link = document.createElement('a');
            link.setAttribute('href', '/successful_topup');
            link.click()
        });
    }, 200)
}

document.getElementById('card-payment-submit').addEventListener('click', () => {/*
    let amount = document.getElementById('card-amount').innerHTML;
    amount = amount.toString().replace('€', '');
    amount = Number(amount)*100;*//*
    stripe.createPaymentMethod({
        type: 'card',
        card: card
    })
    .then((paymentMethod) => {
        var id = paymentMethod;
        var amount_to_post = document.getElementById('eur1').value;
        amount_to_post = (Number(amount_to_post)*100).toFixed();
        fetch('/top_up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                amount: amount_to_post,
                id: id
            })
        })
        .then(() => {
            console.log('Nicely done...')
        })
})*/
        stripe.createToken(card)
        .then(
            (result) => {
                stripeTokenHandler(result.token)
            }
        )
})

const fetchCurrentBalance = (e) => {
    let whichForm = e.target.id;
    switch(whichForm.toString() == 'submit-input') { // CHECKING WHICH OF THE TWO SUBMITS HAVE BEEN CLICKED
        case true: // IF IT WAS FIRST ONE

            let pwd = $('#password-input').attr('value');
            fetch('/wallet/show-my-balance', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    password: pwd
                })
            })
            .then(res => res.json())
            .then((res) => {
                if (res.error) {
                    if (res.error == 'wrong-pwd') {
                        alert('Please, try again with correct password.')
                    }
                } else {
                    let balance = res.balance;
                    let sigecoins = balance.current;
                    let eur = balance.eur;

                    $('#balance-sigecoins').html(
                        `${sigecoins.toString()}  <img src="/sigecoin_icon_currency.svg" alt="" class="desktop"> <img src="/sigecoin_icon_currency.svg" alt="" class="mobile">`
                    )
                    $('#balance-eur').html(
                        `${eur.toString()}  €`
                    )
                }
            })

            break // STOP THE EXECUTION OF THE SWITCH STATEMENT AFTER WE HAVE TAKEN SPECIFIC ACTIONS NEEDED
        case false: // IF IT WAS SECOND ONE

            let pwdEur = $('#password-input-eur').attr('value');
            fetch('/wallet/show-my-balance', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    password: pwdEur
                })
            })
            .then(res => res.json())
            .then((res) => {
                if (res.error) {
                    if (res.error == 'wrong-pwd') {
                        alert('Please, try again with correct password.')
                    }
                } else {
                    let balance = res.balance;
                    let sigecoins = balance.current;
                    let eur = balance.eur;

                    $('#balance-sigecoins').html(
                        `${sigecoins.toString()}  <img src="/sigecoin_icon_currency.svg" alt="" class="desktop"> <img src="/sigecoin_icon_currency.svg" alt="" class="mobile">`
                    )
                    $('#balance-eur').html(
                        `${eur.toString()}  €`
                    )
                }
            })

            break // STOP THE EXECUTION OF THE SWITCH STATEMENT AFTER WE HAVE TAKEN SPECIFIC ACTIONS NEEDED
    }
}

const submit1 = $('#submit-input');
const submit2 = $('#submit-input-eur');

$(submit1).on('click', fetchCurrentBalance);
$(submit2).on('click', fetchCurrentBalance);