
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