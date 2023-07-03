$searchGuide.focus();

$document.on('keydown', function(e) {
    if (e.keyCode == 65376 && urlLanguage == '/ko') {
        //키워드 검색 기능
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

//버튼 변화
$btnGoBack.click(function() {
    $detailModal.css('display', 'none');
})

$btnGoBack.on({
    focusin: function() {
        $goBackGuide.css('display', 'block');
        $iconGoBack.addClass('active');
    },
    blur: function() {
        $iconGoBack.removeClass('active');
    },
    keydown: function(e) {
        if (e.keyCode == 39) {
            $searchAreaA.focus();
        }
    }
})

// 리모콘 조작 컨트롤
$('.item-container li:nth-of-type(-n+4) a').on({
    keydown: function(e) {
        switch (e.keyCode) {
            case 38:
                $searchAreaA.focus();
                return false;
        }
    }
});
$searchAreaA.on({
    keydown: function(e) {
        switch (e.keyCode) {
            case 40:
                $('.item-container li:nth-of-type(1) a').focus()
                return false;
        }
    }
});

$('.item-container li:nth-of-type(4n+1) a, .search-guide').on({
    keydown: function(e) {
        switch (e.keyCode) {
            case 37:
                $btnGoBack.focus();
                return false;
        }
    }
});


//LG masic remote 매직리모콘 --------------------------------------------------------------------------------------------
//카테고리 클릭
$itemContainerItem.on('click', function(e) {
    e.target.nextElementSibling.click();
})

//검색창 활성화 된 상태에서 뒤로 가기 버튼 눌렀을 때
$searchAreaA.on('keydown', function(e) {
    if (e.keyCode == 13) {
        $('.btn-go-back ').addClass('input-active')
    }
});
$btnGoBack.on('keydown', function(e) {
    if (e.keyCode == 13) {
        if ($btnGoBack.hasClass('input-active')) {
            e.preventDefault();
            $('.menu, .search-guide, #cate_guide, .item-container, #artist_list, .art-slides').removeClass('disnone');
            $('.search-box, .search-key').addClass('disnone');
            $btnGoBack.removeClass('input-active');
        }
    }
});