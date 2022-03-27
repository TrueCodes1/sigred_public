

console.log(document.getElementById('card-payment-submit'))

document.getElementById('card-payment-submit').addEventListener('click', () => {
    let amount = document.getElementById('card-amount').innerHTML;
    amount = amount.toString().replace('€', '');
    amount = Number(amount)*100;
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
})
})

function card_come(){
    let amount = document.getElementById('eur1').value;
    document.getElementById('card-amount').innerHTML = amount.toString()+' €';
    if ((amount.toString()).length>0 && amount != '0'){
        card_whole.style.display = 'flex';
        card_whole.classList.add('card-come');
        setTimeout(() =>{
            card_whole.classList.remove('card-come');
            card_whole.style.transform = 'translateY(-200px)';
            card_whole.style.opacity = '1';
        }, 500)
    }
    }

function card_leave(){
    card_whole.classList.add('card-leave');
    setTimeout(() => {
        card_whole.classList.remove('card-leave');
        card_whole.style.transform = 'translateY(-180px)';
        card_whole.style.opacity = '0';
        card_whole.style.display = 'none'
    }, 500)
}
