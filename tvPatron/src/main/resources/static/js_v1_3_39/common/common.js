//url
//모달
var searchInputFocusBoolean = false;
var page = window.location.pathname;
var moveItemParentsSetTimeOut;
var urlLanguage = '/' + location.pathname.split('/')[1]
var adVersion;
var statusInterval;
var toastModalTimeOut;
var deviceNation = '';
var advData;
var keydownChecker = true;


var $document = $(document);
var $body = $('body');

var $active = $('.active');
var $adPop = $('#ad_pop');
var $artistList = $('#artist_list');
var $artistProfile = $('#artist_profile');
var $artistResult = $('#artist_result').val();
var $backImg = $('#back_img');
var $btnArtistsClose = $('#btn_artists_close');
var $btnGoBack = $('.btn-go-back');
var $btnMoreArtist = $('.btn-more-artist');
var $btnPause = $('#btn_pause');
var $btnPlay = $('.btn-play');
var $btnPlayA = $('.btn-play a');
var $carousel = $('.carousel');
var $carouselContainer = $('#carousel_container');
var $cateGuide = $('#cate_guide');
var $category = $('.category');
var $categoryA = $('.category a');
var $categoryLiA = $('.category li a');
var $detailModal = $('#detail_modal');
var $explanation = $('.explanation');
var $fakeSearchLeft = $('.fake-search-left');
var $focus = $(':focus');
var $goBackGuide = $('.go-back-guide');
var $headerHome = $('#header_home');
var $headerSearch = $('#header_search');
var $iconGoBack = $('.icon-go-back');
var $iconLike = $('.icon-like');
var $iconOriginArtwork = $('.icon-origin-artwork');
var $imgCover = $('#img_cover');
var $imgOrigin = $('#img_origin');
var $infoModalScroll = $('.info-modal-scroll');
var $itemA = $('.item-a');
var $itemA2 = $('.item a');
var $itemBox = $('.item-box');
var $itemContainer = $('.item-container');
var $itemContainerItem = $('.item-container .item');
var $itemContainerLi = $('.item-container li a');
var $itemSpan = $('.item span');
var $lastInactive = $('.last-inactive');
var $loginStatus = $('#login_status').val();
var $menu = $('.menu');
var $pauseText = $('.pause-text');
var $playContents = $('#play_contents');
var $proArea = $('.pro-area');
var $qrLoginModal = $('#qr_login_modal');
var $searchAreaA = $('.search-area a');
var $searchBox = $('.search-box');
var $searchGuide = $('.search-guide');
var $searchKey = $('.search-key');
var $seeAdModalNoMore = $('#see_ad_modal_no_more');
//common only
var $allArtistsContainerItemBox = $('.all-artists-container .item-box');
var $btnLoginClose = $('#btn_login_close');
var $code = $('.code');
var $lastFocused = $('.last-focused');
var $sectionCode = $('.section-code');
var $sectionQrCode = $('.section-qrcode');




function showToastModal(sentence) {
    var $toastModal = $('.toast-modal');
    if ($toastModal.length) {
        $toastModal.find('p').text(sentence);
    } else {
        var tag =
            '<div class="toast-modal">' +
            '<p>' + sentence + '</p>' +
            '</div>';
        $body.append(tag);
        $toastModal = $('.toast-modal');
    }
    clearTimeout(toastModalTimeOut);
    toastModalTimeOut = setTimeout(function() {
        $toastModal.remove();
    }, 3000);
}


if (page != urlLanguage + '/smartTvLogin') {
    $.ajax({
        url: '/api/country-code',
        method: 'post',
        data: {},
        success: function(e) {
            ipAddress = e.toUpperCase();
            deviceNation = e.toUpperCase();
        }
    })
}

/***************************기가지니 리모콘 막기***************************/
document.addEventListener('keydown', function(event) {
    if (event.keyCode == '37' || event.keyCode == '38' || event.keyCode == '39' || event.keyCode == '40') {
        event.returnValue = false;
    }
})

/****************************************************************************************************************/

//스크롤 방지 함수
function avoidScrollTop() {
    document.getElementById('carousel').scrollTop = 0;
}

//작품 포커스시 음악 미리듣기
function audioPlay() {
    if (Cookies.get('prevSound') != '0') {
        function increaseVolume(audio, duration) {
            var start = new Date().getTime();
            var end = start + duration;
            var currentVolume = audio.volume;
            var targetVolume = 1.0;

            function updateVolume() {
                var currentTime = new Date().getTime();
                var volume = ((currentTime - start) / duration) * (targetVolume - currentVolume) + currentVolume;
                if (volume > 1.0) {
                    volume = 1.0;
                }
                audio.volume = volume;
                if (currentTime < end) {
                    requestAnimationFrame(updateVolume);
                }
            }
            requestAnimationFrame(updateVolume);
        }
        audio = document.getElementById('audio');
        if (audio != null) {
            setTimeout(function() {
                if ($btnPlay.is(':focus')) {
                    return;
                }
                audio.volume = 0; //  0% 볼륨에서 시작
                audio.play();
                increaseVolume(audio, 3000); // 3초에 걸쳐 커짐
            }, 2000)
        }
    }

}
//item이 왼쪽으로 이동하는 함수 moveItem
//item : 테두리가 생길 태그 container : 그 태그를 둘러싸고있는 position이 잡힌 박스
//length: 박스의 가로 넓이 + 마진값
function moveCategoryItem(item) {
    $(item).on({
        focus: function() {
            var $this = $(this);
            var itemBorder = $this.children('.item-border'); //해당 item의 테두리
            var $container = $this.parents('.item-container');
            //$length : 박스의 가로 넓이 + 마진값
            var $length;
            if ($container.hasClass('artist-list')) {
                // home
                $length = 256
            } else if ($container.hasClass('favorite-artists')) {
                // storage
                $length = 256
            } else {
                $length = 420
            }
            $this.children('.item-border').css('opacity', 1); //작품 테두리
            $body.css('top', 0);
            var lastCount = $container.find(".item").length - 1;
            var selfNum = $this.parent().index();
            var cateNum = $this.parents('.category').index();
            var itemHref = $this.attr('href'); //해당 item-a의 href
            $category.css('opacity', 1);
            for (var i = 0; i < cateNum; i++) {
                $category.eq(i).css('opacity', 0);
            }
            if (selfNum == lastCount) {
                $container.find('li').removeClass('active');
                $container.find('li').eq(0).addClass('active');
                $container.css('left', 0);
                $container.find('li').eq(0).find('a').focus();
            } else {
                var num = $this.parent().index();
                var left = num * -$length;
                clearTimeout(moveItemParentsSetTimeOut);
                moveItemParentsSetTimeOut = setTimeout(function() {
                    itemBorder.addClass('on'); //전시 테두리
                    itemBorder.css('opacity', 1); //작품 테두리
                }, 10)
                $container.css('left', left + 'px');
                if (num == 0) {
                    $container.css('left', 0);
                }
                if (num == 1) {
                    $container.css('left', -$length);
                }
            }
            //해당 작품 href 데이터가 없을 경우 링크이동안함
            if (itemHref.indexOf('no_data') != -1) {
                $this.attr('href', 'javascript:void(0)');
            }
        },
        blur: function() {
            var $this = $(this);
            var itemBorder = $this.children('.item-border');
            //해당 작품에서 포커스가 나가면 음악을 정지시키고, id를 지움
            itemBorder.removeClass('on'); //전시 테두리
            itemBorder.css('opacity', 0); //작품 테두리
            if (!($qrLoginModal.length > 0 && $qrLoginModal.css('display') == 'block')) {
                audio = document.getElementById('audio');
                if (audio != null) {
                    audio.currentTime = 0;
                    audio.load();
                    audio.pause();
                    clearTimeout(audioPlay);
                }
            }
        }
    })
}

function movePlainItem(item, container, length) {
    $(item).on({
        focus: function() {
            var $this = $(this);
            var itemBorder = $this.children('.item-border'); //해당 item의 테두리
            var $container = $(container);
            $this.children('.item-border').css('opacity', 1); //작품 테두리
            $body.css('top', 0);
            var lastCount = $container.find(".item").length - 1;
            var selfNum = $this.parent().index();
            var cateNum = $this.parents('.category').index();
            var itemHref = $this.attr('href'); //해당 item-a의 href
            $category.css('opacity', 1);
            for (var i = 0; i < cateNum; i++) {
                $category.eq(i).css('opacity', 0);
            }
            if (selfNum == lastCount) {
                $container.find('li').removeClass('active');
                $container.find('li').eq(0).addClass('active');
                $container.css('left', 0);
                $container.find('li').eq(0).find('a').focus();
            } else {
                var num = $this.parent().index();
                var left = num * -length;
                clearTimeout(moveItemParentsSetTimeOut);
                moveItemParentsSetTimeOut = setTimeout(function() {
                    itemBorder.addClass('on'); //전시 테두리
                    itemBorder.css('opacity', 1); //작품 테두리
                }, 10)
                $container.css('left', left + 'px');
                if (num == 0) {
                    $container.css('left', 0);
                }
                if (num == 1) {
                    $container.css('left', -length);
                }
            }
            //해당 작품 href 데이터가 없을 경우 링크이동안함
            if (itemHref.indexOf('no_data') != -1) {
                $this.attr('href', 'javascript:void(0)');
            }
        },
        blur: function() {
            var $this = $(this);
            var itemBorder = $this.children('.item-border');
            //해당 작품에서 포커스가 나가면 음악을 정지시키고, id를 지움
            itemBorder.removeClass('on'); //전시 테두리
            itemBorder.css('opacity', 0); //작품 테두리
            if (!($qrLoginModal.length > 0 && $qrLoginModal.css('display') == 'block')) {
                audio = document.getElementById('audio');
                if (audio != null) {
                    audio.currentTime = 0;
                    audio.load();
                    audio.pause();
                    clearTimeout(audioPlay);
                }
            }
        }
    })
}
$itemA.on('focus', function() {
    var $this = $(this);
    var audioSrc = $('#audio source').attr('src');
    if (!(audioSrc == undefined || audioSrc == 'undefined' || $this.hasClass('no-content') || $this.hasClass('fake') || ($qrLoginModal.length > 0 && $qrLoginModal.css('display') == 'block'))) {
        var targetHref = $this.attr('href');
        var param;
        if (targetHref.match('player')) {
            param = targetHref.replace('/player?', '').split('&')[0]
        }
        if (targetHref.match('artist')) {
            param = targetHref.replace('/artist?', '')
        }
        if ($this.hasClass('coming-soon-item')) {
            param = 'exh_id=' + $this.children('input').val();
        }
        param = param.replace('/ko', '')
        param = param.replace('/en', '')
        param = param.replace('/ja', '')
        $.ajax({
            url: '/api/sound?' + param,
            method: 'GET',
            success: function(data) {
                $('#audio source').attr('src', data);
                if (document.getElementById('audio') != null) {
                    setAudioVolume('audio');
                }
                setTimeout(function() {
                    document.getElementById('audio').load();
                    audioPlay();
                }, 1000);
            }
        });
    }
});




$itemA.on('blur', function() {
    if (document.getElementById('audio') != null) {
        setTimeout(function() {
            if (!($qrLoginModal.length > 0 && $qrLoginModal.css('display') == 'block')) {
                document.getElementById('audio').load();
                document.getElementById('audio').pause();
                clearTimeout(audioPlay);
            }
        }, 1000);
    }
})

function spinnerNone() {
    var $loadingSpinner = $('.loading-spinner');
    $('.loading-logo, .loading-circle').css('display', 'none');
    $loadingSpinner.css('opacity', 0);
    setTimeout(function() {
        $loadingSpinner.remove();
    }, 500)
}

//시간차 remote.js append함수.
function remoteJsAppend() {
    var script = document.createElement('script');
    script.setAttribute('src', '/js_v1_3_39/common/remote-control-original.js');
    script.setAttribute('id', 'remoteControlJs');
    document.body.appendChild(script);
    setTimeout(function() {
        document.getElementById('remoteControlJs') == 'null' ? remoteJsAppend() : '';
    }, 2000)
}
//로드시 각 페이지에서 js넣기, 스피너, 포커스

$(window).on('load', function() {
    switch (page) {
        case urlLanguage + '/home':
            $.ajax({
                url: '/advertisement?name=tvOngoingEvent',
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    adVersion = parseInt(data.file);
                    advData = data.status;
                    var cookiePromotion = Cookies.get('promotion');
                    if (cookiePromotion != '') {
                        if (cookiePromotion != adVersion.toString()) {
                            Cookies.remove('promotion');
                        }
                    }
                    var $firstMainCurationLink = $('#main_curation li:nth-of-type(1) a');
                    if (cookiePromotion == adVersion.toString()) {
                        $firstMainCurationLink.focus();
                    }
                    if (cookiePromotion == '') {
                        $firstMainCurationLink.focus();
                    }
                    if (data.status == false && (cookiePromotion == undefined || cookiePromotion == 'undefined')) {
                        $firstMainCurationLink.focus();
                    }
                    var $eventImg = $('#event_img');
                    if (deviceNation == '') {
                        $.ajax({
                            url: '/api/country-code',
                            method: 'post',
                            data: {},
                            success: function(e) {
                                deviceNation = e.toUpperCase();
                                if (data.status == true && deviceNation == 'KR' && (cookiePromotion == undefined || cookiePromotion == 'undefined')) {
                                    $eventImg.attr('src', data.image);
                                    $adPop.css('display', 'block');
                                    $seeAdModalNoMore.focus();
                                }
                            }
                        })
                    } else {
                        if (data.status == true && deviceNation == 'KR' && (cookiePromotion == undefined || cookiePromotion == 'undefined')) {
                            $eventImg.attr('src', data.image);
                            $adPop.css('display', 'block');
                            $seeAdModalNoMore.focus();
                        }
                    }
                },
                error: function() {}
            })
            break;
        case urlLanguage + '/storage':
            //보관함 - 컬렉션 첫번째 a
            $('.my-collection').find('li').eq(0).find('a').focus();
            break;
        case urlLanguage + '/search':
            //검색 - 확인키를 눌러 검색해보세요
            $searchGuide.focus();
            break;
        case urlLanguage + '/search-result':
            if ($artistResult > 0) {
                //아티스트 검색결과 있으면 첫번째 아티스트에 포커스
                $artistList.find('li').eq(0).find('a').focus();
            } else {
                //아티스트 검색결과 없으면 작품 검색결과에 포커스
                $carousel.find('li').eq(0).find('a').focus();
            }
            break;
        case urlLanguage + '/search-noresult':
            $itemBox.find('li').eq(0).find('a').focus();
            break;
        case urlLanguage + '/player':
            //플레이어 - 재생
            $btnPause.focus();
            break;
        case urlLanguage + '/artist':
            $btnPlayA.focus();
            break;
        default:
            break;
    }

    if (page == urlLanguage + '/home') {
        spinnerNone();
        setTimeout(function() {
            $.ajax({
                url: '/advertisement?name=tvOngoingEvent',
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    advData = data.status;
                    if (advData == false && (Cookies.get('promotion') == undefined || Cookies.get('promotion') == 'undefined')) {
                        remoteJsAppend();
                    }
                    if (Cookies.get('promotion') == data.file) {
                        remoteJsAppend();
                    }
                    if (Cookies.get('promotion') == '') {
                        remoteJsAppend();
                    }
                },
                error: function() {}
            })
        }, 1500);
    } else if (page == urlLanguage + '/artists-all') {
        spinnerNone();
    } else {
        spinnerNone();
        setTimeout(function() {
            remoteJsAppend();
        }, 800);
    }
})

//사운드 미리듣기 볼륨 설정
function setAudioVolume(ele) {
    var prevSound = Cookies.get('prevSound');
    var audioDom = document.getElementById(ele);
    if (prevSound == '1') {
        // play
        audioDom.volume = 1;
    } else if (prevSound == '0') {
        // not play
        audioDom.volume = 0;
    } else {
        //default - play
        audioDom.volume = 1;
    }
}

//n글자 제한 함수
function sliceTxt(id, n) {
    var container = document.getElementById(id);
    var intro_txt = container.innerHTML; //텍스트
    var intro_len = intro_txt.length //텍스트의 글자 수
    var brief = intro_txt.slice(0, n) + '···'; //n자까지 출력
    if (intro_len >= n) { //글자수가 n자 이상일 경우
        container.innerHTML = brief;
    }
}

if (page != '/player') {
    var $myCollectionItemBoxFirstLiA = $('.my-collection .item-box li:nth-of-type(1) a');
    $('.category .item-box li a, #main_curation li a').on({
        focus: function() {
            var $this = $(this);
            if ($this.parents('li').index() > 0) {
                $menu.css('display', 'none');
                $menu.css('left', '-444px');
            } else {
                $menu.css('display', 'block');
                $menu.css('left', '0');
            }
        },
        blur: function() {
            var $this = $(this);
            //보관함>내 컬렉션 내 컬렉션의 첫번째 item에서 메뉴로 이동할 때 '.contents-focus'넣어줌
            if ($this.parents('.category').hasClass('my-collection')) {
                $categoryA.removeClass('contents-focus');
                $myCollectionItemBoxFirstLiA.addClass('contents-focus');
            }
        }
    })
}

//삼성 이전 버튼
$document.on('keydown', function(e) {
    switch (e.keyCode) {
        case 10009:
            history.go(-1);
            break;
        case 461:
            history.go(-1);
            break;
    }
})

var wheelBoolean = true;
var settingFocusIndex = 0;
setTimeout(function() {
    $document.on('mousewheel', function(e) {
        if (wheelBoolean == true) {
            wheelBoolean = false;
            var wheel = e.originalEvent.wheelDelta;
            var up = $.Event('keydown');
            up.which = 38;
            up.keyCode = 38;
            var down = $.Event('keydown');
            down.which = 40;
            down.keyCode = 40;
            if (wheel > 0) {
                $focus.trigger(up)
            } else {
                $focus.trigger(down)
            }
            setTimeout(function() {
                wheelBoolean = true;
            }, 250)
        }
    });
}, 1500)

function exitLG() {
    webOS.platformBack();
    window.close();
}

//QR Code Login
function toastLogin() {
    $body.addClass('login');
    $qrLoginModal.css('display', 'block');
    $btnLoginClose.focus();
    document.getElementById('qrCode').innerHTML = '';
    $.ajax({
        url: '/api/device-data',
        type: 'post',
        dataType: 'json',
        data: {},
        error: function(error) {},
        success: function(data) {
            deviceId = data['deviceId'];
            deviceName = data['deviceName'];
            provider = data['modelType'];
            //QR 생성
            //TODO 배포 시 체크
            var server_url = 'https://patron.digital' + urlLanguage + '/';
            var options = {
                width: 280,
                height: 280,
                rander: 'canvas',
                text: server_url + 'login?deviceId=' + data['deviceId'] + '&deviceName=' + data['deviceName'] + '&utm_source=modalQRscan'
            }
            $('#qrCode').qrcode(options);
            setTimeout(function() {
                qrCodeCheckFunction();
            }, 1000)
        }
    })
}

function closeLoginModal() {
    var $headerFocus = $('.header-focus');
    if (location.href.split('/').pop() == 'setting') {
        gtag('event', 'login_setting_cancel');
    } else {
        gtag('event', 'login_cancel_step1');
    }
    $sectionCode.removeClass('black');
    if ($('.last-inactive').length > 0) {
        $('.last-inactive').focus();
    } else if ($('.contents-focus').length > 0) {
        $('.contents-focus').focus();
    } else if ($headerFocus.length > 0) {
        $headerFocus.focus();
    } else {
        $headerHome.focus();
    }
    $body.removeClass('login');
    $qrLoginModal.css('display', 'none');
    $.ajax({
        url: '/api/device-data',
        type: 'post',
        dataType: 'json',
        data: {},
        error: function(error) {},
        success: function(data) {
            deviceId = data['deviceId'];
            deviceName = data['deviceName'];
            provider = data['modelType'];
            //QR 다음
            $code.text('');
            $sectionQrCode.show();
            $sectionCode.hide();
            $.ajax({
                url: '/login/delete-code',
                type: 'post',
                dataType: 'json',
                data: {
                    deviceId: deviceId,
                    deviceName: deviceName,
                },
                error: function(error) {},
                success: function(data) {
                    if (data == 1) {
                        qrCodeCheckFunction();
                    }
                }
            });
        }
    })
}

function progressListen() {
    $.ajax({
        url: '/api/device-data',
        type: 'post',
        dataType: 'json',
        data: {},
        error: function(error) {},
        success: function(data) {
            deviceId = data['deviceId'];
            deviceName = data['deviceName'];
            provider = data['modelType'];
            $.ajax({
                url: '/login/request-code',
                type: 'post',
                dataType: 'json',
                data: {
                    deviceId: deviceId,
                    deviceName: deviceName,
                },
                error: function(error) {},
                success: function(data) {
                    data = data.toString().split('');
                    data.splice(3, 0, ' ');
                    data.splice(7, 0, ' ');
                    data = data.join('');
                    $code.text(data);
                }
            })
        }
    })
}
// QR Login 1단계 보여줌
function showFirstQRStage() {
    gtag('event', 'login_cancel_step2');
    $.ajax({
        url: '/api/device-data',
        type: 'post',
        dataType: 'json',
        data: {},
        error: function(error) {},
        success: function(data) {
            deviceId = data['deviceId'];
            deviceName = data['deviceName'];
            provider = data['modelType'];
            //QR 다음
            $code.text('');
            $sectionQrCode.show();
            $sectionCode.hide();
            $.ajax({
                url: '/login/delete-code',
                type: 'post',
                dataType: 'json',
                data: {
                    deviceId: deviceId,
                    deviceName: deviceName,
                },
                error: function(error) {},
                success: function(data) {
                    if (data == 1) {
                        qrCodeCheckFunction();
                    }
                }
            });
        }
    })
    $btnLoginClose.attr('onclick', 'closeLoginModal()');
    $sectionQrCode.show();
    $sectionCode.hide()
}
// QR Login 2단계 보여줌
function showSecondQRStage() {
    $btnLoginClose.attr('onclick', 'showFirstQRStage()');
    $sectionQrCode.hide();
    $sectionCode.show()
}

function qrCodeCheckFunction() {
    $.ajax({
        url: '/api/device-data',
        type: 'post',
        dataType: 'json',
        data: {},
        error: function(error) {
            console.log(error);
        },
        success: function(data) {
            deviceId = data['deviceId'];
            deviceName = data['deviceName'];
            provider = data['modelType'];

            qrcodeCheck = setInterval(function() {
                $.ajax({
                    url: '/login/check-code',
                    type: 'post',
                    data: {
                        deviceId: deviceId,
                        deviceName: deviceName,
                    },
                    error: function(error) {},
                    success: function(data) {
                        console.log('data', data);
                        if (data != '') {
                            showSecondQRStage();
                            clearInterval(qrcodeCheck);
                            data = data.toString().split('');
                            data.splice(3, 0, ' ');
                            data.splice(7, 0, ' ');
                            data = data.join('');
                            $code.text(data);
                            setTimeout(function() {
                                document.getElementById('animationDiv1').removeEventListener('animationiteration', progressListen);
                                document.getElementById('animationDiv1').addEventListener('animationiteration', progressListen)
                            }, 3000)
                            statusInterval = setInterval(function() {
                                $.ajax({
                                    url: '/login/check-status',
                                    type: 'post',
                                    data: {
                                        deviceId: deviceId,
                                        deviceName: deviceName,
                                        provider: provider
                                    },
                                    success: function(email) {
                                        if (email != '') {
                                            $.ajax({
                                                url: '/session',
                                                type: 'post',
                                                contentType: 'application/json',
                                                data: JSON.stringify({
                                                    email: email,
                                                    deviceId: deviceId
                                                }),
                                                success: function(result) {
                                                    if (result != '') {
                                                        clearInterval(statusInterval);
                                                        urlLanguage = '/' + result;
                                                        showToastModal(smartTvLoginSuccess);
                                                        setTimeout(function() {
                                                            // QR로그인 완료 후 로그인 페이지가 player 인 경우, 로그인할 때 감상하던 전시/작품이 플레이 되는 플레이어로 이동
                                                            if (location.pathname.split('/').pop() == 'player') {
                                                                var lastSeenExhCookie = Cookies.get('lastSeenExh');
                                                                var lastSeenArtworkCookie = Cookies.get('lastSeenArtwork');
                                                                if ((lastSeenExhCookie == undefined || lastSeenExhCookie == 'undefined') && lastSeenArtworkCookie) {
                                                                    location.href = urlLanguage + '/player?art_id=' + lastSeenArtworkCookie;
                                                                    Cookies.remove('lastSeenArtwork');
                                                                } else if (lastSeenExhCookie && lastSeenArtworkCookie) {
                                                                    location.href = urlLanguage + '/player?art_id=' + lastSeenArtworkCookie + '&exh_id=' + lastSeenExhCookie;
                                                                    Cookies.remove('lastSeenExh');
                                                                    Cookies.remove('lastSeenArtwork');
                                                                } else {
                                                                    Cookies.remove('lastSeenExh');
                                                                    Cookies.remove('lastSeenArtwork');
                                                                    location.href = location.pathname.replace(/^\/(en|ko|ja)\//, urlLanguage + '/') + location.search;
                                                                }
                                                            } else {
                                                                location.href = location.pathname.replace(/^\/(en|ko|ja)\//, urlLanguage + '/') + location.search;
                                                            }
                                                        }, 3000);
                                                    }
                                                }
                                            })
                                        }
                                    }
                                })
                            }, 3000)
                        }
                    }
                })
            }, 2000)
        }
    })
}

// GA 코드
function checkGAEvent(data) {
    switch (data) {
        case 'login_cancel_step1':
            gtag('event', 'login_cancel_step1');
            break;
        case 'login_cancel_step2':
            gtag('event', 'login_cancel_step2');
            break;
        case 'home_save_coming_curation':
            gtag('event', 'home_save_coming_curation');
            break;
        case 'player_repeat_one':
            gtag('event', 'player_repeat_one');
            break;
        case 'player_repeat_all':
            gtag('event', 'player_repeat_all');
            break;
        case 'player_info':
            gtag('event', 'player_info');
            break;
        case 'player_origial':
            gtag('event', 'player_origial');
            break;
        case 'player_basic':
            gtag('event', 'player_basic');
            break;
        case 'player_prev':
            gtag('event', 'player_prev');
            break;
        case 'player_pause':
            gtag('event', 'player_pause');
            break;
        case 'player_play':
            gtag('event', 'player_play');
            break;
        case 'player_next':
            gtag('event', 'player_next');
            break;
        case 'player_save_curation':
            gtag('event', 'player_save_curation');
            break;
        case 'player_collection':
            gtag('event', 'player_collection');
            break;
        case 'player_like':
            gtag('event', 'player_like');
            break;
        case 'player_add_collection':
            gtag('event', 'player_add_collection');
            break;
        case 'player_remove_collection':
            gtag('event', 'player_remove_collection');
            break;
        case 'login_setting_cancel':
            gtag('event', 'login_setting_cancel');
            break;
        default:
            break;
    }
}