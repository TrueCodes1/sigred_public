
var file_input = document.getElementById('file-input');
var file;
var file_name ;
var item_name = document.getElementById('name-input');
var name_counter = document.getElementById('name-counter');
var name_counter_span = document.getElementById('name-counter-span');
var item_desc = document.getElementById('item-desc');
var item_counter = document.getElementById('desc-counter');
var item_counter_span = document.getElementById('item-counter-span');
var item_price = document.getElementById('price-input');
var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789+-*/,.-§ôúäň´=éíáýžťčšľ+;°\|€}{@&#"!)(/)_:?';
var numbers = '0123456789.';
var numbers_only = '123456789'; /*no zero because these can be at the beginning*/
var numbers_with_zero = '0123456789'

file_input.addEventListener('change', () => {
    file = file_input.files;
    file_name = file[0].name;
    file_name = file_name.toString().replaceAll('%00', '');
    var index = Number(file_name.toString().lastIndexOf('.'));
    var format = '';
    for (i = index; i<file_name.length; i++){
        format+=file_name[i].toString()
    }
    if (format == '.mp4' || format == '.mov' || format == '.MOV'){
        
        var URL = window.URL || window.webkitURL;
        var video = file_input.files[0];

        console.log(video)

        var videoURL = URL.createObjectURL(video);

        if (screen.width<500){
            var parent_div = document.getElementById('content-video-mobile');
            var recap_parent_div = document.getElementById('recap-video');
        } else {
            var parent_div = document.getElementById('phone-mid');
            var recap_parent_div = document.getElementById('phone-mid-recap')
        }
        parent_div.innerHTML = '';
        recap_parent_div.innerHTML = '';
        var video_div = document.createElement('div');
        video_div.classList.add('video');
        var recap_video_div = document.createElement('div');
        recap_video_div.classList.add('video');
        if (screen.width<500){
            video_div.classList.add('mobile');
            video_div.id = 'video-mobile-div';
            recap_video_div.classList.add('mobile');
            recap_video_div.id = 'video-mobile-div-recap';
        }

        var video_video = document.createElement('video');
        video_video.setAttribute('loop', '');
        video_video.setAttribute('autoplay','');
        video_video.muted = 'muted';
        video_video.setAttribute('frameborder', '0');
        video_video.setAttribute('id', 'video');
        video_video.setAttribute('src', videoURL);

        var recap_video_video = document.createElement('video');
        recap_video_video.setAttribute('loop', '');
        recap_video_video.setAttribute('autoplay','');
        recap_video_video.muted = 'muted';
        recap_video_video.setAttribute('frameborder', '0');
        recap_video_video.setAttribute('id', 'video-recap');
        recap_video_video.setAttribute('src', videoURL);

        video_video.addEventListener('loadedmetadata', () => {
            var video_height = video_video.videoHeight;
            var video_width = video_video.videoWidth;

            if (video_width<=video_height){
                video_div.appendChild(video_video);
                parent_div.appendChild(video_div);
                recap_video_div.appendChild(recap_video_video);
                recap_parent_div.appendChild(recap_video_div);
                document.getElementById('chosen-files').innerHTML = file_name;
                if (screen.width<500){
                    let vh = window.innerHeight;
                    document.getElementById('video-mobile-div').style.minHeight = (vh).toString()+'px';
                    document.getElementById('video-mobile-div').style.maxHeight = (vh).toString()+'px';
                    document.getElementById('video-mobile-div-recap').style.minHeight = (vh).toString()+'px';
                    document.getElementById('video-mobile-div-recap').style.maxHeight = (vh).toString()+'px';
                    document.getElementById('video').style.minHeight = (vh).toString()+'px';
                    document.getElementById('video').style.maxHeight = (vh).toString()+'px';
                    document.getElementById('video-recap').style.minHeight = (vh).toString()+'px';
                    document.getElementById('video-recap').style.maxHeight = (vh).toString()+'px';
                }
            } else {
                alert('Bro, please upload video recorded by height of your phone.')
            }
        })

/*
        recap_video_video.addEventListener('loadedmetadata', () => {
            var recap_video_height = recap_video_video.videoHeight;
            var recap_video_width = recap_video_video.videoWidth;

            if (recap_video_width<=recap_video_height){
                recap_video_div.appendChild(recap_video_video);
                recap_parent_div.appendChild(recap_video_div);
            } else {
                alert('Bro, please upload video recorded by height of your phone.')
            }
        })*/

    } else {
        alert('Buddy, we need a video file. not '+ format.toString() + ' one. :-)')
        /* CREATE CUSTOM ALERT */
    }
})

item_name.addEventListener('input', () => {
    document.getElementById('name-input').style.borderBottom = '2px solid #0a5a558e';
    if (document.getElementById('name-input').value != ''){
        var value = item_name.value.toString();
        value = value.replace('<', '');
        value = value.replace('>', '');
        value = value.replace('&#60;', '');
        value = value.replace('&#62;', '');
        value = value.replace('script', '');
        value = value.replace('scripT', '');
        value = value.replace('scriPT', '');
        value = value.replace('scrIPT', '');
        value = value.replace('scRIPT', '');
        value = value.replace('sCRIPT', '');
        value = value.replace('SCRIPT', '');
        value = value.replace('scriPt', '');
        value = value.replace('scrIPt', '');
        value = value.replace('scRIPt', '');
        value = value.replace('sCRIPt', '');
        value = value.replace('SCRIPt', '');
        value = value.replace('scrIpt', '');
        value = value.replace('scRIpt', '');
        value = value.replace('sCRIpt', '');
        value = value.replace('SCRIpt', '');
        value = value.replace('scRipt', '');
        value = value.replace('sCRipt', '');
        value = value.replace('SCRipt', '');
        value = value.replace('sCript', '');
        value = value.replace('SCript', '');
        value = value.replace('Script', '');
        value = value.replace('SCRIPT', '');
        value = value.replace('ScRiPt', '');
        value = value.replace('sCrIpT', '');
        value = value.replace('SCriPT', '');
        value = value.replace('ScripT', '');
        value = value.replace('html', '');

        let length = 0;

        var alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789+-*/,.-§ôúäň´=éíáýžťčšľ+;°\|€}{@&#"!)(/)_:?';
        for (char of value.toString()){
            if (alphabet.includes(char)){
                length+=1;
            }
        }
        if (length < 41){
            name_counter_span.innerHTML = length.toString();
            name_counter_span.classList = 'counter-span';
            name_counter.classList = 'name-counter'
        } else {
            name_counter_span.innerHTML = length.toString();
            name_counter_span.classList = 'counter-span counter-span-limit';
            name_counter.classList = 'name-counter counter-limit'
        }

        item_name.value = value;
        document.getElementById('recap-name').innerHTML = value;
    } else {
        name_counter_span.innerHTML = '0';
        name_counter_span.classList = 'counter-span';
        name_counter.classList = 'name-counter';
        document.getElementById('recap-name').innerHTML = '';
    }
})

item_desc.addEventListener('input', () => {
    document.getElementById('item-desc').style.borderBottom = '2px solid #0a5a558e';
    if (item_desc.value != ''){
        let value = item_desc.value.toString();
        value = value.replace('<', '');
        value = value.replace('>', '');
        value = value.replace('&#60;', '');
        value = value.replace('&#62;', '');
        value = value.replace('script', '');
        value = value.replace('scripT', '');
        value = value.replace('scriPT', '');
        value = value.replace('scrIPT', '');
        value = value.replace('scRIPT', '');
        value = value.replace('sCRIPT', '');
        value = value.replace('SCRIPT', '');
        value = value.replace('scriPt', '');
        value = value.replace('scrIPt', '');
        value = value.replace('scRIPt', '');
        value = value.replace('sCRIPt', '');
        value = value.replace('SCRIPt', '');
        value = value.replace('scrIpt', '');
        value = value.replace('scRIpt', '');
        value = value.replace('sCRIpt', '');
        value = value.replace('SCRIpt', '');
        value = value.replace('scRipt', '');
        value = value.replace('sCRipt', '');
        value = value.replace('SCRipt', '');
        value = value.replace('sCript', '');
        value = value.replace('SCript', '');
        value = value.replace('Script', '');
        value = value.replace('SCRIPT', '');
        value = value.replace('ScRiPt', '');
        value = value.replace('sCrIpT', '');
        value = value.replace('SCriPT', '');
        value = value.replace('ScripT', '');
        value = value.replace('html', '');
        
        let length = 0;

        var alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789+-*/,.-§ôúäň´=éíáýžťčšľ+;°\|€}{@&#"!)(/)_:?';
        for (char of value.toString()){
            if (alphabet.includes(char)){
                length+=1;
            }
        }
        if (length <= 150){
            item_counter_span.innerHTML = length.toString();
            item_counter_span.classList = 'counter-span';
            item_counter.classList = 'desc-counter'
        } else {
            item_counter_span.innerHTML = length.toString();
            item_counter_span.classList = 'counter-span counter-span-limit';
            item_counter.classList = 'desc-counter counter-limit'
        }

        item_desc.value = value;
        document.getElementById('recap-desc').innerHTML = value;
    } else {
        item_counter_span.innerHTML = '0';
        item_counter_span.classList = 'counter-span';
        item_counter.classList = 'desc-counter';
        document.getElementById('recap-desc').innerHTML = '';
    }
})

item_price.addEventListener('input', () => {
    document.getElementById('price-input').style.borderBottom = '2px solid #0a5a55';
    document.getElementById('price-input').style.transition = '.25s ease';
    var price_value = document.getElementById('price-input');
    var price_value_correct = price_value.value.replaceAll(',', '.')
    var checked_price_value = '';
    for (char of price_value_correct){
        if (numbers.includes(char)){
            checked_price_value+=char.toString();
        }
    }
    while (!numbers_only.includes(checked_price_value[0]) && checked_price_value.length > 0){
        checked_price_value = checked_price_value.substring(1)
    }
    price_value.value = checked_price_value.toString();
    document.getElementById('recap-price').innerHTML = checked_price_value.toString() + '<img src="sigecoin_icon_currency.svg" alt="">'
})
var processing = document.getElementById('processing')
var form = document.getElementById('video-desc');

/*****
 THIS WHOLE WAS PUT TO FILE INPUT EVENT LISTENER ABOVE
 */

/*
form.addEventListener('click', () => {
/*
    var indexedDB = window.indexedDB;
    var IDBTransaction = window.IDBTransaction;
    var dbVersion = 1.0;

    //Create / open database
    var request = indexedDB.open("elephantFiles", dbVersion),
        db,
        createObjectStore = function (dataBase) {
            // Create an objectStore
            console.log("Creating objectStore")
            dataBase.createObjectStore("elephants");
        },

        getImageFile = function () {
            // Create XHR
            var xhr = new XMLHttpRequest(),
                blob;

            xhr.open("GET", "burger.svg", true);
            // Set the responseType to blob
            xhr.responseType = "blob";

            xhr.addEventListener("load", function () {
                if (xhr.status === 200) {
                    console.log("Image retrieved");
                    
                    // Blob as response
                    blob = xhr.response;
                    console.log("Blob:" + blob);

                    // Put the received blob into IndexedDB
                    putElephantInDb(blob);
                }
            }, false);
            // Send XHR
            xhr.send();
        },

        putElephantInDb = function (blob) {
            console.log("Putting elephants in IndexedDB");

            // Open a transaction to the database
            var transaction = db.transaction(["elephants"], 'readwrite');

            // Put the blob into the dabase
            var put = transaction.objectStore("elephants").put(blob, "image");

            // Retrieve the file that was just stored
            transaction.objectStore("elephants").get("image").onsuccess = function (event) {
                var imgFile = event.target.result;
                console.log("Got elephant!" + imgFile);

                // Get window.URL object
                var URL = window.URL || window.webkitURL;

                // Create and revoke ObjectURL
                var imgURL = URL.createObjectURL(imgFile);

                // Set img src to ObjectURL
                /*var imgElephant = document.getElementById("elephant");
                imgElephant.setAttribute("src", imgURL);*//*

                console.log(imgURL)

                var url = imgURL.toString().replace('blob:http://localhost:3000/', '')
                console.log(url)

                document.getElementById('img').setAttribute('src', url.toString())
                // Revoking ObjectURL
                URL.revokeObjectURL(imgURL);

            };
        };

    request.onerror = function (event) {
        console.log("Error creating/accessing IndexedDB database");
    };

    request.onsuccess = function (event) {
        console.log("Success creating/accessing IndexedDB database");
        db = request.result;

        db.onerror = function (event) {
            console.log("Error creating/accessing IndexedDB database");
        };
        
        // Interim solution for Google Chrome to create an objectStore. Will be deprecated
        if (db.setVersion) {
            if (db.version != dbVersion) {
                var setVersion = db.setVersion(dbVersion);
                setVersion.onsuccess = function () {
                    createObjectStore(db);
                    getImageFile();
                };
            }
            else {
                getImageFile();
            }
        }
        else {
            getImageFile();
        }
    }
    
    // For future use. Currently only in latest Firefox versions
    request.onupgradeneeded = function (event) {
        createObjectStore(event.target.result);
    };*/
/*
    var openRequest = indexedDB.open('videos', 1)

    /*
    openRequest.onupgradeneeded = () => {
        let db = openRequest.result;
        switch(event.oldVersion){
            case 0:

            case 1:

        }
    }
    *//*
    var URL = window.URL || window.webkitURL;
    var video = file_input.files[0];

    var videoURL = URL.createObjectURL(video);

    var parent_div = document.getElementById('phone-mid');
    var video_div = document.createElement('div');
    video_div.classList.add('video');
    var video_video = document.createElement('video');
    video_video.setAttribute('loop', '');
    video_video.setAttribute('autoplay','');
    video_video.muted = 'muted';
    video_video.setAttribute('frameborder', '0');
    video_video.setAttribute('id', 'video');
    video_video.setAttribute('src', videoURL);

    video_div.appendChild(video_video);
    parent_div.appendChild(video_div)

    
})*/

/*
form.addEventListener('click', () => {


    const firebaseConfig = {
        apiKey: "AIzaSyA310s9PGp_dNRKcJ2yoJjTP1MFm21e9SI",
        authDomain: "sigred-try.firebaseapp.com",
        databaseURL: "https://sigred-try-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "sigred-try",
        storageBucket: "sigred-try.appspot.com",
        messagingSenderId: "613246557709",
        appId: "1:613246557709:web:138dde4734007b206e3f44",
        measurementId: "G-0QNPL8X3W4"
        };
    
        
    firebase.initializeApp(firebaseConfig);
    var ref = firebase.storage().ref('/items_videos/temp_videos');
    file = file_input.files[0];
    processing.innerHTML = 'just a sec...'
    processing.style.display = 'flex';
    processing.classList.add('appear');
    setTimeout(() => {
        processing.style.display = 'flex';
        processing.classList.remove('appear');
    }, 200)
    var date_input;
    var unique_date = new Date().getTime().toString();
    var no_spaces_date = '';
    for (char of unique_date){
        if (char != ' '){
            no_spaces_date+=char;
        } else {
            no_spaces_date+='_'
        }
    }
    date_input = document.getElementById('unique_date');
    date_input.value = no_spaces_date;
    ref.child(no_spaces_date).put(file)/*
    .then(
        () => {
            date_input = document.getElementById('unique_date');
            date_input.value = no_spaces_date;
            console.log(document.getElementById('video-form'))/*
            document.getElementById('video-form').submit();/*
            processing.style.display = 'flex';
            processing.classList.add('appear');
            setTimeout(() => {
                processing.style.display = 'flex';
                processing.classList.remove('appear');
            }, 200)*//*
            setTimeout(() => {
                let link = document.createElement('a');
                link.setAttribute('href', '/video-checked')
                link.click()
            }, 750)*//*
        }
    )*//*
    .then(() => {
        document.getElementById('video-form').submit();/*
        processing.style.display = 'flex';
        processing.classList.add('appear');
        setTimeout(() => {
            processing.style.display = 'flex';
            processing.classList.remove('appear');
        }, 200)*//*
        setTimeout(() => {/*
            let link = document.createElement('a');
            link.setAttribute('href', '/video-checked');
            link.click()*//*
        }, 750)*//*
    })
    .then(() => {
        setTimeout(() => {
            let link = document.createElement('a');
            link.setAttribute('href', '/video-checked');
            link.click()
        }, 750)
    })

    
})*/


var name_inp;
function check_go(){
    name_inp = document.getElementById('name-input');
    var current_length = 0;
    var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789+-*/,.-§ôúäň´=éíáýžťčšľ+;°\|€}{@&#"!)(/)_:?';
    for (char of name_inp.value){
        if (characters.includes(char)){
            current_length+=1
        }
    }
    if (name_inp.value != '' && current_length<41){ 
        if (screen.width<500){/*
            let height = document.getElementById('intro').clientHeight;
            let part_height = document.getElementById('part').clientHeight;
            document.body.scrollTo({
            top: (height*0.87+240+part_height*2),
            behavior: 'smooth'
        })*/
        
            let vh = window.innerHeight;
            document.body.scrollTo({
                top: (3 * vh + 240),
                behavior: 'smooth'
            })
        }else{
            window.scroll({
            top: window.innerHeight*3+240,
            behavior: 'smooth'
        })}
    } else {
        name_inp.focus()
        name_inp.style.borderBottom = '2px solid red';
    }
}

function check_go_desc(){
    desc_inp = document.getElementById('item-desc');
    var current_length = 0;
    var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789+-*/,.-§ôúäň´=éíáýžťčšľ+;°\|€}{@&#"!)(/)_:?';
    for (char of item_desc.value){
        if (characters.includes(char)){
            current_length+=1
        }
    }
    if (desc_inp.value != '' && current_length<151){ 
        if (screen.width<500){/*
            let height = document.getElementById('intro').clientHeight;
            let part_height = document.getElementById('part').clientHeight;
            document.body.scrollTo({
            top: (height*0.87+240+part_height*3),
            behavior: 'smooth'
        })*/
        
            let vh = window.innerHeight;
            document.body.scrollTo({
                top: (4 * vh + 240),
                behavior: 'smooth'
            })
        }else{
            window.scroll({
            top: window.innerHeight*4+240,
            behavior: 'smooth'
        })}
    } else {
        desc_inp.focus()
        desc_inp.style.borderBottom = '2px solid red';
    }
}

var recap_name = document.getElementById('recap-name');
var recap_desc = document.getElementById('recap-desc');
var recap_price = document.getElementById('recap-price');
var name_real;
var desc;
var price;

function recap() {

    name_real = document.getElementById('name-input');
    desc = document.getElementById('item-desc');
    price = document.getElementById('price-input');

    recap_name.innerHTML = name_real.value;
    recap_desc.innerHTML = desc.value;
    recap_price.innerHTML = price.value + '<img src="sigecoin_icon_currency.svg" alt="">';

    if (price.value == ''){
        document.getElementById('price-input').style.borderBottom = '2px solid red';
        document.getElementById('price-input').style.transition = '.25s ease';
    } else {
        if (screen.width<500){/*
            let height = document.getElementById('intro').clientHeight;
            let part_height = document.getElementById('part').clientHeight;
            document.body.scrollTo({
                top: (height*0.87+240+part_height*8),
                behavior: 'smooth'
        })*/
        
            let vh = window.innerHeight;
            document.body.scrollTo({
                top: (6 * vh + 240),
                behavior: 'smooth'
            })
        }else{
            window.scroll({
            top: window.innerHeight*6+240,
            behavior: 'smooth'
        })}
    }
}

function check_all(){
    var video = document.getElementById('file-input').value;
    var name = document.getElementById('name-input').value;
    var desc = document.getElementById('item-desc').value;
    var location = document.getElementById('position-input').value;
    var price = document.getElementById('price-input').value;


    if (video.value != undefined && video.value != null && video.value != ''){
        var name_value = name_inp.value;
        var name_length = 0;
        for (char of name_value){
            if (characters.includes(char)){
                name_length+=1
            }
        }
        if (name.value != undefined && name.value != null && name.value != '' && name_length<41){
            if (desc.value != undefined && desc.value != null && desc.value != ''){
                if (location.value != undefined && location.value != null && location.value != ''){
                    if (price.value != undefined && price.value != null && price.value != ''){
                        let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
                        for (char in price.toString()){
                            if (numbers.includes(char) == false){
                                price.replace(char, '')
                            }
                        }
                        var makesure = document.getElementById('makesure');
                        makesure.style.display = 'flex';
                        makesure.classList.add('makesure-appear');
                        makesure.addEventListener('animationend', ()=> {
                            makesure.classList.remove('makesure-appear');
                            makesure.style.opacity = '1';
                            makesure.style.visibility = '1';
                            makesure.style.display = 'flex'
                        })
                    } else {
                        if (screen.width<500){
                            let height = document.getElementById('intro').clientHeight;
                            let part_height = document.getElementById('part').clientHeight;
                            document.body.scrollTo({
                                top: (height*0.98863+240+part_height*4),
                                behavior: 'smooth'
                            })
                        } else {
                            window.scroll({
                                top: window.innerHeight*5+240,
                                behavior: 'smooth'
                            })
                        }
                    }
                } else {
                    if (screen.width<500){
                        let height = document.getElementById('intro').clientHeight;
                        let part_height = document.getElementById('part').clientHeight;
                        document.body.scrollTo({
                            top: (height*0.98863+240+part_height*3),
                            behavior: 'smooth'
                    })
                    } else {
                        window.scroll({
                            top: window.innerHeight*4+240,
                            behavior: 'smooth'
                        })
                    }
                }
            } else {
                if (screen.width<500){
                    let height = document.getElementById('intro').clientHeight;
                    let part_height = document.getElementById('part').clientHeight;
                    document.body.scrollTo({
                        top: (height*0.98863+240+part_height*2),
                        behavior: 'smooth'
                    })
                } else {
                    window.scroll({
                        top: window.innerHeight*3+240,
                        behavior: 'smooth'
                    })
                }
            }
        } else {
            if (screen.width<500){
                let height = document.getElementById('intro').clientHeight;
                let part_height = document.getElementById('part').clientHeight;
                document.body.scrollTo({
                    top: (height*0.98863+240+part_height),
                    behavior: 'smooth'
            })
            } else {
                window.scroll({
                    top: window.innerHeight*2+240,
                    behavior: 'smooth'
                })
            }
        }
    } else {
        if (screen.width<500){
            let vh = window.innerHeight;
            document.body.scrollTo({
                top: (1.01 * vh + 240),
                behavior: 'smooth'
            })
        } else {
            window.scroll({
                top: window.innerHeight+240,
                behavior: 'smooth'
            })
        }
    }
}

function finish(){
    var video_input = document.getElementById('file-input').value;
    var name = document.getElementById('name-input').value;
    var desc = document.getElementById('item-desc').value;
    var location = document.getElementById('position-input').value;
    var price = document.getElementById('price-input').value;

    
    var video = document.getElementById('video');

    if (video && video.src){
        var name_value = name;
        var name_length = 0;
        for (char of name_value){
            if (characters.includes(char)){
                name_length+=1
            }
        }
        if (name != undefined && name != null && name != '' && name_length<41){
            var desc_value = desc;
            var desc_length = 0;
            for (char of desc_value){
                if (characters.includes(char)){
                    desc_length+=1
                }
            }
            if (desc != undefined && desc != null && desc != '' && desc_length<151){
                if (location != undefined && location != null && location != ''){
                    if (price != undefined && price != null && price != ''){
                        let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
                        for (char in price.toString()){
                            if (numbers.includes(char) == false){
                                price.replace(char, '')
                            }
                        }

                        var makesure = document.getElementById('makesure');
                        makesure.style.display = 'flex';
                        makesure.classList.add('makesure-appear');
                        makesure.addEventListener('animationend', ()=> {
                            makesure.classList.remove('makesure-appear');
                            makesure.style.opacity = '1';
                            makesure.style.visibility = '1';
                            makesure.style.display = 'flex'
                        })

                        document.addEventListener('scroll', close_makesure)
                        document.body.addEventListener('scroll', close_makesure)

                        var file = file_input.files[0]
                        console.log('FILE')
                        console.log(file)
                        console.log('FILE')
                        console.log(video_input)         

                        document.getElementById('makesure-submit').addEventListener('click', finish_send)

                    } else {
                        if (screen.width<500){
                            let vh = window.innerHeight;
                            document.body.scrollTo({
                                top: (5 * vh + 240),
                                behavior: 'smooth'
                            })
                        } else {
                            window.scroll({
                                top: window.innerHeight*5+240,
                                behavior: 'smooth'
                            })
                        }
                    }
                } else {
                    if (screen.width<500){
                        let vh = window.innerHeight;
                        document.body.scrollTo({
                            top: (4 * vh + 240),
                            behavior: 'smooth'
                        })
                    } else {
                        window.scroll({
                            top: window.innerHeight*4+240,
                            behavior: 'smooth'
                        })
                    }
                }
            } else {
                if (screen.width<500){
                    let vh = window.innerHeight;
                    document.body.scrollTo({
                        top: (3 * vh + 240),
                        behavior: 'smooth'
                    })
                } else {
                    window.scroll({
                        top: window.innerHeight*3+240,
                        behavior: 'smooth'
                    })
                }
            }
        } else {
            if (screen.width<500){
                let vh = window.innerHeight;
                document.body.scrollTo({
                    top: (2 * vh + 240),
                    behavior: 'smooth'
                })
            } else {
                window.scroll({
                    top: window.innerHeight*2+240,
                    behavior: 'smooth'
                })
            }
        }
    } else {
        if (screen.width<500){
            let vh = window.innerHeight;
            document.body.scrollTo({
                top: (1 * vh + 240),
                behavior: 'smooth'
            })
        } else {
            window.scroll({
                top: window.innerHeight+240,
                behavior: 'smooth'
            })
        }
    }
}

function finish_send(){
    var video_input = document.getElementById('file-input').files;
    var name = document.getElementById('name-input').value;
    var desc = document.getElementById('item-desc').value;
    var location = document.getElementById('position-input').value;
    var price = document.getElementById('price-input').value;

    
    var video = document.getElementById('video');

    if (video && video.src){
        var name_value = name;
        var name_length = 0;
        for (char of name_value){
            if (characters.includes(char)){
                name_length+=1
            }
        }
        if (name != undefined && name != null && name != '' && name_length<41){
            var desc_value = desc;
            var desc_length = 0;
            for (char of desc_value){
                if (characters.includes(char)){
                    desc_length+=1
                }
            }
            if (desc != undefined && desc != null && desc != '' && desc_length<151){
                if (location != undefined && location != null && location != ''){
                    if (price != undefined && price != null && price != ''){
                        let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
                        for (char in price.toString()){
                            if (numbers.includes(char) == false){
                                price.replace(char, '')
                            }
                        }

                        close_makesure()
                        
                        const firebaseConfig = {
                            apiKey: "AIzaSyA310s9PGp_dNRKcJ2yoJjTP1MFm21e9SI",
                            authDomain: "sigred-try.firebaseapp.com",
                            databaseURL: "https://sigred-try-default-rtdb.europe-west1.firebasedatabase.app",
                            projectId: "sigred-try",
                            storageBucket: "sigred-try.appspot.com",
                            messagingSenderId: "613246557709",
                            appId: "1:613246557709:web:138dde4734007b206e3f44",
                            measurementId: "G-0QNPL8X3W4"
                            };
                        
                            
                        firebase.initializeApp(firebaseConfig);
                        var unique_name_with_spaces = new Date().getTime().toString();
                        unique_name = '';
                        for (char of unique_name_with_spaces){
                            if (char == ' '){
                                unique_name+='_'
                            } else {
                                unique_name+=char.toString()
                            }
                        }
                        
                        processing.innerHTML = "almost there &#128640;"
                        processing.style.display = 'flex';
                        processing.classList.add('appear');
                        setTimeout(() => {
                            processing.style.display = 'flex';
                            processing.classList.remove('appear');
                        }, 200)

                        let form = document.createElement('form');
                        form.method = 'post';
                        form.enctype = 'multipart/form-data';
                        form.action = '/new-sell';

                        let content_text = {
                            item_name: name.toString(),
                            item_desc: desc.toString(),
                            item_location: location.toString(),
                            item_price: price.toString(),
                            video_name: unique_name.toString()
                        }
                        let index = 0;

                        for (i in content_text){
                            let input = document.createElement('input');
                            input.type = 'text';
                            input.value = content_text[i];
                            input.name = Object.keys(content_text)[index];
                            form.appendChild(input);
                            index+=1
                        }
                        
                        let file_inp = document.getElementById('file-input');
                        file_inp.name = 'video';
                        form.appendChild(file_inp);

                        document.getElementById('video-header').appendChild(form);
                        form.submit();
                    } else {
                        if (screen.width<500){
                            let height = document.getElementById('intro').clientHeight;
                            let part_height = document.getElementById('part').clientHeight;
                            document.body.scrollTo({
                                top: (height*0.98863+240+part_height*4),
                                behavior: 'smooth'
                            })
                        } else {
                            window.scroll({
                                top: window.innerHeight*5+240,
                                behavior: 'smooth'
                            })
                        }
                    }
                } else {
                    if (screen.width<500){
                        let height = document.getElementById('intro').clientHeight;
                        let part_height = document.getElementById('part').clientHeight;
                        document.body.scrollTo({
                            top: (height*0.98863+240+part_height*3),
                            behavior: 'smooth'
                    })
                    } else {
                        window.scroll({
                            top: window.innerHeight*4+240,
                            behavior: 'smooth'
                        })
                    }
                }
            } else {
                if (screen.width<500){
                    let height = document.getElementById('intro').clientHeight;
                    let part_height = document.getElementById('part').clientHeight;
                    document.body.scrollTo({
                        top: (height*0.98863+240+part_height*2),
                        behavior: 'smooth'
                    })
                } else {
                    window.scroll({
                        top: window.innerHeight*3+240,
                        behavior: 'smooth'
                    })
                }
            }
        } else {
            if (screen.width<500){
                let height = document.getElementById('intro').clientHeight;
                let part_height = document.getElementById('part').clientHeight;
                document.body.scrollTo({
                    top: (height*0.98863+240+part_height),
                    behavior: 'smooth'
            })
            } else {
                window.scroll({
                    top: window.innerHeight*2+240,
                    behavior: 'smooth'
                })
            }
        }
    } else {
        if (screen.width<500){
            let height = document.getElementById('intro').clientHeight;
            document.body.scrollTo({
                top: (height*0.98863+240),
                behavior: 'smooth'
            })
        } else {
            window.scroll({
                top: window.innerHeight+240,
                behavior: 'smooth'
            })
        }
    }
}

function close_makesure(){
    document.removeEventListener('scroll', close_makesure);
    document.body.removeEventListener('scroll', close_makesure);
    var makesure = document.getElementById('makesure');
    makesure.style.display = 'flex';
    makesure.classList.add('makesure-disappear');
    makesure.addEventListener('animationend', ()=> {
        makesure.classList.remove('makesure-disappear');
        makesure.style.opacity = '0';
        makesure.style.visibility = '0';
        makesure.style.display = 'none'
    })
}

var makesure_close = document.getElementById('makesure-close');
makesure_close.addEventListener('click', close_makesure)
