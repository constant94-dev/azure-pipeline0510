//재생바 시간에 따라 변경
audio.addEventListener('timeupdate', function () {
    var playingPos = audio.currentTime / audio.duration;

    circle.style.left = playingPos * 100 + '%';
    playingBar.style.width = playingPos * 100 + '%';

    if (audio.ended) {
        $btnPause.removeClass('play');
    }
});

playingBar_focus(); // audio 진행바 포커스 관련 함수
/* 플레이어 페이지 play 버튼 리스트에서 상향키 이벤트 있을 때 fixedBar(전역변수) 포커스 된다
 * fixedBar 에서 하향키 이벤트 있을 때 재생(전역변수) 버튼에게 포커스 된다
 * fixedBar 에서 왼쪽키 누를 때 현재 오디오 '분', '초' 가져와서 fastForward_Rewind(currentMinute, currentSeconds) 함수 실행
 * */
function playingBar_focus() {
    var play_buttonList = document.querySelector('.play-buttons'); // 버튼 리스트(정보, 액자모드, 이전작품, 재생, 다음작품, 컬렉션 담기, 좋아요, 기본/오리지널 이미지)

    /* 버튼 리스트(정보, 액자모드, 이전작품, 재생, 다음작품, 컬렉션 담기, 좋아요, 기본/오리지널 이미지)에서 이벤트가 발생하면 동작한다
     * 나열된 버튼 리스트에서 상향키 △ 누르면 fixedBar 포커스됨
     * */
    play_buttonList.addEventListener('keydown', function (event) {
        if (keydownChecker == true) {
            switch (event.keyCode) {
                case 38:
                    fixedBar.focus(); // fixedBar 포커스 기능
                    break;

            } // play_buttonList 포커스 되어 있을 때 switch end
        }
    }); // play_buttonList addEventListener end

    /* fixedBar 에서 이벤트가 발생하면 동작한다
     * ▽ 하향키 이벤트 : fixedBar 포커스 사라짐, btn 포커스 생김
     * ◁ 왼쪽키 이벤트 : 현재 플레이시간 가져와서 10초 감소 함수 시작
     * ▷ 오른쪽키 이벤트 : 현재 플레이시간 가져와서 10초 증가 함수 시작
     * return 값 currentTimeElement 요소의 세팅하면 화면 출력됨
     * audio 태그 사용해서 audio.currentTime 에 return 값 저장
     * */
    fixedBar.addEventListener('keydown', function (event) {
        var audio_currentTime;
        var currentMinutes;
        var currentSeconds;
        if (keydownChecker == true) {
            switch (event.keyCode) {
                case 40:
                    $('.last-inactive').focus();
                    keydownChecker = false
                    setTimeout(function () {
                        keydownChecker = true
                    }, 10)
                    return false; // 단일 스위치가 아니라 멀티 스위치라면 꼭 break 잊지말자!
                case 37:
                    clearTimeout(fadeoutClear);
                    clearTimeout(secondFadeoutClear);
                    fadeoutClear = setTimeout(fadeoutSet, 5000);

                    audio_currentTime = audio.currentTime; // 현재 음악 플레이시간

                    currentMinutes = Math.floor(audio_currentTime / 60); // 음악 플레이시간 '분' 뽑아내기
                    currentSeconds = Math.floor(audio_currentTime - currentMinutes * 60); // 음악 플레이시간 '초' 뽑아내기


                    var rewind_result = fastForward_Rewind(currentMinutes, currentSeconds, 'ArrowLeft'); // 10초 빨리감기 함수 반환값 세팅
                    // 되감기 기능동작 완료 후 10초 감소된 값을 현재 오디오 시간의 세팅
                    audio.currentTime = rewind_result;

                    fixedBar.focus();
                    break;
                case 39:
                    clearTimeout(fadeoutClear);
                    clearTimeout(secondFadeoutClear);
                    fadeoutClear = setTimeout(fadeoutSet, 5000);

                    audio_currentTime = audio.currentTime; // 현재 음악 플레이시간

                    currentMinutes = Math.floor(audio_currentTime / 60); // 음악 플레이시간 '분' 뽑아내기
                    currentSeconds = Math.floor(audio_currentTime - currentMinutes * 60); // 음악 플레이시간 '초' 뽑아내기

                    var forward_result = fastForward_Rewind(currentMinutes, currentSeconds, 'ArrowRight');

                    // 빨리감기 기능동작 완료 후 10초 증가된 값을 현재 오디오 시간의 세팅
                    audio.currentTime = forward_result;
                    fixedBar.focus();
                    break;
                case 38:
                    fadeoutSet();
            } // fixedBar 포커스 되어 있을 때 switch end
        }
    }); // fixedBar addEventListener end

} // function fixedBar_focus() end

function fastForward_Rewind(currentMinute, currentSeconds, currentAction) {

    if (currentAction == 'ArrowLeft') {

        var result_rewind_currentMinute = 0;

        /* 이벤트 발생할 때 가져온 '초' 9 이하일 때, 50 ~ 59 return
         * 이벤트 발생할 때 가져온 '분' 1 차감 return
         * 이벤트 발생할 때 가져온 '분' 0 일때, 0 return
         * */
        if (currentSeconds <= 9) {


            var rewindSeconds_nineDown = 10 - currentSeconds; // 가져온 '초' 10 보다 작다
            var result_rewind_currentSeconds = 60 - rewindSeconds_nineDown; // 계산된 '초' 반환값

            if (currentMinute != 0) {

                result_rewind_currentMinute = currentMinute - 1; // 계산된 '분' 반환값
            } else {

                result_rewind_currentMinute = 0; // 계산된 '분' 반환값
                result_rewind_currentSeconds = 0; // 계산된 '분' 값이 0 이기 때문에 '초'가 9 이하일 때 '초' 반환값도 0 이 된다
            }
            return (result_rewind_currentMinute * 60) + result_rewind_currentSeconds; // '초'를 반환
        } else {

            var rewindSeconds_nineUp = currentSeconds - 10; // 이벤트 발생할 때 가져온 '초' 10초 차감 및 반환값
            return (currentMinute * 60) + rewindSeconds_nineUp; // '초'를 반환
        } // 조건문 종료!
    } else if (currentAction == 'ArrowRight') {


        var result_forward_currentMinute = 0;

        /* 이벤트 발생할 때 가져온 '초' 50 이상일 때, 0 ~ 9 return
         * 이벤트 발생할 때 가져온 '분' 1 증가 return
         * 이벤트 발생할 때 가져온 '분' 59 일때, 0 return (재생시간이 1시간인 단일 작품이 없기 때문에 '시' 관련 로직 작성안함)
         * */
        if (currentSeconds >= 50) {

            var forwardSeconds_fiftyUp = 10 + currentSeconds; // 이벤트 발생할 때 가져온 '초' 10초 증가
            var result_forward_currentSeconds = Math.abs(60 - forwardSeconds_fiftyUp); // 계산된 '초' 반환값, Math.abs : 음수 값을 양수로 변환

            if (currentMinute != 59) {

                result_forward_currentMinute = currentMinute + 1; // 계산된 '분' 반환값
            } else {

                result_forward_currentMinute = 0; // 계산된 '분' 반환값
            }
            return (result_forward_currentMinute * 60) + result_forward_currentSeconds; // '초'를 반환
        } else {

            var forwardSeconds_fiftyDown = currentSeconds + 10; // 이벤트 발생할 때 가져온 '초' 10초 증가 및 반환값

            return (currentMinute * 60) + forwardSeconds_fiftyDown; // '초'를 반환
        } // 조건문 종료!
    } // key event (왼쪽, 오른쪽) 로직 분기를 위한 조건문 종료!

} // function fastForward_Rewind end

// 재생시간
function currentTime() {
    var currentMinutes = Math.floor(audio.currentTime / 60);
    var currentSeconds = Math.floor(audio.currentTime - currentMinutes * 60);
    var durationMinutes = Math.floor(audio.duration / 60);
    var durationSeconds = Math.floor(audio.duration - durationMinutes * 60);

    if (currentMinutes < 10 && currentSeconds < 10) {
        currentTimeElement.innerHTML = '0' + currentMinutes + ':' + '0' + currentSeconds;
    } else if (currentMinutes < 10 && currentSeconds >= 10) {
        currentTimeElement.innerHTML = '0' + currentMinutes + ':' + currentSeconds;
    } else if (currentMinutes >= 10 && currentSeconds < 10) {
        currentTimeElement.innerHTML = currentMinutes + ':' + '0' + currentSeconds;
    } else if (currentMinutes >= 10 && currentSeconds >= 10) {
        currentTimeElement.innerHTML = currentMinutes + ':' + currentSeconds;
    }

    if (durationMinutes < 10 && durationSeconds < 10) {
        durationTimeElement.innerHTML = '0' + durationMinutes + ':' + '0' + durationSeconds;
    } else if (durationMinutes < 10 && durationSeconds >= 10) {
        durationTimeElement.innerHTML = '0' + durationMinutes + ':' + durationSeconds;
    } else if (durationMinutes >= 10 && durationSeconds < 10) {
        durationTimeElement.innerHTML = durationMinutes + ':' + '0' + durationSeconds;
    } else if (durationMinutes >= 10 && durationSeconds >= 10) {
        durationTimeElement.innerHTML = durationMinutes + ':' + durationSeconds;
    }
}

//오디오 재생 위치가 변경되면 초 음성의 현재 위치를 표시
audio.addEventListener('timeupdate', currentTime);


function handleFirstPlay(event) {
    var vid = event.target;

    vid.onplay = null;
}