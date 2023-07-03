//socket
// connect();
$.ajax({
    url: '/api/country-code',
    method: 'post',
    data: {},
    success: function (e) {
        document.getElementById('device_nation').innerText = e.toUpperCase();
    }
})

var gigaType;
var gigaId;
var gigaNick;
var scrollCountPrivacy = 0;
var scrollCountTerm = 0;


var $soundNoUseIconCheck = $('#sound_no_use .icon-check');
var $soundUseIconCheck = $('#sound_use .icon-check');
var $contentsKoreanIconCheck = $('#contents_korean .icon-check');
var $contentsEnglishIconCheck = $('#contents_english .icon-check');
var $contentsJapaneseIconCheck = $('#contents_japanese .icon-check');
var $btnContentsIconCheck = $('.btn-contents .icon-check');
var $menuContainerBtn = $('.menu-container .btn');
var $termsOfService = $('#terms_of_service');
var $privacyPolicy = $('#privacy_policy');
var $accountPolicy = $('#account_policy');


//진입시 kt일 경우 계정 운영정책 안보임
if (Cookies.get('provider') == 'kt') {
    $('.btn-account-policy').css('display', 'none');
    $('.btn-privacy-term').css('margin-bottom', '36px');
}
var check = true;

function logOut(boolean) {
    $.ajax({
        url: '/api/device-data',
        type: 'post',
        dataType: 'json',
        error: function (error) {
        },
        success: function (data) {
            var deviceId = data['deviceId']
            var deviceName = data['deviceName']
            var provider = data['modelType']

            if (boolean != 'true' && boolean != true) {
                $.ajax({
                    url: '/login/logout',
                    type: 'post',
                    dataType: 'json',
                    data: {},
                    success: function (result) {
                        Cookies.remove('klipdrops');
                        Cookies.remove('ownerAddress');
                        Cookies.remove('sKlaytnLength');
                        Cookies.remove('language');
                        Cookies.remove('prevSound');
                        Cookies.remove('searchKeywordArray');
                        showToastModal(messageSetting.logOutMessage);
                        setTimeout(function () {
                            location.href = '/smartTvLogin?duid=' + deviceId + '&deviceName=' + deviceName + '&provider=' + provider;
                        }, 2000);
                    },
                    error: function () {
                    }
                });
                setInterval(function () {
                    $('.logoutButton').focus();
                }, 1);
            }
        }
    });
}


settingMenuMove(5, 32); //왼쪽 메뉴 이동 애니메이션

forHeaderMove() //header에 포커스가 갔을 때 밀림
setTimeout(function () {
    settingContentsChange(); //오른쪽 UI변경
}, 50)

//왼쪽 메뉴 이동 애니메이션. num은 div(소메뉴)의 개수, margin은 각각의 소메뉴의 간격을 넣으면 됩니다.
function settingMenuMove(num, margin) {
    //1. 각각의 div의 높이를 구한 뒤 heightArray 배열에 넣는다.
    var heightArray = [];
    for (var i = 0; i < num; i++) {
        var divHeight = $('.menu-container').find('.category').eq(i).height();
        heightArray.push(divHeight);
    }
    //2. 포커스되면 자신의 부모가 몇번째 div인지 체크한다
    $menuContainerBtn.on({
        focus: function () {
            var selfIndex = $(this).parents('.category').index();
            var thisIndex = $(this).index();
            //divHeight에서 0부터 index-1번째까지의 값을 모두 더한다.
            var totalHeight = 0
            for (var i = 0; i < selfIndex; i++) {
                totalHeight = totalHeight + heightArray[i];
            }

            //new move
            var menuContainer = $('.menu-container');
            switch (selfIndex) {
                case 0:
                    menuContainer.css('top', '0');
                    break
                case 1:
                    if (thisIndex == 1) {
                        menuContainer.css('top', '-165px');
                    } else if (thisIndex > 1) {
                        menuContainer.css('top', '-' + (165 + (thisIndex - 1) * 77) + 'px');
                    }
                    break
                case 2:
                    if (thisIndex == 1) {
                        menuContainer.css('top', '-409px');
                    } else if (thisIndex > 1) {
                        menuContainer.css('top', '-' + (409 + (thisIndex - 1) * 77) + 'px');
                    }
                    break
                case 3:
                    if (thisIndex == 1) {
                        menuContainer.css('top', '-652px');
                    } else if (thisIndex > 1) {
                        menuContainer.css('top', '-' + (652 + (thisIndex - 1) * 77) + 'px');
                    }
                    break
                case 4:
                    if (thisIndex == 1) {
                        menuContainer.css('top', '-818px');
                    } else if (thisIndex > 1) {
                        menuContainer.css('top', '-' + (818 + (thisIndex - 1) * 77) + 'px');
                    }
                    break
            }
            //4. 오른쪽의 작은 아이콘이 보인다.
            var iconMore = document.querySelector('.icon-more');
            iconMore.style.display = 'none';
            $(this).find('.icon-more').css('display', 'block');
            //5. 버튼에 효과를 준다.
            $('.setting-menu .btn').removeClass('active');
            $(this).addClass('active');
        },
        blur: function () {
            $('.icon-more').css('display', 'none');
            $('.setting-menu .btn').removeClass('active');
        }
    })
}


//focus된 메뉴에 따라 바뀌는 컨텐츠 UI------------------------------------
function settingContentsChange() {
    $category.eq(0).find('.btn').eq(0).focus();
    changeButtonStyle();

    // 사운드 미리듣기
    if (Cookies.get('prevSound') == '1') {
        $soundNoUseIconCheck.css('display', 'none');
        $soundUseIconCheck.css('display', 'block');
    } else if (Cookies.get('prevSound') == '0') {
        $soundUseIconCheck.css('display', 'none');
        $soundNoUseIconCheck.css('display', 'block');
    } else {
        $soundNoUseIconCheck.css('display', 'none');
        $soundUseIconCheck.css('display', 'block');
    }
    $('#sound_use').on('click', function () {
        soundOn();
        $soundUseIconCheck.css('display', 'block');
        $soundNoUseIconCheck.css('display', 'none');
    })
    $('#sound_no_use').on('click', function () {
        soundOff();
        $soundUseIconCheck.css('display', 'none');
        $soundNoUseIconCheck.css('display', 'block');
    })

    // 언어선택
    if (urlLanguage == '/ko') {
        $contentsKoreanIconCheck.css('display', 'block');
        $contentsEnglishIconCheck.css('display', 'none');
        $contentsJapaneseIconCheck.css('display', 'none');
    } else if (urlLanguage == '/en') {
        $contentsKoreanIconCheck.css('display', 'none');
        $contentsEnglishIconCheck.css('display', 'block');
        $contentsJapaneseIconCheck.css('display', 'none');
    } else if (urlLanguage == '/ja') {
        $contentsKoreanIconCheck.css('display', 'none');
        $contentsEnglishIconCheck.css('display', 'none');
        $contentsJapaneseIconCheck.css('display', 'block');
    } else {
        $contentsKoreanIconCheck.css('display', 'block');
        $contentsEnglishIconCheck.css('display', 'none');
        $contentsJapaneseIconCheck.css('display', 'none');
    }
    $('#contents_korean').on('click', function () {
        $contentsKoreanIconCheck.css('display', 'block');
        $contentsJapaneseIconCheck.css('display', 'none');
        $contentsEnglishIconCheck.css('display', 'none');
        changeLanguage('한국어');
        location.href = '/ko/home';
    })
    $('#contents_english').on('click', function () {
        $contentsKoreanIconCheck.css('display', 'none');
        $contentsJapaneseIconCheck.css('display', 'none');
        $contentsEnglishIconCheck.css('display', 'block');
        changeLanguage('English');
        location.href = '/en/home';
    })
    $('#contents_japanese').on('click', function () {
        $contentsKoreanIconCheck.css('display', 'none');
        $contentsEnglishIconCheck.css('display', 'none');
        $contentsJapaneseIconCheck.css('display', 'block');
        changeLanguage('日本語');
        location.href = '/ja/home';
    })

    function changeLanguage(chosenLanguage) {
        if ($loginStatus == 'true' || $loginStatus == true) {
            $.ajax({
                url: '/setting/language',
                type: 'POST',
                data: {
                    language: chosenLanguage
                },
                success: function (data) {
                },
                error: function () {
                }
            });
        } else {
            switch (chosenLanguage) {
                case '한국어':
                    Cookies.set('language', 'ko');
                    break;
                case 'English':
                    Cookies.set('language', 'en');
                    break;
                case '日本語':
                    Cookies.set('language', 'ja');
                    break;
                default:
                    Cookies.set('language', 'en');
                    break;
            }
        }
    }

    //앱 정보
    deviceName = Cookies.get('deviceName');
    //기기정보 없으면 js 고장
    var userEmail = document.getElementById('account_email').value;
    var username = document.getElementById('account_name').value;
    var deviceType = deviceName;
    var deviceVersion = '1.3.39';
    document.getElementById('device_type').innerText = deviceType;
    document.getElementById('device_version').innerText = deviceVersion;
    if ($loginStatus == 'true' || $loginStatus == true) {
        document.getElementById('setting_email').innerText = userEmail;
        document.getElementById('setting_username').innerText = username;
    }
    //감상 기록 지우기
    $('#play_history_delete').on('click', function () {
        var deviceId = Cookies.get('deviceId');
        $.ajax({
            url: urlLanguage + '/setting',
            type: 'POST',
            data: {
                deviceId: deviceId
            },
            success: function (data) {
                showToastModal(messageSetting.clearWatchHistoryMessage);
            },
            error: function () {
                showToastModal(messageSetting.clearWatchHistoryMessage);
            }
        });
    })

    //검색 기록 지우기
    $('#search_history_delete').on('click', function () {
        Cookies.remove('searchKeywordArray');
        Cookies.remove('searchKeywordArray', {
            domain: 'tvpatron.com'
        })
        $.ajax({
            url: urlLanguage + '/api/deleteHistory/all',
            type: 'post',
            dataType: 'json',
            data: {},
            error: function (error) {
            },
            success: function (data) {
            }
        })
        showToastModal(messageSetting.clearSearchHistoryMessage)
    })

    forHeaderMove();

    //menuButton
    $menuContainerBtn.on({
        focus: function () {
            $('.hovers').removeClass('hovers');

            $('.setting-contents-simple-layout').addClass('disnone');
            $('.setting-contents-with-image').addClass('disnone');
            $('.setting-contents-with-long-text').addClass('disnone');

            var $this = $(this);

            // 사운드 미리듣기
            if ($this.hasClass('btn-pre-sound')) {
                $('#setting_sound').removeClass('disnone');
            }

            //언어선택 (GIGA제외)
            if ($this.hasClass('btn-language')) {
                $('#setting_language').removeClass('disnone');
            }
            //앱정보
            if ($this.hasClass('btn-device-info')) {
                $('#setting_appInfo').removeClass('disnone');
            }

            //감상 기록 지우기
            if ($this.hasClass('btn-delete-played')) {
                $('#setting_play_delete').removeClass('disnone');
            }

            //검색 기록 지우기
            if ($this.hasClass('btn-delete-searched')) {
                $('#setting_search_delete').removeClass('disnone');
            }

            //서비스 이용약관
            if ($this.hasClass('btn-service-term')) {
                $('#setting_service_term').removeClass('disnone');
                switch (urlLanguage) {
                    case '/ko':
                        $.ajax({
                            url: '/service_policy_kr',
                            type: 'get',
                            success: function (e) {
                                document.getElementById('terms_of_service_wrap').innerText = e;
                            }
                        })
                        break
                    case '/en':
                        $.ajax({
                            url: '/service_policy_en',
                            type: 'get',
                            success: function (e) {
                                document.getElementById('terms_of_service_wrap').innerText = e;
                            }
                        })
                        break
                    case '/ja':
                        $.ajax({
                            url: '/service_policy_ja',
                            type: 'get',
                            success: function (e) {
                                document.getElementById('terms_of_service_wrap').innerText = e;
                            }
                        })
                        break
                    case undefined:
                        $.ajax({
                            url: '/service_policy_kr',
                            type: 'get',
                            success: function (e) {
                                document.getElementById('terms_of_service_wrap').innerText = e;
                            }
                        })
                        break
                }
                $termsOfService.scrollTop(0);
                //약관
                setTimeout(function () {
                    fixedBox = 800;
                    containedBox = $('#terms_of_service_wrap').height();
                    scrollHeight = fixedBox * (fixedBox / containedBox);
                    $('.info-modal-scroll-service').css('height', scrollHeight);
                    $termsOfService.on('scroll', function () {
                        var playerScrollTop = $termsOfService.scrollTop();
                        $('.info-modal-scroll-service').css('top', (playerScrollTop * (fixedBox / containedBox)) + 'px')
                    })
                }, 200)
            }

            //개인정보 취급 방침
            if ($this.hasClass('btn-privacy-term')) {
                $('#setting_privacy_policy').removeClass('disnone');
                switch (urlLanguage) {
                    case '/ko':
                        $.ajax({
                            url: '/private_policy_kr',
                            type: 'get',
                            success: function (e) {
                                document.getElementById('privacy_policy_wrap').innerText = e;
                            }
                        })
                        break
                    case '/en':
                        $.ajax({
                            url: '/private_policy_en',
                            type: 'get',
                            success: function (e) {
                                document.getElementById('privacy_policy_wrap').innerText = e;
                            }
                        })
                        break
                    case '/ja':
                        $.ajax({
                            url: '/private_policy_ja',
                            type: 'get',
                            success: function (e) {
                                document.getElementById('privacy_policy_wrap').innerText = e;
                            }
                        })
                        break
                    case undefined:
                        $.ajax({
                            url: '/private_policy_kr',
                            type: 'get',
                            success: function (e) {
                                document.getElementById('privacy_policy_wrap').innerText = e;
                            }
                        })
                        break
                }
                $privacyPolicy.scrollTop(0);
                setTimeout(function () {
                    fixedBox = 800;
                    containedBox = $('#privacy_policy_wrap').height();
                    scrollHeight = fixedBox * (fixedBox / containedBox);
                    $('.info-modal-scroll-privacy').css('height', scrollHeight);
                    $privacyPolicy.on('scroll', function () {
                        var playerScrollTop = $privacyPolicy.scrollTop();
                        $('.info-modal-scroll-privacy').css('top', (playerScrollTop * (fixedBox / containedBox)) + 'px')
                    })
                }, 200)
            }

            //계정 운영정책
            if ($this.hasClass('btn-account-policy')) {
                if (Cookies.get('provider') != 'kt') {
                    $('#setting_account_policy').removeClass('disnone');
                }
                switch (urlLanguage) {
                    case '/ko':
                        $.ajax({
                            url: '/account_policy_kr',
                            type: 'get',
                            success: function (e) {
                                document.getElementById('account_policy_wrap').innerText = e;
                            }
                        })
                        break
                    case '/en':
                        $.ajax({
                            url: '/account_policy_en',
                            type: 'get',
                            success: function (e) {
                                document.getElementById('account_policy_wrap').innerText = e;
                            }
                        })
                        break
                    case '/ja':
                        $.ajax({
                            url: '/account_policy_ja',
                            type: 'get',
                            success: function (e) {
                                document.getElementById('account_policy_wrap').innerText = e;
                            }
                        })
                        break
                    case undefined:
                        $.ajax({
                            url: '/account_policy_kr',
                            type: 'get',
                            success: function (e) {
                                document.getElementById('account_policy_wrap').innerText = e;
                            }
                        })
                        break

                }
                $accountPolicy.scrollTop(0);
                setTimeout(function () {
                    fixedBox = 800;
                    containedBox = $('#account_policy_wrap').height();
                    scrollHeight = fixedBox * (fixedBox / containedBox);
                    $('.info-modal-scroll-account').css('height', scrollHeight);
                    $accountPolicy.on('scroll', function () {
                        var playerScrollTop = $accountPolicy.scrollTop();
                        $('.info-modal-scroll-account').css('top', (playerScrollTop * (fixedBox / containedBox)) + 'px')
                    })
                }, 200)
            }

            //문의하기
            if ($this.hasClass('btn-customer-service')) {
                $('#setting_customer_service').removeClass('disnone');
            }

            //계정
            if ($this.hasClass('btn-member-info')) {
                $('#setting_app_device_info').removeClass('disnone');
            }

            //로그아웃
            if ($this.hasClass('btn-logout')) {
                $('#setting_logout').removeClass('disnone');
            }
        }
    })
}

//세팅 메뉴 이동시 contents-focus 클래스 추가,삭제
function contentsFocus() {
    $menuContainerBtn.on({
        focus: function () {
            $menuContainerBtn.removeClass('contents-focus');
            $('.icon-more-inactive').addClass('disnone');
        },
        blur: function () {
            var $this = $(this);
            if (!$this.hasClass('contents-focus')) {
                $this.addClass('contents-focus');
                $this.find('.icon-more-inactive').removeClass('disnone');
            }
        }
    })
}

contentsFocus(); //헤더 <-> 컨텐츠 포커스 이동방식

//기본설정/언어 및 위치/ 기록 및 데이터의 버튼에 focus 됐을 때 버튼 변화
function changeButtonStyle() {
    $('.setting-contents-with-image .btn').on({
        focus: function (e) {
            $(this).addClass('active')
        },
        blur: function () {
            $(this).removeClass('active')
        }
    })
}


//header에 포커스가 갔을 때 밀림
function forHeaderMove() {
    $menuA.on({
        focus: function (e) {
            $settingContents.css('left', 942);
            $settingMenuBox.css('left', 416);
        },
        blur: function () {
            $settingContents.css('left', 686);
            $settingMenuBox.css('left', 160);
        }
    })
}

function deviceData(gType, gId, gNickname) {
    gigaType = gType;
    gigaId = gId
    gigaNick = gNickname;

    document.getElementById('giga_type').textContent = gigaType
    document.getElementById('giga_id').textContent = gigaId
}


//버튼에 들어왔을 때 오른쪽 버튼 누르면 본문으로. (웹 테스트용)
scrollKeycode('.btn-service-term', '#terms_of_service');
scrollKeycode('.btn-privacy-term', '#privacy_policy');
scrollKeycode('.btn-account-policy', '#account_policy');
scrollKeycode('.btn-language', '#contents_korean');
scrollKeycode('.btn-area', '#location');
scrollKeycode('.btn-delete-played', '#play_history_delete');
scrollKeycode('.btn-delete-searched', '#search_history_delete');
scrollKeycode('.btn-pre-sound', '#sound_use');

function scrollKeycode(menuButton, termsBox) {
    $(menuButton).on({
        focus: function () {
            $infoModalScroll.css('background-color', '#424242');
            $(menuButton).keydown(function (event) {
                if (event.keyCode == '39') {
                    $(termsBox).focus();
                    $infoModalScroll.css('background-color', '#2841fa');
                }
            });
        },
        blur: function () {
        }
    });
}

//test 쿠키에 사운드 on/off넣기
function soundOn() {
    Cookies.remove('prevSound')
    Cookies.set('prevSound', '1', {
        domain: cookieDomain
    });
}

function soundOff() {
    Cookies.remove('prevSound')
    Cookies.set('prevSound', '0', {
        domain: cookieDomain
    });
}

//쿠키 끝

scrollKeycode('.btn-pre-sound', '.btn-use');

//리모컨 동작===============================================================================
var contentsFocus;
document.addEventListener('keydown', function (e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        document.activeElement.click();
    }
    //컨텐츠 <--> 메뉴 동작
    if (document.activeElement.classList.contains('terms-of-service') || document.activeElement.classList.contains('btn-contents') ||
        document.activeElement.classList.contains('privacy-policy') || document.activeElement.classList.contains('account-policy')) {
        if (e.keyCode == 37) {
            keydownChecker = false;
            contentsFocus = document.querySelector('.contents-focus');
            contentsFocus.focus();
            return false;
        }
    }
    //메뉴 <--> 헤더 동작
    if (document.activeElement.classList.contains('menu-btn')) {
        if (e.keyCode == 37) {
            document.getElementById('header_setting').focus();
            keydownChecker = false;
        }
        if (e.keyCode == 39) {
            keydownChecker = false;
        }
    }

    //컨텐츠 동작 (버튼)
    if (document.activeElement.classList.contains('btn-contents')) {
        if (e.keyCode == 38) {
            if (document.activeElement.classList.contains('btn-no-use')) {
                document.querySelector('.btn-use').focus();
            } else {
                keydownChecker = false;
            }
        }
        if (e.keyCode == 40) {
            if (document.activeElement.classList.contains('btn-use')) {
                document.querySelector('.btn-no-use').focus();
            } else {
                keydownChecker = false;
            }
        }
    }
    //컨텐츠 동작 (언어)
    if (document.activeElement.classList.contains('btn-contents')) {
        if (e.keyCode == 38) {
            if (document.activeElement.classList.contains('btn-japanese')) {
                $('.btn-english').focus();
                $btnContentsIconCheck.removeClass('show');
                $('.btn-english .icon-check').addClass('show');
            } else if (document.activeElement.classList.contains('btn-english')) {
                $('.btn-korean').focus();
                $btnContentsIconCheck.removeClass('show');
                $('.btn-korean .icon-check').addClass('show');
            } else {
                keydownChecker = false;
            }
        }
        if (e.keyCode == 40) {
            if (document.activeElement.classList.contains('btn-korean')) {
                $('.btn-english').focus();
                $btnContentsIconCheck.removeClass('show');
                $('.btn-english .icon-check').addClass('show');
            } else if (document.activeElement.classList.contains('btn-english')) {
                $('.btn-japanese').focus();
                $btnContentsIconCheck.removeClass('show');
                $('.btn-japanese .icon-check').addClass('show');
            } else {
                keydownChecker = false;
            }
        }
    }
})

document.addEventListener('focus', function () {
    if (document.activeElement.classList.contains('btn-contents')) {
        keydownChecker = false;
    }
    if (document.activeElement.classList.contains('menu-btn') || document.activeElement.classList.contains('setting')) {
        setTimeout(function () {
            keydownChecker = true;
            scrollCountTerm = 0;
            scrollCountPrivacy = 0;
        }, 100);
    }
}, true)

//문의하기
$('.btn-customer-service').on('keydown', function (event) {
    if (event.keyCode == 39) {
        return false;
    }
})

$('.btn-logout').on('keydown', function (event) {
    if (event.keyCode == 39) {
        $('.logoutButton').focus();
        $('.logoutButton').addClass('active');
    }
})

$('.btn-device-info').on('keydown', function (e) {
    if (e.keyCode == 39) {
        return false
    }
});
$('.btn-customer-service').on('keydown', function (e) {
    if (e.keyCode == 39) {
        return false
    }
});
$('.btn-member-info').on('keydown', function (e) {
    if (e.keyCode == 39) {
        return false
    }
});

// 스크롤 변수
var fixedBox;
var containedBox;
var scrollHeight;

//스크롤 위아래 움직이는 함수
function scrollUpDown(selector, num) {
    var target = document.getElementById(selector);
    var scrollTopNow;
    scrollTopNow = target.scrollTop;
    target.scrollTop = scrollTopNow + num;
}

$termsOfService.on('keydown', '#terms_of_service', function (e) {
    switch (e.keyCode) {
        case 38:
            scrollUpDown('terms_of_service', -100)
            break
        case 40:
            scrollUpDown('terms_of_service', 100)
            break
    }
})
$privacyPolicy.on('keydown', '#privacyPolicy', function (e) {
    switch (e.keyCode) {
        case 38:
            scrollUpDown('privacyPolicy', -100)
            break
        case 40:
            scrollUpDown('privacyPolicy', 100)
            break
    }
})
$accountPolicy.on('keydown', '#account_policy', function (e) {
    switch (e.keyCode) {
        case 38:
            scrollUpDown('accountPolicy', -100)
            break;
        case 40:
            scrollUpDown('accountPolicy', 100)
            break;
    }
})

function getDeviceInfo() {
    $.ajax({
        url: '/api/device-data',
        type: 'post',
        dataType: 'json',
        data: {},
        error: function (error) {
        },
        success: function (data) {
            $('#device_type').text(data['deviceId']);
        }
    })
}

//기기정보 받아옴
getDeviceInfo();


//LG masic remote 매직리모콘 --------------------------------------------------------------------------------------------
//설정 메뉴, 설정 컨텐츠 버튼
$document.on('click', '.setting-menu .btn, .button-box .btn', function (e) {
    e.target.focus();
})

//이용약관
$document.on('mouseenter', '.setting-detail, .info-modal-scroll-bar', function (e) {
    $infoModalScroll.css('background-color', '#2841fa');
})
$document.on('mouseleave', '.setting-detail, .info-modal-scroll-bar', function (e) {
    $infoModalScroll.css('background-color', '#424242');
})

$('.setting-menu .btn span').on('click', function (e) {
    e.target.parentElement.focus();
})

$('.btn.menu-btn').on('mouseenter', function () {
    $(this).addClass('hovers');
});
$('.btn.menu-btn').on('mouseleave', function () {
    $(this).removeClass('hovers');
});

//메뉴에서 스크롤
var wheelBoolean = true;
var settingFocusIndex = 0;
setTimeout(function () {
    $('.setting-menu').on('mousewheel', function (e) {
        if (wheelBoolean == true) {
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
            //setting menu scroll movement
            if (location.pathname == urlLanguage + '/setting') {
                if (wheel > 0) {
                    if (settingFocusIndex > 0) {
                        settingFocusIndex = settingFocusIndex - 1
                    }
                } else {
                    if (settingFocusIndex < 12) {
                        settingFocusIndex = settingFocusIndex + 1
                    }
                }
                $menuContainerBtn.eq(settingFocusIndex).focus();
            }

            wheelBoolean = false;
            setTimeout(function () {
                wheelBoolean = true;
            }, 250)
        }
    });
}, 1500)

//scroll terms
//컨텐츠 동작 (약관)
$('#terms_of_service, #privacy_policy, #account_policy').on({
    'keydown': function (e) {
        if (wheelBoolean == true) {
            var maxheight = $(this).children('div').height();
            var nowScroll = $(this).scrollTop();
            switch (e.keyCode) {
                case 38:
                    nowScroll = nowScroll - 480 <= 0 ? nowScroll = 0 : nowScroll = nowScroll - 480;
                    $(this).scrollTop(nowScroll);
                    return false
                case 40:
                    nowScroll = nowScroll + 480 >= maxheight ? nowScroll = maxheight : nowScroll = nowScroll + 480;
                    $(this).scrollTop(nowScroll);
                    return false
            }
        }
    }
})