
// giveNameSpace('.artist-english-name');


//사업자정보확인
//href : 주소
//w : 가로 길이
//h : 세로 길이
//xPos , yPos : 화면의 중앙에 위치시키기 위해 존재 (듀얼모니터용..)
function businessInfo(href, w, h){
    let xPos =(document.body.offsetWidth/2) - (w/2);
    xPos = xPos+window.screenLeft
    const yPos = (document.body.offsetHeight/2) - (h/2);
    window.open(href, "businessInfo", "width="+w+", height="+h+", left="+xPos+", top="+yPos+", menubar=yes, status=yes, titlebar=yes, resizable=yes");
}

//device Login
const deviceIdSelector = document.getElementById('deviceId');
const deviceNameSelector = document.getElementById('tvLoginSuccess');

if(deviceNameSelector !== null){
    if(deviceNameSelector.value == 'success'){
        toastPopup('success',loginSucceed);

    }else if(deviceNameSelector.value == 'fail'){
        toastPopup('normal',tvLoginFailed);

    }else{
        console.log("why am i here")
    }
}

//event modal 다신 보지 않기 toggle 애니메이션
let adToggleBoolean = false;
function seeNoMoreToggle(selector){
    let target = selector;
    if(adToggleBoolean === true){
        target.querySelector('.btn-img').setAttribute('src','/img/icon_check_active1.png');
        target.querySelector('.btn-img').setAttribute('alt','icon_check_active');
        adToggleBoolean = false;
    }else if(adToggleBoolean === false){
        target.querySelector('.btn-img').setAttribute('src','/img/icon_check_inactive2.png');
        target.querySelector('.btn-img').setAttribute('alt','icon_check_inactive');
        adToggleBoolean = true;
    }else{
        target.querySelector('.btn-img').setAttribute('src','/img/icon_check_active1.png');
        target.querySelector('.btn-img').setAttribute('alt','icon_check_active');
        adToggleBoolean = false;
    }
    // preventsScroll();
}
function setAdCookie(){
    if(adToggleBoolean === false){
        Cookies.set('advertisement', 'false');
    }else if(adToggleBoolean === true){
        Cookies.set('advertisement', 'undefined');
    }
}
function showEventModal(img,url){
    let eventImg = img;
    let eventUrl = url;
    document.querySelector('#event_modal').style.display = 'block';
    setTimeout(function(){
        document.querySelector('.event-modal').style.top = '48px';
    },500)
    document.querySelector('#event_modal .event-img').setAttribute('src',eventImg);
    document.querySelector('#event_modal #anchor_see_more').setAttribute('href',eventUrl);
    if(scrollModalBoolean){
        preventsScroll();
    }
}

function getAdverModalAjax(){
    var name = 'webOngoingEvent'
    $.ajax({
        url:"/api/advertisement?name=" + name,
        type:"GET",
        dataType: "json",
        success: function(data){
            if(data.status === true){
                let img = data.image;
                let url = data.hrefUrl;
                showEventModal(img, url);
                sessionStorage.setItem('advertisement','1')
            }
        },
        error: function(){
        }
    })
}
var adCookie = Cookies.get('advertisement');
if((adCookie === undefined || adCookie === 'undefined')&&(sessionStorage.getItem('advertisement')!=='1')){
    getAdverModalAjax();
}

function closeEventModalWrap(selector){
    let btn = selector;
    let wrap = btn.closest('div.wrap');
    wrap.style.display = 'none';
}
window.addEventListener("load", function() {
    document.getElementById('preload-black-page').remove()
});

function goToAllArtwork(){
    location.href = "/" + location.pathname.split('/')[1] + "/artwork/all";
}
function goToTvGuide(){
    location.href = "/" + location.pathname.split('/')[1] + "/mypage/use-tv";
}
function goToAllArtists(){
    location.href = "/" + location.pathname.split('/')[1] + "/artists";
}
function goToStore(){
    window.open("https://patron-gallery.com/", "_blank");
}
$('.home-enjoy-wrap').addClass('semi-light')
