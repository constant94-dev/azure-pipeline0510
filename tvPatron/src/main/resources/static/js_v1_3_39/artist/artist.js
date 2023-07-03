var $btnArtistGoback = $('#btn_artist_goback');
var $artistExplanation = $('.artist-explanation');
var $proTitle = $('.pro-title');
var $recommendedCurationGuide = $('#recommended_curation_guide');


if ($btnPlay.length > 0) {
    //top위치 움직이는 함수
    moveTop('#carousel_container a');
    moveCategoryItem('.category .item a');
    //버튼 변화 함수
    changeActive('.btn-play a');
    changeActive('#btn_like');
    ChangeBackImg();

    //메인전시 소개 - 감상하기 버튼에 포커스시
    $btnPlayA.on({
        focus: function () {
            $recommendedCurationGuide.css('display', 'none');
            $artistExplanation.css({
                'opacity': 1,
                'top': '64px'
            });
            $('.buttons a').css('font-weight', 700);
        }
    });

    //버튼 변화 함수
    function changeActive(button) {
        $(button).on({
            focus: function () {
                $(this).addClass('active');
            },
            blur: function () {
                $(this).removeClass('active');
            }
        })
        $btnArtistGoback.on({
            focus: function () {
                $goBackGuide.css('display', 'block');
                $iconGoBack.addClass('active');
            },
            blur: function () {
                $goBackGuide.css('display', 'none');
                $iconGoBack.removeClass('active');
            },
            keydown: function (e) {
                if (e.keyCode == '39') {
                    setTimeout(function () {
                        $('.contents-focus').focus()
                    }, 10);
                    return false;
                }
                if (e.keyCode == '38') {
                    return false
                }
            }
        })

    }

    $('.regi-art a').on({
        focus: function () {
            $backImg.css('opacity', '1');
            var itemBorder = $(this).children('.item-border');
            itemBorder.addClass('on');
            itemBorder.css('opacity', 1);
            avoidScrollTop();
            $artistExplanation.css('opacity', 0);
            $carousel.css({
                'top': 550,
                'height': 480
            });
            $proArea.css('opacity', 1);
            $('#info_label').removeClass('active');
            $proTitle.text(popular);
            $proTitle.css('opacity', 1);
        },
        blur: function () {
            var itemBorder = $(this).children('.item-border');
            itemBorder.removeClass('on');
            itemBorder.css('opacity', 0);
        }
    });

    $('.recommended-curation a').on({
        focus: function () {
            $backImg.css('opacity', '1');
            var itemBorder = $(this).children('.item-border');
            itemBorder.addClass('on');
            itemBorder.css('opacity', 1);
            avoidScrollTop();
            $carousel.css({
                'top': 550,
                'height': 480
            });
            $proArea.css('opacity', 1);
            $('#info_label').addClass('active');
            $proTitle.text(recommended);
            $proTitle.css('opacity', 1);
        },
        blur: function () {
            var itemBorder = $(this).children('.item-border');
            itemBorder.removeClass('on');
            itemBorder.css('opacity', 0);
        }
    });

    function moveTop(item) {
        //포커스가 되면 carousel의 top이 이동한다.
        $(item).on({
            focus: function () {
                var indexItem = $(this).parents('.category').index();
                var itemTop = 0;
                var itemHeight = 0;
                for (var i = 0; i < indexItem; i++) {
                    itemHeight = $category.eq(i).height();
                    itemTop = itemTop - itemHeight - 40;
                }
                avoidScrollTop();
                $carouselContainer.css('top', itemTop);
                if (indexItem == 0) {
                    $carousel.css({
                        'top': 580,
                        'height': 480
                    });
                }
            }
        })
    }

    $('.btn-play a, .btn-like button').on('focus', function () {
        $carousel.css('top', 880);
        $carouselContainer.css('top', 0);
        $('.regi-art.category').css('opacity', '1');
        $proArea.css('opacity', 0);
        $proTitle.css('opacity', 0);
        $recommendedCurationGuide.css('display', 'none');
        $explanation.removeClass('active');
    });

    function ChangeBackImg() {
        //등록된 작품에 포커스 됐을때
        $('.regi-art .visible-item a').on({
            focus: function () {
                var index = $(this).parents('.visible-item').attr('id');
                var artworksDefault = document.getElementById('artworksDefault' + index).value;
                var ArtworkName = document.getElementById('ArtworkName' + index).value;
                var ArtistName = document.getElementById('ArtistName' + index).value;
                var ArtworkArtistIntro = document.getElementById('ArtworkArtistIntro' + index).value;
                $backImg.attr('src', artworksDefault);
                $proArea.css('display', 'none');
                $recommendedCurationGuide.css('display', 'none');
                $('#regi_artwork_info').css('display', 'block');
                $('#regi_artwork_title').text(ArtworkName);
                $('#regi_artwork_info .artist-name').text(ArtistName);
                $('#regi_artwork_info .pro-info p').text(ArtworkArtistIntro);
                sliceTxt('regi_artwork_title', 40);
            }
        })

        $('.recommended-curation .visible-item a').on({
            focus: function () {
                var index = $(this).parents('.visible-item').index();
                var curationName = document.getElementById('ExhibitionName' + index).value;
                var ArtistName = '';
                if ($('#ExhibitionArtistNameOne' + index).length > 0) {
                    ArtistName = document.getElementById('ExhibitionArtistNameOne' + index).value;
                }
                if ($('#ExhibitionArtistNameTwo' + index).length > 0) {
                    ArtistName += ', ' + document.getElementById('ExhibitionArtistNameTwo' + index).value;
                }
                if ($('#ExhibitionArtistNameThree' + index).length > 0) {
                    ArtistName += ', ' + document.getElementById('ExhibitionArtistNameThree' + index).value;
                }
                if ($('#ExhibitionArtistNameMore' + index).length > 0) {
                    ArtistName += ' ' + and + ' ' + document.getElementById('ExhibitionArtistNameMore' + index).value + more;
                }
                var curationIntro = document.getElementById('ExhibitionIntro' + index).value;
                var ExhibitionArtworkCount = document.getElementById('ExhibitionArtworkCount' + index).value;
                var ExhibitionDuration = document.getElementById('ExhibitionDuration' + index).value;
                $backImg.attr('src', $(this).parents('.item').css('background-image').replace(/^url\(['"]?([^'"]*)['"]?\)$/, '$1'));
                $proArea.css('display', 'none');
                $('#recommended_curation_info').css('display', 'flex');
                $('#recommended_curation_title').text(curationName);
                $('#recommended_curation_info .artist-name').text(ArtistName);
                $('#recommended_curation_info .pro-info p').text(curationIntro);
                $recommendedCurationGuide.css('display', 'flex');
                $('#recommended_curation_guide .curation-size').text(ExhibitionArtworkCount + messageCommon.artwork);
                $('#recommended_curation_guide .curation-duration').text(ExhibitionDuration);
                sliceTxt('recommended_curation_title', 40);
            },
            blur: function () {
            }
        })

    }

    //컨텐츠 -> 헤더, 컨텐츠 최상단 <->최하단 이동
    function fakeFocusOn(fake, button) {
        fake.on('focus', function () {
            button.focus();
        })
    }

    fakeFocusOn($('.fake-artist-top'), $category.last().find('li').eq(0).find('a')); //컨텐츠 최하단 -> 최상단
    fakeFocusOn($('.fake-artist-bottom'), $btnPlayA); //컨텐츠 최하단 -> 최상단

    $('.fake-div').on('focus', function () {
        $('.contents-focus').focus();
    })

    function contentsFocus() {

        $('.category a, .btn-play').on({
            focus: function () {
                var $this = $(this);
                if ($this.parent('li').index() == 0 || $this.hasClass('btn-play')) { //작품,전시 리스트
                    $('.category a, .btn-play').removeClass('contents-focus');
                }
            },
            blur: function () {
                var $this = $(this);
                if ($this.parent('li').index() == 0 && !$this.hasClass('contents-focus')) {
                    $this.addClass('contents-focus');
                } else if ($this.hasClass('btn-play')) {
                    $this.addClass('contents-focus');
                }
            }
        })
    }

    contentsFocus(); //헤더 <-> 컨텐츠 포커스 이동방식

    $btnPlay.on('keydown', function (e) {
        switch (e.keyCode) {
            case 37:
                $btnArtistGoback.focus();
                return false;
            case 38:
                $category.last().find('li').eq(0).find('a').focus();
                $artistExplanation.css('opacity', '0');
                return false;
            case 40:
                if ($categoryLiA.hasClass('category-focus')) {
                    $('.category-focus').first().focus();
                    return false;
                } else {
                    $category.first().find('li').eq(0).find('a').focus();
                    return false;
                }
            case 39:
                $('.btn-like button').focus();
                return false;
        }
    })

    $categoryA.on({
        focus: function () {
            $(this).parents('.category').find('a').removeClass('category-focus');
        },
        blur: function () {
            $(this).addClass('category-focus');
        },
        keydown: function (e) {
            var indexNumber = parseInt($(this).parents('.category').index());
            var totalCategory = parseInt($category.length) - 1;
            switch (e.keyCode) {
                case 40:
                    if (indexNumber !== totalCategory) {
                        $('.category:nth-of-type(' + (indexNumber + 2) + ') .category-focus').length > 0 ?
                            $('.category:nth-of-type(' + (indexNumber + 2) + ') .category-focus').focus() :
                            $('.category:nth-of-type(' + (indexNumber + 2) + ') li:nth-of-type(1) a:nth-of-type(1)').focus();
                        return false;
                    } else {
                        $btnPlay.focus();
                        return false;
                    }
                case 38:
                    if (indexNumber !== 0) {
                        $('.category:nth-of-type(' + (indexNumber) + ') .category-focus').length > 0 ?
                            $('.category:nth-of-type(' + (indexNumber) + ') .category-focus').focus() :
                            $('.category:nth-of-type(' + (indexNumber) + ') li:nth-of-type(1) a:nth-of-type(1)').focus();
                        return false;
                    } else {
                        $btnPlay.focus();
                        return false;
                    }
                case 37:
                    if ($(this).parents('li').index() == 0) {
                        $btnArtistGoback.focus();
                        return false
                    }
                    break;
            }
        }
    })


    //LG masic remote 매직리모콘 --------------------------------------------------------------------------------------------
    //최근작 감상하기
    $btnPlay.on('click', function (e) {
        e.target.focus();
    })

    //캐러셀
    $('.regi-art .item a').on('click', function (e) {
        e.target.parentElement.focus();
    })
    //작가 큐레이션
    $('.recommended-curation .item a').on('click', function (e) {
        e.target.parentElement.focus();
    })
} else {
    window.onload = function () {
        $btnArtistGoback.focus();
    }
    $('.btn-like button').on({
        keydown: function (e) {
            switch (e.keyCode) {
                case 37:
                    $btnArtistGoback.focus();
                    return false;
                    break;
                case 38:
                    return false;
                    break;
                case 40:
                    return false;
                    break;
                case 39:
                    return false;
                    break;
                default:
                    break;
            }
        }
    })
    $btnArtistGoback.on({
        focus: function () {
            $goBackGuide.css('display', 'block');
            $iconGoBack.addClass('active');
        },
        blur: function () {
            $goBackGuide.css('display', 'none');
            $iconGoBack.removeClass('active');
        }
    })
}

//뒤로가기
$btnArtistGoback.on('click', function () {
    history.go(-1);
});

$('.btn-like button').on({
    focus: function () {
        $(this).addClass('active')
    },
    blur: function () {
        $(this).removeClass('active')
    },
    keydown: function (e) {
        switch (e.keyCode) {
            case 37:
                break;
            case 38:
                $category.last().find('li').eq(0).find('a').focus();
                $artistExplanation.css('opacity', '0');
                return false;
            case 40:
                if ($categoryLiA.hasClass('category-focus')) {
                    $('.category-focus').first().focus();
                    return false;
                } else {
                    $category.first().find('li').eq(0).find('a').focus();
                    return false;
                }
            case 39:
                return false;
            default:
                break;
        }
    }
});

function controlFavoriteArtist(id) {
    var likeStatus = document.querySelector('#btn_like .like-state').innerText == messageCommon.liked ? 0 : 1;

    $.ajax({
        url: urlLanguage + '/api/like-artist?art_id=' + id + '&like=' + likeStatus,
        method: 'post',
        data: {},
        success: function (result) {
            if (result == 1) {
                showToastModal(like);
                document.querySelector('#btn_like .like-state').innerText = messageCommon.liked
                $iconLike.css('display', 'block');
            }
            if (result == 2) {
                showToastModal(removeLike);
                document.querySelector('#btn_like .like-state').innerText = messageCommon.like
                $iconLike.css('display', 'none');
            }
        }
    })
}