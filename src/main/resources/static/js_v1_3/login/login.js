//변수 선언
let processIndex = 1;
let totalIndex = document.querySelectorAll('.carousel-item').length;
const btnGoback = document.getElementById('btn_goback');
const btnCancel = document.getElementById('btn_cancel');
const carousel_control_next = document.querySelectorAll('.carousel-control-next');
const pathName = '/' + location.pathname.split('/').pop();
// const progressbar = document.querySelector('.signup-step-progress');
// const signupStep = document.getElementById('signup_step');

// if(document.getElementById('deviceId') && document.getElementById('deviceId').value !== '' && location.pathname !== '/signup' ){
//     Cookies.set('pastUrl',location.href);
// }

function showingErrorGuide(error){
    switch(error){
        case 'noEmail' :
            //이메일을 입력하지 않은 경우
            $('.error-guide-box.email').css('display','block');
            $('.error-guide').css('display','none');
            $('#error_no_email').css('display','block');
            $('#email_id').addClass('error');
            break;
        case 'noAccount' :
            //가입된 계정이 없을 경우
            $('.error-guide-box.email').css('display','block');
            $('.error-guide').css('display','none');
            $('#error_no_account').css('display','block');
            $('#email_id').addClass('error');
            break;
        case 'noPassword' :
            //비밀번호를 입력하지 않은 경우
            $('.error-guide-box.pw').css('display','block');
            $('.error-guide').css('display','none');
            // $('.pw-check-list').css('display','none');
            $('#error_no_password').css('display','block');
            $('#login_pw').addClass('error');
            break;
        case 'noCorrectPassword' :
            //비밀번호가 일치하지 않을 경우
            $('.error-guide-box.pw').css('display','block');
            $('.error-guide').css('display','none');
            // $('.pw-check-list').css('display','none');
            $('#error_incorrect_password').css('display','block');
            $('#login_pw').addClass('error')
            break;
        case 'noSignupPassword' :
            //비밀번호를 입력하지 않은 경우(회원가입)
            $('.error-guide-box.pw').css('display','block');
            $('.error-guide').css('display','none');
            // $('.pw-check-list').css('display','none');
            $('#error_no_password').css('display','block');
            $('#user_pw').addClass('error');
            break;
        case 'noCorrectSignupPassword' :
            //비밀번호가 일치하지 않을 경우 (회원가입)
            $('.error-guide-box.pw').css('display','block');
            $('.error-guide').css('display','none');
            // $('.pw-check-list').css('display','none');
            $('#error_incorrect_password').css('display','block');
            $('#user_pw').addClass('error')
            break;
        case 'alreadyExistAccount' :
            //이미 가입한 회원인 경우 (회원가입)
            $('.error-guide-box.email').css('display','block');
            $('.error-guide').css('display','none');
            $('#error_registered_account').css('display','block');
            $('#email_id').addClass('error')
            break;
        case 'wrongCode' :
            $('.error-guide-box.code').css('display','block');
            $('.error-guide').css('display','none');
            $('#error_wrong_code').css('display','block');
            $('#auth_code').addClass('error')
            break;
        case 'noUserName' :
            //사용자 이름을 입력하지 않은 경우 (회원가입)
            $('.error-guide-box.name').css('display','block');
            $('.error-guide').css('display','none');
            $('#error_no_name').css('display','block');
            $('#user_name').addClass('error')
            break;
        case 'noAgreement' :
            //약관 동의를 하지 않은 경우 (회원가입)
            $('.error-guide-box.agreement').css('display','block');
            $('.error-guide').css('display','none');
            $('#error_no_agreement').css('display','block');
            break;
        default :
            break;
    }
}


//로그인이 필요합니다 모달 삭제
const signUpFailedDelete = () => {
    document.querySelector('.modal-login-required').remove();
    // location.href = '/login';
}
//로그인이 필요합니다 모달 생성
const signUpFailed = (word) => {
    if(scrollModalBoolean){
        preventsScroll();
    }
    let sentence;
    switch (word){
        case 'kakaoaccounthasnoemailregistered' :
            //Kakao unlinked
            sentence = kakaoAccountHasNoEmailRegistered;
            break
        case 'accounthasnoemailregistered':
            sentence = accountHasNoEmailRegistered;
            break
        case 'Kakao':case 'KaKao':
            sentence = kakao;
            break
        case 'General':
            sentence = general;
            break
        case 'Facebook':
            sentence = facebook;
            break
        case 'Google':
            sentence = google;
            break
        case 'thisisleftmember':
            sentence = thisIsLeftMember;
            break
    }
    let divEle = document.createElement('div');
    divEle.setAttribute('class','modal-login-required');
    document.querySelector('main').append(divEle);
    let html = `<div>
                    <div class="modal-area">
                        <p class="modal-title">
                            `+ sentence +`
                        </p>
                        <button type="button" id="btn_login_signup" class="btn btn-login-signup" style="margin-top: 16px;margin-bottom: 0" onclick="modalClose(); signUpFailedDelete();">${next}</button>
                    </div>
                </div>`
    document.querySelector('.modal-login-required').innerHTML = html;
}


//같은 이메일로 간편로그인 시도했을때 (ex. 구글, 페이스북, 카카오 이메일이 같을때)
if($('#signProvider').text() !== ''){
    signUpFailed($('#signProvider').text())
}

//이메일 이메일주소값이 이미 입력되어있을때
// setTimeout(function(){
//     if(document.getElementById('email_id').value !== ''){
//         document.getElementById('btn_step1').classList.add('blue');
//     }
// },200)

if (pathName === '/login' && location.search.split('&').length > 1){
    $('.btn-language-choice').css('display','flex');
    $('#btn_step1').on('click',function (){
        $('.btn-language-choice').css('display','none');
    })
    $('#btn_cancel').on('click',function (){
        $('.btn-language-choice').css('display','flex');
    })
}

//프로세스 앞으로
const processProgress = (index) => {
    processIndex = index;
    if((pathName === '/signup' && processIndex === 1) || pathName === '/' || pathName === '/login') {
        btnGoback.style.display = 'none';
    }else{
        btnGoback.style.display = 'block';
    }
    // progressbar ? progressbar.value = processIndex : "";
    // signupStep ? signupStep.innerText = processIndex : "";
    if(processIndex <= totalIndex){
        let activeCarousel = document.getElementById(`step_${index-1}`);
        let targetCarousel = document.getElementById(`step_${index}`);
        document.getElementById(`btn_step${index}`).style.display = 'block';

        let carouselItem = $('.carousel-item').css('width');
        let moveCarouselLeft;
        if(carouselItem === '328px'){
            moveCarouselLeft = -328 * (index-1);
        }else{
            moveCarouselLeft = -(parseInt(carouselItem)) * (index-1);
        }
        processMove(moveCarouselLeft, activeCarousel, targetCarousel);
    }else {
        // 프로세스 진행 마지막일 때
        switch (pathName){
            case '/':case '/login':
                $.ajax({
                    url:'/api/login',
                    method: "POST",
                    type: "json",
                    data: {
                        'email':document.getElementById('email_id').value,
                        'password':document.getElementById('login_pw').value,
                        'remember-me':false
                    },
                    success: function(data,status,xhr){
                        // location.href = xhr.getResponseHeader("myUrl")
                        if(Cookies.get('pastUrl')!==null && Cookies.get('pastUrl')!=='null' && Cookies.get('pastUrl')!==undefined && Cookies.get('pastUrl')!=='undefined' && Cookies.get('pastUrl')!==''){
                            location.href = Cookies.get('pastUrl');
                        }else{
                            location.href = xhr.getResponseHeader("myUrl");
                        }
                        // $.ajax({
                        //     url:'/api/previous-page',
                        //     method: "POST",
                        //     type: "json",
                        //     data: {
                        //     },
                        //     success: function (data){
                        //         location.href = data;
                        //     }
                        // })
                        // if(pathName === '/login'){
                            // //QR코드로 들어왔을 때 goBackPage에 현재 url 넣어줌
                            // if(location.href.split('&').length > 1){
                            //     sessionStorage.setItem('goBackPage', location.href);
                            // }
                            // //goBackPage에 값이 있으면 그 url로 보내주고 없으면 /home
                            // if(sessionStorage.getItem('goBackPage') !== '' && sessionStorage.getItem('goBackPage') !== undefined && sessionStorage.getItem('goBackPage') !== null){
                            //     location.href = sessionStorage.getItem('goBackPage');
                            // }else{
                            //     location.href ='/home';
                            // }
                        // }
                    },
                    error: function (request){
                        // processIndex -= 1;
                        // toastPopup('error',passwordInvalid);
                        // 틀린 비밀번호 에러
                        showingErrorGuide('noCorrectPassword');
                        return false
                    }
                })
                break
            case '/signup':
                break
            case '/password-find':
                break
        }
    }
}

//프로세스 뒤로
//TODO 작업 중
const processRegress = () => {
    processIndex -= 1;
    // progressbar ? progressbar.value = processIndex : "";
    // signupStep ? signupStep.innerText = processIndex : "";
    if(pathName ===  "/signup" && processIndex === 1) {
        btnGoback.style.display = 'none';
    }
    if(pathName === '/signup'){
        switch (processIndex) {
            case 1 :
                $('#btn_cancel').attr('onclick',"checkGAEvent('signup_cancel_step1');history.back();");
                break;
            case 2 :
                $('#btn_cancel').attr('onclick',"checkGAEvent('signup_cancel_step2');history.back();");
                break;
            case 3 :
                $('#btn_cancel').attr('onclick',"checkGAEvent('signup_cancel_step3');history.back();");
                break;
            default :
                $('#btn_cancel').attr('onclick',"history.back();");
                break;
        }
    }
    if (processIndex > 0){
        let activeCarousel = document.getElementById(`step_${processIndex+1}`);
        let targetCarousel = document.getElementById(`step_${processIndex}`);
        let leftRemainder;
        let carouselItem = $('.carousel-item').css('width');
        let moveCarouselLeft;
        if(carouselItem === '328px'){
            moveCarouselLeft = -328 * (processIndex-1);
        }else{
            moveCarouselLeft = -(parseInt(carouselItem)) * (processIndex-1);
        }
        processMove(moveCarouselLeft, activeCarousel, targetCarousel);
    }
}

//프로세스 이동
const processMove = (left, activeCarousel, targetCarousel) => {
    document.getElementById('carousel').style.left = left+'px';
    activeCarousel.style.cssText = `opacity: 0; transition: all 0.3s ease-in-out 0s;`;
    targetCarousel.style.cssText = `opacity: 1; transition: all 0.3s ease-in-out 0s;`;
    targetCarousel.querySelector('.login-input-area').style.display = 'block';
    if(processIndex > 1){
        if(pathName !== '/signup'){
            btnGoback.style.display = 'none';
        }
        btnCancel.style.display = 'block';
    } else {
        btnGoback.style.display = 'block'
        btnCancel.style.display = 'none'
    }
    if(pathName !== '/signup'){
        setTimeout(()=>{
            activeCarousel.querySelector('.login-input-area').style.display = 'none';
            targetCarousel.querySelector('input').focus();
        },600);
    }
}

[... carousel_control_next].filter(a=>a.classList.contains('extra-button') === false).forEach(e=>e.addEventListener('click',function (){
    this.classList.contains('blue')  ? processProgress(processIndex+1) : "";
}));
[... carousel_control_next].filter(a=>a.classList.contains('extra-button')).forEach(e=>e.addEventListener('click',function (){
    if (this.classList.contains('blue')){
        switch (pathName){
            case '/':
            case '/login':
                $('.error-guide').css('display','none');
                if(document.getElementById('email_id').value === ''){
                    //이메일 없음 에러메시지 보여줌
                    showingErrorGuide('noEmail');
                }

                if(document.getElementById('login_pw').value === ''){
                    //비밀번호 없음 에러메시지 보여줌
                    showingErrorGuide('noPassword');
                }

                if(document.getElementById('email_id').value !== '' && document.getElementById('login_pw').value !== ''){
                    checkMember(document.getElementById('email_id').value);
                }
                break
            case '/signup':
                // checkMember(document.getElementById('email_id').value);
                // this.classList.contains('send-mail') ? sendEmail(sessionStorage.getItem('email_id'),'email') :"";
                // this.classList.contains('check-code') ? checkAuthKey(document.getElementById('auth_code').value) :"";
                break
            case '/password-find':
                $('.text-eraser').remove('active');
                this.classList.contains('send-mail') ? sendEmail(document.getElementById('email_id').value,'password') :"";
                this.classList.contains('check-code') ? checkAuthKey(document.getElementById('auth_code').value) :"";
                break
        }
    }
}));

//엔터 클릭 대응
document.onkeyup = function (e){
    if(e.keyCode === 13) {
        if (document.getElementById(`step_${processIndex}`).querySelector('input')) {
            document.activeElement.tagName === 'INPUT' ? carousel_control_next[processIndex - 1].click() : "";
        } else {
            carousel_control_next[processIndex - 1].click();
        }
    }
}

//로그인 > 회원가입 페이지 이동시 이메일주소 세션에 담고 아닐시 바로 이동
let linkHref = (link) => {
    link === 'signup' ? sessionStorage.setItem('email_id',document.getElementById('email_id').value) : '';
    location.href = serverUrl + location.pathname.split('/')[1] + "/" +  link;
}

let linkHrefSignup = () => {
    sessionStorage.setItem('email_id',document.getElementById('email_id').value);
    location.href = '/' + location.pathname.split('/')[1] + '/signup';
}

let emailTimer
function emailSession(){
    sessionStorage.setItem('email_id',document.getElementById('email_id').value);
    clearTimeout(emailTimer)
    // 유효시간 초과 체크
    emailTimer = setTimeout(function (){
        toastPopup("error", authenticationPeriodPassed);
    },1800000)
}

//소셜로그인 최근 아이콘 추가
function createIconRecently(){
    if(!document.querySelector('.recently')){
        let iconRecently = document.createElement('span');
        iconRecently.setAttribute('class','recently');
        iconRecently.innerText = '최근';
        Cookies.get('recentlyLogin') && document.getElementById('btn_'+Cookies.get('recentlyLogin')+'_login').append(iconRecently);
    }
}

//소셜로그인 링크 수정
const socialHref = (social) => {
    switch (social) {
        case 'google': case '구글':
            Cookies.set('recentlyLogin','google');
            location.href = serverUrl + 'oauth2/authorization/google';
            break;
        case 'facebook': case '페이스북':
            Cookies.set('recentlyLogin','facebook');
            location.href = serverUrl + 'oauth2/authorization/facebook';
            break;
        case 'kakao': case '카카오톡':
            Cookies.set('recentlyLogin','kakao');
            location.href = 'https://kauth.kakao.com/oauth/authorize?client_id=48f54d2f32584082c6d37da47a366f3c&redirect_uri=' + serverUrl + '&response_type=code';
            break;
    }
}

//간편로그인으로 계속하기 모달
const socialModal = (social) => {
    let socialTranslate;
    switch (social){
        case 'google': case '구글': socialTranslate = "Google";break;
        case 'facebook': case '페이스북': socialTranslate = "Facebook";break;
        case 'kakao': case '카카오톡': socialTranslate = "KakaoTalk";break;
        default: socialTranslate = "undefined";break;
    }
    let html = `<div class="modal-area">
            <p class="modal-title">
                ${alreadySnsAccountEnglish} ${socialTranslate} ${alreadySnsAccount}
            </p>
            <button type="button" id="btn_social_guide" class="btn btn-login-signup" onclick="socialHref('${social}')">${simpleLogin}</button>
            <button type="button" class="btn-cancel" onclick="modalClose()">${cancel}</button>
        </div>`;
    document.querySelector('.modal-social-guide').innerHTML = html;
    document.querySelector('.modal-social-guide').style.cssText = `display: block`;
    modalOpen('modal-social-guide');
}

//회원 가입여부 확인
function checkMember(email){
    $.ajax({
        url:'/api/email-check',
        method: "POST",
        dataType: "json",
        data: {
            email: email
        },
        success: function(provider){
            if(pathName == '/signup'){
            //    이미 가입한 회원이면 login페이지로
            //    가입한 회원이 아니면 계속 진행
            }else if(pathName == '/login' || pathName == '/password-find'){
                switch (provider){
                    case 'General':
                        //비밀번호 찾기 페이지일경우 인증메일 발송
                        if(document.getElementById('carousel').classList.contains('password-find-section')){
                            sendEmail(document.getElementById('email_id').value,'password');
                            $('.text-eraser').removeClass('active');
                        }else{
                            processProgress(processIndex+1)
                        }
                        break;
                    case 'Google':
                        socialModal('구글');
                        break;
                    case 'Facebook':
                        socialModal('페이스북');
                        break;
                    case 'Kakao':
                        socialModal('카카오톡');
                        break;
                    case -2:
                        toastPopup('error', errorLeftAccount);
                        break;
                    case -1:
                        // slideModalOpen('modal-signup');
                        // toastPopup('error','계정정보가 없습니다.')
                        showingErrorGuide('noAccount')
                        sessionStorage.setItem('email_id',document.getElementById('email_id').value);
                        // location.href = '/' + location.pathname.split('/')[1] + '/signup';
                        break;
                }
            }else{
            }
        },
        error: function(request){
        }
    })
}

//코드 검사
function checkAuthKey(authKey){
    let email = document.getElementById('email_id').value;
    $.ajax({
        url:'/api/email-verify',
        method: "POST",
        dataType: "json",
        data: {
            email: email,
            authKey: authKey
        },
        success: function(data){
            if(data === 1 && url === '/password-find'){
                processProgress(processIndex+1)
            } else {
                // toastPopup('error',authenticationCodeInvalid);
                showingErrorGuide('wrongCode');
            }
        },
        error: function(request){
        }
    })
}

//유효성 검사
const checkAndAddClass = (target, f)=>{
    if ( document.getElementById(target) !== null ){
        document.getElementById(target).onkeyup = function (){
            let btnClassList = document.getElementById(`btn_step${processIndex}`).classList;
            f(this.value) ? btnClassList.add('blue') : btnClassList.remove('blue');
        }
    }
}
//이메일 유효성 검사
const checkEmail = (val) => {
    // let regExp = new RegExp(/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i);
    if(val.includes("@")){
        return true;
    } else {
        return false;
    }
}
// checkAndAddClass('email_id',checkEmail);
//알파벳+숫자 코드 입력 유효성검사
const checkCode = (val) => {
    let regExp = new RegExp(/^[a-zA-Z0-9]{2,16}$/);
    let spe = new RegExp(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
    //공백 유무, 특수문자 체크
    if(val.search(/\s/) === -1 && spe.test(val) === false){
        return regExp.test(val);
    }
}
checkAndAddClass('auth_code',checkCode);
//이름 입력 유효성검사
function checkName(val){
    let regExp = new RegExp(/^[a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]{2,16}$/);
    let spe = new RegExp(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

    //공백 유무, 특수문자 체크
    if(val.search(/\s/) === -1 && spe.test(val) === false){
        return regExp.test(val);
    }
}
checkAndAddClass('user_name',checkName);
//비밀번호 유효성 - 초록색 체크
const checkAddGreen = (el) => {
    document.querySelector(el).classList.add('green');
    document.querySelector(el).children[0].classList.add('active');
}
//비밀번호 유효성 - 회색 체크
const checkRemoveGreen = (el) => {
    document.querySelector(el).classList.remove('green');
    document.querySelector(el).children[0].classList.remove('active');
}
// green check
const greenClassCheck = (target) => {
    return document.querySelector(target).className.split(' ').filter(e=>{return e==='green'}).length;
}
//비밀번호 입력 유효성검사
const checkPw = (val) => {
    let eng = new RegExp(/(?=.*[a-z])(?=.*[A-Z])/);
    let spe = new RegExp(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
    eng.test(val) ? checkAddGreen('.pw-eng') : checkRemoveGreen('.pw-eng');
    spe.test(val) ? checkAddGreen('.pw-spe') : checkRemoveGreen('.pw-spe');
    val.length > 7 ? checkAddGreen('.pw-length') : checkRemoveGreen('.pw-length');
    //모든 유효성검사를 통과했을 경우 1 아니면 0
    if(greenClassCheck('.pw-eng') + greenClassCheck('.pw-spe') + greenClassCheck('.pw-length') === 3){
        return 1;
    } else {
        return 0;
    }
}


// 회원가입 모달 여백 클릭시 모달 닫힘
$('.modal-content').on('click',function(){
    closeModalSimply('.modal-signup');
})


//gtag 관련
// function checkSignupEvent(button){
//     switch (button){
//         case 'termsOfServiceButton' :
//             gtag('event','termsOfServiceButton');
//             break;
//         case 'emailSendAgainButton' :
//             gtag('event','emailSendAgainButton');
//             break;
//         case 'emailCheckButton' :
//             gtag('event','emailCheckButton');
//             break;
//         case 'userNameButton' :
//             gtag('event','userNameButton');
//             break;
//         case 'passwordButton' :
//             gtag('event','passwordButton');
//             break;
//     }
// }
function checkTerms(){
    let checked;
    let ess_personal_info = document.getElementById('ess_personal_info').checked;
    let ess_terms_service = document.getElementById('ess_terms_service').checked;
    let ess_account_service = document.getElementById('ess_account_service').checked;
    if(ess_personal_info && ess_terms_service && ess_account_service){
        checked = true;
    } else {
        checked = false;
    }
    return checked;
}
//Signup
checkAndAddClass('user_pw',checkPw);
if (pathName === '/signup'){
    $('#btn_cancel').focus();
    $('.btn-goback').css('display','none');
    //Change style when input focused
    $('input').focus(function(){
        switch($(this).attr('id')){
            case ('user_pw') :
                // $('.error-guide-box').css('display','none');
                // $('.error-guide-box.pw .error-guide').css('display','none');
                $('.login-input').removeClass('active');
                $('.text-eraser').removeClass('active');
                // $('.login-input:nth-of-type(2)').removeClass('error');
                $('.text-eraser.pw').addClass('active');
                if(!$(this).hasClass('error')){
                    $('.login-input:nth-of-type(2)').addClass('active');
                }
                break;
            case ('email_id') :
                // $('.error-guide-box').css('display','none');
                // $('.error-guide-box.email .error-guide').css('display','none')
                $('.login-input').removeClass('active');
                $('.text-eraser').removeClass('active');
                // $('#email_id.login-input').removeClass('error');
                if(!$(this).hasClass('error')){
                    $('#email_id.login-input').addClass('active');
                }
                break;
            case ('auth_code') :
                // $('.error-guide-box').css('display','none');
                // $('.error-guide-box.code .error-guide').css('display','none');
                $('.login-input').removeClass('active');
                $('.text-eraser').removeClass('active');
                // $('.signup-step2 .login-input').removeClass('error');
                $('.text-eraser.code').addClass('active');
                  if(!$(this).hasClass('error')){
                    $('.signup-step2 .login-input').addClass('active');
                }
                break;
            case ('user_name') :
                // $('.error-guide-box').css('display','none');
                // $('.error-guide-box.name .error-guide').css('display','none');
                $('.login-input').removeClass('active');
                $('.text-eraser').removeClass('active');
                // $('.login-step3 .login-input').removeClass('error');
                $('.text-eraser.name').addClass('active');
                  if(!$(this).hasClass('error')){
                    $('.login-step3 .login-input').addClass('active');
                }
                break;
            default :
                break;
        }
    })
    $('input').blur(function(){
        $('.login-input-title, .login-input').removeClass('active');
    })
    //Move to the next step
    //1단계 : 이메일, 비밀번호 입력하고 '계속' 버튼 눌렀을 때
    $('#btn_step1').on('click',function (){
        if(document.getElementById('email_id').value === '' || document.getElementById('user_pw').value === ''){
            if(document.getElementById('email_id').value === ''){
                showingErrorGuide('noEmail');
            }
            if(document.getElementById('user_pw').value === ''){
                showingErrorGuide('noSignupPassword');
            }
        }else if(checkPw(document.getElementById('user_pw').value) === 0){
            // toastPopup('error','비밀번호 조건을 만족하세요.')
            showingErrorGuide('noCorrectSignupPassword');
        }else{
            //이메일 체크
            $.ajax({
                url:'/api/email-check',
                method: "POST",
                dataType: "json",
                data: {
                    email: document.getElementById('email_id').value
                },
                success: function(provider){
                    //General, Google, Facebook, Kakao , -2(탈퇴회원) 면 toastPopup, 가입하지않은회원이면 계속 진행
                    switch (provider){
                        case 'General':
                            // toastPopup('error', '이미 가입한 회원입니다.');
                            showingErrorGuide('alreadyExistAccount');
                            break;
                        case 'Google':
                            // toastPopup('error', '이미 가입한 회원입니다.');
                            showingErrorGuide('alreadyExistAccount');
                            break;
                        case 'Facebook':
                            // toastPopup('error', '이미 가입한 회원입니다.');
                            showingErrorGuide('alreadyExistAccount');
                            break;
                        case 'Kakao':
                            // toastPopup('error', '이미 가입한 회원입니다.');
                            showingErrorGuide('alreadyExistAccount');
                            break;
                        case -2:
                            toastPopup('error', errorLeftAccount);
                            break;
                        case -1:
                            //이메일 전송
                            sessionStorage.setItem('email_id',document.getElementById('email_id').value);
                            sendEmail(sessionStorage.getItem('email_id'),'email');
                            //tabindex 조정
                            $('input,button').attr('tabindex','-1');
                            $('#step_2 input,#step_2 button').attr('tabindex','0');
                            document.getElementById('email_address').innerHTML = document.getElementById('email_id').value;
                            //GA
                            checkGAEvent('signup_continue_step1');
                            $('#btn_cancel').attr('onclick',"checkGAEvent('signup_cancel_step2');history.back();");
                            //다음 단계로
                            processProgress(2);
                            //지우기 버튼
                            $('.text-eraser').removeClass('active');
                            //에러 숨김
                            $('.error-guide, .error-guide-box').css('display','none');
                            //뒤로가기 버튼 보임
                            $('.btn-goback').css('display','block');
                            break;
                    }
                },
                error: function(request){
                }
            })
        }

    })
    //2단계 : 인증코드 누르고 '계속' 버튼 눌렀을 때
    $('#btn_step2').on('click',function(){
        let email = sessionStorage.getItem('email_id');
        let authKey = document.getElementById('auth_code').value;
        $.ajax({
            url:'/api/email-verify',
            method: "POST",
            dataType: "json",
            data: {
                email: email,
                authKey: authKey
            },
            success: function(data){
                if(data === 1){
                    //성공 시 tabindex
                    $('input,button').attr('tabindex','-1');
                    $('#step_3 input,#step_3 button').attr('tabindex','0');
                    //GA
                    checkGAEvent('signup_continue_step2');
                    $('#btn_cancel').attr('onclick',"checkGAEvent('signup_cancel_step3');history.back();");
                    //다음 단계로
                    processProgress(3);
                    //지우기 버튼
                    $('.text-eraser').removeClass('active');
                    //에러 숨김
                    $('.error-guide, .error-guide-box').css('display','none');
                    //유저 이름 삽입
                    let userName = document.getElementById('email_id').value.toString().split('@')[0];
                    document.getElementById('user_name').value = userName;
                }else{
                    //코드가 일치하지 않습니다.
                    showingErrorGuide('wrongCode');
                    // toastPopup('error',authenticationCodeInvalid);
                }
            },
            error: function(request){
            }
        })
    })
    //3단계 : 사용자 이름 입력하고 "계속'버튼 눌렀을 때 (회원가입 완료단계)
    $('#btn_step3').on('click',function(){
        if(checkTerms() && checkName(document.getElementById('user_name').value)){
                $.ajax({
                    url:'/api/signup',
                    method: "POST",
                    dataType: "json",
                    data: {
                        email: sessionStorage.getItem('email_id'),
                        name: document.getElementById('user_name').value,
                        password: document.getElementById('user_pw').value,
                        marketing: document.getElementById('cho_marketing_reception').checked
                    },
                    success: function(data){
                        if(data === 1){
                            //GA
                            checkGAEvent('signup_continue_step3');
                            //회원가입 완료 페이지로 이동
                            linkHref('login-success');
                        } else {
                            //회원가입 실패 안내 필요
                            modalOpen('modal-signup-error');
                        }
                    },
                    error: function(request){
                    },
                    statusCode: {
                        400: function (response) {
                            //이메일 형식에 오류!! 안내 필요
                        }
                    }
                })
            }else if(!checkTerms() && checkName(document.getElementById('user_name').value)){
                showingErrorGuide('noAgreement');
                // toastPopup('error','약관에 동의해주세요.')
            }else if(checkTerms() && !checkName(document.getElementById('user_name').value)){
                showingErrorGuide('noUserName');
        }else if(!checkTerms()&&!checkName(document.getElementById('user_name').value)){
            showingErrorGuide('noAgreement');
            showingErrorGuide('noUserName');
            // toastPopup('error','올바른 사용자 이름을 입력하세요.')
        }

    })
    //when password input is focused, show pw check list
    $('#user_pw').focus(function(){
        $('.pw-check-list').css('display','block');
    })
    //에러메시지 안보임
    $('#terms_check_list input').on('click',function(){
        $('.error-guide-box.agreement .error-guide').css('display','none');
    })
    //뒤로가기 눌렀을 때 tabindex
    $('.btn-goback').click(function(){
        if($('#step_2').css('opacity')==='1'){
            //tabindex
            $('input,button').attr('tabindex','-1');
            $('#step_1 input,#step_1 button').attr('tabindex','0');
            document.getElementById('user_pw').value = '';
            //첫번째 단계에서는 뒤로가기 버튼 숨김
            btnGoback.style.display = 'none';
            //focus
            $('#email_id').focus();
        }else if($('#step_3').css('opacity')==='1'){
            $('input,button').attr('tabindex','-1');
            $('#step_2 input,#step_2 button').attr('tabindex','0');
            //뒤로가기 버튼 보임
            btnGoback.style.display = 'block';
            $('#auth_code').val('');
            $('#auth_code').focus();
        }else{}
    })
}
//login
if (pathName === '/login') {
    createIconRecently();
    $('#btn_goback').focus();
    //Change style when input focused
    $('input').focus(function () {
        switch ($(this).attr('id')) {
            case ('login_pw') :
                //에러메시지 지움
                // $('.error-guide-box').css('display','none');
                // $('.error-guide-box.pw .error-guide').css('display','none');
                // $('#login_pw').removeClass('error');
                $('.text-eraser').removeClass('active');
                $('.text-eraser.pw').addClass('active');
                if(!$(this).hasClass('error')){
                    //활성화 효과
                    $('.login-input').removeClass('active');
                    $('.login-input:nth-of-type(2)').addClass('active');
                }
                break;
            case ('email_id') :
                //에러메시지 지움
                // $('.error-guide-box').css('display','none');
                // $('.error-guide-box.email .error-guide').css('display','none');
                $('.text-eraser').removeClass('active');
                $('.text-eraser.email').addClass('active');
                if(!$(this).hasClass('error')){
                    //활성화 효과
                    $('.login-input').removeClass('active');
                    $('.login-input:nth-of-type(1)').addClass('active');
                }
                // $('#email_id').removeClass('error');
                break;
            default :
                break;
        }
    })
}
//find password
if (pathName === '/password-find') {
    $('input').focus(function () {
        switch ($(this).attr('id')) {
            case ('email_id') :
                $('.text-eraser').removeClass('active');
                $('.login-input').removeClass('active');
                // $('.password-find-step1 .login-input').removeClass('error');
                $('.error-guide').css('display','none');
                $('.email.error-guide-box .error-guide').css('display','none');
                $('.text-eraser.email').addClass('active');
                if(!$('.password-find-step1 .login-input').hasClass('error')){
                    $('.password-find-step1 .login-input').addClass('active');
                }
                break;
            case ('auth_code') :
                $('.text-eraser').removeClass('active');
                $('.login-input').removeClass('active');
                // $('.password-find-step2 .login-input').removeClass('error');
                $('.error-guide').css('display','none');
                $('.code.error-guide-box .error-guide').css('display','none');
                $('.text-eraser.code').addClass('active');
                if(!$('.password-find-step2 .login-input').hasClass('error')){
                    $('.password-find-step2 .login-input').addClass('active');
                }
                break;
            case ('user_pw') :
                $('.pw-check-list').css('display','block');
                $('.text-eraser').removeClass('active');
                $('.login-input').removeClass('active');
                // $('.password-find-step3 .login-input').removeClass('error');
                $('.error-guide').css('display','none');
                $('.pw.error-guide-box .error-guide').css('display','none');
                $('.text-eraser.pw').addClass('active');
                if(!$('.password-find-step3 .login-input').hasClass('error')){
                    $('.password-find-step3 .login-input').addClass('active');
                }
                break;
            default :
                break;
        }
    })
    $('input').blur(function () {$('.login-input-title, .login-input').removeClass('active');})
    //1단계 : 이메일 입력하고 '계속' 버튼 눌렀을 때
    $('#btn_step1').on('click',function (){
        if(document.getElementById('email_id').value == ''){
            showingErrorGuide('noEmail')
        }else{
            checkMember(document.getElementById('email_id').value);
            document.getElementById('email_address').innerHTML = document.getElementById('email_id').value;
        }
    })
    $('#btn_step3').on('click',function(){
        if(document.getElementById('user_pw').value == ''){
            showingErrorGuide('noSignupPassword')
        }else if(checkPw(document.getElementById('user_pw').value) === 0){
            showingErrorGuide('noCorrectSignupPassword');
        }else{
            $.ajax({
                url: '/api/password-reset',
                method: "POST",
                dataType: "json",
                data: {
                    email: document.getElementById('email_id').value,
                    password: document.getElementById('user_pw').value
                },
                success: function (data) {
                    if(data === 1){
                        //변경된 비번으로 로그인하라는 모달
                        modalOpen('modal-changed-pw');
                    } else {
                        //비밀번호 변경에 실패했다는 안내 필요
                    }
                },
                error: function (request) {
                    // if(request.status === 403){
                    //     return adminLogout();
                    // }
                }
            })
        }
    })
}
function goToLoginPage(){
    modalClose(); NonMemberInAccessibleDelete();
    location.href = '/'+ location.pathname.split('/')[1] + '/login';
}
function goToSignUpPage(){
    // modalClose(); NonMemberInAccessibleDelete();
    checkGAEvent('login_go_signup');
    location.href = '/'+ location.pathname.split('/')[1] + '/signup';
}
// document.getElementById('user_pw').addEventListener('input', updateValue);
// function updateValue(e) {
//     var text = e.target.value;
//     // console.log(text);
//     // text.toString().replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '');
//
//     let regExpSpecial = /[\{\}\[\]\/?.;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi //특수문자
//     let regExpNotEnglish = /[가-힇ㄱ-ㅎㅏ-ㅣぁ-ゔァ-ヴー々〆〤一-龥]/gi //영어가 아닌 문자들
//     let regExpEmoji = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
//     //영어, 이모티콘, 특수문자 검사
//     let correctValue = text.value.replace(regExpEmoji, '').replace(regExpSpecial,'').replace(regExpNotEnglish,'').replace(/\s/gi, '');
//     e.target.value = correctValue;
// }


//input 영어체크
let checkCorrectValue = (text) => {
    let regExpNotEnglish = /[가-힇ㄱ-ㅎㅏ-ㅣぁ-ゔァ-ヴー々〆〤一-龥]/gi //영어가 아닌 문자들
    let regExpEmoji = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    //영어, 이모티콘, 특수문자 검사
    let enValue = text.value.replace(regExpEmoji, '').replace(regExpNotEnglish,'').replace(/\s/gi, '');
    text.value = enValue;
}

//input 사용자이름 체크
let checkNameValue = (text) => {
    let regExpEmoji = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    //영어, 이모티콘, 특수문자 검사
    let enValue = text.value.replace(regExpEmoji, '').replace(/\s/gi, '');
    text.value = enValue;
}

window.addEventListener('unload', function (event) {
    document.getElementById('email_id').value = ''
    document.getElementById('login_pw').value = ''
});

//input 외의 화면 눌렀을 때 '지우기' 버튼 안 보임
document.querySelector('.wrap').addEventListener('click', function(event) {
    if (event.target.tagName !== 'INPUT') {
        $('.text-eraser').removeClass('active');
    }
});