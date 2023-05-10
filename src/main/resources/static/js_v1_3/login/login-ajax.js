if(location.pathname.split('/').pop() === '/signup'){
    window.onload = () => {
        //이전 페이지가 login이 아닌 경우 login 페이지로 보냄
        let prevUrl = document.referrer.includes('login');
        prevUrl !== true ? location.href = "/" + location.pathname.split('/')[1] + '/login' : '';
    }
    $(window).on("beforeunload", callback);
    function callback(){
        sessionStorage.removeItem('code');
        sessionStorage.removeItem('email_id');
    }
    if(sessionStorage.getItem('email_id') === null){
        location.href = "/" + location.pathname.split('/')[1] + "/login"
    }
}


//회원가입 통신
const signupApi = () => {
    if(checkEmail(sessionStorage.getItem('email_id')) &&
        checkName(document.getElementById('user_name').value) &&
        checkPw(document.getElementById('user_pw').value)){
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
                if(data != ""){
                    //회원가입 완료 페이지로 이동
                    location.href = serverUrl + data + "/" +  "login-success";
                } else {
                    //회원가입 실패 안내 필요
                    modalOpen('modal-signup-error');
                }
            },
            error: function(request){
                console.log("error")
            },
            statusCode: {
                400: function (response){
                    //이메일 형식에 오류!! 안내 필요
                }

            }
        })
    }
}

// 30분동안 회원가입 페이지에 있으면 인증 코드 무효 후 alert
document.getElementById('btn_step1').addEventListener('click',function (){
    // 이벤트 30분
    timeoutFunction = setTimeout(function (){
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
                    sessionStorage.removeItem('code');
                    sessionStorage.removeItem('email_id');
                    modalOpen('modal-signup-timeout');
                } else {
                    location.reload();
                }
            },
            error: function(){
                location.reload();
            }
        })
    },1800000);
})

//서비스 이용 동의
//서비스 이용 전체 체크
const checkBoxAll = (el) => {
    if(el.checked){
        document.querySelectorAll('input[name="service_agree"]').forEach((check)=>{
            check.checked = true;
            el.previousElementSibling.classList.add('active');
            check.previousElementSibling.classList.add('active');
        })
        colorToBlue(true,'btn_step1');
    } else {
        document.querySelectorAll('input[name="service_agree"]').forEach((check)=> {
            check.checked = false;
            el.previousElementSibling.classList.remove('active');
            check.previousElementSibling.classList.remove('active');
        })
        colorToBlue(false,'btn_step1');
    }
}
//서비스 이용 개별 체크
const checkBox = (el) => {
    let check = document.querySelectorAll('input[name="service_agree"]');
    // let checkAll = document.querySelector('input[name="all_service_agree"]');
    let ess_personal_info = document.getElementById('ess_personal_info');
    let ess_terms_service = document.getElementById('ess_terms_service');
    let ess_account_service = document.getElementById('ess_account_service');
    if(el.checked){
        el.previousElementSibling.classList.add('active');
        //필수 체크박스가 모두 선택됐을 때 버튼 활성화
        if(ess_personal_info.checked === true && ess_terms_service.checked === true && ess_account_service.checked === true){
            colorToBlue(true,'btn_step1');
        }
    } else {
        el.previousElementSibling.classList.remove('active');
        // checkAll.checked = false;
        // checkAll.previousElementSibling.classList.remove('active');
        if(ess_personal_info.checked === false || ess_terms_service.checked === false || ess_account_service.checked === false) {
            colorToBlue(false,'btn_step1');
        }
    }
    //체크박스 수와 체크된 박스 수가 같으면 all 체크
    if(check.length === document.querySelectorAll('input[name="service_agree"]:checked').length){
        // checkAll.checked = true;
        // checkAll.previousElementSibling.classList.add('active');
    }
}

//인증코드 발송 api
const sendEmail = (email,type) => {
    if(pathName !== '/signup'){
            processProgress(processIndex+1);
    }
    $.ajax({
        url:'/api/email-verification',
        method: "POST",
        dataType: "json",
        data: {
            email: email,
            type: type
        },
        success: function(data){
            console.log('sendEmail success??')
            console.log(data);
            if(data === 1){
                sessionStorage.setItem('code','1');
                setTimeout(()=>{sessionStorage.removeItem('code')},18000);
            }
        },
        error: function(request){
            toastPopup(failedToSendEmail)
            // if(request.status === 403){
            //     return adminLogout();
            // }
        }
    })
}
let resendSetTimeOut
//인증메일 재발송 텀
const resendEmail = (self,type) => {
    if(self.disable){
        //no send
        toastPopup('success',authenticationCodeResent);
        modalClose('btn-resend-mail');
    } else {
        $.ajax({
            url:'/api/email-verification',
            method: "POST",
            dataType: "json",
            data: {
                email: sessionStorage.getItem('email_id'),
                type: type
            },
            success: function(data){
                if(data === 1){
                    sessionStorage.setItem('code','1');
                    resendSetTimeOut = setTimeout(()=>{sessionStorage.removeItem('code')},30000);
                }
            },
            error: function(request){
                // if(request.status === 403){
                //     return adminLogout();
                // }
            }
        })
        self.disable = true;
        setTimeout(()=>{self.disable = false;},30000); //30초 텀으로 전송
        toastPopup('success',authenticationCodeResent);
        modalClose('modal-resend-mail');
    }
}
