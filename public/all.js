
var burger = document.getElementById('top-burger');
var mobile_menu = document.getElementById('routes');
var single_routes = document.getElementsByClassName('route');
var close_routes = document.getElementById('mobile-close-routes')

burger.addEventListener('click', () => {
    mobile_menu.style.display = 'flex';
    mobile_menu.classList.add('routes_appear');
    setTimeout(() => {
        mobile_menu.style.opacity = '1';
        mobile_menu.style.visibility = 'visible';
        mobile_menu.classList.remove('routes_appear');
        for (route of single_routes){
            route.style.display = 'flex';
        }
    }, 300)
})

close_routes.addEventListener('click', () => {
    for (route of single_routes){
        route.classList.add('disappear_l');
    }
    setTimeout(() => {
        for (route of single_routes){
            route.style.display = 'none';
            route.classList.remove('disappear_l');
        }
        mobile_menu.classList.add('routes_disappear');
        setTimeout(() => {
            mobile_menu.classList.remove('routes_disappear')
            mobile_menu.style.display = 'none';
            mobile_menu.style.opacity = '0';
            mobile_menu.style.visibility = 'hidden'
        }, 300)
    }, 400)
})