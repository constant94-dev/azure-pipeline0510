// $('a, button, input').on('focus',function(){
//     $(this).css('border','3px solid pink')
// })

//pwa <!-- 서비스 워커를 등록 -->
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
        });
}


$(document).ready(function(){
    if($('.owl-carousel').length > 0){
        $(".owl-carousel").owlCarousel({
            loop:false,
            items:2,
            autoWidth:true,
            margin:12,
            nav:true
        });
    }
});

$('*').on('click',function (e){
    if(e.target.tagName !== 'INPUT'){
        document.querySelectorAll('input').forEach(x=>x.blur());
    }
});

const navDropDown = document.getElementById("nav_dropdown");
const btnGoBack = document.getElementById("btn_goback");
if(navDropDown !== null && btnGoBack !== null){
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === "style") {
                if (navDropDown.style.display === "none") {
                    btnGoBack.style.opacity = "1";
                } else {
                    btnGoBack.style.opacity = "0";
                }
            }
        });
    });
    observer.observe(navDropDown, { attributes: true });
}

// let connect = '';

//TODO 배포전 체크사항
// let serverType = 'server';
// let serverType = 'local';
//****************************************************************************************************************//
// let serverLang = sessionStorage.getItem('language');
let sessionForCollection = sessionStorage.getItem('sessionForCollection');
let serverUrl = 'https://'+location.host+'/';
// serverType === 'local' ? serverUrl = 'https://localhost:8081/' : serverUrl = 'https://patron.digital/';
let url = "/" + location.pathname.split('/').pop();

let playToggleBoolean=true;
let scrollModalBoolean = true;

//logout
function logoutAndPopup() {
    toastPopup('normal', logoutJs)
    setTimeout(function(){logout();},500);
}

//버튼 활성화
const activateBtn = (self,btn) => {
    colorToBlue(self.value.length > 2, btn);
}

// 버튼 파랗게 색칠함수
function colorToBlue(input, target){
    console.log(input)
    if(input){
        document.getElementById(target).classList.add('blue');
        document.getElementById(target).disabled = false;
    } else {
        document.getElementById(target).classList.remove('blue');
        document.getElementById(target).disabled = true;
    }
}

let currentScrollTopPosition;
let lastScrollY
// 모달 뒤 스크롤 막는 함수
function scrollEventPrevent(){
    document.querySelector('main').style.position = '';
    document.querySelector('main').style.top = '';
    window.scrollTo(0, lastScrollY);
}

function preventsScroll(){
    let scrollArea = document.querySelector('body');
    currentScrollTopPosition = window.scrollY;
    if(scrollArea.classList.contains('scrollHidden')){
        //모달 숨김
        scrollArea.classList.remove('scrollHidden')
        document.removeEventListener('scroll',scrollEventPrevent,true);
        scrollModalBoolean = true;
    } else {
        //모달 뜸
        scrollArea.classList.add('scrollHidden')
        lastScrollY = window.scrollY;
        document.addEventListener('scroll',scrollEventPrevent,true);
        scrollModalBoolean = false;
    }
}


//============ TV input 3글자 당 띄어쓰기 주기============
function giveAutoSpaceCode(selector){
    selector.value = autoSpaceCode(selector.value);
}
function autoSpaceCode(str){
    str = str.toString().replace(/[^0-9]/g, '');
    var tmp = '';
    if( str.length < 4){
        return str;
    }else if(str.length < 7){
        tmp += str.substr(0, 3);
        tmp += ' ';
        tmp += str.substr(3);
        // console.log(tmp)
        return tmp;
    }else if(str.length < 11){
        tmp += str.substr(0, 3);
        tmp += ' ';
        tmp += str.substr(3, 3);
        tmp += ' ';
        tmp += str.substr(6);
        return tmp;
    }else{
        tmp += str.substr(0, 3);
        tmp += ' ';
        tmp += str.substr(3, 4);
        tmp += ' ';
        tmp += str.substr(7);
        return tmp;
    }
    return str;
}


//session 관련 함수
let urlHref = location.href;
if(url === '/search-result' || url==='/search'|| url==='/search-noresult'|| url==='/'|| url==='/login' || url==='/login-success' || url==='/password-find' || url==='/signup' ){
    // let pastUrl = sessionStorage.getItem('pastUrl');
}else {
    Cookies.set('pastUrl', urlHref);
}
//input type="number" 글자수 제한
const numMaxLength = (self) => {
    self.value.length > self.max ? self.value = self.value.slice(0, self.max) : '';
}
//'취소' 버튼 눌렀을 때 검색 진입 바로 전 페이지로 이동
function goPastPage(){
    const pastUrl = Cookies.get('pastUrl');
    if(pastUrl===null){
        console.log("HELLO IM HERE")
        location.href = '/' + location.pathname.split('/')[1] + '/home';
    }else{
        location.href = pastUrl;
    }
}
//============== modal 열고 닫기 ================
//모달(슬라이드) 열기
const slideModalOpen = (name) => {
    document.querySelector('.'+name).style.cssText = `display: block;`;
    setTimeout(()=>{document.querySelector('.'+name).classList.add('active');},10);
}
//모달(슬라이드) 닫기
const slideModalClose = () => {
    let modals = document.querySelectorAll('.modal-content');
    modals.forEach(el => el.classList.remove('active'));
    setTimeout(()=>{ modals.forEach(el => el.style.cssText = `display: none`);},300);
}
//모달 열기
const modalOpen = (name) => {
    // 스크롤 막기
    window.addEventListener('scroll',function (){
        document.querySelector('body').scrollTo(0, 0);
    })
    document.querySelector('.'+name).style.cssText = `display: block;`;
}
//모달 닫기
function modalClose(){
    let modals = document.querySelectorAll('.modal-content');
    modals.forEach(el => el.style.cssText = `display: none`);
    if(!scrollModalBoolean){
        preventsScroll();
    }
}
//팝업 모달 열고닫기
const modalPopup = (name) => {
    let modal = document.querySelector('.'+name);
    setTimeout(()=>{modal.classList.add('active');},10);
    setTimeout(()=>{modal.classList.remove('active');},3000);
}
let modalStyleAddTimer;
let modalStyleRemoveTimer;
let modalRemoveTimer;
//작품 좋아요 토스트 팝업
const toastPopup = (type,message) => {
    clearTimeout(modalStyleAddTimer);
    clearTimeout(modalStyleRemoveTimer);
    clearTimeout(modalRemoveTimer);

    if(document.getElementById('toast_popup')){
        document.getElementById('toast_popup').remove();
    }

    let divEle = document.createElement('div');
    let divModal = document.createElement('div');
    divEle.setAttribute('id','toast_popup');
    divModal.setAttribute('class','modal-box');
    divEle.append(divModal);

    switch (type){
        case 'normal':
            divModal.innerText = message;
            break;
        case 'success':
            divModal.classList.add('green')
            divModal.innerText = message;
            break;
        case 'error':
            divModal.classList.add('modal-error');
            divModal.innerText = message;
            break;
    }

    document.querySelector('main').append(divEle);
    modalStyleAddTimer = setTimeout(()=>{divModal.classList.add('active');},20);
    modalStyleRemoveTimer = setTimeout(()=>{divModal.classList.remove('active');},3000);
    modalRemoveTimer = setTimeout(()=>{document.getElementById('toast_popup').remove();},3200);

}

//모달 애니메이션
function showModal(selector){
    toggleCheckArray = [];
    if(document.querySelector(selector).classList.contains('going-down')){
        //이미 모달 떠있음
    } else {
        const targetModal = document.querySelector(selector);
        targetModal.classList.add('going-up');
        targetModal.style.display = 'block';
        targetModal.style.top = '0';
        setTimeout(function(){
            targetModal.classList.remove('going-up');
        },1000)
    }
    if(scrollModalBoolean){
        preventsScroll();
    }
}
function closeModal(selector) {
    const targetModal = document.querySelector(selector);
    targetModal.classList.add('going-down');
    targetModal.style.top = '100vh';
    setTimeout(function () {
        targetModal.style.display = 'none';
        targetModal.classList.remove('going-down');
    }, 1000)
    if(!scrollModalBoolean){
        preventsScroll();
    }
}
//Wrap 모달 닫는 함수
function closeWrap(selector){
    let btn = selector;
    let wrap = btn.closest('div.wrap');
    wrap.style.display = 'none';
    if(!scrollModalBoolean){
        preventsScroll();
    }
}

//그냥 닫는 모달
function closeModalSimply(selector){
    $('.loading').css('display','block');
    const targetModal = document.querySelector(selector);
    targetModal.style.display = 'none';
    if(!scrollModalBoolean){
        preventsScroll();
    }
}
function showModalSimply(selector){
    const targetModal = document.querySelector(selector);
    targetModal.style.display = 'block';
    if(scrollModalBoolean){
        preventsScroll();
    }
}
//로그아웃
const logout = () => {
    $.ajax ({
        url: "/logout",
        method: "POST",
        type: "json",
        data: {
        },
        success: function(){
            //비밀번호가 맞으면 새 비밀번호 입력창으로 이동
            location.href = '/' + location.pathname.split('/')[1] + '/home';
        },
        error: function (request) {
            // console.log(request)
            //비밀번호가 틀리면 에러팝업
        }
    })
}

//비밀번호 보기/숨기기
const pwShowToggle = (input) => {
    let pw = document.getElementById(input);
    if(pw.getAttribute('type') === 'password'){
        pw.setAttribute('type','text');
        document.getElementById('btn_pw_show').setAttribute('src','/img/icon_show.png');
        // document.querySelector('.btn-pw-show').style.color = '#2841fa';
        // document.querySelector('.check-blue').style.display = 'block';
    } else {
        pw.setAttribute('type','password');
        document.getElementById('btn_pw_show').setAttribute('src','/img/icon_blind.png');
        // document.querySelector('.btn-pw-show').style.color = '#707070';
        // document.querySelector('.check-blue').style.display = 'none';
    }
}

//모달 나왔을 때 뒷 배경 스크롤 금지
function preventScroll(boolean){
    const body = document.querySelector('body');
    if(boolean){
        body.style.overflowY = 'hidden';
    }else{
        body.style.overflowY = 'scroll';
    }
}

//'컬렉션 담기'버튼 클릭 했을 때 모달창 나옴
let collectionIdArray = []; //작품 id 받는 배열
async function setAddArtworkModalData(art_id){

    artworkId = art_id;
    let alreadyInCollection;
    let alreadyInRecentCollection;
    let collectionIds;
    let collectionNames;
    let recentCollectionIds;
    let recentCollectionNames;
    let response = null;
    await $.ajax({
        url:"/api/add-to-collection-detail?art_id="+art_id,
        method: "post",
        data:{},
        success:function (result){
            alreadyInCollection = result['alreadyInCollection'];
            alreadyInRecentCollection = result['alreadyInRecentCollection'];
            collectionIds = result['collectionIds'];
            collectionNames = result['collectionNames'];
            recentCollectionIds = result['recentCollectionIds'];
            recentCollectionNames = result['recentCollectionNames'];
            if( result === -2 ){
                response = result
            }
        }
    })
    if( response !== null ){
        NonMemberInAccessible();
    } else {
        collectionIdArray = collectionIds;
        let container = document.getElementById('collection_addition_modal');
        let latestUsedCollection = '',allCollection = '',li,title,contain,id;
        //최근 사용한 컬렉션 리스트 태그
        for(let i=0; i<recentCollectionIds.length; i++){
            id = recentCollectionIds[i];
            title = recentCollectionNames[i];
            contain = alreadyInRecentCollection[i];
            //컬렉션이 작품을 포함했을 때 true 포함하지 않았을 때 false
            contain === false
                ? li = `<li class="collection-li" data-id="${id}">
            <button onclick="toggleCheckUI(this);toggleCheckArrayFunction(\'${title}\')">
                <p class="collection-name">${title}</p>
                <img class="btn-img" src="/img/icon_check_inactive2.png" alt="icon_check_inactive">
            </button>
        </li>`
                : li = `<li style="opacity: 0.4">
            <button onclick="" disabled>
                <p class="collection-name">${title}</p>
                <img class="btn-img" src="/img/icon_check_inactive2.png" alt="icon_check_inactive">
            </button>
        </li>`
            latestUsedCollection = latestUsedCollection + li;
        }
        //모든 컬렉션 리스트 태그
        for(let j=0; j<collectionIds.length; j++){
            id = collectionIds[j];
            title = collectionNames[j];
            contain = alreadyInCollection[j];
            //컬렉션이 작품을 포함했을 때 true 포함하지 않았을 때 false
            contain === false
                ? li = `<li class="collection-li" data-id="${id}">
                    <button onclick="toggleCheckUI(this);toggleCheckArrayFunction(\'${title}\')">
                        <p class="collection-name">${title}</p>
                        <img class="btn-img" src="/img/icon_check_inactive2.png" alt="icon_check_inactive">
                    </button>
                </li>`
                : li = `<li style="opacity: 0.4">
                    <button onclick="" disabled>
                        <p class="collection-name">${title}</p>
                        <img class="btn-img" src="/img/icon_check_inactive2.png" alt="icon_check_inactive">
                    </button>
                </li>`
            allCollection = allCollection + li;
        }
        //최근 사용한 컬렉션이 있었을 때의 태그
        let latestUsedCollectionListTags = `<p class="subtitle">${recentlyUsed}</p><ul class="collection-list">${latestUsedCollection}</ul>`
        //최근 사용한 컬렉션이 없을 때의 태그 (기본 사용자 컬렉션만 존재)
        let userOwnCollectionTags =
            `<ul class="collection-list">
                <li class="user-own-collection">
                    <button onclick="toggleCheckUI(this);toggleCheckArrayFunction(\'${collectionNames[0]}\')">
                        <p class="collection-name">${collectionNames[0]}</p>
                        <img class="btn-img" src="/img/icon_check_inactive2.png" alt="icon_check_inactive">
                    </button>
                </li>
            </ul>`
        //모달 안에 들어갈 태그들
        let selectedArtworkThumbnail = document.getElementById('current_img').getAttribute('src');
        let selectedArtworkTitle = document.getElementById('current_title').innerText;
        let selectedArtworkArtist = document.getElementById('current_name').innerText;
        let content = `
    <section class="collection-add-section">
        <div class="fixed-part" id="fixed_part">
            <button class="btn-close" id="btn_close" onclick="closeModalSimply('#collection_addition_modal'); closeModal('#artwork_option_box')">
                <span>${cancel}</span>
            </button>
            <h1>${addToCollection}</h1>
            <div class="main-title">
                <ul>
                    <li>
                        <img src="${selectedArtworkThumbnail}" alt="${selectedArtworkTitle}">
                    </li>
                    <li>
                        <p class="artwork-title">${selectedArtworkTitle}</p>
                        <p class="artwork-artist">${selectedArtworkArtist}</p>
                    </li>
                </ul>
            </div>
        </div>
        <div class="relative-part" id="relative_part">
            ${alreadyInRecentCollection ? latestUsedCollectionListTags : ""}
            <p class="subtitle">${allCollections}</p>
            <ul class="collection-list">${allCollection}</ul>

        </div>
        <div class="add-collection-modal-gradient"> 
        </div>
        <button class="btn-add-artworks disable" id="btn_add_artworks" onclick="addArtworkToCollection(); closeModalSimply('#collection_addition_modal'); closeModal('#artwork_option_box')" disabled>
                <span>${save}</span>
            </button>
    </section>`
        container.innerHTML = content;

        // ui 개선
        const targetModal = document.querySelector(".collection-addition-modal");
        targetModal.style.display = 'block';
        targetModal.classList.add('going-up');
        targetModal.style.top = '0';
        setTimeout(function(){
            targetModal.classList.remove('going-up');
        },1000)
    }
}
function goToNewCollectionPage(){
    closeModalSimply('#collection_addition_modal');
    closeModal('#artwork_option_box');
    location.href="/" + location.pathname.split('/')[1] + "/collection-new"
}
//컬렉션에 작품추가 추가
//TODO Clare 작품 추가 안되고 있음
function addArtworkToCollection(){
    let selectedCollection;
    for(let i=0; i<toggleCheckArray.length;i++){
        selectedCollection = toggleCheckArray[i];
        $.ajax({
                url:"/api/collection/artwork",
                method:"post",
                data:{
                    "art_id" : artworkId,
                    "col_name" : selectedCollection,
                    "add_art" : true,
                },
                success:function (result){
                    // console.log(result)
                    toastPopup('success',exhibitionSaved);
                }
            }
        )
    }
}

//컬렉션 담기 버튼 UI 변경 (한 컬렉션을 선택했을 경우 같은 컬렉션 동시선택 되기)
function toggleCheckUI(selector){
    let target = selector;
    let targetId = target.parentElement.dataset.id;
    //클릭한 작품의 id가 collectionIdArray에 있으면 넣고, 없으면 넣지않는다
    collectionIdArray.includes(targetId) ? collectionIdArray = collectionIdArray.filter((element) => element !== targetId) : collectionIdArray.push(targetId);
    //컬렉션 리스트를 전부 불러온다
    let collectionLists = document.querySelectorAll('.collection-li');
    let eachLiData;
    let img;
    for(let i=0; i<collectionLists.length; i++){
        eachLiData = collectionLists[i].dataset.id; //해당 작품의 id
        img = collectionLists[i].querySelector('.btn-img');
        //collectionIdArray에 들어있으면 active img, 그렇지 않으면 inactive img
        if(collectionIdArray.includes(eachLiData)){
            img.setAttribute('src','/img/icon_check_active1.png');
            img.setAttribute('alt','icon_check_active');
        }else{
            img.setAttribute('src','/img/icon_check_inactive2.png');
            img.setAttribute('alt','icon_check_inactive');
        }
    }
}
let toggleCheckArray = [];
function toggleCheckArrayFunction(title){
    if(toggleCheckArray.includes(title)){
        toggleCheckArray = toggleCheckArray.filter((function(item) {
            return item !== title;
        }));
    } else {
        toggleCheckArray.push(title);
    }
    if(document.getElementById('btn_add_artworks')){
        if(toggleCheckArray.length === 0){
            document.getElementById('btn_add_artworks').disabled = true;
            document.getElementById('btn_add_artworks').classList.add('disable');
        }else{
            document.getElementById('btn_add_artworks').disabled = false;
            document.getElementById('btn_add_artworks').classList.remove('disable');
        }
    }
}

//이메일 링크복사
function copyToClipboard(link) {
    toastPopup('normal',copied);
    const temporaryTag = document.createElement("textarea");
    document.body.appendChild(temporaryTag);
    temporaryTag.value = link;
    temporaryTag.select();
    document.execCommand('copy');
    document.body.removeChild(temporaryTag);
}
//현재 주소 링크복사
function copyHrefToClipboard() {
    let temporaryTag = document.createElement("textarea");
    document.body.appendChild(temporaryTag);
    temporaryTag.value = document.location.href;
    temporaryTag.select();
    document.execCommand('copy');
    document.body.removeChild(temporaryTag);
}
//현재 주소 링크복사
function copyHref() {
    copyHrefToClipboard();
    toastPopup('success',linkCopied);
}

let toggleSaveSwitch;
//전시 저장 버튼 UI 변경
async function toggleSaveUI(selector){
    let exhibition_id = document.getElementById('exhibition_id').innerText;
    const target = selector;
    const img = target.children[0];
    const span = target.children[1];
    if(span.innerText === saveExhibition){
        await likeExhibitionToggle(exhibition_id,true)
        if(toggleSaveSwitch){
            img.setAttribute('src','/img/icon_already_save_collection.png');
            span.innerText = alreadySaved;
            document.querySelector('.btn-save-exhibition') !== null ? document.querySelector('.btn-save-exhibition img').setAttribute('src','/img/icon_already_save_collection.png') : "";
            document.querySelector('.btn-save-exhibition') !== null ? document.querySelector('.btn-save-exhibition span').innerText =  alreadySaved : "";
        }
    }else{
        await likeExhibitionToggle(exhibition_id,false)
        if(toggleSaveSwitch){
            img.setAttribute('src','/img/icon_save_exhibition.png');
            span.innerText = saveExhibition;
            document.querySelector('.btn-save-exhibition') !== null ? document.querySelector('.btn-save-exhibition img').setAttribute('src','/img/icon_save_exhibition.png')  : "";
            document.querySelector('.btn-save-exhibition') !== null ? document.querySelector('.btn-save-exhibition span').innerText = saveExhibition  : "";
        }
    }
}
//전시 저장
const likeExhibitionToggle = async (exh_id, add_exh) => {
    await $.ajax({
        url:"/api/collection/exhibition",
        method:"post",
        data:{
            exh_id : exh_id,
            add_exh : add_exh,
        },
        success:function (result){
            if(result === 1){
                toastPopup('success',exhibitionSaved);
                toggleSaveSwitch = true;
            } else if(result === 2){
                toastPopup('success',exhibitionRemoved);
                toggleSaveSwitch = true;
            } else if(result === -2){
                NonMemberInAccessible();
                toggleSaveSwitch = false;
            }
        }
    })
}
let toggleLikeSwitch
//좋아요 버튼 UI 변경
async function toggleLikeUI(selector){
    let artworkId;
    let target = selector;
    if(page === 'curationPlayer' || page === 'artwork'){
        artworkId = selector.querySelector('.artwork-id').value;
    }else{
        artworkId = document.querySelector('.artwork-id').value;
    }
    let img = target.children[0];
    let span = target.children[1];
    if(span.innerText === like){
        await likeArtworkToggle(artworkId,true)
        if(toggleLikeSwitch){
            img.setAttribute('src','/img/icon_already_like.png');
            span.innerText = liked;
        }
    }else{
        await likeArtworkToggle(artworkId,false)
        if(toggleLikeSwitch){
            img.setAttribute('src','/img/icon_like.png');
            span.innerText = like;
        }
    }
}

//작품 좋아요
const likeArtworkToggle = async (artworkId, like) => {
    console.log('좋아요 apie됨')
    console.log(artworkId, like)
    await $.ajax({
        url:"/api/like-artwork",
        method:"post",
        data:{
            art_id : artworkId,
            like : like,
        },
        success:function (result){
            if(result === 1){
                //좋아요
                toastPopup('success',likeExhibition);
                toggleLikeSwitch = true;
            } else if(result === 2){
                //좋아요 취소
                toastPopup('normal',unlikeExhibition);
                toggleLikeSwitch = true;
            } else if(result === -2){
                NonMemberInAccessible();
                toggleLikeSwitch = false;
            }
        }
    })
}

//회원 탈퇴하기
const deleteAccount = () => {
    let type = document.getElementById('selected_value').textContent;
    let reason = document.getElementById('left_textarea').textContent;

    $.ajax({
        url:"/api/delete-account",
        method:"post",
        data:{
            type : type,
            reason : reason,
        },
        success:function (result){
            if(result === 1){
                toastPopup('success',accountDeleted);
                logout();
                window.location.href = '/' + location.pathname.split('/')[1] + '/home';
            }
        }
    })
}

//로그인이 필요합니다 모달 생성
const NonMemberInAccessible = () => {
    if(scrollModalBoolean){
        preventsScroll();
    }
    let divEle = document.createElement('div');
    divEle.setAttribute('class','modal-login-required');
    document.querySelector('main').append(divEle);
    let html = `<div class="modal-content modal-signup">
                    <div class="modal-area">
                        <p class="modal-title">
                            <span class="modal-title-top">${joinPatron}</span>
                            <span class="modal-title-bottom">${needToLogin}</span>
                        </p>
                        <button type="button" id="btn_login_signup" class="btn btn-login-signup" onclick="checkGAEvent('modal_signup');goToSignUpPage('${location.pathname.split("/")[1]}')">${signup}</button>
                        <button type="button" class="btn-cancel" onclick="checkGAEvent('modal_signup_cancel');modalClose(); NonMemberInAccessibleDelete();">${cancel}</button>
                    </div>
                </div>`
    document.querySelector('.modal-login-required').innerHTML = html;
}

//로그인이 필요합니다 모달 삭제
const NonMemberInAccessibleDelete = () => {
    document.querySelector('.modal-login-required') != null ? document.querySelector('.modal-login-required').remove() : null;
}

//연결된 TV에서 로그아웃
const alreadyLoginTvLogout = () => {
    //tv에서 로그아웃 통신
    $.ajax ({
        url: "/api/logoutTv",
        method: "get",
        success: function(data){
            //로그아웃 성공시 이전페이지로 이동 및 success 토스트 팝업 출력
            toastPopup('success',logoutFromTvSuccess);
            modalClose();
        },
        error: function (request) {
            //비밀번호가 틀리면 에러팝업
            toastPopup('error',logoutFromTvFail);
            location.reload();
        }
    })
}
//연결된 TV에서 로그아웃
const logoutTv = () => {
    //tv에서 로그아웃 통신
    $.ajax ({
        url: "/api/logoutTv",
        method: "get",
        success: function(data){
            //로그아웃 성공시 이전페이지로 이동 및 success 토스트 팝업 출력
            location.href = '/' + location.pathname.split('/')[1] + '/mypage/setting';
        },
        error: function (request) {
            //비밀번호가 틀리면 에러팝업
            toastPopup('error',logoutFromTvFail);
        }
    })
}
//(인풋관련) x버튼 눌렀을 때 검색 중이던 것 없애는 함수
function eraseTxt(selector){
    const target = document.querySelector(selector)
    target.value = '';
}
function goFocus(selector){
    const target = document.querySelector(selector);
    target.focus();
}

function changeText(selector, selector2){
    const targetSelector = document.querySelector(selector);
    const textToChange = selector2.textContent;
    targetSelector.textContent = textToChange;
}

//공유하기
//플레이어가 있는 페이지 (썸네일을 클릭하면 현재 재생중인 작품이 변하는 경우)
function getPlayerUrl(selector){
    let linkToBeCopied = selector.parentElement.querySelector('.shared-link').getAttribute('href');
    let domain = location.href.split('/')[2];
    linkToBeCopied = 'https://' + domain + linkToBeCopied;
    let linkPasteButton = document.getElementById('btn_copy_link');
    let twitterButton = document.getElementById('btn_share_twitter');
    let kakaoButton = document.getElementById('btn_share_kakaotalk');
    let facebookButton = document.getElementById('btn_share_facebook');
    twitterButton.setAttribute('value',linkToBeCopied);
    kakaoButton.setAttribute('value',linkToBeCopied);
    facebookButton.setAttribute('value',linkToBeCopied);
    linkPasteButton.addEventListener('click',function(){copyToClipboard(linkToBeCopied)});
}
//플레이어가 없는 페이지 (썸네일을 클릭하면 바로 artstream detail로 넘어가는 경우)
function getUrl(selector){
    let linkToBeCopied = selector.previousElementSibling.getAttribute('href');
    let domain = location.href.split('/')[2];
    linkToBeCopied = 'https://' + domain + linkToBeCopied;
    let linkPasteButton = document.getElementById('btn_copy_link');
    let twitterButton = document.getElementById('btn_share_twitter');
    let kakaoButton = document.getElementById('btn_share_kakaotalk');
    let facebookButton = document.getElementById('btn_share_facebook');
    twitterButton.setAttribute('value',linkToBeCopied);
    kakaoButton.setAttribute('value',linkToBeCopied);
    facebookButton.setAttribute('value',linkToBeCopied);
    linkPasteButton.addEventListener('click',function(){copyToClipboard(linkToBeCopied)});
}
//location href를 공유해야하는 경우(취향을 공유할래요)
function putThisPageUrlToDataAttr(){
    let linkToBeCopied = location.href;
    let linkPasteButton = document.getElementById('btn_copy_link');
    let twitterButton = document.getElementById('btn_share_twitter');
    let kakaoButton = document.getElementById('btn_share_kakaotalk');
    let facebookButton = document.getElementById('btn_share_facebook');
    twitterButton.setAttribute('value',linkToBeCopied);
    kakaoButton.setAttribute('value',linkToBeCopied);
    facebookButton.setAttribute('value',linkToBeCopied);
    linkPasteButton.addEventListener('click',function(){copyToClipboard(linkToBeCopied)});
    let thumbnail = document.querySelector('#exh_artworks_list .exh-artworks-list li:nth-of-type(1) .exh-artwork-img-wrap img').getAttribute('src');
    document.getElementById('ogImg').setAttribute('content',thumbnail);
}
function shareTwitter() {
    var sendText = shareText; // 전달할 텍스트
    //이미지 타이틀 설명
    let sendUrl = document.getElementById('btn_share_twitter').getAttribute('value');
    sendUrl = encodeURIComponent(sendUrl);
    window.open("https://twitter.com/intent/tweet?text=" + sendText + "&url=" + sendUrl);
}
function shareFacebook(){
    let sendUrl = document.getElementById('btn_share_facebook').getAttribute('value');
    sendUrl = encodeURIComponent(sendUrl);
    // var sendUrl = 'http://patrontestnodamen.kro.kr/player?exh_id=12'+"%26para=1_Rasing_Mountain/HD"; // 전달할 URL
    window.open("http://www.facebook.com/sharer/sharer.php?u=" + sendUrl);
}
function shareKakaoTalk(){
    let description = document.getElementById('ogText').getAttribute('content');
    let imageUrl = document.getElementById('ogImg').getAttribute('content');
    let link = document.getElementById('btn_share_kakaotalk').getAttribute('value');
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: shareText,
            description: description,
            imageUrl: imageUrl,
            link: {
                webUrl: link,
                mobileWebUrl: link,
                androidExecutionParams: 'patron',
            },
        },
        buttons: [
            {
                title: goToWeb,
                link: {
                    webUrl: link,
                    mobileWebUrl: link,
                },
            },
        ]
    });
}
function sharedItem(kind, selector){
    switch (kind){
        case 'exh' :
            $.ajax({
                url:'/api/share/exhibition',
                method: "POST",
                dataType: "json",
                data: {
                    exh_id : selector.querySelector('.exh-id').value
                },
                success: function(data){
                },
                error:function(error){
                    console.log('error', error)
                }
            })
            break;
        case 'art' :
            $.ajax({
                url:'/api/share/artwork',
                method: "POST",
                dataType: "json",
                data: {
                    art_id : selector.querySelector('.art-id').value
                },
                success: function(data){
                },
                error:function(error){
                    console.log('error', error)
                }
            })
            break;
        case 'artist' :
            $.ajax({
                url:'/api/share/artist',
                method: "POST",
                dataType: "json",
                data: {
                    artist_id : selector.querySelector('.artist-id').value
                },
                success: function(data){
                },
                error:function(error){
                    console.log('error', error)
                }
            })
            break;
    }

}

//top위치 변경하는 함수
function changeTop(selector, px){
    let container = document.querySelector(selector);
    container.style.top = px + 'px';
}

let moveTop = () => {
    document.querySelector('html').scrollTop = 0;
}

//기다리는 전시 추가하기
function controlComingCollection(exh_id, selector){
    let target;
    // if(location.pathname==='/' + location.pathname.split('/')[1] + '/mypage'){
    //     target = selector.querySelector('.collection-confirm-anchor');
    // }else{
        target = selector.querySelector('.more-contents-anchor');
    // }

    $.ajax({
        url:"/api/waiting?exh_id="+exh_id,
        method:"post",
        data:{
        },
        success:function (result){
            console.log(result)
            switch (result){
                case 1:
                    //GA
                    checkGAEvent('home_save_coming_curation');
                    toastPopup('success',addedToWaitingExhibition)
                    target.style.backgroundColor = '#1F1F1F';
                    target.innerHTML = `<img class="coming-soon-confirm-icon" src="/img/icon_confirm_white.png" alt="confirm-icon">
                    <span>${addedToCollection}</span>`
                    break
                case 2:
                    toastPopup('normal',removedFromWaitingExhibition)
                    target.innerHTML = `<span>${wantToWatchExhibition}</span>`
                    break
            }
        }
    })
}


// giveNameSpace('.artist-english-name');

//websocket ================================================================
// $.ajax ({
//     url: "/api/socket-deviceName",
//     method: "GET",
//     success: function (data) {
//         if(data !== '' && data !== "undefined"){
//             connect = data;
//             // if(location.pathname === '/mypage/connect/tv'){
//             //     document.querySelector('#disconnect_modal_container .modal-disconnect').innerHTML =
//             //         `
//             //         <div class="modal-area">
//             //             <p class="modal-title">
//             //                 이미 연결중인 TV가 있습니다.<br>
//             //                 연결 해제 후 계속하시겠습니까?</p>
//             //             <div>
//             //                 <p class="modal-guide">연결된 TV</p>
//             //                 <p class="tv-model">LG 2021 OLED 0711</p>
//             //             </div>
//             //             <button type="button" id="btn_disconnect" class="btn" onclick="disconnectHeaderSocket();modalClose()">연결 해제</button>
//             //             <button type="button" class="btn-cancel" onclick="modalClose()">취소</button>
//             //         </div>`;
//             //     if(document.getElementById('btn_tv_connection')){
//             //         document.getElementById('btn_tv_connection').addEventListener('click',function(){
//             //             // modalOpen('modal-disconnect');
//             //         })
//             //     }
//             // }
//             let tvModel = document.querySelectorAll('.tv-model');
//             for(let i=0; i<tvModel.length; i++){
//                 tvModel[i].innerText = connect;
//             }
//             // if(document.querySelector('#btn_tv_connection img')){
//             //     document.querySelector('#btn_tv_connection img').setAttribute('src','/img/icon_connect_tv_active.png');
//             //     document.querySelector('#btn_tv_connection img').setAttribute('alt','icon_tv_connected');
//             // }
//
//         }else{
//             // connect = '';
//             // if(document.getElementById('btn_tv_connection')){
//             //     document.getElementById('btn_tv_connection').addEventListener('click',function(){
//             //         location.href='/mypage/connect/tv'
//             //     })
//             // }
//         }
//     }
// });

// function disconnectHeaderSocket() {
//     $.ajax ({
//         url: "/api/disconnect",
//         method: "post",
//         success: function(data){
//             toastPopup('normal','연결을 취소했습니다.');
//             setTimeout(function(){
//                 connect = '';
//                 location.reload();
//             },3000)
//         },
//         error: function (request) {
//             //비밀번호가 틀리면 에러팝업
//         }
//     })
// }


// var stompClient = null;
// function connectFunc() {
//     var socket = new SockJS('/patron-web-mobile-socket');
//     stompClient = Stomp.over(socket);
//     // stompClient.heartbeat.incoming = 500;
//     // stompClient.heartbeat.outgoing = 500;
//     stompClient.connect({}, function (frame) {
//         // console.log('Connected: ' + frame);
//         stompClient.subscribe('/user/queue/player', function (response){
//             // console.log('topic player subscribe success!')
//             // console.log(JSON.parse(response.body))
//             if(location.pathname === '/player'){
//                 changeTvConnectedPlayerUI(JSON.parse(response.body));
//             }
//         });
//     },function (response){
//         setTimeout(function (){
//             // connectFunc();
//         },1000)
//         // console.log("response error");
//         // console.log(response);
//     });
// }
//tv에서 정보 받으면 움직임
// function changeTvConnectedPlayerUI(response) {
//     // console.log('changeTvConnectedPlayerUI() success!')
//     // console.log(response);
//     //location href
//     var art_id = response.artId;
//     var exh_id = response.exhId;
//     var play = response.play;
//     var url = location.pathname + location.search;
//     if(art_id === null || parseInt(art_id) === 0){
//         // location.href = "/player?exh_id="+exh_id;
//     }else{
//         if (play === true) {
//             if(document.getElementById('btn_pause')){
//                 playToggleButton(document.getElementById('btn_pause'))
//             }
//             if(document.getElementById('btn_play_exhibition')){
//                 playToggleButton(document.getElementById('btn_play_exhibition'))
//             }
//         } else {
//             location.href = "/player?art_id="+exh_id+"&exh_id="+art_id+"&receive=true";
//         }
//     }
// }

// setTimeout(function(){connectFunc()},300)

//=======================작품상세정보 함수==============================
function showArtworkInfo(selector){
    let artworkId = selector.children.namedItem('artwork-id').value;
    $.ajax({
        url:"/" + location.pathname.split("/")[1] + "/api/artwork-detail",
        method: "POST",
        type: "json",
        data:{
            "artworkId" : artworkId
        },
        success: function(result){
            console.log(result);
            let thumbnail = result['thumbnail'];
            let artworkName = result['name'];
            let artistName = result['artistName'];
            let technique = result['source'];
            let size = result['size'];
            let year = result['year'];
            let soundName = result['soundName'];
            let soundCreator = result['soundCreator'];
            let soundUrl =  result['soundUrl'];
            let soundLicense =  result['soundLicense'] === toBeDeleted ? '' : result['soundLicense'];
            let urlArr;
            let url;
            function soundUrlIsNull(){
                soundUrl = ""
                urlArr = ""
                url ="";
            }
            function soundUrlIsNotNull(){
                soundUrl = result['soundUrl'];
                urlArr= soundUrl.split('/');
                url = urlArr[2];
            }
            soundUrl === null ? soundUrlIsNull() : soundUrlIsNotNull()
            console.log(size)
            container = document.getElementById('artwork_detail_box');
            container.innerHTML = `
                     <section class="more-info-section">
            <button id="btn_goback" class="btn-goback" onclick="closeWrap(this);closeModal('#artwork_option_box');">
                <img src="/img/icon_go_back.png" alt="icon_go_back">
            </button>
            <h1>${detailInfo}</h1>
            <div class="thumbnail-img-wrap">
                <img src="${thumbnail}" alt="${artworkName}">
            </div>
            <div class="info-box" ${artworkName == '' && artistName == '' ? 'style="display:none"' : ''}>
                <ul>
                    <li ${artworkName == '' ? 'style="display:none"' : ''}>
                        <span>${artworkTitle}</span>
                        <span>${artworkName}</span>
                    </li>
                    <li ${artistName == '' ? 'style="display:none"' : ''}>
                        <span>${artistNameTitle}</span>
                        <span>${artistName}</span>
                    </li>
                </ul>
            </div>
            <div class="info-box" ${technique == '' && size == '' && year == '' ? 'style="display:none"' : ''}>
                <ul>
                    <li ${technique == '' ? 'style="display:none"' : ''}>
                        <span>${techniqueTitle}</span>
                        <span>${technique}</span>
                    </li>
                    <li ${size == '' ? 'style="display:none"' : ''}>
                        <span>${sizeTitle}</span>
                        <span>${size}</span>
                    </li>
                    <li ${year == '' ? 'style="display:none"' : ''}>
                        <span>${yearTitle}</span>
                        <span>${year}</span>
                    </li>
                </ul>
            </div>
            <div class="info-box" ${soundName == '' && soundCreator == '' && soundLicense == '' ? 'style="display:none"' : ''}>
                <ul>
                    <li ${soundName == '' ? 'style="display:none"' : ''}>
                        <span>${soundNameTitle}</span>
                        <span>${soundName}</span>
                    </li>
                    <li ${soundCreator == '' ? 'style="display:none"' : ''}>
                        <span>${soundCreatorTitle}</span>
                        <span>${soundCreator}</span>
                    </li>
                    <li ${soundLicense == '' ? 'style="display:none"' : ''}>
                        <span>${soundLicenseTitle}</span>
                        <span>${soundLicense}</span>
                    </li>
                </ul>
            </div>
        </section>`
            container.style.display = 'block';
            showArtistNameWithLan();
        }
    });
}
//한국어일 때 작가 이름 '한국이름(영어이름)', 영어일 때 작가 이름 '영어이름'
function showArtistNameWithLan(){
    // let nowSelectedLanguageContainer = document.querySelector('.weglot_switcher');
    // let languageNow = nowSelectedLanguageContainer.ariaLabel;
    // if(languageNow ==='Language selected: 한국어'){
    //     $('.korean-name').css('display', 'inline');
    //     $('.bracket-english-name').css('display', 'inline');
    //     $('.english-name').css('display', 'none');
    // }else{
    //     $('.korean-name').css('display', 'none');
    //     $('.bracket-english-name').css('display', 'none');
    //     $('.english-name').css('display', 'inline-block');
    // }
    // $('.etc-number-of-artists').css('display','inline-block');
}
//weglot 번역 적용 후 작가 이름 & 외 ~명 스타일 적용
setTimeout(function(){
    showArtistNameWithLan();
    // if(document.querySelector('.weglot_switcher').ariaLabel ==='Language selected: 한국어'){
    // }else{
    //     translateToAndMore('en');
    // }
},500);
$('.language-choice-modal .btn-kor').on('click',function(){
    $('.korean-name').css('display', 'inline');
    $('.bracket-english-name').css('display', 'inline');
    $('.english-name').css('display', 'none');
    translateToAndMore('ko');
})
$('.language-choice-modal .btn-eng').on('click',function(){
    $('.korean-name').css('display', 'none');
    $('.bracket-english-name').css('display', 'none');
    $('.english-name').css('display', 'inline-block');
    translateToAndMore('en');
})
$('.language-choice-modal .btn-jap').on('click',function(){
    $('.korean-name').css('display', 'none');
    $('.bracket-english-name').css('display', 'none');
    $('.english-name').css('display', 'inline-block');
    translateToAndMore('en');
})
//change header default home icon
function changeToModalHeader(){
    document.getElementById('btn_gnb').innerHTML = ` 
        <button type="button" id="btn_goback" class="btn-goback" onclick="modalClose(); changeToCommonHeader(); hideNavMenu();">
            <img src="/img/icon_go_back.png" alt="icon_go_back">
        </button>`;
    // if(document.getElementById('btn_tv_connection')){
    //     document.getElementById('btn_tv_connection').style.display = 'none';
    // }
}
//back to header default home icon
function changeToCommonHeader(){
    document.getElementById('btn_gnb').innerHTML = ` 
         <a href="/` + location.pathname.split('/')[1]  + `/home">
            <img src="/img/logo_symbol.png" id="header_logo" class="header-logo" alt="header-logo">
        </a>`;
    // if(document.getElementById('btn_tv_connection')){
    //     document.getElementById('btn_tv_connection').style.display = 'block';
    // }
}
//로그인 했을 때 이전에 머물던 페이지로 이동
function goToLoginPage(language){
    modalClose(); NonMemberInAccessibleDelete();
    console.log("HERE")
    // sessionStorage.setItem('goBackPage',location.href);
    location.href='/' + language + '/login';
}
function goToSignUpPage(){
    modalClose(); NonMemberInAccessibleDelete();
    checkGAEvent('login_go_signup');
    location.href = '/'+ location.pathname.split('/')[1] + '/signup';
}
//컬렉션 생성/편집/삭제 시 모달 띄어줌 (mypage, artstream-detail, collection-detail)
function showCollectionUpdateModal(){
    switch (sessionForCollection){
        case 'create' :
            toastPopup('success',saved);
            sessionStorage.setItem('sessionForCollection', undefined);
            break
        case 'delete' :
            toastPopup('normal',removedFromCollection);
            sessionStorage.setItem('sessionForCollection', undefined);
            break
        default :
            sessionStorage.setItem('sessionForCollection', undefined);
            break
    }
}

//더보기 함수
function showMoreList(list){
    let target = $(list);
    target.css('display','flex');
    // $('#anchor_see_more_item').css('display','none');
}
function showMoreButton(list){
    let target = $(list);
    if (target.length > 5){
        $('#anchor_see_more_item').css('display','block');
    }
}
//더보기 버튼
if ($('.artwork-list').length > 5){
    showMoreButton('.artwork-list');
}
//~외 n명
function translateToAndMore(lan){
    let etcNumberOfArtists = $('.etc-number-of-artists');
    if (lan === 'ko'){
        for (let i=0; i<etcNumberOfArtists.length; i++) {
            etcNumberOfArtists.eq(i).text(etcNumberOfArtists.eq(i).text().replace('and', '외'));
            etcNumberOfArtists.eq(i).text(etcNumberOfArtists.eq(i).text().replace('others', '명'));
        }
    }else{
        for (let i=0; i<etcNumberOfArtists.length; i++){
            etcNumberOfArtists.eq(i).text(etcNumberOfArtists.eq(i).text().replace('외', 'and'));
            etcNumberOfArtists.eq(i).text(etcNumberOfArtists.eq(i).text().replace('명', 'others'));
        }
    }

}
//전시 설명 더보기 버튼
function checkLineClamp(selector) {
    let target = document.querySelectorAll(selector);
    for (let i=0; i<target.length; i++){
        if (target[i].scrollHeight > target[i].clientHeight){
            // target[i].closest('.exh-info-section').querySelector('.btn-more-contents').style.display = 'block';
        }else{
            target[i].style.webkitLineClamp = 'unset';
            target[i].style.marginBottom = '40px';
            target[i].style.webkitLineClamp = 'unset';
            // target[i].closest('.exh-info-section').querySelector('.btn-more-contents').style.display = 'none';
        }
    }
}
function showAllInfo(selector){
    let target = selector;
    //작가설명
    if(target.closest('.artist-detail')){
        target.closest('.artists-description').querySelector('.artist-detail').style.webkitLineClamp = 'unset';
        target.closest('.artists-description').querySelector('.artist-detail').style.marginBottom = '40px';
    }
    //전시설명
    if(target.closest('.exh-info-section')){
        target.closest('.exh-info-section').querySelector('.exh-description').style.webkitLineClamp = 'unset';
    }
}

//Go to terms of service
function goTermsOfService(kind){
    location.href = '/' + location.pathname.split('/')[1] +'/mypage/terms-of-service?type='+ kind;
}

//gtag 관련
function checkGAEvent(data){
    switch (data){
        case 'menu_signup' :
            gtag('event','menu_signup');
            break;
        case 'menu_login' :
            gtag('event','menu_login');
            break;
        case 'modal_signup' :
            gtag('event','modal_signup');
            break;
        case 'modal_signup_cancel' :
            gtag('event','modal_signup_cancel');
            break;
        case 'login_cancel' :
            gtag('event','login_cancel');
            break;
        case 'login_google' :
            gtag('event','login_google');
            break;
        case 'login_kakao' :
            gtag('event','login_kakao');
            break;
        case 'login_go_signup' :
            gtag('event','login_go_signup');
            break;
        case 'signup_cancel_step1' :
            gtag('event','signup_cancel_step1');
            break;
        case 'signup_cancel_step2' :
            gtag('event','signup_cancel_step2');
            break;
        case 'signup_cancel_step3' :
            gtag('event','signup_cancel_step3');
            break;
        case 'signup_continue_step1' :
            gtag('event','signup_continue_step1');
            break;
        case 'signup_google' :
            gtag('event','signup_google');
            break;
        case 'signup_kakao' :
            gtag('event','signup_kakao');
            break;
        case 'signup_go_login' :
            gtag('event','signup_go_login');
            break;
        case 'signup_continue_step2' :
            gtag('event','signup_continue_step2');
            break;
        case 'signup_continue_step3' :
            gtag('event','signup_continue_step3');
            break;
        case 'signup_success_curation' :
            gtag('event','signup_success_curation');
            break;
        case 'signup_success_home' :
            gtag('event','signup_success_home');
            break;
        case 'tv_login_continue' :
            gtag('event','tv_login_continue');
            break;
        case 'tv_login_cancel' :
            gtag('event','tv_login_cancel');
            break;
        case 'tv_login_success' :
            gtag('event','tv_login_success');
            break;
        case 'home_save_coming_curation' :
            gtag('event','home_save_coming_curation');
            break;
        case 'home_go_artwork' :
            gtag('event','home_go_artwork');
            break;
        case 'home_go_tv_guide' :
            gtag('event','home_go_tv_guide');
            break;
        case 'home_go_artist' :
            gtag('event','home_go_artist');
            break;
        case 'home_go_store' :
            gtag('event','home_go_store');
            break;
        case 'player_play' :
            gtag('event','player_play');
            break;
        case 'artist_detail_play' :
            gtag('event','artist_detail_play');
            break;
        default:
            break;
    }
}
if($('.fade-in-section').length > 0){
    $('.fade-in-section').css({'opacity':'1'});
}
if($('.catch-phrase').length >0){
    $('.catch-phrase').css({'opacity':'1'});
}

