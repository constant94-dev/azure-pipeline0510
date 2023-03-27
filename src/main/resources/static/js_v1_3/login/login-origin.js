/************************/

let carousel = document.getElementById('carousel'); //section
let btnGoback = document.getElementById('btn_goback'); //<- 버튼
let moveCarousel = 0; //캐러셀 left


//input에서 엔터버튼 클릭시 버튼이벤트 동작
document.querySelectorAll('input').forEach(e=>e.addEventListener('keydown',(event)=>{
    if(event.keyCode === 13) {
        let carouselItem = event.target.parentElement.parentElement;
        let idxThis = carouselItem.getAttribute('id').substr(5); //현재 인덱스
        let btn = document.getElementById('btn_step'+idxThis+'');
        let func = btn.getAttribute('onclick').split('(')[0];
        let type = btn.getAttribute('onclick').split("'")[1];
        console.log('carouselItem', carouselItem)
        console.log('idxThis', idxThis)
        console.log('btn', btn)
        console.log('func', func)
        console.log('type', type)
        console.log('여기1')
        // switch (func){
        //     case 'btnNext':
        //         btnNext(btn,type);
        //         break;
        //     case 'loginForm':
        //         loginForm();
        //         break;
        //     case 'signupApi':
        //         signupApi();
        //         break;
        //     case 'changeCurrentPw':
        //         changeCurrentPw();
        //         break;
        //     case 'findPw':
        //         findPw();
        //         break;
        // }
    }
}))

//input tab 이동 막기
// document.querySelectorAll('input').forEach(e=>e.addEventListener('keydown',(event)=>{
//     if(event.keyCode === 9){
//         event.preventDefault();
//     }
// }))

//계속하기,다음 버튼 클릭
const btnNext = (self, stat) => {
    //상태에 따라 통신하거나 다음페이지로 이동시켜준다.
    switch (stat){
        case 'email':
            if(checkEmail(document.getElementById('email_id').value)){
                checkMember(self,document.querySelector('input[type="email"]').value);
            } else {
                self.classList.remove('blue');
                self.disabled = true;
            }
            break;
        case 'next':
            carouselNext(self);
            if(sessionStorage.getItem('code') === '1'){
                //no send
            } else {
                sessionStorage.getItem('email_id') !== undefined ? sendEmail(sessionStorage.getItem('email_id'),'email') : '';
            }
            break;
        case 'code':
            checkAuthKey(document.getElementById('code_input').value, self);
            checkTvCode(self,document.querySelector('input[type="text"]').value);
            break;
        case 'auth':
            checkAuthKey(document.getElementById('auth_code').value, self);
            break;
        case 'text':
            if(checkName(document.getElementById('user_name').value)){
                //이름 형식 오류
            } else {
                self.classList.remove('blue');
                self.disabled = true;
            }
            break;
    }
}

//캐러셀 이동 <좌로 당겨진다
const carouselNext = (self) => {
    // let idxLength = document.querySelectorAll('.carousel-item').length; //전체 인덱스
    let carouselItem = self.parentElement.parentElement; //현재 carousel-item
    let idxThis = carouselItem.getAttribute('id').substr(5); //현재 인덱스
    let idxNext = Number(idxThis)+1;
    let carouselItemNext = document.getElementById('step_'+idxNext);

    //<- 뒤로가기 버튼 none
    if(document.getElementById('btn_goback').getAttribute('data-id') === '2' && url !== '/signup' && url !== '/'){
        document.getElementById('btn_goback').style.display = 'none';
        createBtnCancel();
    } else if(url === '/signup'){
        progressChange('next');
    }
    //캐러셀 이동, css
    moveCarousel = -368 * idxThis;
    carousel.style.cssText = `left: ${moveCarousel}px;`;
    carouselItem.style.cssText = `opacity: 0; transition: all 0.3s ease-in-out 0s;`;
    carouselItemNext.style.cssText = `opacity: 1; transition: all 0.3s ease-in-out 0s;`;
    btnGoback.dataset.id = Number(idxThis) + 1;
    //input 포커스
    setTimeout(()=>{carouselItem.nextElementSibling.querySelector('input').focus();},600);
}
let timeoutFunction
//캐러셀 이동 >우로 당겨진다
document.getElementById('btn_goback') !== null && document.getElementById('btn_goback').addEventListener('click',()=>{
    let idxThis = btnGoback.dataset.id;
    if(idxThis > '1'){
        if(idxThis === '2'){
            $.ajax({
                url:"/api/delete-verification-code",
                type:"POST",
                dataType: "json",
                data: {
                    email: sessionStorage.getItem('email_id'),
                    name: document.getElementById('user_name').value,
                    password: document.getElementById('user_pw').value,
                    marketing: document.getElementById('cho_marketing_reception').checked
                },
                success: function(data){
                    // alert
                    if(data === 1){
                        sessionStorage.setItem('code','0');
                        clearTimeout(timeoutFunction)
                    }
                },
                error: function(){
                    location.reload();
                }
            })
        }
        let idxPrev = Number(btnGoback.dataset.id)-1;
        let carouselItem = document.getElementById('step_'+idxThis);
        let carouselItemPrev = document.getElementById('step_'+idxPrev);

        progressChange('prev');
        //캐러셀 이동, css
        moveCarousel = parseInt(moveCarousel) + 368;
        carousel.style.cssText = `left: ${moveCarousel}px;`;
        carouselItem.style.cssText = `opacity: 0; transition: all 0.3s ease-in-out 0s;`;
        carouselItemPrev.style.cssText = `opacity: 1; transition: all 0.3s ease-in-out 0s;`;
        btnGoback.dataset.id = idxPrev;
        //input 포커스
        setTimeout(()=>{carouselItem.previousElementSibling.querySelector('input').focus();},600);
    }
})

//헤더에 취소버튼 생성
const createBtnCancel = () => {
    let btnCancell = document.createElement('button');
    btnCancell.setAttribute('id','btn_cancel');
    btnCancell.setAttribute('class','btn-cancel');
    btnCancell.setAttribute('onclick','history.go(-1)');
    btnCancell.innerText = '취소';
    document.getElementById('nav_menu').append(btnCancell);
}

//회원가입 - 프로그래스바 단계 변경
const progressChange = (direction) => {
    let step = document.getElementById('btn_goback').dataset.id;
    switch (direction){
        case 'next':
            document.querySelector('.signup-step-progress').value = Number(step) + 1;
            document.getElementById('signup_step').innerText = Number(step) + 1;
            break;

        case 'prev':
            document.querySelector('.signup-step-progress').value = Number(step) - 1;
            document.getElementById('signup_step').innerText = Number(step) - 1;
            break;
    }
}

//링크 이동 (서비스 내 이동)
let linkHref = (link) => {
    //로그인 > 회원가입 페이지 이동시 이메일주소 세션에 담고 아닐시 바로 이동
    link === 'signup' ? sessionStorage.setItem('email_id',document.getElementById('email_id').value) : '';
    location.href = serverUrl +"/" + location.pathname.split('/')[1] +  link;
}

//소셜로그인 링크 이동
const socialHref = (social) => {
    switch (social) {
        case 'google': case '구글':
            location.href = serverUrl + 'oauth2/authorization/google';
            break;
        case 'facebook': case '페이스북':
            location.href = serverUrl + 'oauth2/authorization/facebook';
            break;
        case 'kakao': case '카카오톡':
            location.href = 'https://kauth.kakao.com/oauth/authorize?client_id=48f54d2f32584082c6d37da47a366f3c&redirect_uri=' + serverUrl + '&response_type=code';
            break;
    }
}


//소셜로그인 최근 아이콘 추가
const createIconRecently = () => {
    if(!document.querySelector('.recently')){
        let iconRecently = document.createElement('span');
        iconRecently.setAttribute('class','recently');
        iconRecently.innerText = recent;
        Cookies.get('recentlyLogin') && document.getElementById('btn_'+Cookies.get('recentlyLogin')+'_login').append(iconRecently);
    }
}

//버튼 활성화 (로그인, 회원가입, 비밀번호 찾기)
function btnActivation(self,btn){
    switch (self.type) {
        case 'password':
            colorToBlue(checkPw(self.value), btn);
            break;
        case 'number':
            //TODO AJAX 통신으로 인증 리턴이 트루면 보내자
            colorToBlue(self.value.length > 1, btn);
            break;
        case 'email' :
            colorToBlue(checkEmail(self.value), btn);
            break;
        case 'text' :
            if(self.getAttribute('id') === 'code_input'){
                colorToBlue(self.value.length === 11, btn);
            }else if(self.getAttribute('id') === 'auth_code'){
                colorToBlue(checkCode(self.value), btn);
            }else if(self.getAttribute('id') === 'user_pw'){
                colorToBlue(checkPw(self.value), btn);
            }else {
                colorToBlue(checkName(self.value), btn);
            }
            break;
    }
}

// //비밀번호 보기/숨기기
// const pwShowToggle = (input) => {
//
//     let pw = document.getElementById(input);
//     pw.getAttribute('type') === 'password' ? pw.setAttribute('type','text') : pw.setAttribute('type','password');
// }

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
//이메일 입력 유효성검사
const checkEmail = (val) => {
    // let regExp = new RegExp(/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i);
    if(val.includes("@")){
        return true;
    } else {
        return false;
    }
}
//이름 입력 유효성검사
function checkName(val){
    let regExp = new RegExp(/^[a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]{2,16}$/);
    let spe = new RegExp(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

    //공백 유무, 특수문자 체크
    if(val.search(/\s/) === -1 && spe.test(val) === false){
        return regExp.test(val);
    }
}
//알파벳+숫자 코드 입력 유효성검사
const checkCode = (val) => {
    let regExp = new RegExp(/^[a-zA-Z0-9]{2,16}$/);
    let spe = new RegExp(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

    //공백 유무, 특수문자 체크
    if(val.search(/\s/) === -1 && spe.test(val) === false){
        return regExp.test(val);
    }
}
//서비스 이용 전체 체크
const checkBoxAll = (el) => {
    if(el.checked){
        document.querySelectorAll('input[name="service_agree"]').forEach((check)=>{
            check.checked = true;
            el.previousElementSibling.classList.add('active');
            check.previousElementSibling.classList.add('active');
        })
        colorToBlue(true,'btn_step1');
        colorToBlue(true,'btn_login_next');
    } else {
        document.querySelectorAll('input[name="service_agree"]').forEach((check)=> {
            check.checked = false;
            el.previousElementSibling.classList.remove('active');
            check.previousElementSibling.classList.remove('active');
        })
        colorToBlue(false,'btn_step1');
        colorToBlue(false,'btn_login_next');

    }
}
//서비스 이용 개별 체크
const checkBox = (el) => {
    let check = document.querySelectorAll('input[name="service_agree"]');
    let checkAll = document.querySelector('input[name="all_service_agree"]');

    if(el.checked){
        el.previousElementSibling.classList.add('active');
        //필수 체크박스가 모두 선택됐을 때 버튼 활성화
        document.getElementById('ess_personal_info').checked === true && document.getElementById('ess_terms_service').checked === true ?
            colorToBlue(true,'btn_step1') : '';
        document.getElementById('ess_personal_info').checked === true && document.getElementById('ess_terms_service').checked === true ?
            colorToBlue(true,'btn_login_next') : '';

    } else {
        el.previousElementSibling.classList.remove('active');
        checkAll.checked = false;
        checkAll.previousElementSibling.classList.remove('active');
        //필수 체크박스가 모두 선택되지 않았을 때 버튼 비활성화
        document.getElementById('ess_personal_info').checked === false || document.getElementById('ess_terms_service').checked === false ?
            colorToBlue(false,'btn_step1') : '';
        document.getElementById('ess_personal_info').checked === false || document.getElementById('ess_terms_service').checked === false ?
            colorToBlue(false,'btn_login_next') : '';
    }
    //체크박스 수와 체크된 박스 수가 같으면 all 체크
    if(check.length === document.querySelectorAll('input[name="service_agree"]:checked').length){
        checkAll.checked = true;
        checkAll.previousElementSibling.classList.add('active');
    }
}

//간편로그인으로 계속하기 모달
const socialModal = (social) => {
    let html = `<div class="modal-area">
            <p class="modal-title">
                ${social}${alreadySnsAccount}
            </p>
            <button type="button" id="btn_social_guide" class="btn btn-login-signup" onclick="socialHref('${social}')">간편 로그인</button>
            <button type="button" class="btn-cancel" onclick="modalClose()">${cancel}</button>
        </div>`;
    document.querySelector('.modal-social-guide').innerHTML = html;
    document.querySelector('.modal-social-guide').style.cssText = `display: block`;
}


/******************* ajax 통신 ********************/
//로그인 통신
const loginForm = () => {
    $.ajax({
        url:'/api/login',
        method: "POST",
        type: "json",
        data: {
            'email':document.getElementById('email_id').value,
            'password':document.getElementById('login_pw').value,
            'remember-me':false
        },
        success: function(){
            // location.href = "/" + location.pathname.split('/')[1] + '/login-success'
        },
        error: function (request) {
            toastPopup('error',passwordInvalid);
            return false
        }
    })
}

//회원 가입여부 확인
const checkMember = (self,email) =>{
    $.ajax({
        url:'/api/email-check',
        method: "POST",
        dataType: "json",
        data: {
            email: email
        },
        success: function(provider){
            switch (provider){
                case 'General':
                    //비밀번호 찾기 페이지일경우 인증메일 발송
                    if(document.getElementById('carousel').classList.contains('password-find-section')){
                        sendEmail(document.getElementById('email_id').value,'password');
                    }
                    carouselNext(self);
                    break;
                case 'Google':
                    socialModal('구글');
                    modalOpen('modal-social-guide');
                    break;
                case 'Facebook':
                    socialModal('페이스북');
                    modalOpen('modal-social-guide');
                    break;
                case 'Kakao':
                    socialModal('카카오톡');
                    modalOpen('modal-social-guide');
                    break;
                case -2:
                    toastPopup('error',errorLeftAccount);
                    break;
                default:
                    //-1 가입된 이메일주소가 아닌 경우 회원가입 모달
                    slideModalOpen('modal-signup');
                    break;
            }
        },
        error: function(request){
            // if(request.status === 403){
            //     return adminLogout();
            // }
        }
    })
}


//인증코드 발송 api
const sendEmail = (email,type) => {
    $.ajax({
        url:'/api/email-verification',
        method: "POST",
        dataType: "json",
        data: {
            email: email,
            type: type
        },
        success: function(data){
            if(data === 1){
                sessionStorage.setItem('code','1');
                setTimeout(()=>{sessionStorage.removeItem('code')},18000);
            }
        },
        error: function(request){
            // if(request.status === 403){
            //     return adminLogout();
            // }
        }
    })
}


//인증메일 재발송 텀
const resendEmail = (self) => {
    if(self.disable){
        //no send
        modalClose('btn-resend-mail');
    } else {
        sendEmail(sessionStorage.getItem('email_id'),'email');
        self.disable = true;
        setTimeout(()=>{self.disable = false;},180000); //3분 텀으로 전송
        modalClose('modal-resend-mail');
    }
}


//코드 검사
function checkAuthKey(authKey, self){
    let email;
    if(url === '/signup'){
        email = sessionStorage.getItem('email_id');
    } else {
        email = document.getElementById('email_id').value;
    }
    $.ajax({
        url:'/api/email-verify',
        method: "POST",
        dataType: "json",
        data: {
            email: email,
            authKey: authKey
        },
        success: function(data){
            if(data === 1 && url === '/signup'){
                progressChange('next');
                carouselNext(self);
            } else if(data === 1 && url === '/password-find'){
                carouselNext(self);
            } else {
                toastPopup('error',authenticationCodeInvalid);
            }
        },
        error: function(request){
        }
    })
}

//비밀번호 변경
const findPw = () => {
    if(checkEmail(document.getElementById('email_id').value) &&
        checkPw(document.getElementById('user_pw').value)) {
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
}
//smartTv login
function smartTvLogin(){
    const socketTest = document.getElementById('code_input');
    const inputCode = socketTest.value.split(' ').join('');
    $.ajax({
        url:'/api/tvLogin?code='+inputCode,
        method: "GET",
        dataType: "text",
        success: function(data){
            if(data === '1'){
                checkGAEvent('tv_login_success');
                location.href ="/" + location.pathname.split('/')[1] +'/home'
            }else if( data === '0'){
                $('#code_input').addClass('error');
                $('#error_incorrect_code').css('opacity',1)
                console.log('여기 맞음?')
                // toastPopup('error',authenticationNumberCodeInvalid);
            } else {
                document.getElementById('loginDeviceName').innerText = data;
                modalOpen('modal-disconnect');
            }
        },
        error: function(request){
            toastPopup('error','연결이 원할하지 않습니다.');
        }
    })
}

