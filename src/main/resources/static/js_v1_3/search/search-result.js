function initSearchResult(){
    const input = document.getElementById('input_search');
    const keyword = document.getElementById('searched_keyword').innerText;
    input.value = keyword;
    goFocus('#input_search');
}
function goFocus(selector){
    const target = document.querySelector(selector);
    target.focus();
}
function eraseTxt(selector){
    const target = document.querySelector(selector)
    target.value = '';
}
//검색창 onkeyup 이벤트
function toggleModal(selector){
    if(selector.value.length > 0){
        showModalSimply('#text_eraser');
    }else{
        closeModalSimply('#text_eraser');
    }
}
//enter 눌렀을 때 검색페이지로 이동
function searchKeyword(selector){
    const target = document.querySelector(selector).value;
    const pattern_spc =/[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/; // 특수문자 정규표현식(유효성 검사용)
    //유효성 검사 : 공백 금지, 띄어쓰기 한 번 금지, 특수문자 금지==
    if (target.trim(' ')==='') {
        toastPopup('error',inputSearchKeyword);
        // location.href = `/search`
    }else if(pattern_spc.test(target)){
        toastPopup('error',symbolCantBeSearched);
        // location.href=`/search`
    }else{
        location.href='/'+location.pathname.split('/')[1]+`/search-result?keyword=${target}`
    }
}

window.addEventListener("keydown", (e) => {
    if(e.keyCode===13){
        searchKeyword('#input_search')
    }
});

//모두 보기
//=======================infinite scroll==============================
let pageNumberArtStream = 0;
let pageNumberArtist = 0;
let pageNumberArtwork = 0;
let container;
const searchArtStreamAllModal = document.querySelector('#search_art_stream_all .art-stream-list-section');
const searchArtistAllModal = document.querySelector('#search_artist_all .artist-list-section');
const searchArtworkAllModal = document.querySelector('#search_artwork_all .artwork-list-section');
const searchedKeyword = document.getElementById('searched_keyword').innerText;
let exhibitionId;
let exhibitionThumb;
let exhibitionName;
let durationTime;
let exhibitionArtist;
let artistCount;
let artworksCount;
let artworkId;
let artistId;
let artworkThumbnail;
let artworkName;
let searchedType;
let totalCount;
let searchedResultsCount;
let post;
let forCount;
let scrollHeight;
let scrollTop;
let clientHeight;
let artistNationality;
let artistKorName;
let artistEngName;
let artistBracketName;
let artistCountText;
let scrolled;
//아트스트림 모두 보기
function openModalAllArtStream(){
    searchedResultsCount = document.querySelector('#artstream_result_count');
    searchedType = "Exhibition";
    container = document.querySelector('#search_art_stream_all .art-stream-list');
    $.ajax({
        url:'/'+location.pathname.split('/')[1]+"/api/search",
        method: "POST",
        type: "json",
        data:{
            "keyword" : searchedKeyword,
            "type" : searchedType,
            "p" : pageNumberArtStream,
        },
        success: function(result){
            if (result.id.length < 20){
                $('.loading').css('display','none');
            }
            exhibitionId = result['id'];
            exhibitionThumb = result['thumbnail'];
            exhibitionName = result['name'];
            artistNationality = result['nationality'];
            artistName = result['artistName'];
            // artistKorName = result['artistKorName'];
            // artistEngName = result['artistEngName'];
            durationTime = result['durationTime'];
            artistCount = result['artistCount'];
            artworksCount = result['artworkCount'];
            totalCount = result['totalCount'];
            searchedResultsCount.innerText = totalCount;
            durationTime === null ? durationTime = '' : durationTime = durationTime;
            exhibitionId.length < 20 ? forCount = exhibitionId.length : forCount = 20;
            for(let i=0; i<forCount; i++){
                // if (artistNationality[i] === '대한민국' || artistNationality[i] === '한국') {
                //     artistBracketName = '';
                // }else{
                //     artistBracketName = `(${artistEngName[i]})`;
                // }
                if(artistCount[i] > 2){
                    switch(location.pathname.split('/')[1]){
                        case "ja" : artistCountText = `ほか${artistCount[i]}名様です`; break;
                        case "ko" : artistCountText = `외 ${artistCount[i]}명`; break;
                        default : artistCountText =  `and ${artistCount[i]}others`; break;
                    }
                }else{
                    artistCountText = '';
                }
                post = document.createElement('div');
                post.className = 'contents-wrap';
                post.innerHTML = `
                <div class="exh-item-box">
                    <div class="exh-item">
                        <a class="exh-anchor" href="/` + location.pathname.split('/')[1] + `/player?exh_id=${exhibitionId[i]}">
                            <img class="icon-exhibition" src="/img/icon_exhibition.png" alt="icon_exhibition">
                            <div class="item-img-wrap">
                                <img class="exh-item-img" src="${exhibitionThumb[i]}" alt="${exhibitionName[i]}">
                            </div>
                            <p class="item-exh-title">${exhibitionName[i]}</p>
                        </a>
                        <div class="item-text-wrap">
                            <p class="item-exh-artist">
                                <span class="korean-name">${artistName[i]}</span>
                                <span class="etc-number-of-artists">${artistCountText}</span>
                            </p>
                            <div class="exh-info-wrap">
                                <span class="exh-total-artwork">${artworksCount[i]}${artwork}</span>, <span class="exh-total-time">${durationTime[i]}</span>
                            </div>
                        </div>
                    </div>
                </div>`
                container.appendChild(post);
                showArtistNameWithLan();
            }
        }
    });
    pageNumberArtStream = pageNumberArtStream + 1;
    scrolled = false;
}
//작가 모두보기
function openModalAllArtist(){
    searchedResultsCount = document.querySelector('.artist-head-count span');
    searchedType = "Artist";
    container = document.querySelector('#search_artist_all .artist-list');
    $.ajax({
        url:'/'+location.pathname.split('/')[1]+"/api/search",
        method: "POST",
        type: "json",
        data:{
            "keyword" : searchedKeyword,
            "type" : searchedType,
            "p" : pageNumberArtist,
        },
        success: function(result){
            if (result.artistId.length < 20){
                $('.loading').css('display','none');
            }
            artistId = result['artistId'];
            artistThumbnail = result['thumbnail'];
            artistNationality = result['nationality'];
            artistName = result['artistName'];
            // artistKorName = result['artistKorName'];
            // artistEngName = result['artistEngName'];
            totalCount = result['totalCount'];
            searchedResultsCount.innerText = totalCount;
            if(artistId.length < 20){
                forCount = artistId.length
            }else{
                forCount = 20;
            }
            for(let j=0; j<forCount; j++){
                // if (artistNationality[j] === '대한민국' || artistNationality[j] === '한국') {
                //     artistBracketName = '';
                // }else{
                //     artistBracketName = `(${artistEngName[j]})`;
                // }
                post = document.createElement('li');
                post.innerHTML = `
                    <a href="/` + location.pathname.split('/')[1] + `/artists/detail?artist_id=` + artistId[j] + `">
                        <ul class="artists-description">
                            <li class="artist-profile-img">
                                <img src="${artistThumbnail[j]}" alt="${artistName[j]}">
                            </li>
                            <li class="artist-profile-txt">
                                <p class="artist-name">
                                    <span class="korean-name">${artistName[j]}</span>
                                </p>
                            </li>
                        </ul>
                    </a>`
                container.appendChild(post);
                showArtistNameWithLan();
            }
        }
    });
    pageNumberArtist = pageNumberArtist + 1;
    scrolled = false;
}
//작품 모두보기
function openModalAllArtwork(){
    searchedResultsCount = document.querySelector('.artwork-count span');
    searchedType = "Artwork";
    container = document.querySelector('#search_artwork_all .exh-artworks-list');
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
            // artistKorName = result['artistKorName'];
            // artistEngName = result['artistEngName'];
            totalCount = result['totalCount'];
            searchedResultsCount.innerText = totalCount;
            if(artworkId.length < 20){
                forCount = artworkId.length
            }else{
                forCount = 20;
            }
            for(let k=0; k<forCount; k++){
                // if (artistNationality[k] === '대한민국' || artistNationality[k] === '한국') {
                //     artistBracketName = '';
                // }else{
                //     artistBracketName = `(${artistEngName[k]})`;
                // }
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
//아트스트림 모두 보기 init 함수
function initModalAllArtStream(){
    openModalAllArtStream();
    searchArtStreamAllModal.addEventListener('scroll',function(){
        scrollHeight = searchArtStreamAllModal.scrollHeight;
        scrollTop = searchArtStreamAllModal.scrollTop;
        clientHeight = searchArtStreamAllModal.clientHeight;
        if( (scrollTop + clientHeight) > (scrollHeight - 1) && !scrolled){
            scrolled = true;
            openModalAllArtStream();
        }
    });
}
//작가 모두 보기 init 함수
function initModalAllArtist() {
    openModalAllArtist();
    searchArtistAllModal.addEventListener('scroll',function(){
        scrollHeight = searchArtistAllModal.scrollHeight;
        scrollTop = searchArtistAllModal.scrollTop;
        clientHeight = searchArtistAllModal.clientHeight;
        if( (scrollTop + clientHeight) > (scrollHeight - 1) && !scrolled){
            scrolled = true;
            openModalAllArtist();
        }
    });
}
//작품 모두 보기 init 함수
async function initModalAllArtwork(){
    await openModalAllArtwork();
    await showModal('.search-artwork-all-wrap');
    searchArtworkAllModal.addEventListener('scroll',function(){
        scrollHeight = searchArtworkAllModal.scrollHeight;
        scrollTop = searchArtworkAllModal.scrollTop;
        clientHeight = searchArtworkAllModal.clientHeight;
        if( (scrollTop + clientHeight) > (scrollHeight - 1) && !scrolled){
            scrolled = true;
            openModalAllArtwork();
        }
    });
}
//=======================infinite scroll==============================
//=======================작품상세정보 함수==============================
//'등록한 작품'의 '자세히보기'버튼 클릭 했을 때 모달창 나옴
function setModal(selector){
    let artworkId = selector.children.namedItem('artwork-id').value;
    $('#share_options .art-id').val(artworkId);
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


//change header default home icon
function changeToModalHeader(selector){
    //header 보임
    document.querySelector('header').style.display="block"
    document.getElementById('btn_gnb').innerHTML = ` 
        <button type="button" id="btn_goback" class="btn-goback" onclick="closeModalSimply('${selector}');changeToCommonHeader();hideNavMenu();">
            <img src="/img/icon_go_back.png" alt="icon_go_back">
        </button>`;
    // if(document.getElementById('btn_tv_connection')){
    //     document.getElementById('btn_tv_connection').style.display = 'none';
    // }
}
//back to header default home icon
function changeToCommonHeader(){
    document.querySelector('header').style.display='none'
    // if(document.getElementById('btn_tv_connection')){
    //     document.getElementById('btn_tv_connection').style.display = 'block';
    // }
}
initSearchResult();

//border 사라짐 방지 TODO later
$('section').on('click',function(){
    $('.art-stream-main-section,.artist-list-wrap-section').css('border-bottom','1px solid #424242');
})