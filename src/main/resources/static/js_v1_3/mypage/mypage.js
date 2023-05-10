showCollectionUpdateModal();
let artworkId;
let linkToBeCopied;
//'전시하는 작품'의 '자세히보기'버튼 클릭 했을 때 모달창 나옴
function setModalData(selector){
    let artstreamUrl = serverUrl + selector.previousElementSibling.getAttribute('href').replace(/^./, "")
    let container = document.getElementById('artwork_option_box');
    let thumbnail = selector.previousElementSibling.querySelector('img').getAttribute('src');
    let title = selector.previousElementSibling.querySelector('.artwork-name').textContent;
    let artistId = selector.children.namedItem('artist-id').value;
    document.getElementById('ogImg').setAttribute('content',thumbnail);
    // document.getElementById('ogText').setAttribute('content',ogText);
    getUrl(selector); //공유할 링크 가져오기
    artworkId = selector.children.namedItem('artwork-id').value;
    const artistName = selector.previousElementSibling.querySelector('.artist-name').textContent;
    // let artistName;
    // if(selector.previousElementSibling.querySelector('.artist-english-name')){
    //     const artistEnglishName = selector.previousElementSibling.querySelector('.artist-english-name').textContent;
    //     artistName = artistKoreanName + '(' + artistEnglishName + ')';
    // }else{
    //     artistName = artistKoreanName;
    // }
    let likeImg;
    let likeText
    $.ajax({
        url: "/" + location.pathname.split('/')[1] + "/api/artwork-more?art_id=" + artworkId,
        type:"POST",
        success: function(data){
            // console.log(data);
        },
        error: function (request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error);
        },
    }).done(function (data) {
        //console.log(data)
        if (data['artworkLiked']) {
            likeImg = '/img/icon_already_like.png'
            likeText = liked
        } else {
            likeImg = '/img/icon_like.png';
            likeText = like
        }
        let loggedIn;
        document.querySelector('.loggedIn').value === 'true' ? loggedIn = 'setAddArtworkModalData('+artworkId+').then()' : loggedIn = 'NonMemberInAccessible();"';
        const content = `
        <div class="modal-gradation-box" onclick="closeModal('#artwork_option_box')"></div>
        <ul id="artwork_options" class="artwork-options">
            <li class="artwork-wrap">
                <button type="button" class="exh-artwork" onclick="showArtworkInfo(this)">
                    <img id="current_img" src="${thumbnail}" alt="${title}">
                    <input type="hidden" class="artwork-id" name="artwork-id" value="${artworkId}">
                    <ul class="artwork-txt-info">
                        <li id="current_title">${title}</li>
                        <li id="current_name">${artistName}</li>
                    </ul>
                    <img class="icon-more" src="/img/icon_more.png" alt="icon_more">
                </button>
            </li>
            <!--<li>
                <button type="button" id="btn_play" class="btn-play" onclick="location.href = '${artstreamUrl}';">
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
//=======================작품상세정보 함수==============================
//'등록한 작품'의 '자세히보기'버튼 클릭 했을 때 모달창 나옴
function setModal(selector){
    let artworkId = selector.children.namedItem('artwork-id').value;
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
        // let artistName;

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
        showArtistNameWithLan();
    })
}


//모두 보기 ========================================
let pageNumberMyCollection = 1;
let pageNumberMyExhibition = 1;
let pageNumberMyWaitingExhibition = 1;
let pageNumberMyFavoriteArtwork = 1;
let pageNumberMyFavoriteArtist = 1;
let pageNumberMyPlayedArtwork = 1;
let artworkCount;
let durationTime;
let exhibitionThumb;
let dDay;
let itemId;
let itemName;
let forCount;
let container;
let artist;
let artistId;
let artistEngName;
let artistKorName;
let artistNationality;
let artistBracketName;
let artistCount;
let artistCountText;
let artistNumberOfLikes;
let artistProfileImg;
const myCollectionAllModal = document.querySelector('#my_collection_all .art-stream-list-section');
const myExhibitionAllModal = document.querySelector('#my_exhibition_all .art-stream-list-section');
const myWaitingExhibitionAllModal = document.querySelector('#my_waiting_exhibition_all .art-stream-list-section');
const myFavoriteArtworkAllModal = document.querySelector('#my_favorite_artwork_all .artwork-list-section');
const myFavoriteArtistAllModal = document.querySelector('#my_favorite_artist_all .artist-list-section');
const myPlayedArtworkAllModal = document.querySelector('#my_played_artwork_all .artwork-list-section');
let mycollectionEnd;
//내 컬렉션 모두 보기 init 함수
function initModalAllMyCollection(){

    openModalAllMyCollection();
    myCollectionAllModal.addEventListener('scroll',function(){
        scrollHeight = myCollectionAllModal.scrollHeight;
        scrollTop = myCollectionAllModal.scrollTop;
        clientHeight = myCollectionAllModal.clientHeight;
        if( (scrollTop + clientHeight) > (scrollHeight - 1) && mycollectionEnd !== 'end'){
            openModalAllMyCollection();
        }
    });
}
//내가 저장한 전시 모두 보기 init 함수
function initModalAllMyExhibition(){
    openModalAllMyExhibition();
    myExhibitionAllModal.addEventListener('scroll',function(){
        scrollHeight = myExhibitionAllModal.scrollHeight;
        scrollTop = myExhibitionAllModal.scrollTop;
        clientHeight = myExhibitionAllModal.clientHeight;
        if( (scrollTop + clientHeight) > (scrollHeight - 1)){
            openModalAllMyExhibition();
        }
    });
}
//내가 기다리는 전시 모두 보기 init 함수
function initModalAllMyWaitingExhibition(){
    openModalAllMyWaitingExhibition();
    myWaitingExhibitionAllModal.addEventListener('scroll',function(){
        scrollHeight = myWaitingExhibitionAllModal.scrollHeight;
        scrollTop = myWaitingExhibitionAllModal.scrollTop;
        clientHeight = myWaitingExhibitionAllModal.clientHeight;
        if( (scrollTop + clientHeight) > (scrollHeight - 1)){
            openModalAllMyWaitingExhibition();
        }
    });
}
//내가 좋아하는 작품 모두 보기 init 함수
function initModalAllMyFavoriteArtwork(){
    openModalAllMyFavoriteArtwork();
    myFavoriteArtworkAllModal.addEventListener('scroll',function(){
        scrollHeight = myFavoriteArtworkAllModal.scrollHeight;
        scrollTop = myFavoriteArtworkAllModal.scrollTop;
        clientHeight = myFavoriteArtworkAllModal.clientHeight;
        if( (scrollTop + clientHeight) > (scrollHeight - 1)){
            openModalAllMyFavoriteArtwork();
        }
    });
}
//내가 좋아하는 작품 모두 보기 init 함수
function initModalAllMyFavoriteArtist(){
    openModalAllMyFavoriteArtist();
    myFavoriteArtistAllModal.addEventListener('scroll',function(){
        scrollHeight = myFavoriteArtistAllModal.scrollHeight;
        scrollTop = myFavoriteArtistAllModal.scrollTop;
        clientHeight = myFavoriteArtistAllModal.clientHeight;
        if( (scrollTop + clientHeight) > (scrollHeight - 1)){
            openModalAllMyFavoriteArtist();
        }
    });
}
//내가 감상한 작품 모두 보기 init 함수
function initModalAllMyPlayedArtwork(){
    openModalAllMyPlayedArtwork();
    myPlayedArtworkAllModal.addEventListener('scroll',function(){
        scrollHeight = myPlayedArtworkAllModal.scrollHeight;
        scrollTop = myPlayedArtworkAllModal.scrollTop;
        clientHeight = myPlayedArtworkAllModal.clientHeight;
        if( (scrollTop + clientHeight) > (scrollHeight - 1)){
            openModalAllMyPlayedArtwork();
        }
    });
}
//내컬렉션 모두 보기
function openModalAllMyCollection(){
    container = document.querySelector('#my_collection_all .item-list');
    $.ajax({
        url:"/" + location.pathname.split('/')[1] + "/api/artwork-collections",
        method: "POST",
        type: "json",
        data:{
            "page" : pageNumberMyCollection,
        },
        success: function(result){
            // console.log(result);
            if(result['id'].length !== 0) {
                artworkCount = result['artworkCount'];
                durationTime = result['durationTime'];
                exhibitionThumb = result['exhibitionThumb'];
                itemId = result['id'];
                itemName = result['name'];
                itemId.length < 20 ? forCount = itemId.length : forCount = 20;
                let time;
                for (let i = 0; i < forCount; i++) {
                    let imgTag = result['exhibitionThumb'][i] === null
                        ? `<div class="item-img-wrap null">
                                            <img class="item-img" src="/img/icon_logo_inactive.png" alt="no_artwork">
                                        </div>`
                        : `<div class="item-img-wrap">
                                            <img class="mypage-collection-icon" src="/img/icon_exhibition.png" alt="collection-icon">
                                            <img class="item-img" src="${exhibitionThumb[i]}" alt="${itemName[i]}">
                                        </div>`;
                    let aUrl = result['exhibitionThumb'][i] === null
                    ? `javascript:void(0)`
                    : `/${location.pathname.split('/')[1]}/collection-detail?col_id=${itemId[i]}`;
                    post = document.createElement('div');
                    post.className = 'contents-wrap';
                    post.innerHTML = `
                        <div class="exh-item">
                            <a class="anchor-curation" href="${aUrl}">
                                <img class="icon-exhibition" src="/img/icon_exhibition.png" alt="icon_exhibition">
                                ` +
                        imgTag
                        + `
                            </a>
                            <p class="item-exh-title">${itemName[i]}</p>
                            <div class="item-text-wrap">
                                <div class="exh-info-wrap">
                                    <span class="exh-total-artwork">${artworkCount[i]}${artwork}</span>&nbsp;·&nbsp;<span class="exh-total-time">${durationTime[i]}</span>
                                </div>
                                 <a href="/` + location.pathname.split('/')[1]  + `/collection-edit?col_id=${itemId[i]}" class="item-exh-more">${editCollection}<i class="icon-more"><img src="/img/icon_more.png" alt="icon-more"></i></a>
                            </div>
                        </div>
                    `
                    container.appendChild(post);
                }
            } else {
                mycollectionEnd = 'end';
            }
        }
    });
    pageNumberMyCollection = pageNumberMyCollection + 1;
}
//내가 저장한 전시 모두 보기
function openModalAllMyExhibition(){
    container = document.querySelector('#my_exhibition_all .item-list');
    $.ajax({
        url:"/" + location.pathname.split('/')[1] + "/api/exhibition-collections",
        method: "POST",
        type: "json",
        data:{
            "page" : pageNumberMyExhibition,
        },
        success: function(result){
            console.log(result);
            artistNationality = result['artistNationality'];
            artistName = result['artistName'];
            // artistKorName = result['artistKorName'];
            // artistEngName = result['artistEngName'];
            artistCount = result['artistCount'];
            artworkCount = result['artworkCount'];
            durationTime = result['durationTime'];
            exhibitionThumb = result['exhibitionThumb'];
            itemId = result['id'];
            itemName = result['name'];
            itemId.length < 20 ? forCount = itemId.length : forCount = 20;
            for(let i=0; i<forCount; i++){
                // if (artistNationality[i] === '대한민국' || artistNationality[i] === '한국') {
                //     artistBracketName = '';
                // }else{
                //     artistBracketName = `(${artistEngName[i]})`;
                // }
                if (artistCount[i] > 2){
                    switch(location.pathname.split('/')[1]){
                        case "ja" : artistCountText = ` ほか${artistCount[i]}名様です`; break;
                        case "ko" : artistCountText = ` 외 ${artistCount[i]}명`; break;
                        default : artistCountText =  ` and ${artistCount[i]} others`; break;
                    }
                }else{
                    artistCountText = '';
                }
                post = document.createElement('div');
                post.className = 'contents-wrap';
                post.innerHTML = `
                    <div class="exh-item">
                        <a class="anchor-curation" href="/` + location.pathname.split('/')[1]  + `/player?exh_id=${itemId[i]}">
                            <img class="icon-exhibition" src="/img/icon_exhibition.png" alt="icon_exhibition">
                        <div class="item-img-wrap">
                            <img src="${exhibitionThumb[i]}" alt="${itemName[i]}">
                        </div>
                        </a>
                        <p class="item-exh-title">${itemName[i]}</p>
                        <div class="item-text-wrap">
                            <p class="item-exh-artist">
                                <span class="korean-name">${artistName[i]}</span>
                                <span class="etc-number-of-artists">${artistCountText}</span>
                            </p>
                            <div class="exh-info-wrap">
                                <span class="exh-total-artwork">${artworkCount[i]}${artwork}</span>&nbsp;·&nbsp;<span class="exh-total-time">${durationTime[i]}</span>
                            </div>
                             
                        </div>
                </div>`
                container.appendChild(post);
                showArtistNameWithLan();
            }
        }
    });
    pageNumberMyExhibition = pageNumberMyExhibition + 1;
}
//내가 기다리는 전시 모두 보기
function openModalAllMyWaitingExhibition(){
    container = document.querySelector('#my_waiting_exhibition_all .item-list');
    $.ajax({
        url:"/" + location.pathname.split('/')[1] + "/api/waiting-all",
        method: "POST",
        type: "json",
        data:{
            "page" : pageNumberMyWaitingExhibition,
        },
        success: function(result){
            console.log(result);
            artistNationality = result['exhibitionArtistNationality'];
            artistName = result['exhibitionArtistName'];
            // artistKorName = result['exhibitionArtistKorName'];
            // artistEngName = result['exhibitionArtistEngName'];
            artistCount = result['artistCount'];
            artworkCount = result['artworksCount'];
            durationTime = result['durationTime'];
            exhibitionThumb = result['exhibitionThumb'];
            itemId = result['id'];
            exhibitionName = result['exhibitionName'];
            dDay = result['dday'];
            itemId.length < 20 ? forCount = itemId.length : forCount = 20;
            for(let i=0; i<forCount; i++){
                // if (artistNationality[i] === '대한민국' || artistNationality[i] === '한국') {
                //     artistBracketName = '';
                // }else{
                //     artistBracketName = `(${artistEngName[i]})`;
                // }
                if (artistCount[i] > 2){
                    switch(location.pathname.split('/')[1]){
                        case "ja" : artistCountText = ` ほか${artistCount[i]}名様です`; break;
                        case "ko" : artistCountText = ` 외 ${artistCount[i]}명`; break;
                        default : artistCountText =  ` and ${artistCount[i]} others`; break;
                    }
                }else{
                    artistCountText = '';
                }
                dDay[i] < 1 ? dDay[i] = 'day' : '';
                post = document.createElement('div');
                post.className = 'contents-wrap';
                if(dDay[i] == 'day'){
                    post.innerHTML = `
                    <div class="exh-item" data-url="/` + location.pathname.split('/')[1]  + `/player?exh_id=${itemId[i]}"
                 onclick='location.href=this.dataset.url'>
                        <a class="anchor-curation">
                            <div class="coming-soon-day-count">D-${dDay[i]}</div>
                            <img class="icon-exhibition" src="/img/icon_exhibition.png" alt="icon_exhibition">
                        <div class="item-img-wrap">
                            <img src="${exhibitionThumb[i]}" alt="${exhibitionName[i]}">
                        </div>
                        </a>
                        <p class="item-exh-title">${exhibitionName[i]}</p>
                        <div class="item-text-wrap">
                            <div class="item-exh-artist">
                                <div class="curation-artist">
                                    <span class="korean-name">${artistName[i]}</span>
                                    <span class="etc-number-of-artists">${artistCountText}</span>
                                </div>
                                <div class="curation-info">
                                    <span>${artworkCount[i]} ${artwork}</span> · <span>${durationTime[i]}</span>
                                </div>
                            </div>
                            <a class="collection-confirm-anchor"><span>${watchRightNow}</span></a>
                        </div>
                    </div>
                </div>`
                }else{
                    post.innerHTML = `
                    <div class="exh-item" onclick="controlComingCollection(${itemId[i]},this)">
                        <a class="anchor-curation">
                            <div class="coming-soon-day-count">D-${dDay[i]}</div>
                            <img class="icon-exhibition" src="/img/icon_exhibition.png" alt="icon_exhibition">
                        <div class="item-img-wrap">
                            <img src="${exhibitionThumb[i]}" alt="${exhibitionName[i]}">
                        </div>
                        </a>
                        <p class="item-exh-title">${exhibitionName[i]}</p>
                        <div class="item-text-wrap">
                            <div class="item-exh-artist">
                             <div class="curation-artist">
                                    <span class="korean-name">${artistName[i]}</span>
                                    <span class="etc-number-of-artists">${artistCountText}</span>
                                </div>
                                <div class="curation-info">
                                    <span>${artworkCount[i]} ${artwork}</span> · <span>${durationTime[i]}</span>
                                </div>
                            </div>
                            <a class="collection-confirm-anchor saved"><img class="coming-soon-confirm-icon" src="/img/icon_confirm_white.png" alt="confirm-icon"><span>${addedToCollection}</span></a>
                        </div>
                    </div>
                </div>`
                }

                container.appendChild(post);
                showArtistNameWithLan();
            }
        }
    });
    pageNumberMyWaitingExhibition = pageNumberMyWaitingExhibition + 1;
}
//내가 좋아하는 작품 모두 보기
function openModalAllMyFavoriteArtwork(){
    container = document.querySelector('#my_favorite_artwork_all .item-list');
    $.ajax({
        url:"/" + location.pathname.split('/')[1] + "/api/liked-artworks",
        method: "POST",
        type: "json",
        data:{
            "page" : pageNumberMyFavoriteArtwork,
        },
        success: function(result){
            console.log(result);
            artworkId = result['id'];
            artworkName = result['name'];
            artworkThumbnail = result['thumbnail'];
            artistId = result['artistId'];
            artistNationality = result['artistNationality'];
            artistName = result['artistName'];
            // artistKorName = result['artistKorName'];
            // artistEngName = result['artistEngName'];
            if(artworkId.length < 20){
                forCount = artworkId.length
            }else{
                forCount = 20;
            }
            for(let k=0; k<forCount; k++){
                post = document.createElement('li');
                // if (artistNationality[k] === '대한민국' || artistNationality[k] === '한국') {
                //     artistBracketName = '';
                // }else{
                //     artistBracketName = `(${artistEngName[k]})`;
                // }
                post.innerHTML = `
                    <a href="/` + location.pathname.split('/')[1]  + `/player?art_id=` + artworkId[k] + `" class="exh-artwork" onclick="showArtworkInfo(this)">
                        <div class="exh-artwork-img-wrap">
                            <img src="${artworkThumbnail[k]}" alt="${artworkName[k]}">
                        </div>
                        <ul class="artwork-txt-info">
                            <li class="artwork-name">
                                ${artworkName[k]}
                            </li>
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
    pageNumberMyFavoriteArtwork = pageNumberMyFavoriteArtwork + 1;
}
//내가 팬맺은 작가 모두 보기
function openModalAllMyFavoriteArtist(){
    container = document.querySelector('#my_favorite_artist_all .item-list');
    $.ajax({
        url:"/" + location.pathname.split('/')[1] + "/api/liked-artists",
        method: "POST",
        type: "json",
        data:{
            "page" : pageNumberMyFavoriteArtist,
        },
        success: function(result){
            // console.log(result);
            artistId = result['id'];
            // artistEngName = result['engName'];
            // artistKorName = result['korName'];
            artistName = result['name'];
            artistNationality = result['nationality'];
            artistNumberOfLikes = result['numberOfLikes'];
            artistProfileImg = result['profileImg'];
            let artist = [];
            if(artistId.length < 20){
                forCount = artistId.length
            }else{
                forCount = 20;
            }
            for(let j=0; j<forCount; j++){
                // if(artistNationality[j] != '대한민국' || artistNationality[j] != '한국' ){
                //     artist[j] = artistKorName[j] + '(' + artistEngName[j] + ')';
                // }else{
                //     artist[j] = artistKorName[j];
                // }
                post = document.createElement('li');
                post.innerHTML = `
                    <a href="/` + location.pathname.split('/')[1]  + `/artists/detail?artist_id=` + artistId[j] + `">
                        <ul class="artists-description">
                            <li class="artist-profile-img">
                                <img src="${artistProfileImg[j]}" alt="${artistName[j]}">
                            </li>
                            <li class="artist-profile-txt">
                                <p class="artist-name">${artistName[j]}</p>
                            </li>
                        </ul>
                    </a>`
                container.appendChild(post);
            }
        }
    });
    pageNumberMyFavoriteArtist = pageNumberMyFavoriteArtist + 1;
}

//내가 감상한 작품 모두 보기
function openModalAllMyPlayedArtwork(){
    container = document.querySelector('#my_played_artwork_all .item-list');
    $.ajax({
        url:"/" + location.pathname.split('/')[1] + "/api/last-seen-artworks",
        method: "POST",
        type: "json",
        data:{
            "page" : pageNumberMyPlayedArtwork,
        },
        success: function(result){
            artistNationality = result['artistNationality'];
            artistName = result['artistName'];
            // artistKorName = result['artistKorName'];
            // artistEngName = result['artistEngName'];
            artworkId = result['id'];
            artworkName = result['name'];
            artworkThumbnail = result['thumbnail'];
            artistId = result['artistId'];
            if(artworkId.length < 20){
                forCount = artworkId.length
            }else{
                forCount = 20;
            }
            for(let k=0; k<forCount; k++){
                post = document.createElement('li');
                // if (artistNationality[k] === '대한민국' || artistNationality[k] === '한국') {
                //     artistBracketName = '';
                // }else{
                //     artistBracketName = `(${artistEngName[k]})`;
                // }
                post.innerHTML = `
                    <a href="/` + location.pathname.split('/')[1]  + `/player?art_id=` + artworkId[k] + `" class="exh-artwork" onclick="showArtworkInfo(this)">
                        <div class="exh-artwork-img-wrap">
                            <img src="${artworkThumbnail[k]}" alt="${artworkName[k]}">
                        </div>
                        <ul class="artwork-txt-info">
                            <li class="artwork-name">
                               ${artworkName[k]}
                            </li>
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
    pageNumberMyPlayedArtwork = pageNumberMyPlayedArtwork + 1;
}

