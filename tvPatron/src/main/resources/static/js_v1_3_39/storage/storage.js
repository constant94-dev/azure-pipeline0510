//storage size
var exhibitionsCollectionsSize = parseInt(document.getElementById('exhibitionsCollectionsSize').value);
var favoriteArtistsSize = parseInt(document.getElementById('favoriteArtistsSize').value);
var waitingExhibitionsSize = parseInt(document.getElementById('waitingExhibitionsSize').value);
var likedArtworksSize = parseInt(document.getElementById('likedArtworksSize').value);
var watchedArtworksSize = parseInt(document.getElementById('watchedArtworksSize').value);

var $noContentGuide = $('#no_content_guide');
var $noContentGuide2 = $('.no-content-guide');
var $myCollection = $('#my_collection');
var artistEnglishName;

moveTop('#carousel_container .item-a')
//모달 창 함수
popAlert();

var targetLi;
var mouseMoveSwitch = false;
$itemContainerLi.on('keydown', function () {
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

//내 컬렉션, 좋아한 작품의 캐러셀의 left가 움직이게 한다
function moveBigItem(item, container, length) {
    $(item).on({
        focus: function () {
            var $this = $(this);
            $this.children('.item-border').css('opacity', 1); //작품 테두리
            $body.css('top', 0);
            var $container = $(container);
            var lastCount = $container.find('.item').length - 1;
            var selfNum = $this.parent().parent().index();
            var cateNum = $this.parents('.category').index();
            var itemHref = $this.attr('href'); //해당 item-a의 href
            var itemBorder = $this.children('.item-border'); //해당 item의 테두리
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
                var num = $this.parent().parent().index();
                var left = num * -length;
                clearTimeout(moveItemParentsSetTimeOut);
                moveItemParentsSetTimeOut = setTimeout(function () {
                    itemBorder.addClass('on'); //전시 테두리
                    itemBorder.css('opacity', 1); //작품 테두리
                }, 100)
                $container.css('left', left);
                if (num == 0) {
                    $container.css('left', 0);
                }
                if (num == 1) {
                    $(container).css('left', -length);
                }
            }

            //해당 작품 href 데이터가 없을 경우 링크이동안함
            if (itemHref.indexOf('no_data') != -1) {
                $this.attr('href', 'javascript:void(0)');
            }
        },
        blur: function () {
            var $this = $(this);
            var itemBorder = $this.children('.item-border'); //해당 item의 테두리
            //해당 작품에서 포커스가 나가면 음악을 정지시키고, id를 지움
            itemBorder.removeClass('on'); //전시 테두리
            itemBorder.css('opacity', 0); //작품 테두리
            audio = document.getElementById('audio');
            if (audio != null) {
                audio.currentTime = 0;
                audio.load();
                audio.pause();
                clearTimeout(audioPlay);
            }
        }
    })
}

moveBigItem('.my-collection .item a', '.my-collection .item-container', 420);
moveCategoryItem('.category .item a');

//좋아하는 작품 포커스 됐을 때 text 변화
changeExplanationStorage();

//top위치 변화를 주는 함수
changeTopStorage();


//carousel, carousel-container의 높이가 바뀌는 함수, opacity가 바뀌는 함수
function changeTopStorage() {
    //내 컬렉션이 선택됐을 때 carousel-container의 top이 0이 된다
    $('.my-collection a').on({
        focus: function () {
            avoidScrollTop();
            $carouselContainer.css('top', 0);
            $explanation.css('display', 'none');
            $carousel.css('top', 88);
            if ($(this).hasClass('nothing-a') || $(this).hasClass('fake')) {
                $backImg.attr('src', '');
            } else {
                var imgUrl = $(this).find('.item-background-image').attr('src');
                $backImg.attr('src', imgUrl);
            }
        }
    })

    //좋아한 전시가 선택됐을 때 825만큼 위로 올라간다
    $('.favorite-exhibition a').on({
        focus: function () {
            avoidScrollTop();
            $explanation.css('display', 'block');
            $carousel.css('top', 580).css('height', 480);
            $('.favorite-exhibition').css('opacity', 1);
        }
    })

    //좋아한 작가선택됐을 때 825만큼 위로 올라간다
    $('.favorite-artists a').on({
        focus: function () {
            avoidScrollTop();
            $explanation.css('display', 'block');
            $carousel.css('top', 580).css('height', 480);
            $('.favorite-artists').css('opacity', 1);
        }
    })

    //좋아한 작품이 선택됐을 때 825만큼 위로 올라간다
    $('.favorite-artworks a').on({
        focus: function () {
            avoidScrollTop();
            $explanation.css('display', 'block');
            $carousel.css('top', 580).css('height', 480);
            $('.favorite-artworks').css('opacity', 1);
        }
    })

    //감상기록을 선택했을 때 825+360만큼 올라간다
    $('.play-history a').on({
        focus: function () {
            avoidScrollTop();
            $carousel.css('top', 580).css('height', 480);
        }
    })

    //내가 기다리는 전시 선택했을 때 825+360만큼 올라간다
    $('.my-coming-soon a').on({
        focus: function () {
            avoidScrollTop();
            $carousel.css('top', 580).css('height', 480);
        }
    })
}

//저장한 전시, 좋아하는 작품 포커스 됐을 때 text 변화 함수
function changeExplanationStorage() {
    $explanation = $('#explanation');
    //내가 저장한 전시
    $('.favorite-exhibition .visible-item a').on({
        focus: function () {
            if (exhibitionsCollectionsSize > 0) {
                artistEnglishName = $(this).find('.english-name').text();
                $explanation.css('display', 'block');
                var index = $(this).parents('.visible-item').index();
                var exhibitionsCollectionDefault = document.getElementById('exhibitionsCollectionDefault' + index).value;
                var exhibitionsCollectionExhibitionName = document.getElementById('exhibitionsCollectionName' + index).value;
                var exhibitionsCollectionArtistName;
                var numberOfArtist = 0;
                var firstArtist;
                var secondArtist;
                var thirdArtist;
                var numberOfMoreArtist;

                if ($('#exhibitionArtistNameOne' + index).length > 0) {
                    firstArtist = document.getElementById('exhibitionArtistNameOne' + index).value;
                    numberOfArtist = numberOfArtist + 1;
                }
                if ($('#exhibitionArtistNameTwo' + index).length > 0) {
                    secondArtist = document.getElementById('exhibitionArtistNameTwo' + index).value;
                    numberOfArtist = numberOfArtist + 1;
                }
                if ($('#exhibitionArtistNameThree' + index).length > 0) {
                    thirdArtist = document.getElementById('exhibitionArtistNameThree' + index).value;
                    numberOfArtist = numberOfArtist + 1;
                }
                if ($('#exhibitionArtistNameMore' + index).length > 0) {
                    numberOfMoreArtist = document.getElementById('exhibitionArtistNameMore' + index).value;
                    numberOfArtist = numberOfArtist + 1;
                }
                switch (numberOfArtist) {
                    case 1:
                        exhibitionsCollectionArtistName = firstArtist;
                        break;
                    case 2:
                        exhibitionsCollectionArtistName = firstArtist + ', ' + secondArtist;
                        break;
                    case 3:
                        exhibitionsCollectionArtistName = firstArtist + ', ' + secondArtist + ', ' + thirdArtist;
                        break;
                    case 4:
                        exhibitionsCollectionArtistName = firstArtist + ', ' + secondArtist + ', ' + thirdArtist + ' ' + and + ' ' + numberOfMoreArtist + ' ' + more;
                        break;
                    default:
                        break;
                }
                var exhibitionsCollectionExhibitionArtworkSize = document.getElementById('exhibitionsCollectionSize' + index).value;
                var curationDuration = document.getElementById('exhibitionsCollectionDurationTime' + index).value;
                var exhibitionsCollectionIntro = document.getElementById('exhibitionsCollectionIntro' + index).value;
                $backImg.attr('src', exhibitionsCollectionDefault);
                $proArea.css('display', 'none');
                $('#saved_curation').css('display', 'block');
                $('#saved_curation .curation-size').text(exhibitionsCollectionExhibitionArtworkSize + messageCommon.artworks);
                $('#saved_curation .curation-duration').text(curationDuration);
                $('#saved_curation_title').text(exhibitionsCollectionExhibitionName);
                $('#saved_curation .artist-name').text(exhibitionsCollectionArtistName);
                $('#saved_curation .pro-info p').text(exhibitionsCollectionIntro);
                sliceTxt('saved_curation_title', 40);
                $backImg.css('opacity', '1');
            } else {
                $explanation.css('display', 'block');
                $backImg.attr('src', '');
                $proArea.css('display', 'none');
                $noContentGuide.css('display', 'block');
            }

        }
    })
    $('.favorite-artists .visible-item a').on({
        focus: function () {
            if (favoriteArtistsSize > 0) {
                artistEnglishName = $(this).find('.english-name').text();
                $explanation.css('display', 'block');
                var index = $(this).parents('.visible-item').index();
                var likedArtistDefault = document.getElementById('likedArtistDefault' + index).value;
                var likedArtistName = document.getElementById('LikedArtistName' + index).value;
                var LikedArtistIntro = document.getElementById('LikedArtistIntro' + index).value;
                $backImg.attr('src', likedArtistDefault);
                $proArea.css('display', 'none');
                $('#favorite_artists').css('display', 'block');
                $('#favorite_artist_name').text(likedArtistName);
                $('#favorite_artists .pro-info p').text(LikedArtistIntro);
                sliceTxt('favorite_artist_name', 40);
                $backImg.css('opacity', '1');
            } else {
                $explanation.css('display', 'block');
                $backImg.attr('src', '');
                $proArea.css('display', 'none');
                $noContentGuide.css('display', 'block');
            }

        }
    })

    //내가 좋아한 작품
    $('.favorite-artworks .visible-item a').on({
        focus: function () {
            if (likedArtworksSize > 0) {
                artistEnglishName = $(this).find('.english-name').text();
                var index = $(this).parents('.visible-item').index();
                var likedArtworkDefault = document.getElementById('likedArtworkDefault' + index).value;
                var likedArtworkName = document.getElementById('LikedArtworkName' + index).value;
                var likedArtworkArtistName = document.getElementById('LikedArtworkArtistName' + index).value;
                var likedArtworkArtistIntro = document.getElementById('LikedArtworkArtistIntro' + index).value;
                $proArea.css('display', 'none');
                $('#favorite_artworks').css('display', 'block');
                $('#favorite_artwork_title').text(likedArtworkName);
                $('#favorite_artworks .artist-name').text(likedArtworkArtistName);
                $('#favorite_artworks .pro-info p').text(likedArtworkArtistIntro);
                $proArea.css('opacity', 1);
                $backImg.attr('src', likedArtworkDefault);
                $backImg.css('opacity', '1');
                sliceTxt('played_artwork_title', 40);
            } else {
                $explanation.css('display', 'block');
                $backImg.attr('src', '');
                $proArea.css('display', 'none');
                $noContentGuide.css('display', 'block');
            }

        }
    })
}

//000님이 감상하신 작품이 포커스 됐을 때.
$(function () {
    $('.play-history .visible-item a').on({
        focus: function () {
            if (watchedArtworksSize > 0) {
                artistEnglishName = $(this).find('.english-name').text();
                $explanation.css('display', 'block');
                var index = $(this).parents('.visible-item').index();
                var WatchedDefault = document.getElementById('WatchedDefault' + index).value;
                var watchedArtworkName = document.getElementById('WatchedArtworkName' + index).value;
                var watchedArtistName = document.getElementById('WatchedArtistName' + index).value;
                var watchedArtistIntro = document.getElementById('WatchedArtistIntro' + index).value;
                $proArea.css('display', 'none');
                $('#played_artwork').css('display', 'block');
                $('#played_artwork_title').text(watchedArtworkName);
                $('#played_artwork .artist-name').text(watchedArtistName);
                $('#played_artwork .pro-info p').text(watchedArtistIntro);
                $backImg.attr('src', WatchedDefault);
                $backImg.css('opacity', '1');
                sliceTxt('played_artwork_title', 40);
            } else {
                $explanation.css('display', 'block');
                $backImg.attr('src', '');
                $proArea.css('display', 'none');
                $noContentGuide.css('display', 'block');
            }
        }
    });
})

var waitingToggle = true;
//공개예정 큐레이션 포커스 됐을 때.
$(function () {
    var serviceNow = false;
    $('.my-coming-soon .visible-item a').on({
        focus: function () {
            if (waitingExhibitionsSize > 0) {
                artistEnglishName = $(this).find('.english-name').text();
                $(this).find('.bottom-white-guide').addClass('active');
                $(this).addClass('active');
                $explanation.css('display', 'block');
                var index = $(this).parents('.visible-item').index();
                var waitingDefault = document.getElementById('waitingDefault' + index).value;
                var waitingExhibitionName = document.getElementById('waitingExhibitionName' + index).value;
                var waitingArtistName;
                var numberOfArtist = 0;
                var firstArtist;
                var secondArtist;
                var thirdArtist;
                var numberOfMoreArtist;

                if ($('#waitingArtistNameOne' + index).length > 0) {
                    firstArtist = document.getElementById('waitingArtistNameOne' + index).value;
                    numberOfArtist = numberOfArtist + 1;
                }
                if ($('#waitingArtistNameTwo' + index).length > 0) {
                    secondArtist = document.getElementById('waitingArtistNameTwo' + index).value;
                    numberOfArtist = numberOfArtist + 1;
                }
                if ($('#waitingArtistNameThree' + index).length > 0) {
                    thirdArtist = document.getElementById('waitingArtistNameThree' + index).value;
                    numberOfArtist = numberOfArtist + 1;
                }
                if ($('#waitingArtistNameMore' + index).length > 0) {
                    numberOfMoreArtist = document.getElementById('waitingArtistNameMore' + index).value;
                    numberOfArtist = numberOfArtist + 1;
                }
                switch (numberOfArtist) {
                    case 1:
                        waitingArtistName = firstArtist;
                        break;
                    case 2:
                        waitingArtistName = firstArtist + ', ' + secondArtist;
                        break;
                    case 3:
                        waitingArtistName = firstArtist + ', ' + secondArtist + ', ' + thirdArtist;
                        break;
                    case 4:
                        waitingArtistName = firstArtist + ', ' + secondArtist + ', ' + thirdArtist + ' ' + and + ' ' + numberOfMoreArtist + ' ' + more;
                        break;
                    default:
                        break;
                }
                var waitingExhibitionArtworkSize = document.getElementById('waitingExhibitionArtworkSize' + index).value;
                var waitingExhibitionIntro = document.getElementById('waitingExhibitionIntro' + index).value;
                var curationDuration = document.getElementById('waitingExhibitionDurationTime' + index).value;
                $proArea.css('display', 'none');
                $('#coming_soon').css('display', 'block');
                $('#coming_soon .curation-size').text(waitingExhibitionArtworkSize + messageCommon.artworks);
                $('#coming_soon .curation-duration').text(curationDuration);
                $('#coming_soon_title').text(waitingExhibitionName);
                $('#coming_soon .artist-name').text(waitingArtistName);
                $('#coming_soon .pro-info p').text(waitingExhibitionIntro);
                $backImg.attr('src', waitingDefault);
                sliceTxt('coming_soon_title', 40);
                $backImg.css('opacity', '1');
            } else {
                $explanation.css('display', 'block');
                $backImg.attr('src', '');
                $proArea.css('display', 'none');
                $noContentGuide.css('display', 'block');
            }
        },
        blur: function () {
            $(this).find('.bottom-white-guide').removeClass('active');
            $(this).removeClass('active');
        },
        keydown: function (e) {
            if (e.keyCode == '13') {
                if ($(this).hasClass('no-content')) {
                    e.preventDefault();
                } else {
                    if (serviceNow == false) {
                        e.preventDefault();
                        if (waitingToggle == true) {
                            showToastModal(messageCommon.JSwaitingRemove);
                            $(this).find('.bottom-white-guide li').html(messageCommon.wantToSee);
                            deleteWaitingExhibitionData(this);
                            waitingToggle = false;
                        } else if (waitingToggle == false) {
                            showToastModal(messageCommon.JSwaitingAdd);
                            $(this).find('.bottom-white-guide li').html('<i class="icon-check-black"></i><span style="color: black">' + messageStorage.inMyLibrary + '</span>');
                            sendWaitingExhibitionData(this);
                            waitingToggle = true;
                        }
                    }
                }
            }
        },
        click: function (e) {
            if (serviceNow == false) {
                e.preventDefault();
                if (waitingToggle == true) {
                    deleteWaitingExhibitionData(this);
                    showToastModal(messageCommon.JSwaitingRemove);
                    $(this).find('.bottom-white-guide li').html(messageCommon.wantToSee);
                    waitingToggle = false;
                } else if (waitingToggle == false) {
                    showToastModal(messageCommon.JSwaitingAdd);
                    $(this).find('.bottom-white-guide li').html('<i class="icon-check-black"></i><span style="color: black">' + messageStorage.inMyLibrary + '</span>');
                    sendWaitingExhibitionData(this);
                    waitingToggle = true;
                }
            }
        }
    });


})

//모달창 함수
function popAlert() {
    $('.nothing a').click(function (e) {
        if ($(this).hasClass('no-content')) {
            e.preventDefault();
        } else if ($(this).hasClass('nothing-a')) {
            showToastModal(messageStorage.empty);
        }
    })
}


//top위치가 이동하는 함수입니다. item에는 포커스가 될 a를 넣어주면 됩니다.
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
            if ($(this).parents('.category').hasClass('favorite-artists')) {
                $carouselContainer.css('top', itemTop - 45);
            } else {
                $carouselContainer.css('top', itemTop);
            }
            if (indexItem == 0) {
                $carousel.css('top', 580).css('height', 480);
            }
        }
    })
}

var myCollectionSettimeOut
$('.my-collection a').on({
    focus: function () {
        var $this = $(this);
        if ($this.hasClass('fake')) {
            $myCollection.find('li').eq(0).find('a').focus();
        } else {
            //2초 후 이미지 사이즈 변경, 타이틀 사이즈 변경, art-tags보임
            clearTimeout(myCollectionSettimeOut);
            myCollectionSettimeOut = setTimeout(function () {
                $this.addClass('on');
                $this.parents('.item').addClass('size');
                $this.find('.item-title').addClass('active');
                $this.find('.artist-title').addClass('active');
                $this.find('.art-tags').css('transition', 'all 0.5s 0.5s ease-in-out'); //.art-tags
                $this.find('.art-tags').addClass('fade'); //.art-tags
            }, 10)
        }
    },
    blur: function () {
        var $this = $(this);
        if (!$this.hasClass('fake')) {
            var $this = $(this);
            $this.removeClass('on');
            $this.parents('.item').removeClass('size');
            $this.next().next().removeClass('active');
            $this.find('.item-title').removeClass('active');
            $this.find('.artist-title').removeClass('active');
            $this.find('.art-tags').css('transition', 'none'); //.art-tags
            $this.find('.art-tags').removeClass('fade'); //.art-tags
        }
    }
})

//헤더에 포커스 가면 pro-area left가 밀린다
$menuA.on({
    focus: function () {
        $proArea.addClass('active');
        if ($noContentGuide2.length > 0) {
            $noContentGuide2.addClass('active');
        }
    },
    blur: function () {
        $proArea.removeClass('active');
        if ($noContentGuide2.length > 0) {
            $noContentGuide2.removeClass('active');
        }
    }
})

/*
헤더 <-> 컨텐츠 포커스 이동방식
0. 모든 작품/전시 리스트는 category클래스를 갖고있다.
1. category의 첫번째 a태그에서 포커스가 떠날때 $(this)에 contents-focus 클래스를 준다.
2. categoty의 첫번째 a태그에 포커스가 올때 모든 category a태그의 contents-focus클래스를 삭제한다.
3. 헤더로 이동하는 fake에 도달한다 (마지막으로 붙여진 contents-focus클래스가 삭제되지 않았다.)
4. 컨텐츠 -> 헤더 방향(좌클릭 일때) 해당 페이지가 home일 경우, 헤더의 home 메뉴로 포커스를 이동한다.
5. 헤더 -> 컨텐츠 방향(우클릭 일때) contents-focus클래스가 붙은 곳으로 포커스를 이동한다.
 */
function contentsFocus() {
    $('.category a, .btn-go-search').on({
        focus: function () {
            var $this = $(this);
            if ($this.parent('li').index() == 0) { //작품,전시 리스트
                $categoryA.removeClass('contents-focus');
            }
        },
        blur: function () {
            var $this = $(this);
            if ($this.parent('li').index() == 0 && !$this.hasClass('contents-focus')) {
                $this.addClass('contents-focus');
            }
        }
    })

    $('.item-box li:nth-of-type(1) a').on({
        focus: function () {
            $menu.css('opacity', 1);
        }
    })

}

contentsFocus(); //헤더 <-> 컨텐츠 포커스 이동방식

var exhIdValue;
var exhId;

function deleteWaitingExhibitionData(self) {
    exhId = self.querySelector('.coming-curation-id');
    exhIdValue = exhId.value;
    deleteWaitingAjax();
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
        }
    });
}

function sendWaitingExhibitionData(self) {
    exhId = self.querySelector('.coming-curation-id');
    exhIdValue = exhId.value;
    addWaitingAjax();
}

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
        }
    });

}

// 리모콘 조작 컨트롤
$('.my-collection.category a').on('keydown', function (e) {
    switch (e.keyCode) {
        case 37:
            if ($(this).parents('.my-collection.category li').index() == 0) {
                $storage.focus();
                return false;
            }
            break;
        case 39:
            if ($('.my-collection.category').find('li').length == 2) {
                return false;
            }
            break;
    }
})

$categoryLiA.on({
    focus: function () {
        $(this).parents('.category').find('a').removeClass('category-focus');
    },
    blur: function () {
        $(this).addClass('category-focus');
    },
    keydown: function (e) {
        var indexNumber = parseInt($(this).parents('.category').index());
        var totalCategory = parseInt($category.length);
        switch (e.keyCode) {
            case 40:
                if (indexNumber + 1 != totalCategory) {
                    $('.category:nth-of-type(' + (indexNumber + 2) + ') .category-focus').length > 0 ?
                        $('.category:nth-of-type(' + (indexNumber + 2) + ') .category-focus').focus() :
                        $('.category:nth-of-type(' + (indexNumber + 2) + ') li:nth-of-type(1) a:nth-of-type(1)').focus();
                    return false;
                } else if (indexNumber + 1 == totalCategory) {
                    $('.category:nth-of-type(1) .category-focus').focus();
                    return false
                }
            case 38:
                if (indexNumber + 1 != 1) {
                    $('.category:nth-of-type(' + (indexNumber) + ') .category-focus').length > 0 ?
                        $('.category:nth-of-type(' + (indexNumber) + ') .category-focus').focus() :
                        $('.category:nth-of-type(' + (indexNumber) + ') li:nth-of-type(1) a:nth-of-type(1)').focus();
                    return false;
                } else if (indexNumber == 0) {
                    $('.category:nth-of-type(' + (totalCategory) + ') .category-focus').focus();
                    return false
                }
                break;
            case 37:
                if ($(this).parents('li').index() == 0) {
                    $storage.focus();
                    return false
                }
                break;
        }
    }
});

//LG masic remote 매직리모콘 --------------------------------------------------------------------------------------------
//내 컬렉션
$('.my-collection .item-a').on('click', function (e) {
    e.target.parentElement.focus();
})

//캐러셀 내가 저장한 전시
$('.favorite-exhibition .item a').on('click', function (e) {
    e.target.focus();
})
//캐러셀 내가 기다리는 전시, 감상한 작품
$('.my-coming-soon .item a, .play-history .item a').on('click', function (e) {
    e.target.parentElement.focus();
})
//캐러셀 좋아한 작품
$('.favorite-artworks .item a').on('click', function (e) {
    e.target.parentElement.focus();
})