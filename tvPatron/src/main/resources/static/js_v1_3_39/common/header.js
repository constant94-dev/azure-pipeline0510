//헤더 버튼
var $storage = $('#header_storage');
var $menuH1 = $('.menu h1');
var $iconLogo = $('.icon-logo');
var $menuGuide = $('.menu-guide');
var $btnGoSearch = $('.btn-go-search');
var $menuA = $('.menu a');
var $mainExhibitions = $('#main_curation');
var $settingMenuBox = $('.setting-menu-box');
var $settingContents = $('.setting-contents');
var $contents = $('.contents');

//only header.js
var $wrap = $('#wrap');
var $fake = $('.fake');
var $backgroundColor = $('.background-color');
var $menuFocusBoxHome = $('.menu-focus-box-home');
var $menuFocusBoxStorage = $('.menu-focus-box-storage');
var $menuFocusBoxSetting = $('.menu-focus-box-setting');
var $menuFocusBoxSearch = $('.menu-focus-box-search');
var $menuFocusBoxExit = $('.menu-focus-box-exit');


function menuFocus() {
    $menu.addClass('active');
    $wrap.addClass('active'); /*home만 헤더 포커스 깨짐 --> 해결위해 active추가*/
    $fake.addClass('active'); /*setting 포커스 이동 위해 추가*/
    $menuH1.addClass('active');
    $iconLogo.addClass('active');
    $(this).parent('li').addClass('active');
    $(this).find('i').addClass('active');
    $(this).find('.menu-guide').addClass('active');
    $menuGuide.css('display', 'inline-block');
    $menuGuide.css('min-width', '235px');
    $explanation.addClass('active');
    $carousel.addClass('active');
    $backgroundColor.css('width', '360px');
}

function menuBlur() {
    $menu.removeClass('active');
    $wrap.removeClass('active'); /*home만 헤더 포커스 깨짐 --> 해결위해 active추가*/
    $fake.removeClass('active'); /*setting 포커스 이동 위해 추가*/
    $menuH1.removeClass('active');
    $iconLogo.removeClass('active');
    $(this).parent('li').removeClass('active');
    $(this).find('i').removeClass('active');
    $(this).find('.menu-guide').removeClass('active');
    $menuGuide.css('display', 'none');
    $explanation.removeClass('active');
    $carousel.removeClass('active');
    $backgroundColor.css('width', '104px');
    $menuFocusBoxHome.css('opacity', 0);
    $menuFocusBoxStorage.css('opacity', 0);
    $menuFocusBoxSearch.css('opacity', 0);
    $menuFocusBoxSetting.css('opacity', 0);
    $menuFocusBoxExit.css('opacity', 0);
}
//헤더 변화 애니메이션
$menuA.on({
    focus: function() {
        $menu.addClass('active');
        $wrap.addClass('active'); /*home만 헤더 포커스 깨짐 --> 해결위해 active추가*/
        $fake.addClass('active'); /*setting 포커스 이동 위해 추가*/
        $menuH1.addClass('active');
        $iconLogo.addClass('active');
        $(this).parent('li').addClass('active');
        $(this).find('i').addClass('active');
        $(this).find('.menu-guide').addClass('active');
        $menuGuide.css('display', 'inline-block');
        $menuGuide.css('min-width', '235px');
        $explanation.addClass('active');
        $carousel.addClass('active');
        $backgroundColor.css('width', '360px');
    },
    blur: function() {
        $menu.removeClass('active');
        $wrap.removeClass('active'); /*home만 헤더 포커스 깨짐 --> 해결위해 active추가*/
        $fake.removeClass('active'); /*setting 포커스 이동 위해 추가*/
        $menuH1.removeClass('active');
        $iconLogo.removeClass('active');
        $(this).parent('li').removeClass('active');
        $(this).find('i').removeClass('active');
        $(this).find('.menu-guide').removeClass('active');
        $menuGuide.css('display', 'none');
        $explanation.removeClass('active');
        $carousel.removeClass('active');
        $backgroundColor.css('width', '104px');
    }
})

//헤더 설정,나가기 버튼 css 조정
var div;
$headerHome.on({
    mouseleave: function() {
        $menuFocusBoxHome.css('opacity', 0);
        $(this).find('i').removeClass('active');
        $(this).find('.menu-guide').removeClass('active');
    },
    focus: function() {
        $menuFocusBoxHome.css({
            'top': '309px',
            'opacity': '1'
        })
        menuFocus()
    },
    blur: function() {
        $menuFocusBoxHome.css('opacity', 0);
        $(this).find('i').removeClass('active');
        $(this).find('.menu-guide').removeClass('active');
    }
});
$storage.on({
    mouseleave: function() {
        $menuFocusBoxStorage.css('opacity', 0);
        $(this).find('i').removeClass('active');
        $(this).find('.menu-guide').removeClass('active');
    },
    focus: function() {
        $menuFocusBoxStorage.css({
            'top': '377px',
            'opacity': '1'
        })
        menuFocus()
    },
    blur: function() {
        $menuFocusBoxStorage.css('opacity', 0);
        $(this).find('i').removeClass('active');
        $(this).find('.menu-guide').removeClass('active');
    }
});
$headerSearch.on({
    mouseleave: function() {
        $menuFocusBoxSearch.css('opacity', 0);
        $(this).find('i').removeClass('active');
        $(this).find('.menu-guide').removeClass('active');
    },
    focus: function() {
        $menuFocusBoxSearch.css({
            'top': '444px',
            'opacity': '1'
        })
        menuFocus()
    },
    blur: function() {
        $menuFocusBoxSearch.css('opacity', 0);
        $(this).find('i').removeClass('active');
        $(this).find('.menu-guide').removeClass('active');
    }
});
$('#header_setting').on({
    mouseleave: function() {
        $menuFocusBoxSetting.css('opacity', 0);
        $(this).find('i').removeClass('active');
        $(this).find('.menu-guide').removeClass('active');
    },
    focus: function() {
        $menuFocusBoxSetting.css({
            'top': '821px',
            'opacity': '1'
        })
        menuFocus()
    },
    blur: function() {
        $menuFocusBoxSetting.css('opacity', 0);
        $(this).find('i').removeClass('active');
        $(this).find('.menu-guide').removeClass('active');
    }
});
$('#header_exit').on({
    mouseleave: function() {
        $menuFocusBoxExit.css('opacity', 0);
        $(this).find('i').removeClass('active');
        $(this).find('.menu-guide').removeClass('active');
    },
    focus: function() {
        $menuFocusBoxExit.css({
            'top': '892px',
            'opacity': '1'
        })
        menuFocus()
    },
    blur: function() {
        $menuFocusBoxExit.css('opacity', 0);
        $(this).find('i').removeClass('active');
        $(this).find('.menu-guide').removeClass('active');
    }
});
$('.lnb a').on({
    focus: function() {
        div = $(this).find('div');
        div.addClass('active');
    },
    blur: function() {
        div.removeClass('active');
    }
});
$('.gnb a').on({
    focus: function() {
        div = $(this).find('div');
        div.addClass('active');
    },
    blur: function() {
        div.removeClass('active');
    }
});

//헤더 움직임(리모콘) 조작
/*0. 헤더에서 포커스가 튀는 현상을 막는다.
 * 1. 헤더의 메뉴 a태그에 포커스시, 모든 헤더 메뉴 a태그에 붙는 .header-focus클래스를 지운다. (.header-focus: 헤더에서 포커스가 어디 있었는지 기억해주는 클래스)
 * 2. 헤더의 메뉴 a태그에서 블러시, this a태그에 .header-focus 클래스를 붙여준다. (-->헤더 a태그끼리만 이동이 이루어지면 클래스를 지우고, 주고.. 만 반복한다.)
 */
//헤더 메뉴 a태그에 header-focus클래스를 붙이고 떼는 함수
function headerFocus() {
    $('.header a').on({
        focus: function() {
            $('.header a').removeClass('header-focus');
        },
        blur: function() {
            var $this = $(this);
            $this.addClass('header-focus');
        }
    })
}
headerFocus();

//헤더 상,하,좌,우 fake 선택자
var headerCarouselInterval
$('.gnb a, .lnb a').on({
    keydown: function(e) {
        //헤더 동작
        switch (e.keyCode) {
            case 39:
                if (page == urlLanguage + '/search') {
                    $('.item-container li:nth-of-type(1) a').focus();
                    return false
                }
                if ($categoryA.hasClass('contents-focus')) {
                    $('.contents-focus').focus();
                } else if ($btnGoSearch.hasClass('contents-focus')) {
                    $('.contents-focus').focus();
                } else if ($('#main_curation .item-box').hasClass('home')) {
                    $('#main_curation li').eq(0).find('a').focus();
                } else if (document.activeElement.classList.contains('header-menu') && page == urlLanguage + '/setting') {
                    var contentsFocus = document.querySelector('.contents-focus');
                    contentsFocus.focus();
                    keydownChecker = false;
                } else {
                    $('#btn-play-href').focus();
                }

                return false;
        }
    }
})

//----헤더 움직임(리모콘) 조작---//
//헤더 - 나가기 버튼 클릭시 어플 나감
$('#header_exit').on('click', function() {
    exitPatron();
    exitLG();
})

//LG masic remote 매직리모콘 --------------------------------------------------------------------------------------------
//헤더 매직리모콘
$menuA.on('mouseenter', function(e) {
    if (page == urlLanguage + '/home') {
        if (counter == 1 || $('.item-box.home').hasClass('disnone')) {
            var target = $(this);
            target.focus();
        }
    } else {
        var target = $(this);
        target.focus();
    }
})
$menu.on('mouseleave', function(e) {
    switch (page) {
        case urlLanguage + '/home':
            if ($itemA.hasClass('contents-focus')) {
                $('.contents-focus').focus();
            } else {
                $mainExhibitions.find('li').eq(0).find('a').focus();
            }
            break;
        case urlLanguage + '/storage':
            $proArea.removeClass('active');
            if ($itemA.hasClass('contents-focus')) {
                $('.contents-focus').focus();
            } else {
                $('.item.nothing a').focus();
            }
            break;
        case urlLanguage + '/setting':
            $settingMenuBox.css('left', '160px');
            $settingContents.css('left', 686);
            $('.contents-focus').focus();
            break;
        case urlLanguage + '/search':
        case urlLanguage + '/search-global':
            $contents.removeClass('active');
            break;
    }
    menuBlur()
    $('i.active').removeClass('active');
    $('.menu-guide.active').removeClass('active');
})


function goHome() {
    if (location.href.split('/').pop() == 'home') {
        if ($itemA.hasClass('contents-focus')) {
            $('.contents-focus').focus();
        } else {
            $mainExhibitions.find('li').eq(0).find('a').focus();
        }
        menuBlur();
    } else {
        location.href = urlLanguage + '/home'
    }
}

function goLibrary() {
    if (location.href.split('/').pop() == 'storage') {
        $proArea.removeClass('active');
        if ($('.contents-focus').length > 0) {
            $('.contents-focus').focus();
        } else {
            $('.item.nothing a').focus();
        }
    } else {
        location.href = urlLanguage + '/storage'
    }
}

function goSetting() {
    if (location.href.split('/').pop() == 'setting') {
        $proArea.removeClass('active');
        if ($('.contents-focus').length > 0) {
            $('.contents-focus').focus();
        } else {
            $category.eq(0).find('.btn').eq(0).focus();
        }
    } else {
        location.href = urlLanguage + '/storage'
    }
}

function goSearch() {
    if (location.href.split('/').pop() == 'search') {
        $contents.removeClass('active');
        if ($('.contents-focus').length > 0) {
            $('.contents-focus').focus();
        } else {
            $searchGuide.focus();
        }
        menuBlur();
    } else {
        location.href = urlLanguage + '/search'
    }
}

function goSetting() {
    if (location.href.split('/').pop() == 'setting') {
        $settingMenuBox.css('left', '160px');
        $settingContents.css('left', 686);
        if ($('.contents-focus').length > 0) {
            $('.contents-focus').focus();
        } else {
            $('.menu-btn').eq(0).focus();
        }
        menuBlur();
    } else {
        location.href = urlLanguage + '/setting'
    }
}