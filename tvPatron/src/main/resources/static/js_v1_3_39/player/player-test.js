
var global_currentMinute = 1;
var global_currentSeconds = 9;
fastForward_Rewind(global_currentMinute, global_currentSeconds);

/* progress bar 존재한다 가정하고 현재시간을 상수값으로 선언한다
* 선언한 상수 값을 가지고 10초 되감기, 10초 빨리감기 기능
* */
function fastForward_Rewind(currentMinute, currentSeconds) {

    // window 방향키 왼쪽 이벤트
    window.addEventListener('keydown', function (event) {
        /* 사용자가 왼쪽 이벤트 발생시키면 현재시간을 받아와 10초를 차감한 시간 or 10초를 증가한 시간을 return 해준다
        * event key 값은 switch 함수로 구분한다
        * */
        switch (event.key) {
            case 'ArrowLeft' :
                /* 이벤트 발생할 때 가져온 '초' 9 이하일 때, 50 ~ 59 return
                * 이벤트 발생할 때 가져온 '분' 1 차감 return
                * 이벤트 발생할 때 가져온 '분' 0 일때, 0 return
                * */
                if (currentSeconds <= 9) {

                    var rewindSeconds_nineDown = 10 - currentSeconds; // 가져온 '초' 10 보다 작다
                    var result_rewind_currentSeconds = 60 - rewindSeconds_nineDown; // 계산된 '초' 반환값
                    currentSeconds = result_rewind_currentSeconds; // 차감한 '초' 함수 파라미터값으로 다시 세팅
                    var result_rewind_currentMinute;

                    if (currentMinute != 0) {
                        result_rewind_currentMinute = currentMinute - 1; // 계산된 '분' 반환값
                        currentMinute = result_rewind_currentMinute; // 차감한 '분' 함수 파라미터값으로 다시 세팅
                    } else {
                        result_rewind_currentMinute = 0; // 계산된 '분' 반환값
                        currentMinute = result_rewind_currentMinute; // '분' 초기값으로 함수 파라미터값으로 다시 세팅
                    }

                    // return 하려는 time 화면에 출력
                    var rewind_result_nineDown = document.querySelector('.forward-rewind-result');
                    rewind_result_nineDown.innerHTML = result_rewind_currentMinute + ' : ' + result_rewind_currentSeconds;

                    return result_rewind_currentMinute + ' : ' + result_rewind_currentSeconds;
                } else {
                    var rewindSeconds_nineUp = currentSeconds - 10; // 이벤트 발생할 때 가져온 '초' 10초 차감 및 반환값
                    currentSeconds = rewindSeconds_nineUp; // 차감한 '초' 함수 파라미터값으로 다시 세팅

                    // return 하려는 time 화면에 출력
                    var rewind_result_nineUp = document.querySelector('.forward-rewind-result');
                    rewind_result_nineUp.innerHTML = currentMinute + ' : ' + rewindSeconds_nineUp;

                    return currentMinute + ' : ' + rewindSeconds_nineUp;
                } // 조건문 종료!

                break;
            case  'ArrowRight':

                /* 이벤트 발생할 때 가져온 '초' 50 이상일 때, 0 ~ 9 return
                * 이벤트 발생할 때 가져온 '분' 1 증가 return
                * 이벤트 발생할 때 가져온 '분' 59 일때, 0 return (재생시간이 1시간인 단일 작품이 없기 때문에 '시' 관련 로직 작성안함)
                * */
                if (currentSeconds >= 50) {
                    var forwardSeconds_fiftyUp = 10 + currentSeconds; // 이벤트 발생할 때 가져온 '초' 10초 증가
                    var result_forward_currentSeconds = Math.abs(60 - forwardSeconds_fiftyUp); // 계산된 '초' 반환값, Math.abs : 음수 값을 양수로 변환
                    currentSeconds = result_forward_currentSeconds; // 증가한 '초' 함수 파라미터값으로 다시 세팅
                    var result_forward_currentMinute;

                    if (currentMinute != 59) {
                        result_forward_currentMinute = currentMinute + 1; // 계산된 '분' 반환값
                        currentMinute = result_forward_currentMinute; // 증가한 '분' 함수 파라미터값으로 다시 세팅
                    } else {
                        result_forward_currentMinute = 0; // 계산된 '분' 반환값
                        currentMinute = result_forward_currentMinute; // '분' 초기값으로 함수 파라미터값으로 다시 세팅
                    }

                    // return 하려는 time 화면에 출력
                    var forward_result_fiftyUp = document.querySelector('.forward-rewind-result');
                    forward_result_fiftyUp.innerHTML = result_forward_currentMinute + ' : ' + result_forward_currentSeconds;

                    return result_forward_currentMinute + ' : ' + result_forward_currentSeconds;

                } else {
                    var forwardSeconds_fiftyDown = currentSeconds + 10; // 이벤트 발생할 때 가져온 '초' 10초 증가 및 반환값
                    currentSeconds = forwardSeconds_fiftyDown; // 증가한 '초' 함수 파라미터값으로 다시 세팅

                    // return 하려는 time 화면에 출력
                    var forward_result_fiftyDown = document.querySelector('.forward-rewind-result');
                    forward_result_fiftyDown.innerHTML = currentMinute + ' : ' + forwardSeconds_fiftyDown;

                    return currentMinute + ' : ' + forwardSeconds_fiftyDown;
                } // 조건문 종료!
                break;
        } // switch end
    }); // function window.addEventListener end

    return 'NoAction';

} // function fastForward_Rewind end