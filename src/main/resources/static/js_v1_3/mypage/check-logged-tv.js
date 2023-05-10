Cookies.set('triedTvLogin','true');
// let deviceName = document.getElementById('deviceName').value;
// if (deviceName === '' || deviceName === null || deviceName === undefined) {
//     //연결되어있지 않음
// } else {
//     modalOpen('modal-disconnect');
// }

//console.log("check-logged")
//모델명

const loginDeviceNameSelector = document.getElementById('login_device_name');
if(loginDeviceNameSelector !== null){
    modalOpen('modal-disconnect');
}
// $.ajax ({
//     url: "/api/socket-deviceName",
//     method: "GET",
//     success: function (data) {
//         connect = data;
//         //console.log(data);
//         let tvModel = document.querySelectorAll('.tv-model');
//         for(let i=0; i<tvModel.length; i++){
//             tvModel[i].innerText = connect;
//         }
//         if(connect !== ''){
//             // console.log(connect + 'check');
//             modalOpen('modal-disconnect');
//         }
//     }
// });

//TV연결하기
const connectTvs = (el) => {
    let code = document.getElementById(el).value.replaceAll(' ','');
    console.log(code);
    $.ajax ({
        url: "/api/connect?code=" + code,
        method: "GET",
        success: function(data){
            // console.log(data)
            if(data === 1){
                //tv연결 성공시 연결 팝업
                // closeModal('.tv-connection-modal');
                // console.log(url);
                if( !(url === '/setting') ){
                    setTimeout(
                        function (){
                            $.ajax ({
                                url: "/api/socket-deviceName",
                                method: "GET",
                                success: function (data) {
                                    // console.log(data)
                                    connect = data;
                                    let tvModel = document.querySelectorAll('.tv-model');
                                    for(let i=0; i<tvModel.length; i++){
                                        tvModel[i].innerText = connect;
                                    }
                                    modalOpen('modal-connected');
                                }
                            })
                        },1000);
                }
            } else {
                console.log(data)
                toastPopup('error','입력한 숫자코드가 맞지 않습니다.');
            }
        },
        error: function (request) {
            //비밀번호가 틀리면 에러팝업
            //console.log(request)
            toastPopup('error','연결 끊김');
        }
    })
}


//소켓 연결 끊기
function disconnectSocket() {
    //console.log("disconnectSocket()")
    //tv에서 로그아웃 통신
    $.ajax ({
        url: "/api/disconnect",
        method: "post",
        success: function(data){
            //로그아웃 성공시 이전페이지로 이동 및 success 토스트 팝업 출력
            //console.log(data)
            connect = '';
            location.reload();
        },
        error: function (request) {
            //비밀번호가 틀리면 에러팝업
            //console.log(request)
        }
    })
}

$('#code_input').on('focus',function(){
    $(this).removeClass('error');
    $('.error-guide').css('opacity',0);
})

function goHome(){
    location.href = '/' + location.pathname.split('/')[1] + '/home'
}

//이전 버튼 안 보임
const modalDisconnect = document.getElementById("modal_disconnect");
const navMenu = document.getElementById("nav_menu");

// Set up a MutationObserver to watch for changes to box1's style
let observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.attributeName === "style") {
            if (modalDisconnect.style.display === "none") {
                navMenu.style.display = "flex";
            } else {
                navMenu.style.display = "none";
            }
        }
    });
});
observer.observe(modalDisconnect, { attributes: true });

if(document.getElementById("modal_disconnect").style.display === 'block'){
    document.getElementById("nav_menu").style.display = 'none';
}