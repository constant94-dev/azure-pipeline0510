var searchLocation = window.location.search;
var parameters = searchLocation.split('&');

$document.on('keydown', function(e) {
    if (e.keyCode == 65376) {
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
$('.art-slides.category .slide, #artist_list.category').on('keydown', 'li', function() {
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
function cookieSearchKeyword() {
    var recentSearchKeywordArray
    var searchValue;
    var HavingSearchValue;
    if (Cookies.get('searchKeywordArray')) {
        recentSearchKeywordArray = Cookies.get('searchKeywordArray').split(',');
    } else {
        recentSearchKeywordArray = [];
    }
    $searchBox.keydown(function(event) {
        searchValue = $searchBox.val();
        if (event.keyCode == '13' && searchValue.trim(' ') != '' && !pattern_spc.test(searchValue)) {
            HavingSearchValue = false;
            for (var q = 0; q < recentSearchKeywordArray.length; q++) {
                if (recentSearchKeywordArray[q] == searchValue) {
                    HavingSearchValue = true;
                }
            }
            if (HavingSearchValue) {} else {
                if (recentSearchKeywordArray.length == 5) {
                    recentSearchKeywordArray.shift();
                }
                recentSearchKeywordArray.push(searchValue);
            }
            Cookies.remove('searchKeywordArray');
            Cookies.set('searchKeywordArray', String(recentSearchKeywordArray), {
                domain: cookieDomain
            });
        }
    });

    //6. 그 배열을 다시 최근 검색어에 뿌려줌
    $document.ready(function() {
        if (recentSearchKeywordArray.length > 0) {
            for (var i = 0; i < recentSearchKeywordArray.length; i++) {
                var liTag = document.createElement('li');
                var aTag = document.createElement('a');
                aTag.setAttribute('href', urlLanguage + '/search-result?keyword=' + recentSearchKeywordArray[(recentSearchKeywordArray.length - 1) - i]);
                aTag.innerText = recentSearchKeywordArray[(recentSearchKeywordArray.length - 1) - i];
                liTag.appendChild(aTag);
                $('.search-recent').append(liTag);
            }
        }
    })
}
// cookieSearchKeyword();
//ja, en인 경우 (영어이름) 보이지 않는다
//진입시 작품검색결과 데이터를 받아온다
$(function() {
    var keyword = $searchGuide.attr('value');
    $.ajax({
        url: urlLanguage + '/api/search-result?keyword=' + keyword,
        method: 'get',
        type: 'json',
        success: function(data) {
            dataList = data;
            dataLength = Object.keys(dataList.artworkId).length;
        }
    })
});
var dataList; //json으로 받아온 작품검색결과 리스트
var dataLength; //json으로 받아온 작품검색결과 리스트 size


//검색창 a태그 <-> input
$searchGuide.on({
    click: function() {
        if (urlLanguage == '/ko') {
            $searchBox.removeClass('disnone');
            $searchGuide.addClass('disnone');
            $searchBox.focus();
        }
    }
})

//키워드로 검색기능
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


var $self;

//페이지 로드시 작가결과 있는지 없는지 판별한다
//작가검색결과 사이즈로 판별

var artItemOffset = true;

function setGradationTop() {
    var carouselOffsetTop = $('#carousel').offset()['top'];
    var setTarget = $('.opacity-box1');
    setTarget.css('top', carouselOffsetTop);
    $('.art-gradbox a').on({
        focus: function() {
            if (artItemOffset) {
                setTarget.css('display', 'none');
                artItemOffset = false;
            }
        }
    })
    $itemA.on({
        focus: function() {
            if (!artItemOffset) {
                setTarget.css('display', 'block');
                setTarget.css('top', carouselOffsetTop);
                artItemOffset = true;
            }
        }
    })
}

function artistViewStyle() {
    //작가검색결과가 있을경우
    if ($artistResult > 0) {
        $carousel.css('top', '626px');
        setGradationTop();
        $('.opacity-box1').addClass('result-exist');
        goToThere('.art-slides .art-item a', 'li', '#artist_list.first-shown-result li:nth-of-type(1) a', 4);
        goToThere('#artist_list.first-shown-result a', 'li', '.search-guide', 7);
        //input 박스에 다시 포커스 됐을 때 검색어의 맨 마지막으로 커서 위치하도록 하기
        var len = $searchBox.val().length;
        $searchBox[0].setSelectionRange(len, len);
    } else {
        $carousel.css('top', '190px');
        setGradationTop();
        $('.opacity-box1').addClass('result-exist');
    }
}
artistViewStyle();

hideBox(); // 박스 숨기는 함수
changeButtons(); //버튼 변화 함수
moveList('.art-slides a', 265, '#carousel_container');


//item : 포커스가 되는 태그, height : li의 높이, container : top이 변해야하는 div
function moveList(item, height, container) {
    var $container = $(container);
    //opacity box 변경 함수
    if ($artistResult > 0) {
        toggleClassFocus1($('.art-item a'), $('.opacity-box1'), 'big');
        toggleClassFocus2($('.art-item a'), $('.opacity-box1'), 'result-exist');

    } else {
        $('.opacity-box1').css('opacity', 0)
    }

    $document.on('focus', item, function() {
        $self = $(this); // 지금 focus 된 a 태그
        console.log($container);
        var liNumber = $self.parents('li').index(); // 지금 li의 index
        var rowNumber = parseInt(liNumber / 4); //몇번째 줄인지
        var listTop = -rowNumber * height; //캐러셀이 올라가거나 내려가는 높이
        $self.addClass('target');
        $container.css('top', listTop); //carousel box top 변경
        $('.title4').css('top', listTop * -1); //carousel box top 변경
        $(item).parents('li').css('opacity', '1'); //.art-slides a 의 li의 opacity를 1로 변경
        for (var i = 0; i <= liNumber; i++) {
            var rowIdx = parseInt(i / 4);
            if (rowIdx < rowNumber) {
                $(item).parents('li:nth-of-type(' + (i + 1) + ')').css('opacity', '0');
            }
        }

        if (liNumber < 100) {
            addList_lastIndex(liNumber);
        }

    });
    $document.on('blur', item, function() {
        $self = $(this); // 지금 focus 된 a 태그
        $self.removeClass('target');
    });
}


function addList_lastIndex(liNumber) {
    var liLast = $('.art-item').last().index(); // 현재 li들의 마지막 인덱스
    var liLast_directOn = liLast - 12; // 마지막 줄의 출력된 li 마지막 index 값의 4를 차감

    /* 사용자가 포커스하고 있는 이미지가 마지막 줄인지 체크해서
     * 마지막 줄일 때, 이미지 한 줄 추가
     * 마지막 줄이 아닐때, 이미지 이동
     * */
    if (liLast_directOn < liNumber) {
        $('.target').on('keydown', function(event) {
            if (event.keyCode == 40) {
                // alert('하향키 클릭')
                if (dataLength < 16) {

                } else {

                    contentsPaging();
                }
            }
        });
    }
}

//작가 검색결과에서 해당 작가 포커스시 border생김
$('#artist_list a').on({
    focus: function() {
        $(this).children('.item-border').css('opacity', 1);
        $('#artist_list.first-shown-result').css({
            'top': '0',
            'opacity': '1'
        });
        $carousel.css('top', '626px');
        $carouselContainer.css('top', 0);
        $('.art-item').css('opacity', 1);
        $('.art-slides .art-item').css('opacity', 0.4);
    },
    blur: function() {
        $(this).children('.item-border').css('opacity', 0);
    },
    keydown: function(e) {
        if (e.keyCode == 40) {
            if ($('.art-slides').length > 0) {
                $('.art-slides').find('li').eq(0).find('a').focus();
                return false;
            }
        }
    }
})

//작가 검색결과에서 더보기 포커스시 border 변화
$btnMoreArtist.on({
    focus: function() {
        $btnMoreArtist.css('opacity', 1);
    },
    blur: function() {
        $btnMoreArtist.css('opacity', 0.4);
    }
})


//a태그에 포커스 오면 테두리줌/나가면 안줌
$document.on('focus', 'a', function() {
    $(this).next().next().css('opacity', 1);
});

$document.on('blur', 'a', function() {
    $(this).next().next().css('opacity', 0);
});

//작가 검색결과 있을때, 작품에 포커스 가면 작가 숨김
$document.on('focus', '.art-slides a', function() {
    $('#artist_list.first-shown-result').css({
        'top': '-430px',
        'opacity': '0'
    });
})


var url_array_total = 0;

/* 서버에서 전달한 검색어와 관련된 썸네일 이미지 URL 을 배열에 담아두고
 * 배열에 저장된 데이터를 조건에 맞게 페이징해준다
 * */
function contentsPaging() {
    /* click 발생할 때마다 Array 값을 가져온다
     * 화면의 출력되고 있는 이미지의 마지막 index 번호를 가져온다
     * 가져온 index 부터 배열에 저장된 남은 데이터 만큼 화면의 출력한다 (남은 데이터가 4개 이상일 때는 +4 만큼 가져온다)
     * */
    var liSelector = [];
    liSelector = document.querySelectorAll('.slide li');
    var total_imageUrl = dataLength - 1; // 서버에서 전달받은 전체 이미지 url 사이즈
    var current_show_imageUrl = liSelector.length - 1; // 마지막으로 출력되는 li 의 index 번호
    var rest_imageUrl = total_imageUrl - current_show_imageUrl; // 전체 이미지 사이즈 - 마지막으로 출력되는 li index

    if (rest_imageUrl < 4) {
        for (var i = 1; i <= rest_imageUrl; i++) {
            /* click 발생할 때마다 Array 값을 가져온다
             * 화면의 출력되고 있는 이미지의 마지막 index 번호를 가져온다
             * 가져온 index 부터 배열에 저장된 남은 데이터 만큼 화면의 출력한다 (남은 데이터가 4개 이상일 때는 +4 만큼 가져온다)
             * */
            var liSelector_forIn = [];
            liSelector_forIn = document.querySelectorAll('.slide li');

            var current_show_imageUrl_forIn = liSelector_forIn.length - 1; // 마지막으로 출력되는 li 의 index 번호

            var add_LI = document.createElement('li'); // li 태그 추가
            add_LI.setAttribute('class', 'art-item hoverTrue'); // 새로 생성한 li 태그 속성값을 재설정한다

            // li 자식요소
            var add_DIV = document.createElement('div'); // div 태그 추가
            add_DIV.setAttribute('class', 'art-gradbox'); // 새로 생성한 div 태그 속성값(class)을 재설정한다

            var add_SPAN_title = document.createElement('span');
            add_SPAN_title.setAttribute('class', 'art-title');
            add_SPAN_title.setAttribute('id', 'art-title-' + current_show_imageUrl_forIn + '-' + i);

            // li 자식요소
            var add_SPAN_artist = document.createElement('span');
            add_SPAN_artist.setAttribute('class', 'art-artist');
            add_SPAN_artist.setAttribute('id', 'art-artist-' + current_show_imageUrl_forIn + '-' + i);

            // add_DIV 자식요소
            var add_DIV_child_A = document.createElement('a');

            // add_DIV 자식요소
            var add_DIV_child_div_art_grad = document.createElement('div');
            add_DIV_child_div_art_grad.setAttribute('class', 'art-grad');

            // add_DIV 자식요소
            var add_DIV_child_div_art_border = document.createElement('div');
            add_DIV_child_div_art_border.setAttribute('class', 'art-border');

            document.querySelector('.slide').appendChild(add_LI); // ul 태그 안의 li 추가

            /* 반복문이 돌아갈 때마다 li 태그는 하나씩 추가되기 때문에 li 태그가 추가될 때
             * li 태그 전체 길이에서 +1 해준 아이템에 접근해 add_DIV 태그를 append 해준다
             * */
            var liSelector_item_fourDown = document.querySelectorAll('.slide li').item(current_show_imageUrl + i);
            liSelector_item_fourDown.appendChild(add_DIV); // li 태그 안의 div 추가
            liSelector_item_fourDown.appendChild(add_SPAN_title); // li 태그 안의 span 추가
            liSelector_item_fourDown.appendChild(add_SPAN_artist); // li 태그 안의 span 추가

            /* 반복문이 들아갈 때마다 li 태그의 자식요소 중 0번째 요소를 선택해서
             * 0번째 요소(div)의 자식을 추가한다
             * */
            var divSelector_item_fourDown = liSelector_item_fourDown.children.item(0); // li 첫번째 자식 태그 찾는다
            divSelector_item_fourDown.appendChild(add_DIV_child_A);
            divSelector_item_fourDown.appendChild(add_DIV_child_div_art_grad);
            divSelector_item_fourDown.appendChild(add_DIV_child_div_art_border);

            for (var x = current_show_imageUrl_forIn; x < current_show_imageUrl_forIn + 1; x++) {
                document.getElementById('art-title-' + current_show_imageUrl_forIn + '-' + i).innerText = dataList.artworkName[x];
                document.getElementById('art-artist-' + current_show_imageUrl_forIn + '-' + i).innerText = dataList.artworkArtistName[x];
                add_DIV_child_A.setAttribute('style', 'background-image: url(\'' + dataList.artworkThumbNail[x] + '\')'); // style value 값은 변수로 세팅해야함
                add_DIV_child_A.setAttribute('href', urlLanguage + '/player?art_id=' + dataList.artworkId[x]); // art_id 값은 변수로 세팅해야함
            }
        }

    } else {
        // 남은 데이터가 4개 이상일때
        for (var j = 1; j <= 4; j++) {

            /* click 발생할 때마다 Array 값을 가져온다
             * 화면의 출력되고 있는 이미지의 마지막 index 번호를 가져온다
             * 가져온 index 부터 배열에 저장된 남은 데이터 만큼 화면의 출력한다 (남은 데이터가 4개 이상일 때는 +4 만큼 가져온다)
             * */
            var liSelector_forIn_else = [];
            liSelector_forIn_else = document.querySelectorAll('.slide li');
            var current_show_imageUrl_forIn_else = liSelector_forIn_else.length; // 마지막으로 출력되는 li 의 index 번호

            var add_LI = document.createElement('li'); // li 태그 추가
            add_LI.setAttribute('class', 'art-item hoverTrue'); // 새로 생성한 li 태그 속성값을 재설정한다

            // li 자식요소
            var add_DIV = document.createElement('div'); // div 태그 추가
            add_DIV.setAttribute('class', 'art-gradbox'); // 새로 생성한 div 태그 속성값(class)을 재설정한다

            // li 자식요소
            var add_SPAN_title = document.createElement('span');
            add_SPAN_title.setAttribute('class', 'art-title');
            add_SPAN_title.setAttribute('id', 'art-title-' + current_show_imageUrl_forIn_else + '-' + j);

            // li 자식요소
            var add_SPAN_artist = document.createElement('span');
            add_SPAN_artist.setAttribute('class', 'art-artist');
            add_SPAN_artist.setAttribute('id', 'art-artist-' + current_show_imageUrl_forIn_else + '-' + j);

            // add_DIV 자식요소
            var add_DIV_child_A = document.createElement('a');

            // add_DIV 자식요소
            var add_DIV_child_div_art_grad = document.createElement('div');
            add_DIV_child_div_art_grad.setAttribute('class', 'art-grad');

            // add_DIV 자식요소
            var add_DIV_child_div_art_border = document.createElement('div');
            add_DIV_child_div_art_border.setAttribute('class', 'art-border');

            document.querySelector('.slide').appendChild(add_LI); // ul 태그 안의 li 추가
            /* 반복문이 돌아갈 때마다 li 태그는 하나씩 추가되기 때문에 li 태그가 추가될 때
             * li 태그 전체 길이에서 +1 해준 아이템에 접근해 add_DIV 태그를 append 해준다
             * */
            var liSelector_item_fourDown = document.querySelectorAll('.slide li').item(current_show_imageUrl + j);
            liSelector_item_fourDown.appendChild(add_DIV); // li 태그 안의 div 추가
            liSelector_item_fourDown.appendChild(add_SPAN_title); // li 태그 안의 span 추가
            liSelector_item_fourDown.appendChild(add_SPAN_artist); // li 태그 안의 span 추가

            /* 반복문이 들아갈 때마다 li 태그의 자식요소 중 0번째 요소를 선택해서
             * 0번째 요소(div)의 자식을 추가한다
             * */
            var divSelector_item_fourDown = liSelector_item_fourDown.children.item(0); // li 첫번째 자식 태그 찾는다
            divSelector_item_fourDown.appendChild(add_DIV_child_A);
            divSelector_item_fourDown.appendChild(add_DIV_child_div_art_grad);
            divSelector_item_fourDown.appendChild(add_DIV_child_div_art_border);

            document.getElementById('art-title-' + current_show_imageUrl_forIn_else + '-' + j).innerText = dataList.artworkName[current_show_imageUrl_forIn_else];
            document.getElementById('art-artist-' + current_show_imageUrl_forIn_else + '-' + j).innerText = dataList.artworkArtistName[current_show_imageUrl_forIn_else];
            add_DIV_child_A.setAttribute('style', 'background-image: url(\'' + dataList.artworkThumbNail[current_show_imageUrl_forIn_else] + '\')'); // style value 값은 변수로 세팅해야함
            add_DIV_child_A.setAttribute('href', urlLanguage + '/player?art_id=' + dataList.artworkId[current_show_imageUrl_forIn_else]); // art_id 값은 변수로 세팅해야함
        }
    } // 조건문 종료!
} // function contentsPaging() end


//박스 숨기기 함수
function hideBox() {
    //좌우 이동 테두리박스 숨기기
    $('.border-box').addClass('disnone');
    //스크롤전 op박스 숨기기
    $('.art-slides a').on({
        focus: function() {
            avoidScrollTop();
            $carousel.css('top', 211);
            $('.border-box').removeClass('disnone');
        },
        blur: function() {
            $('.opacity-box1').removeClass('disnone');
        }

    })
}

//버튼 변화 함수 (정상작동)
function changeButtons() {
    //버튼 변화
    $btnGoBack.click(function() {
        $detailModal.css('display', 'none');
    });
    $btnGoBack.on({
        'focus mouseenter': function() {
            $goBackGuide.css('display', 'block');
            $iconGoBack.addClass('active');
            $fakeSearchLeft.removeClass('back');
        },
        'blur mouseleave': function() {
            $goBackGuide.css('display', 'none');
            $iconGoBack.removeClass('active');
            $fakeSearchLeft.addClass('back');
        }
    });
}

function contentsFocus() {
    $categoryA.on({
        focus: function() {
            $categoryA.removeClass('contents-focus');
        },
        blur: function() {
            var $this = $(this);
            $this.addClass('contents-focus');
        }
    })
}
contentsFocus(); //헤더 <-> 컨텐츠 포커스 이동방식

function contentsFocusArtwork() {
    $document.on('focus', '#artist_list.category a', function() {
        setTimeout(function() {
            $('.art-slides.category a').removeClass('artwork-focus')
        }, 100)
    })
    $document.on('focus', '.art-slides.category a', function() {
        $('.art-slides.category a').removeClass('artwork-focus')
    })
    $document.on('blur', '.art-slides.category a', function() {
        $(this).addClass('artwork-focus')
    })
}
contentsFocusArtwork()

//컨텐츠 -> 헤더, 컨텐츠 최상단 <->최하단 이동
function fakeFocusOn(fake, button) {
    fake.on('focus', function() {
        button.focus();
    })
}
fakeFocusOn($fakeSearchLeft, $('.contents-focus'));
fakeFocusOn($('.fake-search-bottom'), $('.art-slides').find('li').eq(0).find('a')); //컨텐츠 최하단 -> 컨텐츠 최상단

//최하단에서 하향키 클릭시 fake-search-bottom에 포커스가 왔을때 작가 검색결과 있으면 작가 첫번째로 포커스, 작가 검색결과 없으면 작품 첫번째로 포커스
$('.fake-search-bottom').on('focus', function() {
    if ($artistResult > 0) {
        $artistList.find('li').eq(0).find('a').focus();
    } else {
        $('.art-slides').find('li').eq(0).find('a').focus();
    }
})

function goBackToContents() {
    $fakeSearchLeft.on({
        focus: function() {
            if ($fakeSearchLeft.hasClass('back')) {
                $btnGoBack.focus();
            } else {
                $('.contents-focus').focus();
            }
        }
    })
}
goBackToContents();

$('.result-area').on('focus', function() {
    $('.contents-focus').focus();
})


//focus/blur 됐을 때 class 더하고 빼는 함수1
function toggleClassFocus1(selector, selector2, className) {
    selector.on({
        focus: function() {
            selector2.addClass(className);
        },
        blur: function() {
            selector2.removeClass(className);
        }
    });
}
//focus/blur 됐을 때 class 빼고 더하는 함수2
function toggleClassFocus2(selector, selector2, className) {
    selector.on({
        focus: function() {
            selector2.removeClass(className);
        },
        blur: function() {
            selector2.addClass(className);
        }
    });
}


function goToThere(focusedSelector, parentTag, targetTag, row) {
    $(focusedSelector).keydown(function(event) {
        var idx = $(this).parents(parentTag).index();
        if (event.keyCode == '38') {
            if (idx < row) {
                setTimeout(function() {
                    $(targetTag).focus();
                }, 10)
                return false;
            }
        }
    });
}

$searchAreaA.on('keydown', function(e) {
    if (e.keyCode == 13 && parameters[1] != 'explore=true') {
        $menu.addClass('disnone');
        $searchGuide.addClass('disnone');
        $cateGuide.addClass('disnone');
        $itemContainer.addClass('disnone');
        $artistList.addClass('disnone');
        $('.art-slides').addClass('disnone');
        $searchBox.removeClass('disnone');
        $searchBox.removeClass('disnone');
        $searchBox.focus();
    }
});

$searchAreaA.on('click', function() {
    if (parameters[1] != 'explore=true') {
        $menu.addClass('disnone');
        $searchGuide.addClass('disnone');
        $cateGuide.addClass('disnone');
        $itemContainer.addClass('disnone');
        $artistList.addClass('disnone');
        $('.art-slides').addClass('disnone');
        $searchBox.removeClass('disnone');
        $searchBox.removeClass('disnone');
        $searchBox.focus();
    }
});

$document.on('keydown', '.search-recent li a', function(e) {
    var indexNumber = parseInt($(this).parents('li').index());
    var totalDiv = parseInt($('.search-recent li a').length);
    switch (e.keyCode) {
        case 38:
            indexNumber != 0 ?
                $('.search-recent li:nth-of-type(' + indexNumber + ') a').focus() :
                $searchBox.focus();
            return false
        case 40:
            indexNumber != totalDiv - 1 ?
                $('.search-recent li:nth-of-type(' + parseInt(indexNumber + 2) + ') a').focus() :
                '';
            return false
    }
})

//최근검색어 포커스시 css변화
$document.on('focus', '.search-recent li a', function() {
    $(this).addClass('active');
    $document.on('keydown', '.search-recent li a', function(e) {
        if (e.keyCode == 13) {
            var url = $(this).attr('value');
            location.href = url;
        }
    })
    $document.on('click', '.search-recent li a', function(e) {
        var url = $(this).attr('value');
        location.href = url;
    })
})
$document.on('blur', '.search-recent li a', function() {
    $(this).removeClass('active');
})
$btnGoBack.on({
    keydown: function(e) {
        if (e.keyCode == 39) {
            if ($searchBox.hasClass('disnone')) {
                $searchGuide.focus();
            } else {
                $searchBox.focus();
            }
            return false;
        }
    }
});
$searchBox.on({
    keydown: function(e) {
        if (e.keyCode == 37) {
            return false;
        } else if (e.keyCode == 40) {
            $('.search-recent li:nth-of-type(1) a').focus();
            return false;
        }
    }
});
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

// 작품이동
setTimeout(function() {
    $searchAreaA.on('keydown', function(e) {
        if (e.keyCode == 40) {
            if ($('.artwork-focus').length > 0) {
                $('.artwork-focus').focus();
            } else {
                $('#artist_list li').length > 0 ? $('#artist_list li:nth-of-type(1) a').focus() : $('.art-slides li:nth-of-type(1) a').focus();
            }
            return false
        }
    })
    $('#artist_list a').on('keydown', function(e) {
        var liIndexNumber = $(this).parents('li').index();
        if (e.keyCode == 37) {
            if (liIndexNumber == 0) {
                $btnGoBack.focus();
                return false;
            }
        }
    })
    $('.art-slides.category .slide').on('keydown', 'li', function(e) {
        var indexNumber = $(this).index() + 1;
        var totalDataLength = parseInt(dataLength);
        switch (e.keyCode) {
            case 37:
                if (indexNumber % 4 != 1) {
                    $(this).prev().find('a').focus();
                    return false;
                } else if (indexNumber % 4 == 1) {
                    $btnGoBack.focus();
                    return false;
                } else {
                    return false;
                }
            case 38:
                if (indexNumber <= 4) {
                    $('#artist_list li').length > 0 ? $('#artist_list li:nth-of-type(1) a').focus() : $searchAreaA.focus();
                    return false;
                } else {
                    $('.art-slides li:nth-of-type(' + parseInt(indexNumber - 4) + ') a').focus()
                    return false;
                }
            case 39:
                if (indexNumber % 4 != 0) {
                    $(this).next().find('a').focus();
                    return false;
                } else {
                    return false;
                }
            case 40:
                switch (totalDataLength % 4) {
                    case 0:
                        if (totalDataLength >= indexNumber && indexNumber > totalDataLength - 4) {
                            $('.art-slides li:nth-of-type(' + parseInt(indexNumber - totalDataLength + 4) + ') a').focus();
                        } else {
                            $('.art-slides li:nth-of-type(' + parseInt(indexNumber + 4) + ') a').focus();
                        }
                        return false;
                    case 1:
                        if (totalDataLength - 1 >= indexNumber && indexNumber > totalDataLength - 4) {
                            $('.art-slides li:last-of-type a').focus();
                        } else
                        if (totalDataLength >= indexNumber && indexNumber > totalDataLength - 1) {
                            $('.art-slides li:nth-of-type(1) a').focus();
                        } else {
                            $('.art-slides li:nth-of-type(' + parseInt(indexNumber + 4) + ') a').focus();
                        }
                        return false;
                    case 2:
                        if (totalDataLength - 2 >= indexNumber && indexNumber > totalDataLength - 4) {
                            $('.art-slides li:last-of-type a').focus();
                        } else
                        if (totalDataLength >= indexNumber && indexNumber > totalDataLength - 2) {
                            $('.art-slides li:nth-of-type(' + parseInt(indexNumber - totalDataLength + 2) + ') a').focus();
                        } else {
                            $('.art-slides li:nth-of-type(' + parseInt(indexNumber + 4) + ') a').focus();
                        }
                        return false;
                    case 3:
                        if (totalDataLength - 3 >= indexNumber && indexNumber > totalDataLength - 4) {
                            $('.art-slides li:last-of-type a').focus();
                        } else
                        if (totalDataLength >= indexNumber && indexNumber > totalDataLength - 3) {
                            $('.art-slides li:nth-of-type(' + parseInt(indexNumber - totalDataLength + 3) + ') a').focus();
                        } else {
                            $('.art-slides li:nth-of-type(' + parseInt(indexNumber + 4) + ') a').focus();
                        }
                        return false;
                }
        }
    })
}, 500)


//LG masic remote 매직리모콘 --------------------------------------------------------------------------------------------
//확인키를 눌러 검색해보세요, 뒤로가기 버튼
$('.btn-go-back, .btn-artists-close, .icon-go-back').on('click', function(e) {
    e.target.focus();
})

//작가 검색결과
$('#artist_list .item-a, .btn-more-artist').on('click', function(e) {
    e.target.parentElement.focus();
})

//작가 전체 검색결과
$('.all-artists-list .item-a').on('click', function(e) {
    e.target.parentElement.focus();
})

//작품 전체 검색결과
$document.on('click', '.art-slides .art-item .art-border', function(e) {
    e.target.previousElementSibling.previousElementSibling.focus();
})

//작품 전체 검색결과 클릭
$document.on('click', '.art-slides .art-item .art-border', function(e) {
    e.target.parentElement.querySelector('a').click();
})


//최근 검색어
$('.search-recent').on('click', function(e) {
    e.target.parentElement.focus();
})

//확인키를 눌러 검색해보세요, 카테고리 검색, 뒤로가기 버튼
$('.search-guide, .item-container .item a, .btn-go-back, .icon-go-back').on('click', function(e) {
    e.target.focus();
})

//explore 메뉴일 때 검색결과에서 검색창 안보이도록


if (parameters[1] == 'explore=true') {
    document.querySelector('.search-guide.contents-focus.search-keyword').addEventListener('click', function(e) {
        e.preventDefault()
    });
    document.querySelector('.search-guide.contents-focus.search-keyword').addEventListener('keydown', function(e) {
        if (e.keyCode == 13) {
            e.preventDefault()
        }
    });
}