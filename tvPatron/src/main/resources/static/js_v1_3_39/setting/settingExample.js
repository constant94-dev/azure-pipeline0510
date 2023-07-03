//setting.js

//사운드 미리듣기 사용 버튼 클릭시 사용 정보 db에 저장하기
$('#btnSoundpreviewUse').click(function(){
    var is_presound = '사용';

    $.ajax({
        url : 'ajax_set_presound.php',
        type : 'post',
        dataType : 'json',
        data :
            {
                is_presound : is_presound,
            },
        error:function(request,status,error){
        },

    }).done(function(data) {
        if(data.ret == true){
            //사운드 미리듣기 사용 정보 성공적 저장
        }else{
            //에러시
            alert_pop(data.msg);
        }
    });
});

//사운드 미리듣기 사용안함 버튼 클릭시 사용 정보 db에 저장하기
$('#btnSoundpreviewUnuse').click(function(){
    var is_presound = '사용안함';

    $.ajax({
        url : 'ajax_set_presound.php',
        type : 'post',
        dataType : 'json',
        data :
            {
                is_presound : is_presound,
            },
        error:function(request,status,error){
        },

    }).done(function(data) {
        if (data.ret != true) {
            alert_pop(data.msg);
        }
    });
});

if(is_login == 1){
    //로그인시

    //자동 플레이 정보 세팅
    var is_autoplay = data.user.is_autoplay;

    //사운드 미리듣기 정보 세팅
    var is_presound = data.user.is_presound;

    //설정 왼쪽 메뉴 ui 세팅
    var txt = '<p class="tab-head-title op65">정보</p>' +
        '<li class="active"><a href="#dev_info" class="r_menu_item">단말 정보<i class="g-icon icon-more"></i></a></li>' +
        '<p class="tab-head-title op65">기본 설정</p>' +
        '<li><a href="#auto_play" class="r_menu_item">자동 플레이<i class="g-icon icon-more"></i></a></li>' +
        '<li><a href="#sound_preview" class="r_menu_item">사운드 미리듣기<i class="g-icon icon-more"></i></a></li>' +
        '<p class="tab-head-title op65 guest_not_view">언어 및 위치</p>' +
        '<li><a href="#language_select" class="r_menu_item guest_not_view">언어 선택<i class="g-icon icon-more"></i></a></li>' +
        '<li><a href="#location_select" class="r_menu_item guest_not_view">위치<i class="g-icon icon-more"></i></a></li>' +
        '<p class="tab-head-title op65 guest_not_view">기록 및 데이터</p>' +
        '<li><a href="#enjoy_history_delete" class="r_menu_item guest_not_view">감상 기록 지우기<i class="g-icon icon-more"></i></a></li>' +
        '<li><a href="#search_history_delete" class="r_menu_item guest_not_view">검색 기록 지우기<i class="g-icon icon-more"></i></a></li>' +
        '<li><a href="#app_reset" class="r_menu_item guest_not_view">앱 재설정<i class="g-icon icon-more"></i></a></li>' +
        '<p class="tab-head-title op65 guest_not_view">이용약관 및 개인정보</p>' +
        '<li><a href="#agree_service" class="r_menu_item guest_not_view">서비스 이용약관<i class="g-icon icon-more"></i></a></li>' +
        '<li><a href="#agree_privacy" class="r_menu_item guest_not_view">개인정보 활용 동의<i class="g-icon icon-more"></i></a></li>';
    $('#setting_ul').append(txt);
}

//artist.js
//작가 리스트에 포커스 갔을 때
$document.on('focus', '.list_artist', function(){
    var id_artist = $(this).attr('id_artist');

    //배경 텍스트 설정
    back_txt_set_artist(id_artist);

    //배경 이미지 설정(작가의 대표 작품 이미지 설정)
    back_img_set_artist(id_artist);

    //사운드 미리듣기 세팅
    pre_sound_play_artist(id_artist);

});

//common.js
//사운드 미리듣기 관련 변수 ===========================================
//사운드 미리듣기 변수
var is_presound;

//오디오 객체
var pre_audio = null; // = new Audio();

//2초 뒤 플레이 시키는 timer id
var twosecond;

//비디오 객체
var pre_video = null;
//사운드 미리듣기 관련 변수 ===========================================

//사운드 미리듣기 (작가)
function pre_sound_play_artist(id_artist){

    //미리듣기가 세팅 되어 있는지 조사
    if(is_presound == 1){

        //기존에 플레이 중인 사운드가 있다면 멈춰야 한다.
        audio_init();

        //기존에 플레이 중인 영상이 있다면 멈춰야 한다.
        video_init();

        //해당 artist 정보 조회
        var artist = get_js_db_artist(id_artist);

        if(artist != 'empty'){
            //작가 정보가 있으면
            if(artist.artwork_rep != 0){
                //console.log('play');
                //작가의 대표 작품이 있다면(작가관련 작품이 없을 때는  없다.)
                var is_video = artist.artwork_rep.is_video;

                if(is_video == 0){
                    //작품의 사운드 정보 가져온다.
                    var sound_src = artist.artwork_rep.sound.s_src;

                    //비디오가 아니면 배경음악을 플레이한다.
                    play_sound(sound_src);
                }else if(is_video == 1){
                    //작품의 영상 정보를 가져온다.
                    var video_src = artist.artwork_rep.hdVideo_src;
                    //비디오 이면 영상을 플레이한다.
                    play_video(video_src);
                }
            }
        }

    }
}

//사운드 미리듣기 (작품)
function pre_sound_play_artwork(id_artwork){

    //미리듣기가 세팅 되어 있는지 조사
    if(is_presound == 1){

        //기존에 플레이 중인 사운드가 있다면 멈춰야 한다.
        audio_init();

        //기존에 플레이 중인 영상이 있다면 멈춰야 한다.
        video_init();

        //해당 작품 오디오 / 비디오 읽기
        var artwork = get_js_db_artwork(id_artwork);

        var is_video = artwork.is_video;

        if(is_video == 0){
            //작품의 사운드 정보 가져온다.
            var sound_src = artwork.sound.s_src;
            //비디오가 아니면 배경음악을 플레이한다.
            play_sound(sound_src);
        }else if(is_video == 1){
            //작품의 영상 정보를 가져온다.
            var video_src = artwork.hdVideo_src;
            //영상 플레이
            play_video(video_src);
        }

    }
}

//사운드 미리듣기 (
// 컬렉션)
function pre_sound_play_col(id_col){

    //미리듣기가 세팅 되어 있는지 조사
    if(is_presound == 1){

        //기존에 플레이 중인 사운드가 있다면 멈춰야 한다.
        audio_init();

        //기존에 플레이 중인 영상이 있다면 멈춰야 한다.
        video_init();

        //해당 col 정보
        var col = get_js_db_col(id_col);

        if(col != 'empty'){
            //컬렉션 정보가 있을 때
            if(col.artwork_rep != 0){

                var is_video = col.artwork_rep.is_video;

                if(is_video == 0){
                    //작품의 사운드 정보 가져온다.
                    var sound_src = col.artwork_rep.sound.s_src;

                    //비디오가 아니면 배경음악을 플레이한다.
                    play_sound(sound_src);
                }else if(is_video == 1){
                    //작품의 영상정보를 가져온다.
                    var video_src = col.artwork_rep.hdVideo_src;

                    //영상 플레이
                    play_video(video_src);
                }
            }
        }

    }
}

