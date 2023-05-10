// console.log("artist js")
function artistDetailInit(){
    console.log('ehlsekd ')
    //함수 실행
    // giveNameSpace('.artist-english-name');
//============= 상태바 애니메이션 ===============
//     if(document.getElementById('artist_intro_video')){
    //아티스트의 컨텐츠 없을 경우를 대비
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    var mainTagHeight = document.querySelector('main').offsetHeight;
    if(viewportHeight > mainTagHeight){
        document.querySelector('main').style.cssText = "height: 100vh;display: flex;flex-direction: column;background-color: #0a0a0a;overflow-y: scroll;overflow-x: hidden;";
    }

    // window.addEventListener('scroll', function () {
    //         console.log('???')
    //         let currentScrollTop = document.querySelector('html').scrollTop;
    //         if (currentScrollTop === 0) {
    //             document.querySelector('.exh-info-box').style.cssText = "position: unset; top: unset; z-index: unset;";
    //         } else {
    //             var vw = window.innerWidth;
    //             if(vw > 481){
    //                 document.querySelector('.exh-info-box').style.cssText = "position: fixed; top: 48px; z-index: 2;";
    //             }else{
    //                 document.querySelector('.exh-info-box').style.cssText = "position: fixed; top: 48px; z-index: 2; left: 0; padding-left: 16px;";
    //             }
    //
    //         }
    //     });
    // }
}
function controlFavoriteArtist(id){
        let likeStatus = document.querySelector('#artist_button img').getAttribute('src') === "/img/icon_already_like.png" ? 0 : 1;
    // console.log("like : "+like)
    console.log(likeStatus)
        $.ajax({
            url:"/api/like-artist?art_id="+id+"&like="+likeStatus,
            method:"post",
            data:{
            },
            success:function (result){
                // console.log("result"+result)
                console.log(result)
                if(result === 1){
                    document.querySelector('#artist_button img').setAttribute('src','/img/icon_already_like.png');
                    toastPopup('success',addedToLikedArtists);
                    document.querySelector('#artist_button').children[1].innerText = liked
                }
                if(result === 2){
                    document.querySelector('#artist_button img').setAttribute('src','/img/icon_like.png');
                    document.querySelector('#artist_button').children[1].innerText = like
                }
            }
        })
}



//'등록한 작품'의 '자세히보기'버튼 클릭 했을 때 모달창 나옴
function setModalData(selector){
    let artworkId = selector.children.namedItem('artwork-id').value;
    // let exhId = selector.children.namedItem('exh-id').value;
    let likeImg;
    let likeText
    $.ajax({
        url: "/" + location.pathname.split('/')[1] + "/api/artwork-more?art_id=" + artworkId,
        type:"POST",
        success: function(data){
        },
        error: function (request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error);
        },
    }).done(function (data) {
        if(data.artworkLiked){
            likeImg = '/img/icon_already_like.png'
            likeText = liked
        }  else {
            likeImg = '/img/icon_like.png';
            likeText = like
        }

        let container = document.getElementById('artwork_option_box');
        let thumbnail = selector.previousElementSibling.querySelector('img').getAttribute('src');
        let title = selector.previousElementSibling.querySelector('.artwork-txt-info li:nth-of-type(1)').textContent;
        let artistName;
        let artistKoreanName = selector.previousElementSibling.querySelector('.artist-name').textContent;
        if(selector.previousElementSibling.querySelector('.artist-english-name')){
            let artistEnglishName = selector.previousElementSibling.querySelector('.artist-english-name').textContent;
            artistName = artistKoreanName + '(' + artistEnglishName + ')';
        }else{
            artistName = artistKoreanName;
        }
        let loggedIn;
        document.querySelector('.loggedIn').value === 'true' ? loggedIn = 'setAddArtworkModalData('+artworkId+').then()' : loggedIn = 'NonMemberInAccessible();"';
        let content = `
            <div class="modal-gradation-box" onclick="closeModal('#artwork_option_box')"></div>
            <ul id="artwork_options" class="artwork-options">
                <li class="artwork-wrap">
                    <a href="#" class="exh-artwork" onclick="showArtworkInfo(this)">
                        <img id="current_img" src="${thumbnail}" alt="${title}">
                        <input type="hidden" class="artwork-id" name="artwork-id" value="${artworkId}">
                        <ul class="artwork-txt-info">
                            <li id="current_title">${title}</li>
                            <li id="current_name">${artistName}</li>
                        </ul>
                        <img class="icon-more" src="/img/icon_more.png" alt="icon_more">
                    </a>
                </li>
                <li>
                    <button type="button" id="btn_play" class="btn-play" onclick="location.href = serverUrl+ location.pathname.split('/')[1] + '/player?art_id='+${artworkId};">
                        <img src="/img/icon_play.png" alt="icon_play">
                        <span>${watchThisArtwork}</span>
                    </button>
                </li>
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
                    </button>
                </li>
            </ul>
            <button type="button" id="btn_artwork_options_close" class="btn-artwork-options-close" onclick="closeModal('#artwork_option_box')">
                <img src="/img/icon_close_popup.png" alt="icon_close_popup">
            </button>`
        container.innerHTML = content;
    })
}


if(!document.getElementById('artist_intro_video')){
    document.getElementById('btn_play_artist_video').style.position = 'relative';
}
artistDetailInit()

function fadeOutSet(){
    $('.player-gradation').css('opacity','0');
    $('.btn-play-artist-video').css('opacity','0');
}
function fadeIn(){
    $('.player-gradation').css('opacity','1');
    $('.btn-play-artist-video').css('opacity','1');
}
//플레이
let isPlay,fadeout;
let icon = document.getElementById('btn_play_icon');
let video = document.getElementById('artist_intro_video') ? document.getElementById('artist_intro_video') : '';
document.getElementById('btn_play_artist_video').onclick = function (){
    if ( video !== '' ){
        clearTimeout(fadeout);
        fadeIn()
        fadeout = setTimeout(function (){
            fadeOutSet()
        },5000)
        if(isPlay === true){
            video.pause();
            icon.setAttribute('src','/img/icon_play_large.png')
            $('.pause-text').text('재생');
            isPlay = false;
        }else {
            video.play();
            icon.setAttribute('src','/img/icon_pause_large.png')
            $('.pause-text').text('일시정지');
            isPlay = true;
        }
    }
}
//공유하기
// function shareTwitter() {
//     var sendText = "더 새롭게 예술하다, 파트론"; // 전달할 텍스트
//     //이미지 타이틀 설명
//     let sendUrl = location.href;
//     window.open("https://twitter.com/intent/tweet?text=" + sendText + "&url=" + sendUrl);
// }
// function shareFacebook(){
//     let sendUrl = location.href;
//     // var sendUrl = 'http://patrontestnodamen.kro.kr/player?exh_id=12'+"%26para=1_Rasing_Mountain/HD"; // 전달할 URL
//     window.open("http://www.facebook.com/sharer/sharer.php?u=" + sendUrl);
// }
// function shareKakaoTalk(){
//     let exhName = document.querySelector('.exh-title').textContent;
//     let description = document.getElementById('ogText').getAttribute('content');
//     let imageUrl = document.getElementById('ogImg').getAttribute('content');
//     // let link = document.getElementById('ogUrl').getAttribute('content');
//     let link = location.href;
//     Kakao.Link.sendDefault({
//         objectType: 'feed',
//         content: {
//             title: '더 새롭게 예술하다, 파트론',
//             description: description,
//             imageUrl: imageUrl,
//             link: {
//                 mobileWebUrl: link,
//                 androidExecutionParams: 'test',
//             },
//         },
//         buttons: [
//             {
//                 title: '웹으로 이동',
//                 link: {
//                     mobileWebUrl: link,
//                 },
//             },
//         ]
//     });
// }


function locationArtStream(language,exh_id){
    location.href = '/' + language + '/player?exh_id=' + exh_id
}
//TODO
//작품 모두보기
let pageNumberArtwork = 0;
function openModalAllArtwork(){
    let allArtworkCount = document.querySelector('.artwork-count span');
    let searchedType = "Artwork";
    let searchedKeyword = $('#artist_name').text();
    let container = document.querySelector('#artist_artwork_all .exh-artworks-list');
    $.ajax({
        url:'/'+location.pathname.split('/')[1]+"/api/search",
        method: "POST",
        type: "json",
        data:{
            "keyword" : searchedKeyword,
            "type" : searchedType,
            "p" : pageNumberArtwork,
        },
        success: function(result){
            if (result.id.length < 20){
                $('.loading').css('display','none');
            }
            console.log(result);
            artworkId = result['id'];
            artistId = result['artistId'];
            artworkName = result['name'];
            artworkThumbnail = result['thumbnail'];
            artistNationality = result['nationality'];
            artistName = result['artistName'];
            totalCount = result['totalCount'];
            allArtworkCount.innerText = totalCount;
            if(artworkId.length < 20){
                forCount = artworkId.length
            }else{
                forCount = 20;
            }
            for(let k=0; k<forCount; k++){
                post = document.createElement('li');
                post.innerHTML = `
                    <a href="/` + location.pathname.split('/')[1] + `/player?art_id=` + artworkId[k] + `" class="exh-artwork" onclick="showArtworkInfo(this)">
                        <div class="exh-artwork-img-wrap">
                            <img src="${artworkThumbnail[k]}" alt="${artistName[k]}">
                        </div>
                        <ul class="artwork-txt-info">
                            <li class="artwork-name">${artworkName[k]}</li>
                            <li>
                               <span class="korean-name">${artistName[k]}</span>
                            </li>
                        </ul>
                    </a>
                    <button type="button"  class="icon-show-option" onclick="showModal('#artwork_option_box'); setModal(this)">
                        <img src="/img/icon_show_option_white.png" alt="icon_show_option">
                        <input type="hidden" name="artwork-id" value="${artworkId[k]}">
                        <input type="hidden" name="artist-id" value="${artistId[k]}">
                        <input type="hidden" name="artist-nationality" value="${artistNationality[k]}">
                    </button>
                `
                container.appendChild(post);
                showArtistNameWithLan();
            }
        }
    });
    pageNumberArtwork = pageNumberArtwork + 1;
    scrolled = false;
}
function changeToCommonHeader(){
    document.getElementById('btn_goback').setAttribute('onclick',`history.go(-1)`);
}
//change header default home icon
function changeToModalHeader(selector){
    //header 보임
    document.querySelector('header').style.display="block"
    document.getElementById('btn_goback').setAttribute('onclick',`closeModalSimply('${selector}');changeToCommonHeader();hideNavMenu();`);
    // document.getElementById('btn_goback').innerHTML = `
    //     <button type="button" id="btn_goback" class="btn-goback" onclick="closeModalSimply('${selector}');changeToCommonHeader();hideNavMenu();">
    //         <img src="/img/icon_go_back.png" alt="icon_go_back">
    //     </button>`;
    // if(document.getElementById('btn_tv_connection')){
    //     document.getElementById('btn_tv_connection').style.display = 'none';
    // }
}
//작품 모두 보기 init 함수
async function initModalAllArtwork(){
    await openModalAllArtwork();
    await showModal('.artist-artwork-all-wrap');
    document.getElementById('artist_artwork_all').addEventListener('scroll',function(){
        scrollHeight = document.getElementById('artist_artwork_all').scrollHeight;
        scrollTop = document.getElementById('artist_artwork_all').scrollTop;
        clientHeight = document.getElementById('artist_artwork_all').clientHeight;
        if( (scrollTop + clientHeight) > (scrollHeight - 1) && !scrolled){
            scrolled = true;
            openModalAllArtwork();
        }
    });
}
//=======================작품상세정보 함수==============================
//'등록한 작품'의 '자세히보기'버튼 클릭 했을 때 모달창 나옴
function setModal(selector){
    let artworkId = selector.children.namedItem('artwork-id').value;
    let likeImg;
    let likeText
    $.ajax({
        url: '/'+location.pathname.split('/')[1]+"/api/artwork-more?art_id=" + artworkId,
        type:"POST",
        success: function(data){
        },
        error: function (request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error);
        },
    }).done(function (data) {
        // console.log(data.artworkLiked)
        if (data.artworkLiked) {
            likeImg = '/img/icon_already_like.png'
            likeText = liked
        } else {
            likeImg = '/img/icon_like.png';
            likeText = like
        }
        artistId = selector.children.namedItem('artist-id').value;
        container = document.getElementById('artwork_option_box');
        const thumbnail = selector.previousElementSibling.querySelector('img').getAttribute('src');
        const title = selector.previousElementSibling.querySelector('.artwork-txt-info li:nth-of-type(1)').textContent;
        const artistNationality = selector.children.namedItem('artist-nationality').value;
        const artistName = selector.previousElementSibling.querySelector('.korean-name').textContent;
        // const artistKorName = selector.previousElementSibling.querySelector('.korean-name').textContent;
        // const artistEngName = selector.previousElementSibling.querySelector('.english-name').textContent;
        // let artistBracketName;
        // if (artistNationality === '대한민국' || artistNationality === '한국') {
        //     artistBracketName = '';
        // }else{
        //     artistBracketName = `(${artistEngName})`;
        // }
        let loggedIn;
        console.log(watchThisArtwork)
        document.querySelector('.loggedIn').value === 'true' ? loggedIn = 'setAddArtworkModalData('+artworkId+').then()' : loggedIn = 'NonMemberInAccessible();"';
        const content = `
            <div class="modal-gradation-box" onclick="closeModal('#artwork_option_box')"></div>
            <ul id="artwork_options" class="artwork-options">
                <li class="artwork-wrap">
                    <button class="exh-artwork" onclick="showArtworkInfo(this)">
                        <img id="current_img" src="${thumbnail}" alt="${title}">
                        <input type="hidden" class="artwork-id" name="artwork-id" value="${artworkId}">
                        <ul class="artwork-txt-info">
                            <li id="current_title">${title}</li>
                            <li id="current_name">
                                <span class="korean-name">${artistName}</span>
                            </li>
                        </ul>
                        <img class="icon-more" src="/img/icon_more.png" alt="icon_more">
                    </button>
                </li>
                <!--<li>
                    <button type="button" id="btn_play" class="btn-play" onclick="location.href = '/'+location.pathname.split('/')[1]+'/player?art_id='+${artworkId}">
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
                    </button>
                </li>
                <li>
                    <button type="button" id="btn_share" class="btn-share" onclick="closeModal('#artwork_option_box'); showModal('#share_option_box')">
                        <img src="/img/icon_share.png" alt="icon_share">
                        <span>${shareTo}</span>
                    </button>
                </li>
                 <li>
                    <a href="/` + location.pathname.split('/')[1]  + `/artists/detail?artist_id=${artistId}">
                        <img src="/img/icon_information.png" alt="icon_play">
                        <span>${artistInfo}</span>
                    </a>
                </li>
            </ul>
            <button type="button" id="btn_artwork_options_close" class="btn-artwork-options-close" onclick="closeModal('#artwork_option_box');">
                <img src="/img/icon_close_popup.png" alt="icon_close_popup">
            </button>`
        container.innerHTML = content;
        showArtistNameWithLan();
        document.getElementById('ogImg').setAttribute('content',thumbnail);
        let domain = location.href.split('/')[2];
        let linkToBeCopied = '/' + location.pathname.split('/')[1]  + '/player?art_id='+artworkId;
        linkToBeCopied = 'https://' + domain + linkToBeCopied;
        let linkPasteButton = document.getElementById('btn_copy_link');
        let twitterButton = document.getElementById('btn_share_twitter');
        let kakaoButton = document.getElementById('btn_share_kakaotalk');
        let facebookButton = document.getElementById('btn_share_facebook');
        twitterButton.setAttribute('value',linkToBeCopied);
        kakaoButton.setAttribute('value',linkToBeCopied);
        facebookButton.setAttribute('value',linkToBeCopied);
        linkPasteButton.addEventListener('click',function(){copyToClipboard(linkToBeCopied)});
    })
}