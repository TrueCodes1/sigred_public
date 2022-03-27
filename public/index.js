var videos = document.getElementsByClassName('video');

for (vid of videos){
    var promiseLoad = vid.load();

    if (promiseLoad !== undefined){
        promiseLoad.then( () => {
            video.pause()
        })
        .catch((error) => {

        })
    }
}

for (let video of videos){
    video.load();
    if (screen.width<500){
        video.addEventListener('click', () => {/*
            let image = video.querySelector('.video');*/
            if (video.paused ){
                for (v of videos){
                    v.pause()
                }
                video.play()
                .catch((error) => {
                    console.log(error);
                })
            } else if (!video.paused){
                video.pause()
            }
        })
    } else {
        video.addEventListener('mouseover', () => {/*
            let video = video.querySelector('.video');*/
            video.play()
            .catch((error) => {
                console.log(error);
            })
        })
        video.addEventListener('mouseleave', () => {/*
            let video = video.querySelector('.video');*/
            video.pause()
        })
    }
}
/*

var products = document.getElementsByClassName('products-product')
var current_products = [];
var first_shown_product = 0;
var second_shown_product = 1;
var third_shown_product = 2;
current_products.push(products[first_shown_product]);
current_products.push(products[second_shown_product]);
current_products.push(products[third_shown_product]);
function show_products() {
    current_products = [];
    products[first_shown_product].style.opacity = 0;
    products[second_shown_product].style.opacity = 0;
    products[third_shown_product].style.opacity = 0;
    products[first_shown_product].style.transition = 'all .35s ease';
    products[second_shown_product].style.transition = 'all .35s ease';
    products[third_shown_product].style.transition = 'all .35s ease';
    products[first_shown_product].style.display = 'flex';
    products[second_shown_product].style.display = 'flex';
    products[third_shown_product].style.display = 'flex';
    products[first_shown_product].style.opacity = 1;
    products[second_shown_product].style.opacity = 1;
    products[third_shown_product].style.opacity = 1;
    current_products.push(products[first_shown_product]);
    current_products.push(products[second_shown_product]);
    current_products.push(products[third_shown_product]);
}
show_products()*/

var products = document.getElementsByClassName('products-product');
var products_current_zone = 0;
var products_width = document.getElementById('products-products').clientWidth;
function handle_left() {
    if (products_current_zone == 2){
        document.getElementById('products-products').scroll({
            left: /*((*/products_width/* / 4 * 3) + 120)*/,
            behavior: 'smooth'
        })
        products_current_zone = 1
    } else if (products_current_zone == 1){
        document.getElementById('products-products').scroll({
            left: 0,
            behavior: 'smooth'
        })
        products_current_zone = 0
    } else {
        for (prod of products){
            prod.classList.add('shake');
        }
        setTimeout(() =>{
            for (prod of products){
                prod.classList.remove('shake')
            }
        }, 250)
    }
}

function handle_right() {
    if (products_current_zone == 0){
        if (products.length>3){
            document.getElementById('products-products').scroll({
                left: /*((*/products_width/* / 4 * 3) + 120)*/,
                behavior: 'smooth'
            })
            products_current_zone = 1
        } else {
            for (prod of products){
                prod.classList.add('shake');
            }
            setTimeout(() =>{
                for (prod of products){
                    prod.classList.remove('shake')
                }
            }, 250)
        }
    } else if (products_current_zone == 1){
        if (products.length>6){
            document.getElementById('products-products').scroll({
                left: 2*/*((*/products_width/* / 4 * 3) + 120)*/,
                behavior: 'smooth'
            })
            products_current_zone = 2
        } else {
            for (prod of products){
                prod.classList.add('shake');
            }
            setTimeout(() =>{
                for (prod of products){
                    prod.classList.remove('shake')
                }
            }, 250)
        }
    } else {
        for (prod of products){
            prod.classList.add('shake');
        }
        setTimeout(() =>{
            for (prod of products){
                prod.classList.remove('shake')
            }
        }, 250)
    }
}

function open_item(){
    /* */
}

function buy_item(){
    /* */
}