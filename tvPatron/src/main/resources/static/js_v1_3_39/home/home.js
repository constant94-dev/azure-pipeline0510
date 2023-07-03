/* TODO
 * 1. 위,아래 carousel top 움직임 한 함수로 만들기
 * 2. 넓어지는 박스 size, active, on 등 따로 클래스 주지 말고 한번에 처리하기
 * 3. class 선택자 가능하면 모두 id로 바꾸기
 * */
var $playHistory = $('.play-history');
var $mainCurationItemBorder = $('#main_curation .item-border');
var $forMember = $('.for-member');


//home.js only
var $comingSoonCuration = $('.coming-soon');
//5초마다 한번씩 function
var counter = 1;
var size = 1680;
var lastFocusedIndex = 0;
var totalIndex;
var liCount;
var ele;
var carouselIndex;


if ($loginStatus == 'false' || $loginStatus == false) {
    var unLoggedInLan = Cookies.get('language');
    if (unLoggedInLan == 'ko' || unLoggedInLan == 'en' || unLoggedInLan == 'ja') {
        if (location.pathname != '/' + unLoggedInLan + '/home') {
            location.href = '/' + unLoggedInLan + '/home'
        }
    }
}

setTimeout(function () {
    if (!$playHistory.hasClass('category')) {
        $carousel.css('top', '845px');
    }
}, 300)

var audio;
var myCollectionSettimeOut;
var mustExhSettimeoutClear;

moveCategoryItem('.category .item a');
movePlainItem('#main_curation .item a', '#main_curation .item', 1300);

var targetLi;
var mouseMoveSwitch = false;
$('.item-container li a, .coming-soon li a, #main_curation li a').on('keydown', function () {
    if (document.querySelectorAll('li:hover').length > 0) {
        targetLi = document.querySelectorAll('li:hover')[0];
        targetLi.classList.remove('hoverTrue');
        mouseMoveSwitch = true;
    }
});
window.addEventListener('mousemove', function (e) {
    if (mouseMoveSwitch) {
        targetLi.classList.add('hoverTrue');
        mouseMoveSwitch = false;
    }
})

//높이 및 스타일 바꾸는 함수
changeStyleHome();

function changeStyleHome() {
    //000님이 감상하신 작품이 포커스 됐을 때
    $('.play-history a').on({
        focus: function () {
            clearMainBanner();
            $btnGoSearch.css({
                'opacity': 1,
                'display': 'inline-flex'
            });
            $mainCurationItemBorder.css('opacity', 0);
            $backImg.css('opacity', '1');
            avoidScrollTop();
            $carousel.css({
                'top': 558,
                'height': 480
            });
        },
        blur: function () {
            //opacity가 돌아온다
            $('.new-artworks').css('opacity', 1);
        },
        keydown: function (event) {
            if (event.keyCode == '38') {
                $mainExhibitions.removeClass('disnone');
                $('#main_curation li:nth-of-type(' + parseInt(lastFocusedIndex + 1) + ') a').focus();
                return false;
            }
        }
    })
    //좋아하는 아트워크가 포커스 됐을 때
    $('#favorite_artworks a').on({
        focus: function () {
            clearMainBanner();
            avoidScrollTop();
            $('#favorite_artworks').css('opacity', 1);
        },
        keydown: function (event) {
            if (event.keyCode == '38' && !$playHistory.hasClass('category')) {
                $mainExhibitions.removeClass('disnone');
                $('#main_curation li:nth-of-type(' + parseInt(lastFocusedIndex + 1) + ') a').focus();
                return false;
            }
        }
    })
    //새롭게 선보이는 작품(또는 좋아하는 작품)이 포커스 됐을 때
    $('.new-artworks a').on({
        focus: function () {
            clearMainBanner();
            $mainCurationItemBorder.css('opacity', 0);
            $backImg.css('opacity', '1');
            avoidScrollTop();
        },
        blur: function () {
            //opacity가 돌아온다
            if ($playHistory.hasClass('category')) {
                $mainExhibitions.removeClass('disnone');
            }
            $('.theme1').css('opacity', 1);
        },
        keydown: function (event) {
            if (event.keyCode == '38' && !$playHistory.hasClass('category')) {
                $mainExhibitions.removeClass('disnone');
                $('#main_curation li:nth-of-type(' + parseInt(lastFocusedIndex + 1) + ') a').focus();
                return false;
            }
        }
    })
    //theme1가 선택됐을 때
    $('.theme1 a').on({
        focus: function () {
            clearMainBanner();
            avoidScrollTop();
        },
        blur: function () {
            $comingSoonCuration.css('opacity', 1);
        }
    })

    //theme2가 선택됐을 때
    $('.theme2 a').on({
        focus: function () {
            clearMainBanner();
            avoidScrollTop();
        },
        blur: function () {
            $artistList.css('opacity', 1);
        }
    })
    //전시가 선택됐을 때
    $('.coming-soon a').on({
        focus: function () {
            clearMainBanner();
            avoidScrollTop();
            var curationImg = $(this).parents('.item').find('.item-background-image').attr('src');
            $backImg.attr('src', curationImg);
            // $('.gradient-box').remove();
            $carousel.css({
                'top': 88,
                'height': 992
            });
            $('.theme2').css('opacity', 0);
            $proArea.css('display', 'none');
            if ($(this).parent('li').index() == 0) {
                setTimeout(function () {
                    $menu.css('left', 0);
                }, 10)
            }
        }
    })
    //theme3가 선택됐을 때
    $('.theme3 a').on({
        focus: function () {
            clearMainBanner();
            avoidScrollTop();
        },
        blur: function () {
            $artistList.css('opacity', 1);
        }
    })

    //theme4가 선택됐을 때
    $('.theme4 a').on({
        focus: function () {
            clearMainBanner();
            avoidScrollTop();
        },
        blur: function () {
            $artistList.css('opacity', 1);
        }
    })
    //theme5가 선택됐을 때
    $('.theme5 a').on({
        focus: function () {
            clearMainBanner();
            avoidScrollTop();
        },
        blur: function () {
            $artistList.css('opacity', 1);
        }
    })

    // 곧 찾아뵐게요
    $('.coming-soon a').on({
        focus: function () {
            clearMainBanner();
            var $this = $(this);
            var firstElement = $comingSoonCuration.find('li').eq(0).find('a');
            $this.addClass('active');
            //2초 후 이미지 사이즈 변경, 타이틀 사이즈 변경, curation-info보임
            clearTimeout(myCollectionSettimeOut);
            clearTimeout(mustExhSettimeoutClear);
            if ($this.hasClass('fake')) {
                myCollectionSettimeOut = setTimeout(function () {
                    firstElement.addClass('on');
                    firstElement.parent().addClass('size');
                    mustExhSettimeoutClear = setTimeout(function () {
                        firstElement.find('.bottom-white-guide,.item-title,.artist-title').addClass('active');
                    }, 500)
                    firstElement.next('.d-day').addClass('active')
                    firstElement.find('.curation-info').addClass('fade'); //.curation-info
                    firstElement.find('.item-border.coming').css('display', 'none');
                }, 10)
            } else {
                myCollectionSettimeOut = setTimeout(function () {
                    $this.addClass('on');
                    $this.parent().addClass('size');
                    mustExhSettimeoutClear = setTimeout(function () {
                        $this.find('.bottom-white-guide,.item-title,.artist-title').addClass('active');
                    }, 500)
                    $this.next('.d-day').addClass('active')
                    $this.find('.curation-info').addClass('fade'); //.curation-info
                    $this.find('.item-border.coming').css('display', 'none');
                }, 10)
            }
        },
        blur: function () {
            var $this = $(this);
            $this.removeClass('on active');
            $this.parent().removeClass('size');
            $this.next().next().removeClass('active');
            $this.find('.bottom-white-guide,.item-title,.artist-title').removeClass('active');
            $this.next('.d-day').removeClass('active')
            $this.find('.curation-info').removeClass('fade'); //.curation-info
            $this.find('.item-border.coming').css('display', 'block');
        }
    })
    //작가가 선택됐을 때
    $('#artist_list a').on({
        focus: function () {
            clearMainBanner();
            $btnGoSearch.css({
                'opacity': 1,
                'display': 'inline-flex'
            });
            avoidScrollTop();
        }
    })

    //더 다양한 작품을 선택해보세요가 선택되었을 때
    $btnGoSearch.on({
        focus: function () {
            clearMainBanner();
            $mainCurationItemBorder.css('opacity', 0);
            $backImg.attr('src', '');
            $(this).addClass('active'); //버튼 디자인 변화
            $btnGoSearch.css({
                'opacity': 1,
                'display': 'inline-flex'
            });
            $('.btn-go-search .icon-go-search').addClass('active'); //버튼 아이콘 변화
            avoidScrollTop();
            $carouselContainer.css('top', 0);
            $category.not(':last').css('opacity', 0);
            $comingSoonCuration.css('opacity', 0.4);
            $proArea.css('display', 'none');
            $('#search_more').css('display', 'block');
            $mainExhibitions.css('opacity', 0);
            $mainExhibitions.removeClass('disnone');
            $menu.css('left', '0px');
        },
        blur: function () {
            $backImg.css('opacity', '1');
            $(this).removeClass('active'); //버튼 디자인 변화
            $('.btn-go-search .icon-go-search').removeClass('active'); //버튼 아이콘 변화
        },
        keydown: function (e) {
            var indexNumber = parseInt($(this).parents('.category').index());
            switch (e.keyCode) {
                case 37:
                    menuFocus();
                    $menu.css('display', 'block');
                    $headerHome.focus();
                    return false;
                case 38:
                    console.log('here5')
                    $('.category:nth-of-type(' + (indexNumber) + ') .category-focus').length > 0 ?
                        $('.category:nth-of-type(' + (indexNumber) + ') .category-focus').focus() :
                        $('.category:nth-of-type(' + (indexNumber) + ') li:nth-of-type(1) a:nth-of-type(1)').focus();
                    return false;
                case 39:
                    console.log('here1');
                    return false;
                case 40:
                    $('#main_curation li:nth-of-type(' + parseInt(lastFocusedIndex + 1) + ') a').focus();
                    return false
            }
        }
    })
}

//헤더용
function contentsFocus() {
    $('.category a, .btn-go-search').on({
        focus: function () {
            var $this = $(this);
            if ($this.parent('li').index() == 0) { //작품,전시 리스트
                $categoryA.removeClass('contents-focus');
                $btnGoSearch.removeClass('contents-focus');
            } else if ($category.hasClass('btn-go-search')) { //더 다양한 작품을~ 버튼
                $categoryA.removeClass('contents-focus');
            }
        },
        blur: function () {
            var $this = $(this);
            if ($this.parent('li').index() == 0 && !$this.hasClass('contents-focus')) {
                $this.addClass('contents-focus');
            } else if ($this.hasClass('btn-go-search')) { //더 다양한 작품을~ 버튼
                $this.addClass('contents-focus');
            }
        }
    })
}

contentsFocus(); //헤더 <-> 컨텐츠 포커스 이동방식
//더 다양한 작품 포커스 후 헤더에 포커스 갔을때 작가리스트, 메인전시 소개 op:1로 돌아옴 --> 0으로 유지한다.
$menuA.on({
    focus: function () {
        if ($btnGoSearch.hasClass('contents-focus')) {
            $category.not(':last').css('opacity', 0);
        } else if ($('.coming-soon a').hasClass('contents-focus')) {
            $('.theme2').css('opacity', 0);
        }
    }
})


$('#main_curation li a').on({
    focus: function () {
        var $this = $(this);
        var curationImg = $this.parents('.item').find('.item-background-image').attr('src');
        var $mainCurationBackImageLink = $('#main_curation li.item a')
        $backImg.attr('src', curationImg);
        $mainCurationItemBorder.css('display', 'block');
        if ($playHistory.hasClass('category')) {
            $carousel.css('top', '887px');
        } else {
            $carousel.css('top', '845px');
        }
        $('.carousel .category').css('opacity', 1);
        //포커스 오면 더 다양한 작품을~에 contesnts-focus 클래스를 지워준다
        $btnGoSearch.removeClass('contents-focus');
        $categoryA.removeClass('contents-focus');
        $this.parent('.item').addClass('size active');
        $this.addClass('active on');
        $proArea.css('display', 'none');
        $mainExhibitions.css('opacity', 1);
        // $('.gradient-box').removeClass('half');
        $mainCurationBackImageLink.find('.item-title').css('opacity', '0');
        $mainCurationBackImageLink.find('.title3').css('opacity', '0');
        $mainCurationBackImageLink.find('.curation-info').css('opacity', '0');
        $mainCurationBackImageLink.find('.carousel-index').css('opacity', '0');
        $this.find('.item-border').css('opacity', '1');
        $this.find('.item-title').css('opacity', '1');
        $this.find('.title3').css('opacity', '1');
        $this.find('.curation-info').css('opacity', '1');
        $this.find('.carousel-index').css('opacity', '1');

        if ($this.parent('li').index() == parseInt(document.getElementById('main_curation').childElementCount - 1)) {
            counter = 0;
        } else {
            counter = $this.parent('li').index() + 1;
        }
    },
    blur: function () {
        var $this = $(this);
        $this.find('.item').removeClass('size active');
        $this.removeClass('active on')
        $this.find('.item-border').css('opacity', '0');
    },
    keydown: function (e) {
        if (e.keyCode == '37') {
            liCount = document.activeElement.childElementCount;
            for (var i = 0; i < liCount; i++) {
                ele = document.activeElement.children[i];
                if (ele.className == 'carousel-index') {
                    carouselIndex = ele;
                }
            }
            lastFocusedIndex = parseInt(carouselIndex.children[0].innerText) - 1;
            if (lastFocusedIndex == 0) {
                counter = 1;
                $headerHome.focus();
                return false;
            } else {
                counter = lastFocusedIndex;
                lastFocusedIndex = counter;
            }
        }
        if (e.keyCode == '39') {
            liCount = document.activeElement.childElementCount;
            for (var j = 0; j < liCount; j++) {
                ele = document.activeElement.children[j];
                if (ele.className == 'carousel-index') {
                    carouselIndex = ele;
                }
            }
            lastFocusedIndex = parseInt(carouselIndex.children[0].innerText);
            totalIndex = parseInt(carouselIndex.children[1].innerText);
            console.log('lastFocusedIndex', lastFocusedIndex);
            console.log('totalIndex', totalIndex);
            if (lastFocusedIndex == totalIndex) {
                $('#main_curation li:nth-of-type(1) a').focus();
                lastFocusedIndex = 1;
                counter = 1
                return false;
            } else {
                counter = lastFocusedIndex + 1;
                lastFocusedIndex = counter;
            }
        }
        if (e.keyCode == 40) {
            liCount = document.activeElement.childElementCount;
            for (var k = 0; k < liCount; k++) {
                ele = document.activeElement.children[k];
                if (ele.className == 'carousel-index') {
                    carouselIndex = ele;
                }
            }
            lastFocusedIndex = parseInt(carouselIndex.children[0].innerText) - 1;
            $('.category:nth-of-type(1) .category-focus').length > 0 ? $('.category:nth-of-type(1) .category-focus').focus() : $('.category:nth-of-type(1) li:nth-of-type(1) a:nth-of-type(1)').focus();
            return false;
        }
        if (e.keyCode == 38) {
            liCount = document.activeElement.childElementCount;
            for (var l = 0; l < liCount; l++) {
                ele = document.activeElement.children[l];
                if (ele.className == 'carousel-index') {
                    carouselIndex = ele;
                }
            }
            lastFocusedIndex = parseInt(carouselIndex.children[0].innerText) - 1;
            $('#main_exhibition').addClass('disnone');
            $btnGoSearch.focus();
            return false;
        }
    }
})
var exhIdValue;
var exhId;
$('.coming-soon a').on({
    'click': function () {
        var $this = $(this);
        exhId = $this.find('input').attr('id');
        exhIdValue = $this.find('input').attr('value');
        var ele = $this.find('.bottom-white-guide');
        var addButton = ele.find('.add-to-collection-button');
        if ($loginStatus == 'true') {
            if (addButton.hasClass('want-to-see')) {
                ele.html('<div class="add-to-collection-button hoverTrue already-contained"><i class="icon-check-black"></i><span style="color: #1F1F1F">' + messageHome.inMyLibrary + '</span></span></div>');
                addWaitingAjax();
            } else if (addButton.hasClass('already-contained')) {
                ele.html('<div class="add-to-collection-button hoverTrue want-to-see">' + messageCommon.wantToSee + '</div>');
                deleteWaitingAjax();
            } else {
            }
        } else {
            toastLogin();
        }
    }
})

function addWaitingAjax() {
    $.ajax({
        url: urlLanguage + '/api/waiting',
        method: 'POST',
        type: 'json',
        data: {
            exh_id: exhIdValue,
            waiting: true
        },
        success: function () {
            showToastModal(messageCommon.JSwaitingAdd);
            gtag('event', 'home_save_coming_curation');
        }
    });
}

function deleteWaitingAjax() {
    $.ajax({
        url: urlLanguage + '/api/waiting',
        method: 'POST',
        type: 'json',
        data: {
            exh_id: exhIdValue,
            waiting: false
        },
        success: function () {
            showToastModal(messageCommon.JSwaitingRemove);
        }
    });
}

function clearMainBanner() {
    $mainExhibitions.addClass('disnone');
}

$categoryLiA.on({
    focus: function () {
        $(this).parents('.category').find('a').removeClass('category-focus');
    },
    blur: function () {
        $(this).addClass('category-focus');
    },
    keydown: function (e) {
        var indexNumber = parseInt($(this).parents('.category').index());
        console.log('indexNumber : ', indexNumber);
        var totalCategory = parseInt($category.length);
        switch (e.keyCode) {
            case 40:
                if (indexNumber + 2 !== totalCategory) {
                    $('.category:nth-of-type(' + (indexNumber + 2) + ') .category-focus').length > 0 ?
                        $('.category:nth-of-type(' + (indexNumber + 2) + ') .category-focus').focus() :
                        $('.category:nth-of-type(' + (indexNumber + 2) + ') li:nth-of-type(1) a:nth-of-type(1)').focus();
                    return false;
                } else {
                    $('.btn-go-search').focus();
                    return false;
                }
            case 38:
                if (indexNumber + 1 !== 1) {
                    $('.category:nth-of-type(' + (indexNumber) + ') .category-focus').length > 0 ?
                        $('.category:nth-of-type(' + (indexNumber) + ') .category-focus').focus() :
                        $('.category:nth-of-type(' + (indexNumber) + ') li:nth-of-type(1) a:nth-of-type(1)').focus();
                    return false;
                }
                break;
            case 37:
                if ($(this).parents('li').index() == 0) {
                    $headerHome.focus();
                    return false
                }
                break;
        }
    }
});

$('#see_ad_modal_again').on({
    click: function () {
        Cookies.set('promotion', '');
        $adPop.remove();
        $headerHome.focus();
        remoteJsAppend();
    },
    keydown: function (e) {
        if (e.keyCode == 39) {
            $adPop.focus();
            return false;
        } else if (e.keyCode == 13) {
            $(this).click();
            return false;
        } else {
            return false;
        }
    },
    mouseenter: function () {
        $(this).focus();
    }
})
$adPop.on({
    click: function () {
        Cookies.set('promotion', adVersion.toString());
        $adPop.remove();
        $headerHome.focus();
        remoteJsAppend();
    },
    keydown: function (e) {
        if (e.keyCode == 37) {
            $('#see_ad_modal_again').focus();
            return false;
        } else if (e.keyCode == 13) {
            $(this).click();
            return false;
        } else {
            return false;
        }
    },
    mouseenter: function () {
        $(this).focus();
    }
})
//작가 검색결과에서 더보기 포커스시 border 변화
$btnMoreArtist.on({
    focus: function () {
        $btnMoreArtist.css('opacity', 1);
        $backImg.attr('src', '');
    },
    blur: function () {
        $btnMoreArtist.css('opacity', 0.4);
    }
})

//작가 검색결과(LG)
$btnMoreArtist.on('click', function (e) {
    e.target.parentElement.focus();
})

moveTop('.category a');

function moveTop(item) {
    $(item).on({
        focus: function () {
            var itemIndex = $(this).parents('.category').index();
            var itemTop;
            if ($(this).parents('.category').hasClass('coming-soon')) {
                itemTop = 60;
            } else if ($(this).parents('.category').hasClass('artist-list')) {
                itemTop = 513;
            } else {
                itemTop = 558;
            }
            var itemHeight = 0;
            if (itemIndex >= 0) {
                for (var i = 0; i < itemIndex; i++) {
                    itemHeight = $('.category').eq(i).height();
                    itemTop = itemTop - itemHeight - 40;
                }
                avoidScrollTop();
                $('#carousel').css('top', itemTop);
            }
        }
    })
}