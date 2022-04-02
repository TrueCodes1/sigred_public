
let adminOption1 = $('#admin-option-1');
let adminOption2 = $('#admin-option-2');
let adminOption3 = $('#admin-option-3');

let options = [adminOption1, adminOption2, adminOption3];

let smallScrollbar = $('#small-scrollbar');

let currentPart = 'users';

let usersForSearchengine;
let productsForSearchengine;
let adminsForSearchengine;
const usersList = $('#users-list');
let usersListHtml = '';
let usersTopHtml = '';
const productsList = $('#users-list');
let productsListHtml = '';
let productsTopHtml = '';
const adminsList = $('#users-list');
let adminsListHtml = '';
let adminsTopHtml = '';

const searchbar = $('#searchbar');
const searchResults = $('#search-results');

const switchTo = (where) => {
    switch (where) {
        case 'users':
            currentPart = 'users';
            $('#users-list').html(usersListHtml);
            $('#top-review').html(usersTopHtml);
            $(searchbar).attr('placeholder', 'Search user...');
            break
        case 'products':
            currentPart = 'products';
            $('#top-review').html(productsTopHtml);
            $('#users-list').html(productsListHtml);
            $(searchbar).attr('placeholder', 'Search product...');
            break
        case 'admins':
            currentPart = 'admins';
            $('#top-review').html(adminsTopHtml);
            $('#users-list').html(adminsListHtml);
            $(searchbar).attr('placeholder', 'Search admin...');
            break
    }
    $(searchbar).attr('value', '')
}

const moveSmallScrollbar = (e) => {
    let id = $(e.target).attr('id');
    let sign = '';
    switch (id) {
        case 'admin-option-1':
            sign = '-';
            if (currentPart != 'users') {
                switchTo('users')
            }
            break
        case 'admin-option-2':
            sign = '';
            if (currentPart != 'products') {
                switchTo('products')
            }
            break
        case 'admin-option-3':
            sign = '+';
            if (currentPart != 'admins') {
                switchTo('admins')
            }
            break
    }
    if (sign != '') {
        smallScrollbar.css('transform',`translateX( calc( (${sign}50vw / 4) ${sign} ( (0.25 * 50vw) / 4) ))`);
    } else {
        smallScrollbar.css('transform',`translateX(0)`);
    }
    smallScrollbar.css('transition', 'all .1s linear');
        
    for (let option of options) {
        $(option).removeClass('used')
        $(option).removeClass('unused')
        $(option).addClass('unused')
    }

    $(`#${id}`).addClass('used')

}

for (let option of options) {
    option.on('click', moveSmallScrollbar);
}


// THESE 2 COMMENTS BELOW FOR SECTION USERS
//making post request to get users for search engine

const fetchData = () => $.post('/admin-dashboard/data-for-admin-search-engine', (data) => {
    usersForSearchengine = data.users;
    productsForSearchengine = data.products;

    //updating users part
    let newHtml = '';
    let num = 1;

    for (let user of usersForSearchengine) {
        newHtml+=`
                    
            <ul class="list-user" id="list-user-${num}" onclick='openUser(this.id)'>
                <li class="user-name">
                    ${user.userName}
                </li>
                <li class="user-status disabled-${user.userWarned}">
                    ${user.userWarned} time${Number(user.userWarned) == 1 ? '' : 's'} disabled
                </li>
                <li class="user-date">
                    -
                </li>
            </ul>

        `
        num+=1
    }

    usersList.html(newHtml)
    usersListHtml = newHtml;
    usersTopHtml = `users in total &nbsp;<span id="users-number"> ${usersForSearchengine.length}</span>`;

    $('#users-number').html(` ${usersForSearchengine.length}`)

    //updating products part
    newHtml = '';
    num = 1;

    for (let product of productsForSearchengine) {
        newHtml+=`
                    
            <ul class="list-user" id="list-product-${num}" onclick='openItem(this.id)'>
                <li class="user-name">
                    ${product.item_name}
                </li>
                <li class="user-status">
                    -
                </li>
                <li class="user-date">
                    -
                </li>
            </ul>

        `
        num+=1
    };

    productsListHtml = newHtml;
    productsTopHtml = `products in total &nbsp;<span id="users-number"> ${productsForSearchengine.length}</span>`;

    $('#products-number').html(` ${productsForSearchengine.length}`)

    adminsListHtml = `
        <ul class="list-user" id="list-admin-1">
            <li class="user-name">
                main admin
            </li>
            <li class="user-status">
                all abilities
            </li>
            <li class="user-date">
                ever since
            </li>
        </ul>
    `
    adminsTopHtml = `admins in total &nbsp;<span id="users-number"> 1</span>
                    <div class="add-admin" onclick='addAdmin()' style='cursor: pointer'>+ add admin</div>`
        
    switchTo('users');

})

fetchData()

//grabbing searchbar and giving it search functionality

const updateOrder = (who, list) => {
    let newHtml = '';
    let num = 1;
    if (who == 'users') {

        let clonedUsers = [];
        for (let userToClone of usersForSearchengine) {
            clonedUsers.push(userToClone)
        }
        for (let user of list) {
            console.log(user)
            newHtml+=`
                        
            <ul class="list-user" id="list-user-${num}" onclick='openUser(this.id)'>
                <li class="user-name">
                    ${user.item.userName}
                </li>
                <li class="user-status disabled-${user.item.userWarned}">
                    ${user.item.userWarned} time${Number(user.item.userWarned) == 1 ? '' : 's'} disabled
                </li>
                <li class="user-date">
                    -
                </li>
            </ul>
    
            `
            num+=1
    
            for (let result of clonedUsers) {
                if (result.userName == user.item.userName) {
                    clonedUsers.splice(clonedUsers.indexOf(result), 1)
                }
            }
        }
    
        for (let resultRest of clonedUsers) {
    
            newHtml+=`
                        
            <ul class="list-user" id="list-user-${num}" onclick='openUser(this.id)'>
                <li class="user-name">
                    ${resultRest.userName}
                </li>
                <li class="user-status disabled-${resultRest.userWarned}">
                    ${resultRest.userWarned} time${Number(resultRest.userWarned) == 1 ? '' : 's'} disabled
                </li>
                <li class="user-date">
                    -
                </li>
            </ul>
    
            `
            num+=1
        }
    
        usersList.html(newHtml)

    } else if (who == 'products') {

        let clonedProducts = [];
        for (let productToClone of productsForSearchengine) {
            clonedProducts.push(productToClone)
        }
        for (let product of list) {
            newHtml+=`
                        
            <ul class="list-user" id="list-product-${num}" onclick='openItem(this.id)'>
                <li class="user-name">
                    ${product.item.item_name}
                </li>
                <li class="user-status">
                    -
                </li>
                <li class="user-date">
                    -
                </li>
            </ul>
    
            `
            num+=1
    
            for (let result of clonedProducts) {
                if (result.item_name == product.item.item_name) {
                    clonedProducts.splice(clonedProducts.indexOf(result), 1)
                }
            }
        }
    
        for (let resultRest of clonedProducts) {
    
            newHtml+=`
                        
            <ul class="list-user" id="list-product-${num}" onclick='openItem(this.id)'>
                <li class="user-name">
                    ${resultRest.item_name}
                </li>
                <li class="user-status">
                    -
                </li>
                <li class="user-date">
                    -
                </li>
            </ul>
    
            `
            num+=1
        }

        productsList.html(newHtml)
    }

}

const searchFor = () => {

    if (currentPart != 'admins') {

        let val = searchbar.val().replaceAll(' ', '');
        let foundUsers = [];
    
        let options = {
            keys: []
        }
        
        let fuse;
    
        if (currentPart == 'users') {
            options.keys = ['userName'];
            fuse = new Fuse(usersForSearchengine, options)
        } else if (currentPart == 'products') {
            options.keys = ['item_name'];
            fuse = new Fuse(productsForSearchengine, options)
        }
    
        found = fuse.search(val);
            
        searchResults.html('');
        let newHtml = '';
        let optNum = 1;
        for (let result of found) {
            newHtml+=`<option value="${result.item.userName || result.item.item_name}" class="search-result ${optNum}">${result.item.userName || result.item.item_name}</option>`
            optNum+=1
        }
        
        updateOrder(currentPart, found)

    }
}

$(searchbar).focusin(() => {searchResults.css('display', 'flex'); searchFor})
$(searchbar).focusout(() => {searchResults.css('display', 'none')})
searchbar.on('input', searchFor);


//THESE 2 COMENTS BELOW FOR SECTION PRODUCTS
//making post request to get users for search engine
/*

let productsForSearchengine;
const productsList = $('#products-list');

const fetchProducts = () => $.post('/products-for-admin-search-engine', (data) => {
    productsForSearchengine = data;

    let newHtml = '';
    let num = 1;

    for (let product of productsForSearchengine) {
        newHtml+=`
                    
            <ul class="list-product" id="list-product-${num}">
                <li class="product-name">
                    ${product.name}
                </li>
                <li class="product-status">
                    -
                </li>
                <li class="product-date">
                    -
                </li>
            </ul>

        `
        num+=1
    }

    productsList.html(newHtml)

    $('#products-number').html(` ${productsForSearchengine.length}`)

})

fetchProducts()

//grabbing searchbar and giving it search functionality

const searchbarProducts = $('#searchbar-products');
const searchResultsProducts = $('#search-results-products');

const updateOrderOfProducts = (foundProducts) => {
    let newHtml = '';
    let num = 1;
    let clonedProducts = [];
    for (let productToClone of productsForSearchengine) {
        clonedProducts.push(productToClone)
    }
    for (let product of foundProducts) {
        newHtml+=`
                    
        <ul class="list-product" id="list-product-${num}">
            <li class="product-name">
                ${product.item.name}
            </li>
            <li class="product-status">
                -
            </li>
            <li class="product-date">
                -
            </li>
        </ul>

        `
        num+=1

        for (let result of clonedProducts) {
            if (result.name == user.item.name) {
                clonedProducts.splice(clonedProducts.indexOf(result), 1)
            }
        }
    }

    for (let resultRest of clonedProducts) {

        newHtml+=`
                    
        <ul class="list-product" id="list-product-${num}">
            <li class="product-name">
                ${resultRest.name}
            </li>
            <li class="product-status">
                -
            </li>
            <li class="product-date">
                -
            </li>
        </ul>

        `
        num+=1
    }

    productsList.html(newHtml)

}

const searchForProduct = () => {
    let val = searchbar.val().replaceAll(' ', '');
    let foundProducts = [];

    let options = {
        keys: ['name']
    }
    let fuse = new Fuse(productsForSearchengine, options);
    foundProducts = fuse.search(val)
    
    searchResultsProducts.html('');
    let newHtml = '';
    let optNum = 1;
    for (let result of foundProducts) {
        newHtml+=`<option value="${result.item.name}" class="search-result ${optNum}">${result.item.name}</option>`
        optNum+=1
    }
    searchResultsProducts.html(newHtml);
    searchResultsProducts.css('display', 'flex');

    updateOrderOfProducts(foundProducts)
}

$(searchbarProducts).focusin(() => {searchResultsProducts.css('display', 'flex'); searchForProduct})
$(searchbarProducts).focusout(() => {searchResultsProducts.css('display', 'none')})
searchbarProducts.on('input', searchForProduct);*/

const openUser = (id) => {
    let userName = document.getElementById(id).querySelector('.user-name').innerText;
    for (let user of usersForSearchengine) {
        if (user.userName == userName) {
            let link = `<a style='visibility: hidden' noopener norefferer id='link-to-click' href='./admin-dashboard/user/${user.userID}'></a>`;
            $('#space-for-link').html(link);
            document.getElementById('link-to-click').click()
        }
    }
}

const openItem = (id) => {
    let itemName = document.getElementById(id).querySelector('.user-name').innerText;
    for (let item of productsForSearchengine) {
        if (item.item_name == itemName) {
            let link = `<a style='visibility: hidden' noopener norefferer id='link-to-click' href='/admin-dashboard/item/${item.item_name.replaceAll(' ', '')}'></a>`;
            $('#space-for-link').html(link);
            document.getElementById('link-to-click').click()
        }
    }
}