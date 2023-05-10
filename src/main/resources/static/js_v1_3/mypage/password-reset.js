let moveCarousel = 0; //캐러셀 left

//input tab 이동 막기
document.querySelectorAll('input').forEach(e=>e.addEventListener('keydown',(event)=>{
    if(event.keyCode === 9){
        event.preventDefault();
    }
}))
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

//버튼 활성화 (마이페이지 비밀번호 변경)
const btnActivation = (self,btn) => {
    switch (btn) {
        case 'btn_step1':
            if (self.value.length > 1) {
                colorToBlue(true, btn);
            } else {
                colorToBlue(false, btn);
                btn.disabled = true;
            }
            break;
        case 'btn_step2':
            colorToBlue(checkPw(self.value), btn);
            break;
    }
}


//새 비밀번호 입력창으로 이동
//캐러셀 이동 <좌로 당겨진다
const carouselNext = (self) => {
    let btn = document.getElementById(self);
    let carouselItem = btn.parentElement.parentElement; //현재 carousel-item
    let idxThis = carouselItem.getAttribute('id').substr(5); //현재 인덱스
    let idxNext = Number(idxThis)+1;
    let carouselItemNext = document.getElementById('step_'+idxNext);
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const result = vw - 32;
    const calculatedBox = result + 40;
    if($('.w-box').css('width') !== '328px'){
        moveCarousel = -calculatedBox * idxThis;
    }else{
        moveCarousel = -368 * idxThis;
    }
    //캐러셀 이동, css
    carousel.style.cssText = `left: ${moveCarousel}px;`;
    carouselItem.style.cssText = `opacity: 0; transition: all 0.3s ease-in-out 0s;`;
    carouselItemNext.style.cssText = `opacity: 1; transition: all 0.3s ease-in-out 0s;`;
    //다음 버튼
    document.getElementById('btn_step2').style.display = 'block';
    //헤더 변경
    document.querySelector('header').innerHTML =
        `<section id="nav_menu" class="nav_menu">
            <a href="/` + location.pathname.split('/')[1]  + `/mypage/setting" class="btn-cancel">${cancel}</a>
        </section>`;
}

//캐러셀 이동 >우로 당겨진다
if(document.getElementById('btn_goback')){
    document.getElementById('btn_goback').addEventListener('click',()=>{
        let idxThis = btnGoback.dataset.id;
        if(idxThis > '1'){
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
            //다음 버튼
            document.getElementById('btn_step2').style.display = 'none';
        }
    })
}


//현재 비밀번호 확인 api
const checkCurrentPw = (input) => {
    $.ajax ({
        url: "/api/check-password",
        method: "POST",
        type: "json",
        data: {
            password: document.getElementById('user_current_pw').value
        },
        success: function(data){
            // console.log(data)
            if(data === 1){
                //비밀번호가 맞으면 새 비밀번호 입력창으로 이동
                carouselNext('btn_step1');
            }else {
                toastPopup('error',passwordInvalid);
            }
        },
        error: function (request) {
            //비밀번호가 틀리면 에러팝업
            return false
        }
    })
}

//비밀번호 변경
const changeCurrentPw = () => {
    $.ajax({
        url: '/api/new-password',
        method: "POST",
        type: "json",
        data:{
            password: document.getElementById('user_new_pw').value
        },
        success: function (data) {
            // console.log(data)
            if(data === 1){
                //변경된 비번으로 로그인하라는 모달
                modalOpen('modal-changed-pw');
            } else {
                //비밀번호 변경에 실패했다는 안내 필요
                toastPopup('error', passwordInvalid);
            }
        },
        error: function (request) {
            // if(request.status === 403){
            //     return adminLogout();
            // }
        }
    })
}


//비밀번호 보기/숨기기
const pwShowToggleSecond = (input) => {
    let pw = document.getElementById(input);
    if(pw.getAttribute('type') === 'password'){
        pw.setAttribute('type','text');
        document.getElementById('btn_pw_show_second').setAttribute('src','/img/icon_show.png');
    } else {
        pw.setAttribute('type','password');
        document.getElementById('btn_pw_show').setAttribute('src','/img/icon_blind.png');
    }
}


document.querySelectorAll('input').forEach(e=>e.addEventListener('keydown',(event)=>{
    if(event.keyCode === 13) {
        switch (e.id){
            case 'user_current_pw':
                document.getElementById('btn_step1').click();
                break;
            case 'user_new_pw':
                document.getElementById('btn_step2').click();
                break;
        }
    }
}))

