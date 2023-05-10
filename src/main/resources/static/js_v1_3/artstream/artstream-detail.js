// console.log(Kakao.isInitialized());
showCollectionUpdateModal();
let artworkId;
let now_artwork_id=-1;
let page;

//owl carousel library
$(document).ready(function(){
    if(location.search.indexOf("exh_id") == -1){
        page = 'artwork';
    }else{
        page = 'curationPlayer';
        // $('.exh-info-wrap').css('display','block');
    }
    // let childElement = document.getElementById('child');
    // if (childElement !== null){
    //     //================== iframe ============================
    //     function sendMessage(msg) {
    //         childElement.contentWindow.postMessage(msg, '*');
    //         setTimeout(function (){
    //             // console.clear();
    //         },800)
    //     }
    //     function receiveMessage( e ) {
    //         childElement.style.height = (e.data.height + 100)+'px';
    //         childElement.style.opacity = '1'
    //     }
    //     setTimeout(function (){
    //         sendMessage(0)
    //     },1000);
    //     window.addEventListener( 'message', function (e){
    //         receiveMessage(e)
    //     });
    //     //================== iframe ============================
    // }

    jumpToArtworkList();
});
//'전시하는 작품' 누르면 전시 작품으로 이동
function goToSomewhere(selector, selector2={}){
    document.querySelector('html').scrollTop = 0;
    const targetTagTop = document.querySelector(selector).offsetTop;
    const container = document.querySelector(selector2).offsetHeight;
    const header = document.querySelector('header').offsetHeight;
    if(document.body.clientWidth > 481){
        window.scrollTo({top:targetTagTop - header,behavior:"smooth"});
    }else{
        window.scrollTo({top:targetTagTop - (header+container-5),behavior:"smooth"});
    }
}
//'전시하는 작품'의 '자세히보기'버튼 클릭 했을 때 모달창 나옴
function setModalData(selector){
    let artworkId = selector.children.namedItem('artwork-id').value;
    let exhId;
    if(page === 'curationPlayer'){
        exhId = selector.children.namedItem('exhibition-id').value;
    }else if(page === 'artwork'){
        $('#share_options .art-id').val(artworkId);
    }
    let likeImg;
    let likeText;
    getPlayerUrl(selector);
    let artworkMoreUrl;
    if(page === 'curationPlayer'){
        artworkMoreUrl = "/" + location.pathname.split('/')[1] + "/api/artwork-more?art_id=" + artworkId + "&exh_id="+ exhId
    }else{
        artworkMoreUrl = "/" + location.pathname.split('/')[1] + "/api/artwork-more?art_id=" + artworkId
    }
    $.ajax({
        url: artworkMoreUrl,
        type:"POST",
        success: function(data){
        },
        error: function (request, status, error) {
            // console.log("code = " + request.status + " message = " + request.responseText + " error = " + error);
        },
    }).done(function (data) {
        if (data['artworkLiked']) {
            likeImg = '/img/icon_already_like.png';
            likeText = liked;
        } else {
            likeImg = '/img/icon_like.png';
            likeText = like;
        }
        const container = document.getElementById('artwork_option_box');
        let thumbnail = selector.previousElementSibling.querySelector('img').getAttribute('src');
        let title = selector.previousElementSibling.querySelector('.artwork-name').textContent;
        let artistId = selector.children.namedItem('artist-id').value;
        artworkId = selector.children.namedItem('artwork-id').value;
        let artistName = selector.previousElementSibling.querySelector('.artist-name').textContent;
        let onclickFunction = selector.previousSibling.previousSibling.getAttribute('onclick');
        let loggedIn;
        document.getElementById('ogImg').setAttribute('content',thumbnail);
        document.querySelector('.loggedIn').value === 'true'? loggedIn = 'setAddArtworkModalData('+artworkId+').then()' : loggedIn = 'NonMemberInAccessible();"';
        const content = `
            <div class="modal-gradation-box" onclick="closeModal('#artwork_option_box')"></div>
            <ul id="artwork_options" class="artwork-options">
                <li class="artwork-wrap">
                    <button type="button" class="exh-artwork" onclick="showArtworkInfo(this)">
                        <img id="current_img" src="${thumbnail}" alt="${title}">
                        <input type="hidden" class="artwork-id" name="artwork-id" value="${artworkId}">
                        <span class="artwork-txt-info">
                            <span class="artwork-info" id="current_title">${title}</span>
                            <span class="artwork-info" id="current_name">${artistName}</span>
                        </span>
                        <img class="icon-more" src="/img/icon_more.png" alt="icon_more">
                    </button>
                </li>
                <!--<li>
                    <button type="button" id="btn_play" class="btn-play" onclick="${onclickFunction}; closeModal('#artwork_option_box')">
                        <img src="/img/icon_play.png" alt="icon_play">
                        <span>${watchThisArtwork}</span>
                    </button>
                </li>-->
                <li>
                    <button type="button" id="btn_add_collection" class="btn-add-collection" onclick="${loggedIn}">
                        <img src="/img/icon_add_collection.png" alt="icon_add_collection">
                        <span>${addToCollection}</span>
                    </button>
                </li>
                <li>
                    <button type="button" id="btn_like" class="btn-like" onclick="toggleLikeUI(this)">
                        <img src="${likeImg}" alt="icon_like">
                        <span>${likeText}</span>
                        <input type="hidden" class="artwork-id" name="artwork-id" value="${artworkId}">
                    </button>
                </li>
                <li>
                    <button type="button" id="btn_share" class="btn-share" onclick="closeModal('#artwork_option_box'); showModal('#share_option_box')">
                        <img src="/img/icon_share.png" alt="icon_share">
                        <span>${shareTo}</span>
                    </button>
                </li>
                <li>
                    <a href="/` + location.pathname.split('/')[1]  + `/artists/detail?artist_id=${artistId}" id="artist_information" class="artist-information">
                        <img src="/img/icon_information.png" alt="icon_information">
                        <span>${artistInfo}</span>
                    </a>
                </li>
            </ul>
            <button type="button" id="btn_artwork_options_close" class="btn-artwork-options-close" onclick="closeModal('#artwork_option_box');">
                <img src="/img/icon_close_popup.png" alt="icon_close_popup">
            </button>`
        container.innerHTML = content;
    })
}

//jump paremeter를 가지고 있을 때 바로 작품 목록으로 가기
function jumpToArtworkList(){
    const path = window.location.search;
    const parameter = path.split('&');
    const jumpBool = parameter[1];
    if(jumpBool == 'jump=true'){
        setTimeout(function (){
            goToSomewhere('#exh_artworks_list','.player-wrap');
        },1500)
    }
}

//계속하기,다음 버튼 클릭
const btnNext = (self, stat) => {
    //상태에 따라 통신하거나 다음페이지로 이동시켜준다.
    switch (stat){
        case 'code':
            checkTvCode(self,document.querySelector('input[type="text"]').value);
            break;
    }
}
//============= 상태바 애니메이션 ===============
// window.addEventListener('scroll',function(){
//     let vw = window.innerWidth;
//     if(vw <= 481){
//         let currentScrollTop = document.querySelector('html').scrollTop;
//         if(currentScrollTop === 0){
//             $('.now-playing-info').removeClass('scrolled');
//             fillBlueButton(false).then(removeBlueButton(false));
//         }else{
//             if(!$('.now-playing-info').hasClass('scrolled')){
//                 $('.now-playing-info').addClass('scrolled');
//                 fillBlueButton(true).then(removeBlueButton(true));
//             }
//         }
//     }
// });
// window.addEventListener("resize", function() {
//     let vw = window.innerWidth;
//     if(vw > 481){
//         $('.now-playing-info').removeClass('scrolled');
//         fillBlueButton(false).then(removeBlueButton(false));
//     }
// });
// function fillBlueButton (param){
//     return new Promise((resolve, reject) => {
//         let blueButton;
//         let blueButtonContainer;
//         if (param === true) {
//             blueButton = document.getElementById('player_button').innerHTML;
//             blueButtonContainer = document.getElementById('top_player_button');
//             blueButtonContainer.innerHTML = blueButton;
//         } else {
//             blueButton = document.getElementById('top_player_button').innerHTML;
//             blueButtonContainer = document.getElementById('player_button');
//             blueButtonContainer.innerHTML = blueButton;
//         }
//         resolve();
//     });
// }
// function removeBlueButton (param){
//     return new Promise((resolve, reject) => {
//         if(param === true){
//             document.getElementById('player_button').innerHTML = ``;
//         }else{
//             document.getElementById('top_player_button').innerHTML = ``
//         }
//         resolve();
//     });
// }

function initArtStreamDetail(){
    const firstItemLink = document.getElementById('share_options');
    getPlayerUrl(firstItemLink);
    checkLineClamp('.exh-description');
    //websocket
    // connect();
}
initArtStreamDetail();



