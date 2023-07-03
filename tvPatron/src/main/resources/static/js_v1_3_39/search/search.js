var $searchGoBack = $('.search-go-back');


$document.on('keydown', function(e) {
    if (e.keyCode == 65376) {
        //키워드 검색 기능
        var searchValue = $searchBox.val();
        location.href = urlLanguage + '/search-result?keyword=' + searchValue;
        //유효성 검사 : 공백 금지, 띄어쓰기 한 번 금지, 특수문자 금지==
        if (searchValue.trim(' ') == '') {
            showToastModal(messageSearch.enterSearch);
            $searchBox.val('')
        }
        if (pattern_spc.test(searchValue)) {
            showToastModal(messageSearch.doNotEnterSpecialCharter);
            $searchBox.val('')
        }
        //유효성 검사 끝 ===========================
    }
})
var targetLi;
var mouseMoveSwitch = false;
$itemContainerLi.on('keydown', function() {
    if (document.querySelectorAll('li:hover').length > 0) {
        targetLi = document.querySelectorAll('li:hover')[0];
        targetLi.classList.remove('hoverTrue');
        mouseMoveSwitch = true;
    }
});
window.addEventListener('mousemove', function(e) {
    if (mouseMoveSwitch) {
        targetLi.classList.add('hoverTrue');
        mouseMoveSwitch = false;
    }
})

var pattern_spc = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/; // 특수문자 정규표현식(유효성 검사용)


//search-box, search-key숨김
$searchBox.addClass('disnone');
$searchKey.addClass('disnone');
//검색창에 있는 값 초기화
$searchGuide.on({
    keydown: function(e) {
        if (e.keyCode == 13) {
            $searchBox.val('');
        }
        if(e.keyCode == 40){
           $('.item-box li:nth-of-type(1) a').focus();
           return false;
        }
    },
    click: function() {
        $searchBox.val('');
    }
});


//검색창 확인시 html 변화
$searchAreaA.on('keydown', function(e) {
    if (e.keyCode == 13) {
        $menu.addClass('disnone');
        $searchGuide.addClass('disnone');
        $cateGuide.addClass('disnone');
        $itemContainer.addClass('disnone');
        $artistList.addClass('disnone');
        $searchBox.removeClass('disnone');
        $searchBox.removeClass('disnone');
        $searchBox.focus();
        $searchGoBack.css('display', 'block');
        $searchBox.keydown(function(event) {
            if (event.keyCode == '13') {
                var searchValue = $searchBox.val();
                //유효성 검사 : 공백 금지, 띄어쓰기 한 번 금지, 특수문자 금지==
                if (searchValue.trim(' ') == '') {
                    showToastModal(messageSearch.enterSearch);
                    $searchBox.val('')
                } else if (pattern_spc.test(searchValue)) {
                    showToastModal(messageSearch.doNotEnterSpecialCharter);
                    $searchBox.val('')
                } else {
                    location.href = urlLanguage + '/search-result?keyword=' + searchValue;
                }
            }
        });
    }
});
//검색창 확인시 html 변화
$searchAreaA.on('click', function(e) {
    $menu.addClass('disnone');
    $searchGuide.addClass('disnone');
    $cateGuide.addClass('disnone');
    $itemContainer.addClass('disnone');
    $searchBox.removeClass('disnone');
    $searchKey.removeClass('disnone');
    $searchBox.focus();
    $searchGoBack.css('display', 'block');
    $searchBox.keydown(function(event) {
        if (event.keyCode == '13') {
            var searchValue = $searchBox.val();
            //유효성 검사 : 공백 금지, 띄어쓰기 한 번 금지, 특수문자 금지==
            if (searchValue.trim(' ') == '') {
                showToastModal(messageSearch.enterSearch);
                $searchBox.val('')
            } else if (pattern_spc.test(searchValue)) {
                showToastModal(messageSearch.doNotEnterSpecialCharter);
                $searchBox.val('')
            } else {
                location.href = urlLanguage + '/search-result?keyword=' + searchValue;
            }
            //유효성 검사 끝 ===========================
        }
    });
});

//카테고리 좌우 테두리박스 이동
$itemA2.on('focus', function() {
    $(this).parent().addClass('active');
    //'카테고리로 찾아보세요' 밝아지게 하기
    $cateGuide.addClass('active');
    $itemSpan.css({
        'opacity': '1',
        'font-weight': '700'
    });
    $(this).siblings('.item-border').css('opacity',1);
});
$itemA2.on('blur', function() {
    $(this).parent().removeClass('active');
    $cateGuide.removeClass('active');
    $active.removeClass('active');
    $itemSpan.css({
        'opacity': '0.45',
        'font-weight': '400'
    });
    $(this).siblings('.item-border').css('opacity',0);
});

//최근검색어 포커스시 css변화
$document.on('focus', '.searched-div', function() {
    $(this).children('a').addClass('active');
    $document.on('keydown', '.searched-div', function(e) {
        if (e.keyCode == 13) {
            var url = $(this).attr('value');
            location.href = url;
        }
    })
    $document.on('click', '.searched-div', function(e) {
        var url = $(this).attr('value');
        location.href = url;
    })
})

$document.on('blur', '.searched-div', function() {
    $(this).children('a').removeClass('active');
})

$('.search-recent a').on({
    focus: function() {
        $active.removeClass('active');
        $(this).addClass('active');
    },
    blur: function() {
        $(this).removeClass('active');
    }
});

//헤더 변화 애니메이션
$menuA.on({
    focus: function() {
        $menu.addClass('active');
        $menuH1.addClass('active');
        $iconLogo.addClass('active');
        $(this).addClass('active');
        $(this).find('i').addClass('active');
        $(this).find('.menu-guide').addClass('active');
        $menuGuide.css('display', 'inline-block');
        $explanation.addClass('active');
        $carousel.addClass('active');
        $contents.addClass('active'); //검색 헤더추가
    },
    blur: function() {
        $menu.removeClass('active');
        $menuH1.removeClass('active');
        $iconLogo.removeClass('active');
        $(this).removeClass('active');
        $(this).find('i').removeClass('active');
        $(this).find('.menu-guide').removeClass('active');
        $menuGuide.css('display', 'none');
        $explanation.removeClass('active');
        $carousel.removeClass('active');
        $contents.removeClass('active'); //검색 헤더추가
    },
    keydown: function(e) {
        if (e.keyCode == 39) {
            if (location.pathname == urlLanguage + '/search') {
                $searchGuide.focus();
            }
        }
    }
});

//검색창에 포커스시 카테고리 투명도 변화
$searchGuide.on({
    focus: function() {
        $searchGuide.css('opacity', 1);
    },
    blur: function() {
        if (page == urlLanguage + '/search-noresult') {
            $searchGuide.css('opacity', 1);
        } else {
            $searchGuide.css('opacity', 0.4);
        }
    },
    keydown: function(e) {
        if (e.keyCode == 37) {
            $headerSearch.focus();
            return false;
        }
    }
})

//뒤로가기 버튼 포커스시 css변화
$btnGoBack.on({
    'focus mouseenter': function() {
        $goBackGuide.css('display', 'block');
        $iconGoBack.addClass('active');
    },
    'blur mouseleave': function() {
        $goBackGuide.css('display', 'none');
        $iconGoBack.removeClass('active');
    }
});



//input 박스에 다시 포커스 됐을 때 검색어의 맨 마지막으로 커서 위치하도록 하기
$searchBox.focus(function() {
    var len = $searchBox.val().length;
    $searchBox[0].setSelectionRange(len, len);
});


// 리모콘 조작 컨트롤
setTimeout(function() {
    $itemContainerLi.on({
        keydown: function(e) {
            switch (e.keyCode) {
                case 38:
                    if (page == urlLanguage + '/search') {
                        if ($(this).parents('li').index() < 4) {
                            $searchAreaA.focus()
                            return false;
                        } else {
                            if ($(this).parents('li').index() % 4 == 0) {
                                var nowIndex = $(this).parents('li').index();
                                $itemContainer.find('li').eq(nowIndex - 4).find('a').focus();
                                return false;
                            }
                        }
                    }
                case 37:
                    if ($(this).parents('li').index() % 4 == 0) {
                        $headerSearch.focus();
                    }
                    break;
            }
        }
    });

    $searchBox.on({
        keydown: function(e) {
            if (e.keyCode == 37) {
                $headerSearch.focus();
                return false;
            } else if (e.keyCode == 40) {
                console.log('여기?2')
                $('.search-recent li:nth-of-type(1) .searched-div').focus();
                return false;
            }
        }
    });
    $('.search-recent li .searched-div').on({
        keydown: function(e) {
            var indexNumber = parseInt($(this).parents('li').index());
            var totalDiv = parseInt($('.searched-div').length);
            switch (e.keyCode) {
                case 38:
                    indexNumber != 0 ?
                        $('.search-recent li:nth-of-type(' + indexNumber + ') .searched-div').focus() :
                        $searchBox.focus();
                    return false
                case 40:
                    console.log('여기?1')
                    indexNumber != totalDiv - 1 ?
                        $('.search-recent li:nth-of-type(' + parseInt(indexNumber + 2) + ') .searched-div').focus() :
                        '';
                    return false
            }
        }
    });
    $('.search-recent li:nth-of-type(1) a').on({
        keydown: function(e) {
            if (e.keyCode == 38) {
                $searchBox.focus();
                return false;
            }
        }
    });
    $btnGoBack.on({
        keydown: function(e) {
            if (e.keyCode == 39) {
                $searchBox.focus();
                return false;
            }
        }
    });
}, 500);

//최근 검색어에서 좌향키 눌렀을 때 이전 버튼 focus
$('.search-recent .searched-div').on('keydown', function(e) {
    if (e.keyCode == 37) {
        $btnGoBack.focus();
        return false;
    }
})

//LG masic remote 매직리모콘 --------------------------------------------------------------------------------------------
//확인키를 눌러 검색해보세요, 카테고리 검색, 뒤로가기 버튼
$('.search-guide, .item-container .item a, .btn-go-back, .icon-go-back').on('click', function(e) {
    e.target.focus();
})

//카테고리 클릭
if (page == urlLanguage + '/search') {
    $itemContainerItem.on('click', function(e) {
        e.target.nextElementSibling.click();
    })
}

//최근 검색어
$('.search-recent li a').on('mouseenter', function(e) {
    var target = $(this).parent('div');
    target.focus();
})


// 키패드로 input text 이동
document.querySelector('.search-box').addEventListener('keydown', function(e) {
    var selectionRange = document.querySelector('.search-box').selectionStart
    searchInputFocusBoolean = true;
    if (searchInputFocusBoolean) {
        switch (e.keyCode) {
            case 37:
                if (selectionRange == 0) {
                    setTimeout(function() {
                        document.querySelector('header .btn-go-back').focus()
                    }, 300)
                } else {
                    document.querySelector('.search-box').setSelectionRange(selectionRange - 1, selectionRange - 1)
                }
                break
            case 39:
                document.querySelector('.search-box').setSelectionRange(selectionRange + 1, selectionRange + 1)
                break
        }
    }
    searchInputFocusBoolean = false;
    return false
})