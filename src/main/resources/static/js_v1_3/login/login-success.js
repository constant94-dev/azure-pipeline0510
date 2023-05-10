//간편로그인 완료시 marketing 체크값 전송
let status = sessionStorage.getItem('marketing');
status === 'true' ? status = true : status = false;
$.ajax({
    url:'/api/marketing',
    method: "POST",
    dataType: "json",
    data: {
        status: status
    },
    success: function(data){
        sessionStorage.removeItem('marketing');
    },
    error: function(request){
        // if(request.status === 403){
        //     return adminLogout();
        // }
    }
})

document.getElementById('goBack').onclick = function (){
    // if(Cookies.get('pastUrl') !== undefined){
    //     let url = Cookies.get('pastUrl');
    //     Cookies.remove('pastUrl');
    //     setTimeout(function (){
    //         location.href = url;
    //     },500)
    // } else {
        checkGAEvent('signup_success_home');
        location.href ="/" + location.pathname.split('/')[1] + '/home';
    // }
}


const images = document.querySelectorAll(".image-container img");
let firstTimeNext = true;
let startTime;
let timePassed = 0
let intervalTimer = 49250;
function imageCarousel(){
    switch (images[0].classList.value){
        case "first": images[0].classList.remove("first"); images[0].classList.add("second");break;
        case "second": images[0].classList.remove("second"); images[0].classList.add("third");break;
        case "third": images[0].classList.remove("third"); images[0].classList.add("first");break;
    }
    switch (images[1].classList.value){
        case "first": images[1].classList.remove("first"); images[1].classList.add("second");break;
        case "second": images[1].classList.remove("second"); images[1].classList.add("third");break;
        case "third": images[1].classList.remove("third"); images[1].classList.add("first");break;
    }
    switch (images[2].classList.value){
        case "first": images[2].classList.remove("first"); images[2].classList.add("second");break;
        case "second": images[2].classList.remove("second"); images[2].classList.add("third");break;
        case "third": images[2].classList.remove("third"); images[2].classList.add("first");break;
    }
    startTime = performance.now();
    intervalTimer = 50000;
    clearInterval(timer);
    timer = setInterval(next, intervalTimer);
}

function next(){
    if(firstTimeNext){
        startTime = performance.now();
        firstTimeNext = false
    }else{
        timePassed = performance.now() - startTime;
        console.log(timePassed)
        if(timePassed < intervalTimer){
            setTimeout(
                next
            ,intervalTimer-timePassed);
        }else{
            imageCarousel();
        }
    }
}
next();
let timer = setInterval(next, intervalTimer);

