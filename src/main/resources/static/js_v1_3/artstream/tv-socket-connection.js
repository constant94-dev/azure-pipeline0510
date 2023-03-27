
let artId = document.getElementById('now_playing_info_artwork_id').innerText;
let exhId = document.getElementById('exhibition_id').innerText;

//소켓 연결 끊기
function disconnectSocket() {
    //tv에서 로그아웃 통신
    $.ajax ({
        url: "/api/disconnect",
        method: "post",
        success: function(data){
            //로그아웃 성공시 이전페이지로 이동 및 success 토스트 팝업 출력
            // console.log(data)
            connect = '';
            $('.connect-text-ui').fadeOut(1000);
            if(document.querySelector('.play-time')){
                document.querySelector('.play-time').style.display = 'block';
            }
            if(document.querySelector('.play-bar')){
                document.querySelector('.play-bar').style.display = 'block';
            }
            toastPopup('normal','연결을 취소했습니다.');
        },
        error: function (request) {
            //비밀번호가 틀리면 에러팝업
            // console.log(request)
        }
    })
}

//===============아트스트림 한정==================
//tv로 player 정보 보내는 통신
let receiveBoolean = location.href.split('&receive=')[1];
// console.log(receiveBoolean)
// console.log(typeof receiveBoolean)
function sendPlayerInfo(bool){
    if(receiveBoolean !== 'true'){
        setTimeout(function(){
            let play = bool;
            artId = document.getElementById('now_playing_info_artwork_id').innerText;
            exhId = document.getElementById('exhibition_id').innerText;
            if(connect !== '' && connect !== 'undefined'){
                $.ajax({
                    url:'/api/request-player',
                    method: "GET",
                    dataType: "json",
                    data: {
                        art_id: artId,
                        exh_id: exhId,
                        play : play,
                    },
                    success: function(data){
                        // console.log('sendPlayerInfo success')
                        //player ui에 연결된 화면이 보인다
                        // if(connect !== null){
                        //     showTvConnected();
                        // }
                    },
                    error: function(){
                    }
                })
            }
        },200)
    }else{
        receiveBoolean = false;
    }
}

//tv연결시 재생/일시정지 tv로 전송
function connectPlayToggle(bool){
    // if(playToggleBoolean) {
        if (connect !== '') {
            bool === true ? sendPlayerInfo(true) : sendPlayerInfo(false);
        } else {
            // console.log('connect 안된듯')
        }
    // }
}



//플레이버튼 눌렀을 때 TV로 전송
function playArtwork(){
    $.ajax({
        url:'/request-player',
        method: "GET",
        dataType: "json",
        data: {
            'play' : true
        },
        success: function(data){
            // console.log(data);
        },
        error: function(){
        }
    })
}

//일시정지 버튼 눌렀을 때 TV로 전송
function pausePlayer(){
    $.ajax({
        url:'/request-player',
        method: "GET",
        dataType: "json",
        data: {
            'play' : false
        },
        success: function(data){
            // console.log(data);
        },
        error: function(){
        }
    })
}
//이전 버튼 눌렀을 때 TV로 전송
function playPrevArtwork(){
    $.ajax({
        url:'/request-player',
        method: "GET",
        dataType: "json",
        data: {
            art_id: artId,
            exh_id: exhId,
        },
        success: function(data){
            // console.log(data);
        },
        error: function(){
        }
    })
}
//다음 버튼 눌렀을 때 TV로 전송
function playNextArtwork(){
    $.ajax({
        url:'/request-player',
        method: "GET",
        dataType: "json",
        data: {
            art_id: artId,
            exh_id: exhId,
        },
        success: function(data){
            // console.log(data);
        },
        error: function(){
        }
    })
}


// let connect = sessionStorage.getItem('connect');
//
// if (connect === '' || connect !== '' || connect === undefined) {
//     console.log('not connected');
// } else {
//     console.log('connected')
//     showTvConnected();
// }