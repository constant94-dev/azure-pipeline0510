let navCheckboxSelector = document.getElementById('nav_checkbox');
let navCheckboxLabelSelector = document.querySelector('#nav_menu .nav-checkbox-label img');
let navDropdownSelector = document.getElementById('nav_dropdown');

let showNavMenu = () => {
    navDropdownSelector ? navDropdownSelector.style.display = 'block' : '';
    if(navCheckboxLabelSelector){
        navCheckboxLabelSelector.setAttribute('src','/img/icon_close.png')
    }
    if(navDropdownSelector){
        setTimeout(function(){navDropdownSelector.classList.add('active')},10)
    }
    navCheckboxSelector.value = 'on'
}
function hideNavMenu(){
    setTimeout(function(){
        if(navDropdownSelector){
            navDropdownSelector.style.display = 'none';
        }
        },310);
    if(navCheckboxLabelSelector){navCheckboxLabelSelector.setAttribute('src','/img/icon_menu.png')}
    if(navDropdownSelector){navDropdownSelector.classList.remove('active');}
    if(navCheckboxSelector){navCheckboxSelector.value = 'off'}
}
function hideNavMenu_gallery(){
    // setTimeout(function(){navDropdownSelector.style.display = 'none';},310);
    // navCheckboxLabelSelector.setAttribute('src','/img/icon_menu.png')
    // navDropdownSelector.classList.remove('active');
    // navCheckboxSelector.value = 'off'
    setTimeout(function (){
        window.open('https://patron-gallery.com/');
    },100)
}
let chooseLanguageModalSwitch = true;
function navChecker(){
    let checkerValue = navCheckboxSelector.value;
    if(chooseLanguageModalSwitch){
        document.querySelector('.language-choice-modal').style.display = 'none';
        toggleLanguageSwitch = false;
        checkerValue === 'on' ? hideNavMenu(): showNavMenu();
        // checkerValue === 'on' ? preventScroll(false) : preventScroll(true);
        preventsScroll();
    }
}
//tv NavMenu
let tvNavCheckboxSelector = document.getElementById('tv_nav_checkbox');
let tvNavCheckboxLabelSelector = document.querySelector('#tv_nav_menu .nav-checkbox-label img');
let tvNavDropdownSelector = document.getElementById('tv_nav_dropdown');
let tvShowNavMenu = () => {
    tvNavDropdownSelector.style.display = 'block';
    tvNavCheckboxLabelSelector.setAttribute('src','/img/icon_close.png')
    setTimeout(function(){tvNavDropdownSelector.classList.add('active')},10)
    tvNavCheckboxSelector.value = 'on'
}
let tvHideNavMenu = () => {
    setTimeout(function(){tvNavDropdownSelector.style.display = 'none';},310);
    tvNavCheckboxLabelSelector.setAttribute('src','/img/icon_menu.png')
    tvNavDropdownSelector.classList.remove('active');
    tvNavCheckboxSelector.value = 'off'
    document.querySelector('.language-choice-modal').style.display = 'none';
    toggleLanguageSwitch = false;
}
let tvNavChecker = () => {
    let checkerValue = tvNavCheckboxSelector.value;
    checkerValue === 'on' ? tvHideNavMenu() : tvShowNavMenu();
}


//========================언어========================
//모달에서 언어 선택하면 언어 바꿔주고 ui 바꿔주는 함수
function chooseLanguage(selector){
    chooseLanguageModalSwitch = false;
    let target;
    location.href = "/" + selector + location.pathname.slice(3) + location.search;
    const iconConfirm = document.querySelectorAll('.icon-confirm');
    //console.log(selector)
    // if(selector === 'kor'){
    //     target = document.getElementById('weglot-language-ko');
    //     for(let i=0; i<iconConfirm.length; i++){
    //         iconConfirm[i].style.display = 'none';
    //     }
    //     iconConfirm[0].style.display = 'block';
    // }else{
    //     target = document.getElementById('weglot-language-en');
    //     for(let i=0; i<iconConfirm.length; i++){
    //         iconConfirm[0].style.display = 'none';
    //     }
    //     iconConfirm[1].style.display = 'block';
    // }
    setTimeout(function (){
        target.click();
    },100)
    setTimeout(function (){
        chooseLanguageModalSwitch = true;
        document.querySelector('.language-choice-modal').style.display = 'none';
        toggleLanguageSwitch = false;
    },100)
}
//지금 선택된 언어 표시시켜주는 함수
function setLanguageModalStyle(){
    // let nowSelectedLanguageContainer = document.querySelector('.weglot_switcher');
    // let languageNow = nowSelectedLanguageContainer.ariaLabel;
    // const iconConfirm = document.querySelectorAll('.icon-confirm');
    // for(let i=0; i<iconConfirm.length; i++){
    //     iconConfirm[i].style.display = 'none';
    // }
    // languageNow === 'Language selected: 한국어'
    //     ? iconConfirm[0].style.display = 'block'
    //     : iconConfirm[1].style.display = 'block';
}
//언어 모달 토글 버튼
let toggleLanguageSwitch = false;
function toggleLanguageModal(){
    chooseLanguageModalSwitch = false;
    if(toggleLanguageSwitch){
        document.querySelector('.language-choice-modal').style.display = 'none';
        toggleLanguageSwitch = false;
    }else{
        document.querySelector('.language-choice-modal').style.display = 'flex'
        toggleLanguageSwitch = true;
    }
    setTimeout(function (){
        chooseLanguageModalSwitch = true;
    },100)
}

if(document.getElementById('goToLogin') !== null){
    document.getElementById('goToLogin').onclick = function (){
        // sessionStorage.setItem('goBackPage',location.href);
        const language = this.getAttribute('data-language');
        location.href = '/' + language + '/login';
    }
}

// 연결하기 링크이동
// if(document.getElementById('btn_tv_connection')){
//     document.getElementById('btn_tv_connection').addEventListener('click',function(){
//         location.href='/mypage/connect/tv'
//     })
// }