/****************************
 *****   giga global     *****
 ****************************/

//giga init object
var userStatus = 0;
var options = {};
var gapikey;
var gkeytype;
var isGenie = false;
var deviceId;
var deviceName;
var provider;
var pageName = location.pathname.split('/').pop();

/******    ******/
/***  최중요  ***/
/******    ******/
if (ser_type == 'main') { //상용용
    gapikey = 'RTUwMDQyMDh8R0JPWENPTU18MTYwMDY3MzQyNzc5Ng=='; // api key given from developer portal
    gkeytype = 'GBOXCOMM'; // 개발자센터에서 승인이 되어야 사용하실 수 있습니다.
} else if (ser_type == 'developed') { //개발용
    gapikey = 'RTUwMDQyMDh8R0JPWERFVk18MTYwMDY2NzU5ODAxNw=='; // api key given from developer portal
    gkeytype = 'GBOXDEVM'; // 개발자모드를 설정하고 사용하세요.
}

//giga open message variable
//기가 메세지 전송 변수
var pushDate = null;
var today_date; //오늘 날짜 넣을 함수

//오늘날짜
today_date = new Date();

//날짜 포맷 변환(2021-03-31 -->03312021)
var y = today_date.getFullYear();
var m = today_date.getMonth();
m = m + 1;
if (m < 10) {
    m = '0' + m;
}
var d = today_date.getDate();
if (d < 10) {
    d = '0' + d;
}
var mdy = m + d + y; //오늘 날짜 포맷 변환된 결과


//giga voice guide
var gigaVoiceGuide = '<div id="voice-guide">' +
    '<div class="genie-voice-guide voice-guide-container">' +
    '<p class="guide-mic">' +
    '<i class="g-voice-icon">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" :style="fill: ${this.color};">' +
    '</svg>' +
    '</i>' +
    '<!-- 호출어 추가 -->' +
    '<!-- gigagenie.appinfo.getUserInfo - extra.kwsid으로 셋팅 -->' +
    '<span id=kws>KWS</span>' +
    '</p>' +
    '<p class="lolling-list">' +
    '<span>발화가이드01</span>' +
    '<span>발화가이드02</span>' +
    '<span>발화가이드03</span>' +
    '</p>' +
    '<p class="voice-guide-common">서비스를 종료하려면 “나가기”</p>' +
    '</div>' +
    '</div>';
var $current = 0;
var $interval;
var timerR;


//giga user info variable
var giga_DevId = null;
var giga_DevType = null;
var giga_Nickname = null;


///////////////////////////////////////

gigainit();

//vsctimer();

// giga exit  id = exit_patron  앱 종료
$document.on('click', '#exit_patron', function (ev) {
    ev.preventDefault();
    exitPatron();
});


// gigagenie
// onAppStatusChange
gigagenie.init.onAppStatusChange = function (extra) {
    if (extra.changeStatus == 0) {
        if (extra.muteFlag == true) {
            setTimeout(function () {
                options = {};
                gigagenie.voice.svcFinished(options, function (result_cd, result_msg, extra) {
                });
            }, 3000);
        } else {
            if (pre_audio != null) {
                pre_audio.play();
            }
            if (pre_video != null) {
                pre_video.play();
            }
        }
    }
}
var giga_addr = 'giga'
var playPauseSwitch = 1;
//발화 스타트
gigagenie.init.onAppStatusChange = function (extra) {
    if (pageName == 'home') {
        var targetAudio = document.getElementById('audio');
        !targetAudio.paused ? targetAudio.pause() : targetAudio.play();
    }
    if (extra.changeStatus == 0) {
        if (extra.muteFlag == true) {
            // 일반적으로 서비스 종료 권고 //mute 상태 (음악 등 재생 불가)||지니야 프로그램 돌때 음성명령이 존재할때
            setTimeout(function () {
                options = {};
                gigagenie.voice.svcFinished(options, function (result_cd, result_msg, extra) {
                });
            }, 3000);
            return gOcation = 1;
        } else {
            // Media Contents Resume //unmute 상태 (음악등 재생 가능)||지니야 프로그램 돌때 음성명령이 없을 때
            if (obj != null) {
                if (gObj == 0) {// 일시 정지 중이었는지
                    //obj.pause()
                } else {//재생 중이었는지
                    obj.play()
                }
            }
            return gOcation = 1;
        }
    }
}

// 인텐트
gigagenie.voice.onActionEvent = function (extra) {
    var intent = extra.actioncode;
    var defaultPath = config_url + urlLanguage;
    switch (intent) {
        case 'Click':
            var cat = extra.parameter['NE-CLICK'];
            switch (cat) {
                case '선택하기':
                    if ($focus.attr('href') != undefined && pageName != 'player') {
                        location.href = $focus.attr('href');
                    }
                    $focus.click();
                    var a = jQuery.Event('keydown');
                    a.which = 13;
                    $focus.trigger(a);
                    break;
            }
            break;

        case 'GoHome':
            window.location.href = urlLanguage + '/home';
            break;

        case 'GoBack':
            window.history.back();
            break;

        case 'ToLike':
            var cat = extra.parameter['NE-LIKE'];
            switch (cat) {
                case '이작품좋아':
                    if (pageName == 'player' && document.getElementById('artwork_liked').getAttribute('value') == 'false') {
                        addLiked();
                        toggleLikedBtn();
                    }
                    break;
            }
            break;

        case 'ToMove':
            var cat = extra.parameter['NE-MOVE'];
            switch (cat) {
                case '이전작품':
                    if (pageName == 'player') {
                        $('.contents-focus').removeClass('contents-focus');
                        changeNextPlayList('prev');
                    }
                    break;
                case '다음작품':
                    if (pageName == 'player') {
                        $('.contents-focus').removeClass('contents-focus');
                        changeNextPlayList('next');
                    }
                    break;
            }
            break;

        case 'ArtistInfo':
            var cat = extra.parameter['NE-ARTISTINFO'];
            switch (cat) {
                case '작가정보':
                    if (pageName == 'player') {
                        $artistProfile.click();
                    }
                    break;
                case '더보기':
                    break;
                case '다른작품':
                    break;
            }
            break;

        case 'ArtworkInfo':
            var cat = extra.parameter['NE-ARTWORKINFO'];
            switch (cat) {
                case '작품정보':
                    if (pageName == 'player') {
                        $('.btn-info').click();
                    }
                    break;
            }
            break;

        case 'AddCollection':
            var cat = extra.parameter['NE-ADDCOLLECTION'];
            switch (cat) {
                case '컬렉션담기':
                    if (pageName == 'player') {
                        $('.btn-collection').click();
                    }
                    break;
            }
            break;

        case 'LookChange':
            var cat = extra.parameter['NE-LOOKCHANGE'];
            switch (cat) {
                case '감상변경':
                    if (pageName == 'player') {
                        toggleOriginMode();
                    }
                    break;
                case '원작감상':
                    if ($('.btn-origin-artwork i').hasClass('origin')) {
                        //이미지 변화
                        $imgCover.addClass('disnone');
                        $imgOrigin.removeClass('disnone');
                        $iconOriginArtwork.removeClass('deactivate');
                        $iconOriginArtwork.removeClass('origin');
                    }
                    break;
                case '기본감상':
                    if (!$('.btn-origin-artwork i').hasClass('origin')) {
                        //이미지 변화
                        $imgCover.removeClass('disnone');
                        $imgOrigin.addClass('disnone');
                        $iconOriginArtwork.addClass('deactivate');
                        $iconOriginArtwork.addClass('origin');
                    }
                    break;
            }
            break;

        case 'Pause_Play':
            var cat = extra.parameter['NE-PAUSE_PLAY'];
            switch (cat) {
                case '일시정지':
                    icon.classList.remove('pause');
                    $pauseText.text('재생');
                    audio.pause();
                    break;
                case '재생':
                    icon.classList.add('pause');
                    $pauseText.text('일시정지');
                    audio.play();
                    break;
            }
            break;

        case 'Controller':
            var cat = extra.parameter['NE-CONTROLLER'];
            switch (cat) {
                case '기능보여줘':
                    if (
                        $('.next-list a').focusout() &&
                        $('#other_curation a').focusout() &&
                        $('.buttons button').focusout()
                    ) {
                        //확인 클릭시 버튼동작 막기(test)
                        if ($playContents.hasClass('disnone')) {
                            $playContents.removeClass('disnone');
                            $btnPause.focus();
                        }
                        fadein();
                    }
                    break;
                default:
                    break;
            }
            break;


        //전체 파라미터 확인 : JSON.stringify(extra)
        case 'CallArtistExh':
            // 카테고리 선택 인텐트가 호출된 경우
            var cata = extra.parameter['NE-ARTIST'];
            switch (cata) {
                case '서기환' :
                    window.location = defaultPath + '/player?artist_id=1973';
                    break;
                case '김창열' :
                    window.location = defaultPath + '/player?artist_id=133';
                    break;
                case '박서보' :
                    window.location = defaultPath + '/player?artist_id=136';
                    break;
                case '고영훈' :
                    window.location = defaultPath + '/player?artist_id=131';
                    break;
                case '이정웅' :
                    window.location = defaultPath + '/player?artist_id=132';
                    break;
                case '쇠라':
                    window.location = defaultPath + '/player?artist_id=110';
                    break;
                case '드가':
                    window.location = defaultPath + '/player?artist_id=103';
                    break;
                case '피사로':
                    window.location = defaultPath + '/player?artist_id=13';
                    break;
                case '뭉크':
                    window.location = defaultPath + '/player?artist_id=18';
                    break;
                case '고흐':
                    window.location = defaultPath + '/player?artist_id=88';
                    break;
                case '고갱':
                    window.location = defaultPath + '/player?artist_id=115';
                    break;
                case '세잔':
                    window.location = defaultPath + '/player?artist_id=72';
                    break;
                case '마네':
                    window.location = defaultPath + '/player?artist_id=17';
                    break;
                case '모네':
                    window.location = defaultPath + '/player?artist_id=15';
                    break;
                default :
            }

            break;

        case 'CallArtwork':
            var cat = extra.parameter['NE-ARTIST'];
            switch (cat) {
                case '서기환' :
                    window.location = defaultPath + '/player?artist_id=1973';
                    break;
                case '김창열' :
                    window.location = defaultPath + '/player?artist_id=133';
                    break;
                case '박서보' :
                    window.location = defaultPath + '/player?artist_id=136';
                    break;
                case '고영훈' :
                    window.location = defaultPath + '/player?artist_id=131';
                    break;
                case '이정웅' :
                    window.location = defaultPath + '/player?artist_id=132';
                    break;
                case '쇠라':
                    window.location = defaultPath + '/player?artist_id=110';
                    break;
                case '드가':
                    window.location = defaultPath + '/player?artist_id=103';
                    break;
                case '피사로':
                    window.location = defaultPath + '/player?artist_id=13';
                    break;
                case '뭉크':
                    window.location = defaultPath + '/player?artist_id=18';
                    break;
                case '고흐':
                    window.location = defaultPath + '/player?artist_id=88';
                    break;
                case '고갱':
                    window.location = defaultPath + '/player?artist_id=115';
                    break;
                case '세잔':
                    window.location = defaultPath + '/player?artist_id=72';
                    break;
                case '마네':
                    window.location = defaultPath + '/player?artist_id=17';
                    break;
                case '모네':
                    window.location = defaultPath + '/player?artist_id=15';
                    break;
                default :
            }
            break;
    }
}


/****************************
 *****   function     *****
 ****************************/

// giga voice guide  기가지니 보이스 가이드(하단에 있는것)
// function vsctimer() {
//     var $interval = setInterval(function () {
//         voiceStepChange()
//     }, 5000);
// }
// voiceStepChange 발화가이드 내용 변경 voice -step
// function voiceStepChange() {
//     var vswL = $('.voice-step').length;
//     var vswLmo = vswL - 1;
//     var vswH = (vswL * 60) + 'px'; //60은 변경 가능 당시 디자인 크기에 맞추어 60
//
//     $current++;
//     if ($current == vswL) $current = 0;
//
//     if ($current == vswLmo) {
//         $('.voice-step-wrap').animate({
//             bottom: 0
//         });
//         $('.voice-step').eq(0).addClass('onVoice').siblings().removeClass('onVoice');
//     } else {
//         $('.voice-step-wrap').animate({
//             bottom: '+=60'
//         }); //60은 변경 가능 당시 디자인 크기에 맞추어 60
//         $('.voice-step').eq($current + 1).addClass('onVoice').siblings().removeClass('onVoice');
//     }
// }

// $.urlParam = function(name){
//     var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
//     if (results==null){
//         return null;
//     }
//     else{
//         return results[1] || 0;
//     }
// }

//giga 초기화
function gigainit() {
    options = {};
    options.apikey = gapikey; //global 객체의 값을 넣는다
    options.keytype = gkeytype; //global 객체의 값을 넣는다

    // giga 초기화 init
    gigagenie.init(options, function (result_cd, result_msg, extra) {
        isGenie = true;
        if (result_cd == 200) {
            // 단말기 타입
            giga_DevType = extra.devicetype; //기가 단말기 모델명 알아오는 곳

            gigagenie.appinfo.getContainerId(options, function (result_cd, result_msg, extra) {
                if (result_cd == 200) {
                    //단말기의 아이디
                    giga_DevId = extra.deviceid; //기가 단말기 고유 아이디 알아오는 곳
                    //session
                    if (giga_Nickname != null && giga_DevId != null && giga_DevType != null) {
                        checkUserData()
                    }
                }
            });
            //user 조회
            gigagenie.appinfo.getUserInfo(null, function (result_cd, result_msg, extra) {
                if (result_cd == 200) {

                    // user가 추가로 입력한 정보 불러올 수는 있음
                    var address = extra.address;
                    var usernickname = extra.usernickname;
                    var kwsid = extra.kwsid;
                    var ispin = extra.ispin;
                    var regspeaker = extra.regspeaker;
                    var registwithapp = extra.registwithapp;

                    //기가 회원 닉네임 알아오는 곳
                    giga_Nickname = extra.usernickname;
                    // alert(giga_Nickname)
                    if (giga_Nickname != null && giga_DevId != null && giga_DevType != null) {
                        checkUserData()
                    }

                } else {
                    //confirm('getUserInfo fail.');
                }
            });

            /* onRemoteKeyEvent  리모컨 키 이벤트 수신 API */
            gigagenie.media.onRemoteKeyEvent = function (extra) {
                //console.log('Getting onRemoteKeyEvent.' + extra.key);
            };

        } else {
            //confirm('init 실패');
        }
    });
}

// voice 처리 관련
gigagenie.voice.onRequestClose = function () {
    // 필요한 경우 3rd party 내부 웹 서비스 종료 처리가 선행되어야 함
    gigagenie.voice.svcFinished(null, function (result_cd, result_msg, extra) {
    });
};

//exit 앱 종료
function exitPatron() {
    //기가 api
    isGenie ? gigagenie.voice.svcFinished() : window.android.exit();
}

// user data
function checkUserData() {
    //confirm 에서만 쓴다면 조건문 달아 주기
    if (pageName == 'setting') {//설정 페이지 일때
        deviceData(giga_DevType, giga_DevId, giga_Nickname)
    }
}

