//서비스 이용 전체 체크
const checkBoxAll = (el) => {
    if(el.checked){
        document.querySelectorAll('input[name="service_agree"]').forEach((check)=>{
            check.checked = true;
            el.previousElementSibling.classList.add('active');
            check.previousElementSibling.classList.add('active');
        })
        colorToBlue(true,'btn_accept_service');
        colorToBlue(true,'btn_accept_service');
    } else {
        document.querySelectorAll('input[name="service_agree"]').forEach((check)=> {
            check.checked = false;
            el.previousElementSibling.classList.remove('active');
            check.previousElementSibling.classList.remove('active');
        })
        colorToBlue(false,'btn_accept_service');
        colorToBlue(false,'btn_accept_service');
    }
}
//서비스 이용 개별 체크
const checkBox = (el) => {
    let check = document.querySelectorAll('input[name="service_agree"]');
    let checkAll = document.querySelector('input[name="all_service_agree"]');

    if(el.checked){
        el.previousElementSibling.classList.add('active');
        //필수 체크박스가 모두 선택됐을 때 버튼 활성화
        document.getElementById('ess_personal_info').checked === true && document.getElementById('ess_terms_service').checked === true && document.getElementById('ess_account_service').checked === true ?
            colorToBlue(true,'btn_accept_service') : '';

    } else {
        el.previousElementSibling.classList.remove('active');
        checkAll.checked = false;
        checkAll.previousElementSibling.classList.remove('active');
        //필수 체크박스가 모두 선택되지 않았을 때 버튼 비활성화
        document.getElementById('ess_personal_info').checked === false || document.getElementById('ess_terms_service').checked === false || document.getElementById('ess_account_service').checked === false ?
            colorToBlue(false,'btn_accept_service') : '';
    }
    //체크박스 수와 체크된 박스 수가 같으면 all 체크
    if(check.length === document.querySelectorAll('input[name="service_agree"]:checked').length){
        checkAll.checked = true;
        checkAll.previousElementSibling.classList.add('active');
    }
}


//서비스 이용 동의 api
const acceptService = () => {
    let email = document.getElementById('accept_email').value;
    let nickname = document.getElementById('accept_nickname').value;
    let provider = document.getElementById('accept_provider').value;
    let marketing;
    document.getElementById('cho_marketing_reception').checked ? marketing = true : marketing = false;
    $.ajax({
        url: '/api/sns-register?email=' + email + "&nickname=" + nickname + "&provider=" + provider + "&marketing=" + marketing,
        method: "POST",
        // dataType: "json",
        success: function (data) {
            location.href = "/"+ data + "/login-success";
        },
        error: function (request) {
            console.log(request)
            // if(request.status === 403){
            //     return adminLogout();
            // }
        }
    })
}

//뒤로갈때 쿠키 삭제
document.getElementById('btn_goback').onclick = function (){
    $.ajax ({
        url: "/logout",
        method: "POST",
        type: "json",
        data: {
        },
        success: function(){
            history.back();
        },
        error: function (request) {
        }
    })
}

//Go to terms of service
function goTermsOfService(language, kind){
    location.href = '/' + language +'/mypage/terms-of-service?type='+ kind;
}