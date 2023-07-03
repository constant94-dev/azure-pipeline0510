window.onload = function() {
    $('.search-tag-container li:nth-of-type(1) a').focus();
}

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
    $itemSpan.css({
        'opacity': '1',
        'font-weight': '700'
    });
});
$itemA2.on('blur', function() {
    $cateGuide.removeClass('active');
    $active.removeClass('active');
    $itemSpan.css({
        'opacity': '0.45',
        'font-weight': '400'
    });
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
            switch (e.keyCode) {
                case 38:
                    if ($(this).parents('li').index() < 4) {
                        $btnGoBack.focus()
                        return false;
                    } else {
                        if ($(this).parents('li').index() % 4 == 0) {
                            var nowIndex = $(this).parents('li').index();
                            $itemContainer.find('li').eq(nowIndex - 4).find('a').focus();
                            return false;
                        }
                    }
                case 37:
                    if ($(this).parents('li').index() % 4 == 0) {
                        $btnGoBack.focus();
                    }
                    break;
            }
        }
    });
    $btnGoBack.on({
        keydown: function(e) {
            if (e.keyCode == 39) {
                $('.search-tag-container li:nth-of-type(1) a').focus();
                return false;
            }
        }
    });
}, 500);

//LG masic remote 매직리모콘 --------------------------------------------------------------------------------------------
//확인키를 눌러 검색해보세요, 카테고리 검색, 뒤로가기 버튼
$('.item-container .item a, .btn-go-back, .icon-go-back').on('click', function(e) {
    e.target.focus();
})

//카테고리 클릭
$itemContainerItem.on('click', function(e) {
    e.target.nextElementSibling.click();
})

$btnGoBack.on('click', function() {
    if (document.referrer != '') {
        location.href = document.referrer;
    } else {
        history.go(-1);
    }
})