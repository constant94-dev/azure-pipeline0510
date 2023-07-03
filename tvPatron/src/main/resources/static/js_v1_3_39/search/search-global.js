$document.ready(function() {
    $itemBox.first().find('li').eq(0).find('a').focus();
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

//카테고리 좌우 테두리박스 이동
$itemA2.on('focus', function() {
    $(this).parent().addClass('active');
    //'카테고리로 찾아보세요' 밝아지게 하기
    $cateGuide.addClass('active');
    $('.item-box a').css('opacity', 0.65);
    $itemSpan.css({
        'opacity': '1',
        'font-weight': '700'
    });
});
$itemA2.on('blur', function() {
    $cateGuide.removeClass('active');
    $active.removeClass('active');
    $('.item-box a').css('opacity', 0.3);
    $itemSpan.css({
        'opacity': '0.45',
        'font-weight': '400'
    });
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
})

$document.on('blur', '.searched-div', function() {
    $(this).children('a').removeClass('active');
})

$('.search-recent a').on({
    focus: function() {
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
    }

});

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

// 리모콘 조작 컨트롤
setTimeout(function() {
    $itemContainerLi.on({
        keydown: function(e) {
            var nowIndex = $(this).parents('li').index();
            var totalLengthIndex = $('.item-box li').length;
            switch (e.keyCode) {
                case 37:
                    if ($(this).parents('li').index() % 4 == 0) {
                        $headerSearch.focus();
                        return false;
                    } else {
                        $itemContainer.find('li').eq(nowIndex - 1).find('a').focus();
                        return false;
                    }
                    break;
                case 38:
                    if (page == '/search-global') {
                        if ($(this).parents('li').index() > 3) {
                            $itemContainer.find('li').eq(nowIndex - 4).find('a').focus();
                            return false;
                        } else {
                            return false;
                        }
                    }
                case 39:
                    if ($(this).parents('li').index() % 4 == 3) {
                        return false
                    } else {
                        $itemContainer.find('li').eq(nowIndex + 1).find('a').focus();
                        return false
                    }
                    break;
                case 40:
                    var downCount;
                    totalLengthIndex % 4 == 0 ? downCount = 4 : downCount = totalLengthIndex % 4;
                    if ($(this).parents('li').index() > totalLengthIndex - 1 - downCount) {
                        $itemContainer.find('li').eq($(this).parents('li').index() % 4).find('a').focus();
                        return false
                    } else {
                        $itemContainer.find('li').eq(nowIndex + 4).find('a').focus();
                        return false
                    }
                    break;
            }
        }
    });

    $menuA.on({
        keydown: function(e) {
            if (e.keyCode == 39) {
                $('.search-tag-container li:nth-child(1) a').focus();
                return false;
            }
        }
    });
}, 500);


//LG masic remote 매직리모콘 -------------------------------------------------------------------------------------------
//확인키를 눌러 검색해보세요, 카테고리 검색, 뒤로가기 버튼
$('.item-container .item a, .btn-go-back, .icon-go-back').on('click', function(e) {
    e.target.focus();
})


//카테고리 클릭
$itemContainerItem.on('click', function(e) {
    e.target.nextElementSibling.click();
});