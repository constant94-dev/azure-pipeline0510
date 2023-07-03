//파라미터값 받기
var art_id = document.getElementById('artwork_id').value;
var exh_id = document.getElementById('exhibition_id') != null ? document.getElementById('exhibition_id').value : null;
var artist_id = document.getElementById('artist_id') != null ? document.getElementById('artist_id').value : null;
var myCollection = getParameter('myCollection');

var inCollection = false;
var viewCountSetTimeOut;
var $wrapPlay = $('.wrap-play');
var $wrapCarousel = $('.wrap-carousel');
var $gradiantBox = $('.gradiant-box');
var $iconOriginRepeat = $('.icon-origin-repeat');
var $qrForGallery = $('#qr_for_gallery');
var $recommendedArtworksItem = $('#recommended_artworks .item');
var $otherCurationItem = $('#other_curation .item');
var $recommendedCategoriesItem = $('#recommended_categories .item');
var $otherCuration = $('#other_curation');
var $iconOriginText = $('.artwork-origin-text');
var $activeBtnInfo = $('.active-btn-info');
var $artworkLiked = $('#artwork_liked');
var $exhibitionInCollection = $('#exhibition_in_collection');
var $iconSaveCollection = $('.icon-save-collection');
var $saveCollectionText = $('.save-collection-text');
var $otherArtistsItem = $('#other_artists .item');
var $genieVoiceGuide = $('.genie-voice-guide');
var $fadeBox = $('.fade-box');
var $wrap = $('.wrap');
var $playButtonsButton = $('.play-buttons button');
var $artworkInfo = $('.artwork-info');
var $playerInfoCategory = $('.player-info .category');
var $nextListItem = $('.next-list .item');
var $playerInfo = $('#player_info');
var $playerInfo2 = $('.player-info');
var $collectionContainer = $('.collection-container');
var $activeBtnCollection = $('.active-btn-collection');
var $voiceGuide = $('#voiceGuide');
var $backImg = $('.black-img');
var $fadeBox2 = $('.fade-box2');
var $addCollection = $('.add-collection');
var $cate = $('.cate');
var $carouselA = $('.carousel a');
var fadeCount = 0;
var remoteSwitch = 0;
var idx;
var left;
var lastCount;
var cateNum;
var itemNum;
var artist_info_id;
var removeArtworkTag = '<i class="icon-minus-artwork"></i><span>' + messagePlayer.remove + '</span>';
var addArtworkTag = '<i class="icon-add-artwork"></i><span>' + messagePlayer.add + '</span>';
var artist_url;
// clearTime에 사용할 변수선언
var fadeoutClear;

// 스크롤 변수
var fixedBox;
var containedBox;
var scrollHeight;

// play-contents 필요호출자 변수 담음
var audio = document.getElementById('play_audio'); // audio 태그 음악파일이 실행되는 DOM
var playingBar = document.querySelector('.playing-bar'); // span 태그 음악파일 진행률을 보여주는 DOM
var fixedBar = document.querySelector('.fixed-bar'); // span 태그 전체음악 길이를 보여주는 고정 DOM
var circle = document.querySelector('.circle'); // 프로그래스바 포커스시 나타나는 css
var $playIcon = $('.icon-play'); // i 태그 재생 or 일시정지 아이콘 변경 위한 DOM
var currentTimeElement = document.querySelector('.current'); // span 태그 음악파일이 진행된 현재 플레이시간('분':'초') 보여주는 DOM
var durationTimeElement = document.querySelector('.duration'); // span 태그 음악파일의 총 플레이시간('분':'초') 보여주는 DOM

var pageFadeInSetTimeOutControl;

var targetLi;
var mouseMoveSwitch = false;

var nowPlayingIndex = 1; //지금 플레이 중인 작품의 인덱스
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

var ipAddress;
$.ajax({
    url: '/api/country-code',
    method: 'post',
    data: {},
    success: function (e) {
        ipAddress = e.toUpperCase();
    }
});

//QR code
function createQrForGallery(url) {
    var device = Cookies.get('deviceId');
    document.getElementById('qrCodeDivWrap').innerHTML = '';
    var options = {
        width: 128,
        height: 128,
        rander: 'canvas',
        text: url + '&device=' + device + '&nation=' + ipAddress
    }
    $('#qrCodeDivWrap').qrcode(options);
}

//오디오 재생이 끝났을때 next-list로 넘어가기
audio.addEventListener('ended', function () {
    if ($iconOriginRepeat.hasClass('only')) {
        //작품 반복
        audio.currentTime = 0;
        audio.play();
    } else {
        //전체 반복
        if ($detailModal.css('display') == 'none' && $qrLoginModal.css('display') == 'none') {
            changeNextPlayList('next', 'ended')
        }
    }
})

//오디오(mp3), 재생바, 일시정지/재생 버튼 토글
function togglePlayPause() {
    if (audio.paused) {
        $playIcon.addClass('pause');
        $pauseText.text(messagePlayer.pause);
        audio.play();
        gtag('event', 'player_play');
    } else {
        $playIcon.removeClass('pause');
        $pauseText.text(messagePlayer.play);
        audio.pause();
        gtag('event', 'player_pause');
    }
    switchToggle = true;
}

var switchToggle = true;
//해당 버튼 포커스, 확인(엔터)시로 변경해야함(테스트용 클릭이벤트)
document.getElementById('btn_pause').onclick = function () {
    if (switchToggle) {
        switchToggle = false;
        togglePlayPause();
    }
};

//파라미터 값 받기 함수
function getParameter(keyword) {
    keyword = keyword.replace(/[\[]]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + keyword + "=([^&#]*)"),
        result = regex.exec(location.search);
    if (result != null) {
        return decodeURIComponent(result[1].replace(/\+/g, ""));
    }
}

function checkWidth() {
    var imgOriginWidth = document.getElementById('img_origin').width;
    var imgOriginHeight = document.getElementById('img_origin').height;
    if ($imgCover[0].naturalWidth == $imgOrigin[0].naturalWidth) {
        if (imgOriginWidth < imgOriginHeight) {
            $imgCover.addClass('disnone');
            $imgOrigin.removeClass('disnone');
        } else {
            $imgOrigin.addClass('disnone');
            $imgCover.removeClass('disnone');
        }
        $iconOriginArtwork.addClass('deactivate');
        $iconOriginArtwork.addClass('origin');
        $iconOriginText.text(messagePlayer.basicView);
    }
}

function dataIn(data) {
    //컬렉션 담기 UI
    if ($activeBtnInfo.hasClass('disnone') || $('.add-collection-text').hasClass('inactive')) {
        setTimeout(function () {
            $detailModal.css('z-index', '900');
        }, 2000);
    }

    $('#artwork_id').val(data['id']);
    $artworkLiked.val(data['artworkLiked']);
    if (data['artworkInCollection'] != null) {
        $('#artwork_in_collection').val(data['artworkInCollection'][0]);
    }
    $exhibitionInCollection.val(data['exhibitionInCollection']);
    $('#exhibition_id').val(data['currentExhibitionId']);

    art_id = data['id'];
    var exhibitionInCollection = $exhibitionInCollection.val();
    if (exhibitionInCollection == 'false') {
        $iconSaveCollection.addClass('save')
        $saveCollectionText.text(messagePlayer.saveExhibition)
    } else {
        $iconSaveCollection.removeClass('save')
        $saveCollectionText.text(messagePlayer.saved)
    }

    liked_collection_view_button();

    // 이미지 + 오디오
    $imgOrigin.attr('src', data['originalImg4K']);
    $imgCover.attr('src', data['defaultImg4K']);

    $('#play_audio').attr('src', data['soundUrl']);

    // 작품 제목 + 작가 이름
    $('.play-info-artworkName').text(data['artworkName']);
    $recommendedArtworksItem.css('display', 'none');
    $otherCurationItem.css('display', 'none');
    $recommendedCategoriesItem.css('display', 'none');
    $recommendedArtworksItem.css('opacity', '1');
    $otherCurationItem.css('opacity', '1');
    $recommendedCategoriesItem.css('opacity', '1');
    $('#now_playing_artist').text(data['artistName']);
    //아트워크 플레이어일 때 참여 아티스트
    if (data['artistName'].length > 0 && getParameter('exh_id') == undefined && myCollection == undefined) {
        $otherArtistsItem.eq(0).find('a').attr('href', urlLanguage + '/artist?artist_id=' + data['artistId']);
        $otherArtistsItem.eq(0).find('a').attr('style', 'background-image:url("' + data['artistProfileImg'] + '")');
        $otherArtistsItem.eq(0).find('.art-artist').text(data['artistName']);
    }
    //000 인기 아트워크 (Curation Player & Artwork Player)
    if (data['otherArtistArtworksId'].length > 0 && getParameter('artist_id') == undefined) {
        $('#recommended_artworks').css('display', 'block');
        for (var i = 0; i < data['otherArtistArtworksId'].length; i++) {
            $recommendedArtworksItem.eq(i).css('background-image', 'url(' + data['otherArtistArtworksThumbnail'][i] + ')');
            $recommendedArtworksItem.eq(i).find('a').attr('href', urlLanguage + '/player?art_id=' + data['otherArtistArtworksId'][i]);
            $recommendedArtworksItem.eq(i).find('.art-title').text(data['otherArtistArtworksName'][i]);
            $recommendedArtworksItem.eq(i).find('.art-artist').text(data['artistName']);
            $recommendedArtworksItem.eq(i).css('display', 'block');
        }
        $recommendedArtworksItem.eq(data['otherArtistArtworksId'].length).css('display', 'block');
        $recommendedArtworksItem.eq(data['otherArtistArtworksId'].length).css('opacity', '0');
    } else {
        $('#recommended_artworks').css('display', 'none');
    }
    //추천 큐레이션 (Curation Player & Artist Player & Artwork Player)
    if (data['otherExhibitionsId'].length > 0) {
        $otherCuration.css('display', 'block');
        for (var i = 0; i < data['otherExhibitionsId'].length; i++) {
            $otherCurationItem.eq(i).css('background-image', 'url(' + data['otherExhibitionsThumbnail'][i] + ')');
            $otherCurationItem.eq(i).find('a').attr('href', urlLanguage + '/player?exh_id=' + data['otherExhibitionsId'][i]);
            $otherCurationItem.eq(i).find('.art-title').text(data['otherExhibitionsName'][i]);
            $otherCurationItem.eq(i).find('.other-item-artist-name').text(data['otherExhibitionsArtistName'][i]);
            if (data['otherExhibitionsArtistCount'][i] > 0) {
                $otherCurationItem.eq(i).find('.other-artists-count').text(messagePlayer.and + ' ' + data['otherExhibitionsArtistCount'][i] + ' ' + messagePlayer.moreArtist);
            }
            $otherCurationItem.eq(i).css('display', 'block');
        }
        $otherCurationItem.eq(data['otherExhibitionsId'].length).css('display', 'block');
        $otherCurationItem.eq(data['otherExhibitionsId'].length).css('opacity', '0');
    } else {
        $otherCuration.css('display', 'none');
    }
    //비슷한 카테고리 (Curation Player & Artist Player & Artwork Player)
    if (data['otherTagsName'].length > 0) {
        $('#recommended_categories').css('display', 'block');
        for (var i = 0; i < data['otherTagsName'].length; i++) {
            $recommendedCategoriesItem.eq(i).find('a').attr('href', urlLanguage + '/search-result?keyword=' + data['otherTagsName'][i]);
            $recommendedCategoriesItem.eq(i).find('.keyword').text(data['otherTagsName'][i]);
            $recommendedCategoriesItem.eq(i).css('display', 'block');
        }
        $recommendedCategoriesItem.eq(data['otherTagsName'].length).css('display', 'block');
        $recommendedCategoriesItem.eq(data['otherTagsName'].length).css('opacity', '0');
    } else {
        $('#recommended_categories').css('display', 'none');
    }
    //작품 정보 수정하기 (art_id)
    $('.artwork-info-detail-artwork-name').text(data['artworkName']);
    if(data['artworkSource'] == null || data['artworkSource'] == 'null' || data['artworkSource'] == ''){
        $('.artwork-info-detail-artwork-source').parent('li').css('display','none');
    }else{
        $('.artwork-info-detail-artwork-source').parent('li').css('display','block');
        $('.artwork-info-detail-artwork-source').text(data['artworkSource']);
    }
    if(data['artworkDate'] == null || data['artworkDate'] == 'null' || data['artworkDate'] == ''){
        $('.artwork-info-detail-artwork-date').parent('li').css('display','none');
    }else{
        $('.artwork-info-detail-artwork-date').parent('li').css('display','block');
        $('.artwork-info-detail-artwork-date').text(data['artworkDate']);
    }
    if(data['artworkSize'] == null || data['artworkSize'] == 'null' || data['artworkSize'] == ''){
        $('.artwork-info-detail-artwork-size').parent('li').css('display','none');
    }else{
        $('.artwork-info-detail-artwork-size').parent('li').css('display','block');
        $('.artwork-info-detail-artwork-size').text(data['artworkSize']);
    }
    //TODO Aiden 작품 설명 보여줘야하는지?
    $('.artwork-info-detail-intro p').text(data['artworkIntro']);

    //음악 정보 수정하기
    $('.artwork-info-detail-sound-name').text(data['soundName']);
    $('.artwork-info-detail-sound-creator').text(data['soundCreator']);
    $('.artwork-info-detail-original-url').text(data['soundOriginalUrl']);
    $('.artwork-info-detail-sound-license').text(data['soundLicense']);

    //작가 정보 수정하기
    $('#artist_img img').attr('src', data['artistProfileImg']);
    $('.artist-info-detail div').text(data['artistIntro']);

    //전시 정보 수정하기
    $('.exhibition-info-detail-exhTitle').text(data['currentExhibitionName']);
    var exhArtist;
    var exhArtistName = data['artistName'];

    if (data['currentArtistsCount'] > 0) {
        exhArtist = messagePlayer.and + data['currentArtistsCount'] + messagePlayer.more;
    } else {
        exhArtist = '';
    }

    $('.artist-name').text(exhArtistName);
    $('.curation-info-detail-artists').text(exhArtist);
    $('.curation-info-detail-intro div').text(data['currentExhibitionIntro']);
    $itemContainer.css('left', '0');
    $('.item-box-li').css('opacity', '1');

    //작가 상세 url
    $('#artist_info_id').val(data['artistId']);
    artist_info_id = $('#artist_info_id').val();
    artist_url = urlLanguage + '/artist?artist_id=' + artist_info_id;

    //gallery QR
    if (data['shopUrl'] != null) {
        $qrForGallery.css('display', 'block');
        setTimeout(function () {
            createQrForGallery(data['shopUrl']);
        }, 1500)
    } else {
        $qrForGallery.css('display', 'none');
    }
}

//폼 로드시 작품 이미지에(div) 포커스주기, 기능페이지 첫 진입시 블랙화면-->이미지,ui 페이드인
$(function () {
    if (myCollection != undefined) {
        $.ajax({
            url: urlLanguage + '/api/player?art_id=' + art_id + '&myCollection=' + myCollection,
            type: 'get',
            success: function (initData) {
                dataIn(initData);
                setTimeout(checkWidth, 100);
                setTimeout(function () {
                    audio.autoplay = true;
                    audio.play();
                    pageFadeIn(); //처음 진입시 페이지 fadeIn
                }, 1000);
            }
        })
    } else {
        $.ajax({
            url: urlLanguage + '/api/player?art_id=' + art_id + (exh_id != null ? '&exh_id=' + exh_id : '') + (artist_id != null ? '&artist_id=' + artist_id : ''),
            method: 'GET',
            dataType: 'json',
            success: function (initData) {
                dataIn(initData);
                setTimeout(checkWidth, 100);
                setTimeout(function () {
                    audio.autoplay = true;
                    audio.play();
                    pageFadeIn(); //처음 진입시 페이지 fadeIn
                }, 1000);
            },
            error: function (err) {
            }
        })
    }
    showInfoAtCollection();
    artist_info_id = $('#artist_info_id').val();
    artist_url = urlLanguage + '/artist?artist_id=' + artist_info_id;
});


function afterLoading(data) {
    console.log('들어오는 데이터!!', data)
    //kt일 경우 발화가이드
    if ($genieVoiceGuide.length) {
        $genieVoiceGuide.css('opacity', 0);
    }

    //작품 열림
    $wrap.css('display', 'block');
    //정보창 바탕 그라데이션
    setTimeout(function () {
        if (!$activeBtnInfo.hasClass('disnone')) {
            $detailModal.css('display', 'block');
        }
    }, 3000);
    // TODO Aiden : 최근 컬렉션 기준 바뀌는 기준이 새로고침인지? 모달을 다시 열 때 인지? 모달을 다시 여는 것이라면, 모바일에서 바뀐 것도 적용이 되어야하는 지?
    // 모달을 다시 열 때 라면
    if (data['artworkInRecentCollection'] != null && data['artworkInRecentCollection'].length > 0) {
        for (var k = 0; k < 3; k++) {
            var targetLis = $('.lately-collection li:nth-of-type(' + parseInt(k + 1) + ') a');
            if (data['artworkInRecentCollection'][k] == true) {
                //true
                targetLis.removeClass('add-active-title');
                targetLis.addClass('minus-active-title');
                targetLis.attr('value', data['artworkInRecentCollection'][k]);
                targetLis.next('button').find('div').removeClass('btn-collection-add');
                targetLis.next('button').find('div').addClass('btn-collection-minus');
                targetLis.next('button').find('div').html(removeArtworkTag);
            } else {
                //false
                targetLis.addClass('add-active-title');
                targetLis.removeClass('minus-active-title');
                targetLis.attr('value', data['artworkInRecentCollection'][k]);
                targetLis.next('button').find('div').addClass('btn-collection-add');
                targetLis.next('button').find('div').removeClass('btn-collection-minus');
                targetLis.next('button').find('div').html(addArtworkTag);
            }
        }
    }
    if (data['artworkInCollection'] != null && data['artworkInCollection'].length > 0) {
        var targetLi;
        for (var p = 0; p < data['artworkInCollection'].length; p++) {
            targetLi = $('.all-collection li:nth-of-type(' + parseInt(p + 1) + ') a');
            if (data['artworkInCollection'][p] == true) {
                //true
                targetLi.removeClass('add-active-title');
                targetLi.addClass('minus-active-title');
                targetLi.attr('value', data['artworkInCollection'][p]);
                targetLi.next('button').find('div').removeClass('btn-collection-add');
                targetLi.next('button').find('div').addClass('btn-collection-minus');
                targetLi.next('button').find('div').html(removeArtworkTag);
            } else {
                //false
                targetLi.addClass('add-active-title');
                targetLi.removeClass('minus-active-title');
                targetLi.attr('value', data['artworkInCollection'][p]);
                targetLi.next('button').find('div').addClass('btn-collection-add');
                targetLi.next('button').find('div').removeClass('btn-collection-minus');
                targetLi.next('button').find('div').html(addArtworkTag);
            }
        }
    }

    idx = 0;
    left = 0;
    lastCount = $('.next-list .item-container').find('li').length - 1 < 1 ? $('#other_curation .item-container').find('li').length - 1 : $('.next-list .item-container').find('li').length - 1;
    cateNum = 0;
    itemNum = 0;
    //다음 작품 이동 할 때 컨트롤러 없으면 다음 작품 이동 후에도 컨트롤러 안 보임
    if ($playContents.hasClass('disnone') && $wrapCarousel.css('opacity') == '0') {
        $wrapPlay.css('opacity', 0);
        $wrapCarousel.css('opacity', 0);
        $gradiantBox.css('opacity', 0);
    } else {
        setTimeout(function () {
            $wrapPlay.css('display', 'block');
        }, 3000)
    }
    setTimeout(function () {
        //data 교체
        dataIn(data);
        showInfoAtCollection();
        clearTimeout(pageFadeInSetTimeOutControl);
    }, 2000);
    // img.complete
    setTimeout(function () {
        var dataInImg = new Image();
        dataInImg.src = data['originalImg4K'];
        dataInImg.onload = function () {
            setTimeout(function () {
                //모드 변경 가능 여부 판단
                var imgOriginNaturalWidth = $imgOrigin[0].naturalWidth;
                var imgCoverNaturalWidth = $imgCover[0].naturalWidth;

                var imgOriginWidth = document.getElementById('img_origin').width;
                var imgOriginHeight = document.getElementById('img_origin').height;
                //모드 변경 불가능한 경우
                if (imgOriginNaturalWidth == imgCoverNaturalWidth) {
                    /*
                    4k 이미지와 Original 이미지가 동일 이미지이고
                    세로보다 가로가 긴 이미지일 경우 img-cover (css가 width가 100%인 class)가 보이고,
                    가로보다 세로가 긴 이미지일 경우 img-origin (css가 height가 100%인 class)가 보인다.
                    */
                    if (imgOriginWidth < imgOriginHeight) {
                        $imgCover.addClass('disnone');
                        $imgOrigin.removeClass('disnone');
                    } else {
                        $imgOrigin.addClass('disnone');
                        $imgCover.removeClass('disnone');
                    }
                    $iconOriginArtwork.addClass('deactivate');
                    $iconOriginArtwork.addClass('origin');
                    $iconOriginText.text(messagePlayer.basicView);
                }
                //다음 작품 fadeIn
                $('#btn_pause i').addClass('pause');
                $pauseText.text(messagePlayer.pause);
                $fadeBox.css('opacity', 0)
                $itemContainer.css('left', '0')
            }, 500);
            setTimeout(function () {
                if ($playButtonsButton.hasClass('last-inactive') && $activeBtnInfo.hasClass('disnone') && $('.add-collection-text').hasClass('inactive')) {
                    $('.last-inactive').focus();
                } else if (!$activeBtnInfo.hasClass('disnone')) {
                    playerInfo.focus();
                    $playerInfo.scroll();
                } else if ($('.collection-container .collection-buttons div').hasClass('active') || $activeBtnCollection.hasClass('active')) {
                    $collectionContainer.find('active').focus();
                } else {
                    $('.last-inactive').focus();
                    /*이전작품 > 다음작품에서 온 경우에
                    이전작품에 컨트롤러가 보였으면 마찬가지로 다음작품에 컨트롤러를 보이고,
                    이전 작품에 컨트롤러가 숨었으면 마찬가지로 다음작품에서도 컨트롤러를 숨긴다.*/

                    if (!$playContents.hasClass('disnone')) {
                        $wrapPlay.css('animation', 'fadein 0.3s');
                        $wrapPlay.css('opacity', 1);
                        $wrapCarousel.css('opacity', 1);
                        $gradiantBox.css('opacity', 1);
                        $wrapCarousel.css('animation', 'fadein 0.3s');
                        $gradiantBox.css('animation', 'fadein 0.3s');
                        $voiceGuide.css('opacity', 1);
                    }
                }
                $('a').removeClass('category-focus');
            }, 500);
            setTimeout(function () {
                $('.cate:nth-of-type(1)').css('opacity', '1');
                $('#carousel').css('top', '943px');
                $carouselContainer.css('top', '0');
                $('.contents-focus').removeClass('contents-focus')
                //kt일 경우 발화가이드
                if ($genieVoiceGuide) {
                    $genieVoiceGuide.css('opacity', 1);
                }
            }, 100);
            setTimeout(function () {
                remoteSwitch = 0;
            }, 1500);
            setTimeout(function () {
                keydownChecker = true
            }, 1000)
        }
    }, 2500)

    $('#view_last_time').val(data['viewLastTime']);
    //페이지에 들어오고 30초가 지나면 자동으로 보낸다..
    viewLastTime();
}

//모달창 함수
function popAlert() {
    $('.no-artwork-modal .btn-okay').on('keydown', function (event) {
        if (event.keyCode == 13) {
            $('.no-artwork-modal').css('display', 'none');
            $('.no-artwork-modal-back').css('display', 'none');
            $btnPause.focus();
            keydownChecker = true;
            $btnPause.click()
        } else {
            return false;
        }
    })
}

popAlert();

//플레이어 다음버튼 클릭시
function nextPlayList(ended) {
    if (keydownChecker == true) {
        $backImg.css('z-index', '1000');
        $fadeBox.css('z-index', '1000');
        keydownChecker = false;
        clearTimeout(pageFadeInSetTimeOutControl);
        setTimeout(function () {
            //Collection Modal 닫기
            closeAddCollectionModal();
        }, 1000);
        pageFadeInSetTimeOutControl = setTimeout(function () {
            $backImg.css('z-index', '-1000');
            $fadeBox.css('z-index', '-1000');
            keydownChecker = true;
        }, 6000);

        var nextList = $('.next-list').find('li').eq(0).find('a').attr('value'); //next-list에서 첫번째(다음순서를가진) a링크를 가져옴
        if (nextList != undefined) {
            if (myCollection != undefined) {
                $('.contents-focus').removeClass('contents-focus');
                $fadeBox.css('opacity', 1);
                $.ajax({
                    url: urlLanguage + '/api' + nextList,
                    type: 'get',
                    success: function (data) {
                        clearTimeout(fadeoutClear);
                        //fade 이후에
                        afterLoading(data);
                    }
                })
            } else {
                $('.contents-focus').removeClass('contents-focus');
                $fadeBox.css('opacity', 1);
                $.ajax({
                    url: urlLanguage + '/api' + nextList + (exh_id != null ? '&exh_id=' + exh_id : ''),
                    type: 'get',
                    success: function (data) {
                        clearTimeout(fadeoutClear);
                        //fade 이후에
                        afterLoading(data);
                    }
                })
            }
        } else {
            if (ended == 'ended') {
                audio.currentTime = 0;
                audio.play();
            } else {
                //모달띄우기
                audio.pause();
                $('.no-artwork-modal').css('display', 'block');
                $('.no-artwork-modal-back').css('display', 'block');
                $('.no-artwork-modal .btn-okay').focus();
            }
        }
    }
}

//플레이어 이전버튼 클릭시
function prevPlayList() {
    if (keydownChecker == true) {
        $backImg.css('z-index', '1000');
        $fadeBox.css('z-index', '1000');
        keydownChecker = false;
        clearTimeout(pageFadeInSetTimeOutControl);
        pageFadeInSetTimeOutControl = setTimeout(function () {
            $backImg.css('z-index', '-1000');
            $fadeBox.css('z-index', '-1000');
            keydownChecker = true;
        }, 6000);


        var prevList = $('.next-list').find('li').last().prev().find('a').attr('value'); //next-list에서 마지막번째 a링크를 가져옴
        if (prevList != undefined) {
            if (myCollection != undefined) {
                $('.contents-focus').removeClass('contents-focus');
                $fadeBox.css('opacity', 1);
                $.ajax({
                    url: urlLanguage + '/api' + prevList,
                    type: 'get',
                    success: function (data) {
                        clearTimeout(fadeoutClear);
                        //fade 이후에
                        afterLoading(data);
                    }
                })
            } else {
                $('.contents-focus').removeClass('contents-focus');
                $fadeBox.css('opacity', 1);
                $.ajax({
                    url: urlLanguage + '/api' + prevList + (exh_id != null ? '&exh_id=' + exh_id : ''),
                    type: 'get',
                    success: function (data) {
                        clearTimeout(fadeoutClear);
                        //fade 이후에
                        afterLoading(data);
                    }
                })
            }
        } else {
            //모달띄우기
            audio.pause();
            $('.no-artwork-modal').css('display', 'block');
            $('.no-artwork-modal-back').css('display', 'block');
            $('.no-artwork-modal .btn-okay').focus();
        }
    }
}

//다음 작품 직접 클릭시 이동
$itemA2.on('keydown', function (event) {
    if (event.keyCode == 13 && keydownChecker == true) {
        var toList = $(this).attr('value');
        var dataId = $(this).attr('data-id');
        $backImg.css('z-index', '1000');
        $fadeBox.css('z-index', '1000');
        keydownChecker = false;
        clearTimeout(pageFadeInSetTimeOutControl);
        pageFadeInSetTimeOutControl = setTimeout(function () {
            //UI 보이게
            $wrapPlay.css('opacity', 1);
            $wrapPlay.css('display', 'block');

            $backImg.css('z-index', '-1000');
            $fadeBox.css('z-index', '-1000');
            keydownChecker = true;
        }, 6000);
        $fadeBox.css('opacity', 1);
        $('.contents-focus').removeClass('contents-focus');
        $.ajax({
            url: urlLanguage + '/api' + toList + (exh_id != null ? '&exh_id=' + exh_id : ''),
            type: 'get',
            success: function (data) {
                clearTimeout(fadeoutClear);
                changeNextPlayList(dataId);
                afterLoading(data);
            }
        })
    }
})

$itemA2.on('click', function () {
    if (keydownChecker == true) {
        var toList = $(this).attr('value');
        $backImg.css('z-index', '1000');
        $fadeBox.css('z-index', '1000');
        keydownChecker = false;
        clearTimeout(pageFadeInSetTimeOutControl);
        pageFadeInSetTimeOutControl = setTimeout(function () {
            $backImg.css('z-index', '-1000');
            $fadeBox.css('z-index', '-1000');
            keydownChecker = true;
        }, 6000);
        $fadeBox.css('opacity', 1);
        $('.contents-focus').removeClass('contents-focus');
        $.ajax({
            url: urlLanguage + '/api' + toList + (exh_id != null ? '&exh_id=' + exh_id : ''),
            type: 'get',
            success: function (data) {
                clearTimeout(fadeoutClear);
                //fade 이후에
                afterLoading(data);
            }
        })
    }
})


function pageFadeIn() {
    clearTimeout(pageFadeInSetTimeOutControl);
    pageFadeInSetTimeOutControl = setTimeout(function () {
        $backImg.css('z-index', '-1000');
        $fadeBox.css('z-index', '-1000');
    }, 3000)
    fadeCount = 1;
    $gradiantBox.css('opacity', 1);
    $fadeBox.css('opacity', 0);
    clearTimeout(fadeoutClear);
    //전시 소개 '외 ..명' 번역
}

//ui 숨김 이후 --> 플레이 영역에서 확인(엔터)시 ui보임
//포커스가 .item a 와 button.btn-search, button.btn-home이 아닐때
$document.keyup(function () {
    if (
        $('.next-list a').focusout() &&
        $('#other_curation a').focusout() &&
        $('.buttons button').focusout()
    ) {
        //확인 클릭시 버튼동작 막기(test)
        if ($playContents.hasClass('disnone')) {
            $playContents.removeClass('disnone');
            $('.last-inactive').focus();
        }
        fadein();
    }
});

//변수에 UI fadeout 함수 담음.
var fadeoutSet = function () {
    fadeCount = 1;
    //test 주석
    $wrapPlay.css('animation', 'fadeout 0.5s');
    $wrapCarousel.css('animation', 'fadeout 0.5s');
    $gradiantBox.css('animation', 'fadeout 0.5s');
    $wrapPlay.css('opacity', 0);
    $wrapCarousel.css('opacity', 0);
    $gradiantBox.css('opacity', 0);
    $voiceGuide.css('opacity', 0);

    //확인 클릭시 버튼동작 막기
    setTimeout(function () {
        $playContents.addClass('disnone');
        fadeCount = 0;
    }, 600);
};
setTimeout(function () {
    $('.btn-pause').focus()
}, 200)

//변수에 UI fadein 함수 담음.
var fadein = function () {
    if ($wrapPlay.css('opacity') == '0' && fadeCount == 0) {
        $wrapCarousel.css('animation', 'fadein 0.3s');
        $gradiantBox.css('animation', 'fadein 0.3s');
        $wrapCarousel.css('opacity', 1);
        $gradiantBox.css('opacity', 1);
        $voiceGuide.css('opacity', 1);
        $wrapPlay.css('animation', 'fadein 0.3s');
        $wrapPlay.css('opacity', 1);
        setTimeout(function () {
            $playContents.removeClass('disnone');
        }, 600);
    }
};

//변수에 UI fadeout 함수 담음.
var fadeout = function () {
    if ($wrapPlay.css('opacity') == '1') {
        $wrapPlay.css('animation', 'fadeout 4s');
        $wrapPlay.css('opacity', 0);
        $wrapCarousel.css('animation', 'fadeout 4s');
        $wrapCarousel.css('opacity', 0);
        $gradiantBox.css('animation', 'fadeout 4s');
        $gradiantBox.css('opacity', 0);
        $fadeBox2.css('animation', 'fadeout 4s');
        $fadeBox2.css('opacity', 0);
    }
}

// 모달용 fade in & out
//확인 버튼 클릭시 설정 Ui 보임, gradiant 보임
$('.play-back-image').on({
    focus: function () {
        $('.play-back-image').keyup(function (event) {
            if (event.keyCode == '13') {
                fadein();
                $gradiantBox.removeClass('disnone');
                $('.list-title').addClass('disnone');
            }
        });
    }
});

var secondFadeoutClear
//포커스가 플레이 버튼에 오면 fade
$playButtonsButton.on({
    focus: function () {
        $('.last-inactive').removeClass('last-inactive');
        clearTimeout(secondFadeoutClear);
        secondFadeoutClear = setTimeout(fadeoutSet, 5000);
        // //시간차로 play컨텐츠 ui, carousel, gradiant 가리는 함수
        $(this).children().addClass('inactive');
        $(this).addClass('last-inactive');
    },
    blur: function () {
        clearTimeout(fadeoutClear);
        clearTimeout(secondFadeoutClear);
        $(this).children().removeClass('inactive');
    },
    keydown: function (e) {
        clearTimeout(fadeoutClear);
        clearTimeout(secondFadeoutClear);
        if (!$btnPause.find('i').hasClass('pause')) {
            fadeoutClear = setTimeout(fadeoutSet, 5000);
        }
    }
});

/////////////////////////////////
//반복 버튼
function repeatModeButton() {
    clearTimeout(fadeoutClear);
    clearTimeout(secondFadeoutClear);
    fadeoutClear = setTimeout(fadeoutSet, 5000);
    if ($iconOriginRepeat.hasClass('only')) {
        $iconOriginRepeat.removeClass('only');
        $('.repeat-mode-text').text(messagePlayer.repeat);
        gtag('event', 'player_repeat_all');
    } else {
        $iconOriginRepeat.addClass('only');
        $('.repeat-mode-text').text(messagePlayer.repeatOne);
        gtag('event', 'player_repeat_one');
    }
}

//작품 반복, 전체 반복 클릭시
$('.btn-origin-repeat').on('click', function () {
    repeatModeButton();
})

///////////////////////////////////////


function movePlayerItem(item, container) {
    $(item).on({
        focus: function () {
            var cateIndex = $(this).parents('.cate').index();
            idx = $(this).parent().index(); //.item 몇번째 index인지
            if ($(this).parents('.cate').hasClass('other-artists')) {
                lastCount = $cate.eq(cateIndex).find(container).find('li').length - 1; //현재 컨테이너의 마지막번호
            } else {
                lastCount = $cate.eq(cateIndex).find(':visible').last().parents('.item').index();
            }
            cateNum = $(this).parents('.cate').index();
            itemNum = $(this).parent().index();
            $cate.css('opacity', 1);
            for (var i = 0; i < cateNum; i++) {
                $cate.eq(i).css('opacity', 0);
            }
            if (idx == lastCount) { //리스트 루프
                $cate.eq(cateIndex).find(container).find('li').removeClass('active');
                $cate.eq(cateIndex).find(container).css('left', 0);
                $cate.eq(cateIndex).find(container).find('li').eq(0).find('a').focus();
            } else {
                var totalMoveLen = 0;
                var oneItemLen;
                for (var i = 0; i < idx; i++) {
                    oneItemLen = parseInt($cate.eq(cateNum).find('.item').eq(i).outerWidth()) + 20;
                    totalMoveLen = totalMoveLen + oneItemLen;
                }
                $(this).find('.item-border').css('opacity', 1);
                $cate.eq(cateIndex).find(container).css('left', totalMoveLen * -1);
                if (idx == 0) {
                    $cate.eq(cateIndex).find(container).css('left', 0);
                }
            }
        },
        blur: function () {
            $(this).find('.item-border').css('opacity', 0);
        }
    });
}


movePlayerItem('.cate .item a', '.item-container');

//원작 감상하기,기본보기 토글 변화
function toggleOriginMode() {
    clearTimeout(fadeoutClear);
    clearTimeout(secondFadeoutClear);
    fadeoutClear = setTimeout(fadeoutSet, 5000);

    // 해상도가 서로 다르면 실행 아니면 토스트 팝업하고 무시
    var imgOriginNaturalWidth = $imgOrigin[0].naturalWidth;
    var imgCoverNaturalWidth = $imgCover[0].naturalWidth;
    var imgOriginWidth = document.getElementById('img_origin').width;
    var imgOriginHeight = document.getElementById('img_origin').height;
    if (imgOriginNaturalWidth != imgCoverNaturalWidth) {
        if ($iconOriginArtwork.hasClass('origin')) {
            $iconOriginArtwork.removeClass('origin');
            $iconOriginText.text(messagePlayer.originalView);
            gtag('event', 'player_origial');
        } else {
            $iconOriginArtwork.addClass('origin');
            $iconOriginText.text(messagePlayer.basicView);
            gtag('event', 'player_basic');
        }
        if ($iconOriginArtwork.hasClass('deactivate')) {
            //이미지 변화
            $imgCover.addClass('disnone');
            $imgOrigin.removeClass('disnone');
            $iconOriginArtwork.removeClass('deactivate');
        } else {
            //이미지 변화
            $imgCover.removeClass('disnone');
            $imgOrigin.addClass('disnone');
            $iconOriginArtwork.addClass('deactivate');
        }
    } else {
        /*
             4k 이미지와 Original 이미지가 동일 이미지이고
             세로보다 가로가 긴 이미지일 경우 img-cover (css가 width가 100%인 class)가 보이고,
             가로보다 세로가 긴 이미지일 경우 img-origin (css가 height가 100%인 class)가 보인다.
             */
        if (imgOriginWidth < imgOriginHeight) {
            $imgCover.addClass('disnone');
            $imgOrigin.removeClass('disnone');
        } else {
            $imgOrigin.addClass('disnone');
            $imgCover.removeClass('disnone');
        }
        showToastModal(messagePlayer.noBasicView);
    }
}

//좋아요, 좋아요 취소 토글 변화
function toggleLikedBtn() {
    if ($iconLike.hasClass('unlike')) {
        $iconLike.removeClass('unlike');
        $('.liked-text').text(messagePlayer.like);
    } else {
        $iconLike.addClass('unlike');
        $('.liked-text').text(messagePlayer.liked);
    }
}

//전시 저장하기 토글버튼
function saveCollectionToggle() {
    if ($iconSaveCollection.hasClass('save')) {
        $iconSaveCollection.removeClass('save');
        $saveCollectionText.text(messagePlayer.saved);
        showToastModal(messagePlayer.savedExhibition);
    } else {
        $iconSaveCollection.addClass('save');
        $saveCollectionText.text(messagePlayer.saveExhibition);
        showToastModal(messagePlayer.deleteExhibition);
    }
}

$('.btn-save-collection').on('click', function () {
    if ($loginStatus == 'true' || $loginStatus == true) {
        saveCollectionToggle();
        addExhibitionCollection();
    } else {
        toastLogin();
    }
})

//원작 감상하기 //감상모드에서 나가면 이미지 사이즈 다시 돌려놔야함
$('.btn-origin-artwork').on('click', function () {
    toggleOriginMode();
});


$('.btn-fake').on({
    focus: function () {
        if ($focus.hasClass('btn-fake')) {
            $('button.btn-home').focus();
        }
    }
});

//첫번째 캐러셀에서 뒤로가기시 다시 플레이어 플레이 화면으로 이동
$('.cate:nth-of-type(1) a').on({
    focus: function () {
        $('.next-list a').keydown(function (event) {
            if (event.keyCode == '38' && keydownChecker == true) {
                //메인 전시 소개가 보인다
                $wrapPlay.css('opacity', '1');
                $wrapPlay.css('display', 'block');
                //캐러셀 위치 변화
                $carousel.css('top', 943);
                $('.last-inactive').focus();
                keydownChecker = false
                setTimeout(function () {
                    keydownChecker = true
                }, 10)
            }
        })
    }
});

//좋아요 활성/비활성
var like = $('.like').val();

$('.btn-like').on('click', function () {
    if ($loginStatus == 'true' || $loginStatus == true) {
        if (like == 'true') {
            like = 'false';
        } else {
            like = 'true';
        }
        toggleLikedBtn();
    } else {
        toastLogin();
    }
});


//==========모달쪽 함수 =============

controlBtn() //버튼 UI / 동작 함수
changeBtnStyle() //컬렉션 담기 버튼 함수

//컬렉션 담기 버튼 함수
function changeBtnStyle() {
    //추천 카테고리 스타일 변화
    $('#recommended_artworks a').on({
        'focus': function focus() {
            $(this).parents('.item').addClass('focused');
        },
        'blur': function blur() {
            $(this).parents('.item').removeClass('focused');
        }
    });
    //추천 태그 스타일 변화
    var otherTag = false;
    $('#recommended_categories a').on({
        'focus': function () {
            if (otherTag == false) {
                $recommendedCategoriesItem.removeClass('inactive');
                otherTag = true;
            }
            $(this).parents('.item').addClass('focused');
        },
        'blur': function () {
            $(this).parents('.item').removeClass('focused');
        },
        'keydown': function (e) {
            if (e.keyCode == 38 || e.keyCode == 40) {
                if (otherTag == true) {
                    $recommendedCategoriesItem.addClass('inactive');
                    $recommendedCategoriesItem.removeClass('focused');
                    otherTag = false;
                }
            }
        }
    })
    //담기버튼 스타일 변화
    $('.collection-list a').on({
        'focus': function () {
            $('.hovers').removeClass('hovers');
            $active.removeClass('active');
            if ($(this).hasClass('add-active-title')) {
                $(this).siblings('.collection-buttons').find('.btn-collection-add').addClass('active');
                $(this).removeClass('contents-focus');
            } else {
                $(this).siblings('.collection-buttons').find('.btn-collection-minus').addClass('active');
                $(this).removeClass('contents-focus');
            }
        },
        'blur': function () {
            if ($(this).hasClass('add-active-title')) {
                $(this).siblings('.collection-buttons').find('.btn-collection-add').removeClass('active');
            } else {
                $(this).siblings('.collection-buttons').find('.btn-collection-minus').removeClass('active');
            }
        },
        'keydown': function (e) {
            switch (e.keyCode) {
                case 13:
                    e.preventDefault();
                    addArtworkCollection(this);
                    break
                case 37:
                    $activeBtnCollection.focus();
                    $(this).addClass('contents-focus');
                    return false;
            }
        }
    })

}

//스크롤 위아래 움직이는 함수
function scrollUpDown(selector, num) {
    var target = document.getElementById(selector);
    var scrollTopNow;
    scrollTopNow = target.scrollTop;
    target.scrollTop = scrollTopNow + num;
}

var playerInfo = document.getElementById('player_info');
var step;
playerInfo.addEventListener('keydown', function (e) {
    if (!$artistProfile.hasClass('active')) {
        step = 1;
    } else {
        step = 2;
    }
    switch (e.keyCode) {
        case 37:
            switch (step) {
                case 1:
                    var containerTop = $playerInfo.offset().top;
                    var containerBottom = containerTop + $playerInfo.height();
                    var artistProfileAnchorTop = $artistProfile.offset().top;
                    var artistProfileAnchorBottom = artistProfileAnchorTop + $artistProfile.outerHeight();
                    if (artistProfileAnchorTop >= containerTop && artistProfileAnchorBottom <= containerBottom) {
                    } else {
                        document.getElementById('player_info').scrollTop = document.getElementById('artist_profile').offsetTop;
                    }
                    setTimeout(function () {
                        $infoModalScroll.css('background-color', '#424242');
                        $artistProfile.addClass('active');
                    }, 100)
                    break;
                case 2:
                    $('#detail_modal .btn-go-back').focus();
                    $artistProfile.removeClass('active');
                    break;
            }
            break;
        case 38:
            if (step == 1) {
                scrollUpDown('player_info', -100)
            }
            break
        case 39:
            if (step == 2) {
                if (!$infoModalScroll.is(':hidden')) {
                    $infoModalScroll.css('background-color', '#2841fa');
                    $artistProfile.removeClass('active');
                }
            }
            break;
        case 40:
            if (step == 1) {
                scrollUpDown('player_info', 100)
            }
            break
        case 13:
            if (step == 2) {
                location.href = artist_url;
            }
            break;
    }
})
// 스크롤 같이 움직임
$playerInfo.on('scroll', function () {
    //GG3 에서 소수점까지 표기하기 때문에 소수점 버림
    var playerScrollTop = $playerInfo2.scrollTop();
    playerScrollTop = Math.floor(playerScrollTop);
    $infoModalScroll.css('top', (playerScrollTop * (fixedBox / containedBox)) + 'px')
})
$('#detail_modal .btn-go-back').on('keydown', function (e) {
    switch (e.keyCode) {
        case 39:
            playerInfo.focus();
            $artistProfile.addClass('active');
            break;
        case 13:
            break
    }
})

//버튼 UI / 동작 함수
function controlBtn() {
    $playerInfo.focus();
    $btnGoBack.click(function () {
        $('.curation-info-detail-intro div').removeClass('full-text');
        $detailModal.css('display', 'none');
        $playerInfo2.css('display', 'none');
        $addCollection.css('display', 'none');
        if (inCollection) {
            $('.sound-info').css('border-bottom', 'unset');
        }
    })

    $btnGoBack.on({
        'focus mouseenter': function () {
            $goBackGuide.css('display', 'block');
            $iconGoBack.addClass('active');
            $fakeSearchLeft.removeClass('back');
        },
        'blur mouseleave': function () {
            $goBackGuide.css('display', 'none');
            $iconGoBack.removeClass('active');
            $fakeSearchLeft.addClass('back');
        }
    });

    //작품정보 버튼 클릭시
    $('.btn-info').click(function () {
        gtag('event', 'player_info');
        //발화문 안보이게
        $voiceGuide.css('opacity', '0');
        $('.artist-info, .artwork-info, .sound-info').css('display', 'block');
        if (inCollection) {
            $artworkInfo.css('border-bottom', '1px solid rgb(158, 158, 158)');
        }

        //가짜스크롤바 height 설정
        setTimeout(function () {
            fixedBox = 789;
            containedBox = $('.player-info-box').height();
            scrollHeight = fixedBox * (fixedBox / containedBox);
            //스크롤이 발생하지 않을 때는 스크롤 노출 되지 않도록 함 (최상단에 있을 때)
            if (containedBox - 10 <= fixedBox) {
                $infoModalScroll.css('display', 'none');
                $('.info-modal-scroll-bar').css('display', 'none');
                $artistProfile.addClass('active');
            } else {
                $('.info-modal-scroll-bar').css('display', 'block');
                $infoModalScroll.css('display', 'block');
                $infoModalScroll.css('background-color', '#2841fa');
            }
            $infoModalScroll.css('height', scrollHeight);
            $playerInfo.focus();
        }, 100)

        //정보 모달창 처음 열었을때 화면으로 되돌림
        $('#player_info_box').css('top', 0);
        $playerInfoCategory.eq(0).css('opacity', 1);
        $detailModal.css('display', 'block');
        $playerInfo2.css('display', 'block');
        $activeBtnInfo.removeClass('disnone');
        //플레이어 뒤에 포커스 가지 않도록 display:none
        $('.play-info-container').css('display', 'none');
        $playContents.css('display', 'none');
        $wrapCarousel.css('display', 'none');
        $gradiantBox.css('display', 'none');
    })

    //작품정보에서 뒤로가기 버튼 클릭시
    $('.btn-go-back.player').on('click', function () {
        //발화문 보이게
        $voiceGuide.css('opacity', '1');
        //플레이어 뒤에 포커스 가지 않도록 해제 display:block
        $('.play-info-container').css('display', 'block');
        $playContents.css('display', 'block');
        $wrapCarousel.css('display', 'block');
        $gradiantBox.css('display', 'block');


        if ($activeBtnCollection.hasClass('disnone')) {
            moreInfo();
            $activeBtnInfo.addClass('disnone');
            $('.last-inactive').focus();
        } else if ($activeBtnInfo.hasClass('disnone')) {
            $activeBtnCollection.addClass('disnone');
            $('.btn-collection').focus();
        }
    });

    //작품 컬렉션담기 클릭시
    $('.btn-collection').on('click', function () {
        gtag('event', 'player_collection');
        if ($loginStatus == 'true' || $loginStatus == true) {
            //발화 안보이게
            $voiceGuide.css('opacity', '0');
            $('#player_info_box').css('top', 0);
            $playerInfoCategory.eq(0).css('opacity', 0);

            $detailModal.css('display', 'block');
            $addCollection.css('display', 'block');
            $addCollection.css('z-index', '1002');
            $collectionContainer.scrollTop(0);
            $activeBtnCollection.removeClass('disnone');
            if ($('.lately-collection-container li').length > 0) {
                $('.lately-collection-container li').eq(0).find('a').focus();
            } else {
                $('.all-collection-container li').eq(0).find('a').focus();
            }
            //플레이어 뒤에 포커스 가지 않도록 display:none
            $('.play-info-container').css('display', 'none');
            $playContents.css('display', 'none');
            $wrapCarousel.css('display', 'none');
            $gradiantBox.css('display', 'none');
        } else {
            toastLogin();
        }
    })

    //홈,검색버튼 css 변화
    $('a.btn-search').on({
        focus: function () {
            $('.btn-search').addClass('active');
            $('.btn-search span').css({
                'opacity': '1',
                'font-weight': '700'
            });
            $('.icon-search').addClass('on');
            $explanation.css('display', 'none');
            $artistList.css('opacity', 0)
            $('.buttons').css('opacity', 1);


            $(this).children().last().addClass('disnone');
        },
        blur: function () {
            $('.btn-search').removeClass('active');
            $('.btn-search span').css({
                'opacity': '0.65'
            });
            $('.icon-search').removeClass('on');
            $(this).children().last().removeClass('disnone');
        },
        keydown: function (e) {
            var cateCount = $cate.length;
            if (keydownChecker == true) {
                switch (e.keyCode) {
                    case 38:
                        if ($cate.eq(cateCount - 2).find('.line-focus').length > 0) {
                            return false;
                        } else {
                            $wrapPlay.css('opacity', '0');
                            $wrapPlay.css('display', 'block');
                            $btnPause.focus();
                            $wrapPlay.css('opacity', '1');
                            return false;
                        }
                        break;
                }
            }
        }
    });

    $('.buttons.cate a').on({
        keydown: function (event) {
            if (event.keyCode == 38 && $('.item-box-a').length == 0) {
                $wrapPlay.css('display', 'block');
            }
        }
    });

    $('a.btn-home').on({
        focus: function () {
            $('.btn-home').addClass('active');
            $('.btn-home span').css({
                'opacity': '1',
                'font-weight': '700'
            });
            $('.icon-home').addClass('on');
            $explanation.css('display', 'none');
            $artistList.css('opacity', 0)
            $('.buttons').css('opacity', 1);

            $(this).children().last().addClass('disnone');
        },
        blur: function () {
            $('.btn-home').removeClass('active');
            $('.btn-home span').css({
                'opacity': '0.65'
            });
            $('.icon-home').removeClass('on');

            $(this).children().last().removeClass('disnone');
        },
        keydown: function (e) {
            if (keydownChecker == true) {
                var cateCount = $cate.length;
                switch (e.keyCode) {
                    case 38:
                        if ($cate.eq(cateCount - 2).find('.line-focus').length > 0) {
                            return false;
                        } else {
                            $wrapPlay.css('opacity', '0');
                            $wrapPlay.css('display', 'block');
                            $btnPause.focus();
                            $wrapPlay.css('opacity', '1');
                            return false;
                        }
                        break;
                }
            }
        }
    });
    $('a.btn-go-top').on({
        focus: function () {
            $('.btn-go-top').addClass('active');
            $('.btn-go-top span').css({
                'opacity': '1',
                'font-weight': '700'
            });
            $('.icon-up').addClass('on');
            $explanation.css('display', 'none');
            $artistList.css('opacity', 0)
            $('.buttons').css('opacity', 1);

            $(this).children().last().addClass('disnone');
        },
        blur: function () {
            $('.btn-go-top').removeClass('active');
            $('.btn-go-top span').css({
                'opacity': '0.65'
            });
            $('.icon-up').removeClass('on');

            $(this).children().last().removeClass('disnone');
        },
        keydown: function (e) {
            e.stopPropagation();
            e.preventDefault();
            if (keydownChecker == true) {
                var cateCount = $cate.length;
                switch (e.keyCode) {
                    case 38:
                        if ($cate.eq(cateCount - 2).find('.line-focus').length > 0) {
                            return false;
                        } else {
                            $wrapPlay.css('opacity', '0');
                            $wrapPlay.css('display', 'block');
                            $btnPause.focus();
                            $wrapPlay.css('opacity', '1');
                            return false;
                        }
                        break
                    case 40:
                        break;
                }
            }
        }
    });

}

//정보 버튼 클릭시 전시정보, 더보기 버튼 보이기
function moreInfo() {
    $detailModal.css('display', 'none');
    $playerInfo2.css('display', 'none');
    $('.artist-info').css('display', 'none');
    if (!inCollection) {
        $artworkInfo.css('display', 'none');
        $('.sound-info').css('display', 'none');
    } else {
        $artworkInfo.css('border-bottom', '1px solid rgb(158, 158, 158)');
    }
    $infoModalScroll.css('display', 'none');
    $('.info-modal-scroll-bar').css('display', 'none');
}

//top위치가 이동하는 함수입니다. item에는 포커스가 될 a를 넣어주면 됩니다.
function moveTop(item) {
    //포커스가 되면 carousel의 top이 이동한다.
    $(item).on({
        focus: function () {
            var index = $(this).attr('tabindex');
            $('.indexItem' + index).css('background-color', '#2841fa');
            // 내용 위로 이동
            var itemTop = 0;
            var itemHeight = 0;
            for (var i = 0; i < index - 1; i++) {
                itemHeight = $category.eq(i).height();
                itemTop = itemTop - itemHeight - 32;
            }
            avoidScrollTop();
            $('.player-info-box').css('top', itemTop);

            //작가프로필 보기로 이동
            if (index == 3) {
                $('.showing-profile').attr('tabindex', '5')
            } else {
                $('.showing-profile').attr('tabindex', '-1')
            }

            $('.scroll').removeClass('info-focus');
            infoOpacity(index);
        },
        blur: function () {
            var index = $(this).attr('tabindex');
            $('.indexItem' + index).css('background-color', '#424242');
            if (!$(this).hasClass('info-focus')) {
                $(this).addClass('info-focus');
            }
        }
    });
}

// 이전버튼에서 우측 키 눌렀을때 전에 있던 애로
$btnGoBack.on('keydown', function (event) {
    if (event.keyCode == 39) {
        if ($('.artist-info').hasClass('artist-info-on')) {
            $('.showing-profile').focus();
        } else if ($('.add-title').length > 0) {
            if ($('.add-title.contents-focus').length > 0) {
                $('.add-title.contents-focus').focus()
                return false
            } else {
                $('.add-title')[0].focus()
                return false
            }
        } else {
        }
    }
})

function closeAddCollectionModal() {
    $('.contents-focus').removeClass('contents-focus');
    $addCollection.css('z-index', '1001');
}

$activeBtnCollection.on({
    'click': function () {
        closeAddCollectionModal()
    }
})

//정보에서 지금 포커스된 정보만 opacity 1로 변경하고 나머지는 opacity 0.45로 조정한다
function infoOpacity(index) {
    switch (index) {
        case '1':
            $playerInfoCategory.eq(0).css('opacity', 1);
            $playerInfoCategory.eq(1).css('opacity', 0.45);
            $playerInfoCategory.eq(2).css('opacity', 0.45);
            $category.eq(2).removeClass('artist-info-on');
            break;

        case '2':
            $category.eq(0).css('opacity', 0.45);
            $category.eq(1).css('opacity', 1);
            $category.eq(2).css('opacity', 0.45);
            $category.eq(2).removeClass('artist-info-on');
            break;

        case '3':
            $category.eq(0).css('opacity', 0.45);
            $category.eq(1).css('opacity', 0.45);
            $category.eq(2).css('opacity', 1);
            $category.eq(2).addClass('artist-info-on');
            break;
    }
}

//스크롤 방지 함수
function avoidScrollTop() {
    document.getElementById('player_info').scrollTop = 0;
    document.getElementById('carousel').scrollTop = 0;
}

liked_collection_view_button();

//플레이어 진입시 현재 좋아요, 컬렉션 담기 상태에 따라 버튼변경해서 보여줌
function liked_collection_view_button() {
    //컬렉션, 좋아요 현재 값 받아오기
    var artwork_liked = $artworkLiked.val();
    var btnLikeIcon = $('.btn-like i');
    var btnLikeSpan = $('.btn-like span');

    //좋아요는 버튼 이미지 변경이 없어서 상태만 체크해본다
    if (artwork_liked == true || artwork_liked == 'true') {
        btnLikeIcon.addClass('unlike');
        btnLikeSpan.text(messagePlayer.liked);
    } else {
        btnLikeIcon.removeClass('unlike');
        btnLikeSpan.text(messagePlayer.like);
    }
}

function addArtworkCollection(self) {
    var otherTarget = undefined;
    if (self.parentElement.parentElement.parentElement.classList.contains('lately-collection') && document.querySelector('div.all-collection *[name=\"' + self.getAttribute('name') + '\"]') !== null) {
        otherTarget = document.querySelector('div.all-collection *[name=\"' + self.getAttribute('name') + '\"]');
    }
    if (self.parentElement.parentElement.parentElement.classList.contains('all-collection') && document.querySelector('div.lately-collection *[name=\"' + self.getAttribute('name') + '\"]') !== null) {
        otherTarget = document.querySelector('div.lately-collection *[name=\"' + self.getAttribute('name') + '\"]');
    }
    var artwork_collection = self.getAttribute('value');
    var targetSibling = self.nextElementSibling.children[0];
    if (artwork_collection == 'false') {
        artwork_collection = true;
    } else {
        artwork_collection = false;
    }
    var col_name = self.innerHTML;
    //작품 컬렉션에 담기
    if (artwork_collection) {
        $.ajax({
            method: 'POST',
            url: urlLanguage + '/player',
            type: 'json',
            data: {
                art_id: art_id,
                add_art: artwork_collection,
                colName: col_name
            },
            success: function () {
                self.classList.remove('add-active-title');
                self.classList.add('minus-active-title');
                self.setAttribute('value', 'true');
                targetSibling.classList.remove('btn-collection-add');
                targetSibling.classList.add('btn-collection-minus');
                targetSibling.innerHTML = '<i class="icon-minus-artwork"></i><span>' + messagePlayer.remove + '</span>';
                if (otherTarget !== undefined) {
                    otherTarget.classList.remove('add-active-title');
                    otherTarget.classList.add('minus-active-title');
                    otherTarget.setAttribute('value', 'true');
                    otherTarget.nextElementSibling.children[0].classList.remove('btn-collection-add');
                    otherTarget.nextElementSibling.children[0].classList.add('btn-collection-minus');
                    otherTarget.nextElementSibling.children[0].innerHTML = '<i class="icon-minus-artwork"></i><span>' + messagePlayer.remove + '</span>';
                }
                showToastModal(messagePlayer.addToCollectionMessage);
                gtag('event', 'player_add_collection');
            }
        })
    } else {
        $.ajax({
            method: 'POST',
            url: urlLanguage + '/player',
            type: 'json',
            data: {
                art_id: art_id,
                add_art: artwork_collection,
                colName: col_name
            },
            success: function () {
                self.classList.add('add-active-title');
                self.classList.remove('minus-active-title');
                self.setAttribute('value', 'false');
                targetSibling.classList.add('btn-collection-add');
                targetSibling.classList.remove('btn-collection-minus');
                targetSibling.innerHTML = '<i class="icon-add-artwork"></i><span>' + messagePlayer.add + '</span>';
                if (otherTarget !== undefined) {
                    otherTarget.classList.add('add-active-title');
                    otherTarget.classList.remove('minus-active-title');
                    otherTarget.setAttribute('value', 'false');
                    otherTarget.nextElementSibling.children[0].classList.add('btn-collection-add');
                    otherTarget.nextElementSibling.children[0].classList.remove('btn-collection-minus');
                    otherTarget.nextElementSibling.children[0].innerHTML = '<i class="icon-add-artwork"></i><span>' + messagePlayer.add + '</span>';
                }
                showToastModal(messagePlayer.removeCollectionMessage);
                gtag('event', 'player_remove_collection');
            }
        })
    }
}

function addExhibitionCollection() {
    var exhibition_collection = $exhibitionInCollection.val();
    if (exhibition_collection == 'true' || exhibition_collection == true) {
        exhibition_collection = true;
    } else if (exhibition_collection == 'false' || exhibition_collection == false) {
        exhibition_collection = false;
    }
    //지금 플레이중인 전시 아이디 담기
    var exh_id = $('#exhibition_id').val();
    if (exhibition_collection == true) {
        exhibition_collection = false;
        $.ajax({
            method: 'POST',
            url: urlLanguage + '/player',
            type: 'json',
            data: {
                exh_id: exh_id,
                add_exh: exhibition_collection
            },
            success: function (data) {
                $exhibitionInCollection.val(exhibition_collection);
                showToastModal(messagePlayer.deleteExhibition);
            }
        })
    } else {
        //컬렉션에 없을때

        exhibition_collection = true;

        //이 전시를 모두 담았습니다 - 버튼 클릭시 controller에 데이터 송신
        if (exhibition_collection == true) {
            $.ajax({
                method: 'POST',
                url: urlLanguage + '/player',
                type: 'json',
                data: {
                    exh_id: exh_id,
                    add_exh: exhibition_collection
                },
                success: function (data) {
                    $exhibitionInCollection.val(exhibition_collection);
                    showToastModal(messagePlayer.savedExhibition);
                    gtag('event', 'player_save_curation');
                }
            })
        }
    }
}

//좋아요 클릭시 좋아요 추가/삭제
function addLiked() {
    //현재 좋아요 담았는지 아닌지 true/false
    var artwork_liked = $artworkLiked.val();

    //false면 true를 담아서 컨트롤러에 전달 / true면 false를 담아서 컨트롤러에 전달
    if (artwork_liked == 'false' || artwork_liked == false) {
        artwork_liked = true;
    } else if (artwork_liked == 'true' || artwork_liked == true) {
        artwork_liked = false;
    }
    $.ajax({
        method: 'POST',
        url: urlLanguage + '/player',
        type: 'json',
        data: {
            art_id: art_id,
            like: artwork_liked
        },
        success: function (data) {
            if (artwork_liked == true) {
                // alert('좋아한 작품으로 추가되었습니다')
                showToastModal(messagePlayer.likeMessage);
                gtag('event', 'player_like');
            } else {
                showToastModal(messagePlayer.likeRemoveMessage);
            }
            //좋아요 바뀐 값 세팅
            $artworkLiked.val(artwork_liked);
        }
    })
}

//=====캐러셀 이동=====
//top위치가 이동하는 함수입니다. item에는 포커스가 될 a를 넣어주면 됩니다.
function moveCateTop(item) {
    //포커스가 되면 carousel의 top이 이동한다.
    $(item).on({
        focus: function () {
            var indexItem = $(this).parents('.cate').index();
            var itemTop = 0;
            var itemHeight = 0;
            for (var i = 0; i < indexItem; i++) {
                if ($cate.eq(i).hasClass('recommended-categories')) {
                    itemHeight = 262;
                } else {
                    itemHeight = $cate.eq(i).height();
                }
                itemTop = itemTop - itemHeight;
            }
            avoidScrollTop();
            $carouselContainer.css('top', itemTop);
            //opacity 조정
            $cate.css('opacity', '0');
            $cate.eq(indexItem).css('opacity', '1');
            var nextVisibleCate = $cate.filter(':visible').filter(function (index, element) {
                return $(element).index() > indexItem
            }).first();
            nextVisibleCate.css('opacity', '1');
            if (indexItem == 0) {
                $wrapPlay.css('opacity', 0); //설정 ui 가려짐
                $wrapPlay.css('display', 'none');
                $('.cate .list-title').removeClass('disnone');
                $carousel.css('top', 549).css('height', 480);
            }
            $(this).find('.item-border').css('opacity', '1')
        },
        blur: function () {
            $(this).find('.item-border').css('opacity', '0');
        },
        keydown: function (e) {
            var idx = $(this).parents('.cate').index();
            var cateCount = $cate.length;
            switch (e.keyCode) {
                case 38:
                    $cate.eq(idx).find('a').removeClass('line-focus');
                    if (!$(this).hasClass('line-focus')) {
                        $(this).addClass('line-focus');
                    }
                    if (idx == 0) {
                        $('.last-inactive').focus();
                        return false;
                    } else {
                        var previousVisibleCate = $cate.filter(function (index, element) {
                            return $(element).css('opacity') == '0' && $(element).css('display') == 'block' && $(element).index() < idx
                        }).last();
                        if (previousVisibleCate.find('.line-focus').length > 0) {
                            previousVisibleCate.find('.line-focus').focus();
                            return false;
                        } else {
                            previousVisibleCate.find('li:nth-of-type(1) a').focus();
                        }
                    }
                    break;
                case 40:
                    $cate.eq(idx).find('a').removeClass('line-focus');
                    if (!$(this).hasClass('line-focus')) {
                        $(this).addClass('line-focus');
                    }
                    if (idx + 1 == cateCount) {
                    } else {
                        var nextVisibleCate = $cate.filter(':visible').filter(function (index, element) {
                            return $(element).index() > idx
                        }).first();
                        if (nextVisibleCate.find('.line-focus').length > 0) {
                            nextVisibleCate.find('.line-focus').focus();
                            return false;
                        } else {
                            if (nextVisibleCate.find('li:nth-of-type(1) a').length > 0) {
                                nextVisibleCate.find('li:nth-of-type(1) a').focus();
                            } else {
                                nextVisibleCate.find('li:nth-of-type(1) button').focus();
                            }

                            return false;
                        }
                    }
                    break;
            }
        }
    })
}

moveCateTop('#carousel_container a');
moveCateTop('#carousel_container button.btn-search');

//////////////////////////
$('.fixed-bar').on({
    focus: function () {
        clearTimeout(fadeoutClear);
        clearTimeout(secondFadeoutClear);
        fadeoutClear = setTimeout(fadeoutSet, 5000);
        $carousel.css('top', '943px');
        $carousel.find('p').eq(0).addClass('disnone');

        $('.circle').css('opacity', 1);
        $('.playing-bar').css('height', '8px');
    },
    blur: function () {
        $('.circle').css('opacity', 0);
        $('.playing-bar').css('height', '2px');
    }
})

$playButtonsButton.on({
    focus: function () {
        $carousel.css('top', '943px');
        $carousel.find('p').eq(0).addClass('disnone');
        $carouselA.attr('tabindex', -1);

        $playButtonsButton.keydown(function (event) {
            if (event.keyCode == 40 && keydownChecker == true) {
                $carouselA.attr('tabindex', 1);
            }
        });
    }
})

$carouselA.on({
    focus: function () {
        $('.fixed-bar').attr('tabindex', -1);
        $carouselA.attr('tabindex', 1);
    },
    blur: function () {
        $('.fixed-bar').attr('tabindex', -1);
    }
})

// 기다리는 전시면 삭제한다
function deleteWaitingAjax() {
    var exh_id = $('#exhibition_id').val();
    //check if exh_id exists
    if (exh_id == '' || exh_id == null || exh_id == undefined) {
        return;
    }
    $.ajax({
        url: urlLanguage + '/api/waiting',
        method: 'POST',
        type: 'json',
        data: {
            exh_id: exh_id,
            waiting: false
        },
        success: function () {

        }
    });
}

//조회수 올리는 통신함수
function viewCountPlus() {
    $.ajax({
        method: 'POST',
        url: urlLanguage + '/player/viewcount',
        type: 'json',
        data: {
            art_id: art_id
        },
        success: function () {

        }
    })
}

//마지막 view-last-time과 오늘날짜를 비교해서 같으면 viewCount를 안 보내고, 없거나 다르면 보낸다.
function viewLastTime() {
    clearTimeout(viewCountSetTimeOut);
    var view_last_time = $('#view_last_time').val();


    //오늘 날짜 구하기
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1 < 10 ? '0' + parseInt(today.getMonth() + 1) : today.getMonth() + 1;
    var date = today.getDate();

    today = year + '-' + month + '-' + date;


    if (view_last_time == today) {

    } else {
        //페이지에 들어오고 30초가 지나면 자동으로 보낸다..
        viewCountSetTimeOut = setTimeout(viewCountPlus, 30000);
        viewCountSetTimeOut = setTimeout(deleteWaitingAjax, 30000);
    }
}

if ($loginStatus == 'true' || $loginStatus == true) {
    viewLastTime();
}


//포커스됐던 carousel 위치를 기억해서 포커스
function contentsFocus() {
    $('.cate a').on({
        focus: function () {
            var $this = $(this);
            var cate = $this.parent().parent().parent().parent(); //지금 포커스된 a의 cate 셀렉
            if (cate.index() == 0) { //cate 인덱스가 0번일때
                $('.cate a').removeClass('contents-focus');
            }
        },
        blur: function () {
            var $this = $(this);
            var cate = $this.parent().parent().parent().parent(); //지금 포커스된 a의 cate 셀렉
            if (cate.index() == 0 && !$this.hasClass('contents-focus')) {
                $this.addClass('contents-focus');
            }
        }
    })
}

contentsFocus(); //플레이어에서는 플레이 버튼 <-> carousel컨텐츠 포커스 이동방식

//플레이어 발화가이드//
$('#voice_guide').addClass('disnone');
$('#voice_guide_player').removeClass('disnone');

//컬렉션 플레이어일때 n번째 감상중 안보이게

$playButtonsButton.on('keydown', function (e) {
    if (keydownChecker == true) {
        switch (e.keyCode) {
            case 40:
                if ($('.cate:nth-of-type(1)').find('.line-focus').length > 0) {
                    $('.cate:nth-of-type(1) .line-focus').focus();
                } else {
                    $('.cate:nth-of-type(1) li:nth-of-type(1) a').focus();
                }
                return false;
        }
    }
})

//플레이어 캐러셀에 category-focus클래스추가
$('.cate li a').on({
    focus: function () {
        $(this).parents('.cate').find('a').removeClass('category-focus');
    },
    blur: function () {
        $(this).addClass('category-focus');
    },
    keydown: function (e) {
        if (keydownChecker == true) {
            switch (e.keyCode) {
                case 37:
                    if ($(this).parents('li').index() !== 0) {
                        $(this).parents('li').prev().find('a').focus();
                    }
                    return false;
                case 39:
                    if ($(this).parents('li').index() !== $(this).parents('.next-list-container').children('li').length - 1) {
                        $(this).parents('li').next().find('a').focus();
                    }
                    return false;
            }
        }
    }
})


// 컬렉션 담기 이동
$('.add-collection .add-title').on('keydown', function (e) {
    switch (e.keyCode) {
        case 38:
            $(this).parent('li').prev().find('.add-title').focus();
            if ($(this).parent('li').index() == 0 && $(this).parent('li').parent().parent().hasClass('all-collection')) {
                $('.lately-collection ul li:last-child .add-title').focus();
            }
            if ($(this).parent('li').index() == 1 && $(this).parent('li').parent().parent().hasClass('lately-collection')) {
                $collectionContainer.scrollTop(0);
            }
            break
        case 40:
            $(this).parent('li').next().find('.add-title').focus();
            if ($(this).parent('li').index() == $(this).parent('li').parent().children().length - 1 && $(this).parent('li').parent().parent().hasClass('lately-collection')) {
                $('.all-collection ul li:first-child .add-title').focus();
            }
            break
    }
})

$collectionContainer.on('mousewheel', function (e) {
    e.stopPropagation();
    return false;
})


// 글로벌 플레이어일 때 css 변경 TODO ??
if (urlLanguage != '/ko') {
    $('.info-detail-menu').addClass('global');
    $('.btn-collection-add, .btn-collection-minus').addClass('global');
    $goBackGuide.addClass('global');
}
//작품 플레이할 때 다음 재생 리스트 변경
var nextPlayListArray = [{
    id: 0,
    artwork: '',
    artist: '',
    thumbnail: '',
    href: ''
}];
nextPlayListArray[0]['artwork'] = $('#artwork_name').text();
nextPlayListArray[0]['artist'] = $('#artist_name').text();
nextPlayListArray[0]['thumbnail'] = 'url("' + $('#artwork_thumbnail').val() + '")';
nextPlayListArray[0]['href'] = '/player?art_id=' + $('#first_artwork_id').val();
//배열 생성
for (var i = 0; i < $nextListItem.length - 1; i++) {
    nextPlayListArray[i + 1] = {};
    nextPlayListArray[i + 1]['id'] = parseInt($nextListItem.eq(i).find('a').attr('data-id'));
    nextPlayListArray[i + 1]['artwork'] = $nextListItem.eq(i).find('.art-title').text();
    nextPlayListArray[i + 1]['artist'] = $nextListItem.eq(i).find('.artist-name').text();
    nextPlayListArray[i + 1]['thumbnail'] = $nextListItem.eq(i).css('background-image');
    nextPlayListArray[i + 1]['href'] = $nextListItem.eq(i).find('a').attr('value');
}

function changeNextPlayList(playingIndex) {
    var kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var idx;
    var initialIndex = nowPlayingIndex;
    switch (playingIndex) {
        case 'next':
            //다음 플레이 했을 때
            if (parseInt(nowPlayingIndex) == nextPlayListArray.length || parseInt(nowPlayingIndex) < 1) {
                nowPlayingIndex = 1;
            } else {
                nowPlayingIndex = parseInt(nowPlayingIndex + 1);
            }
            idx = nowPlayingIndex;
            break;
        case 'prev':
            //이전 플레이 했을 때 (맨 처음 작품일 때 (1) 아무것도 하지 않음)
            if (nowPlayingIndex > 1) {
                nowPlayingIndex = parseInt(nowPlayingIndex - 1);
                idx = nowPlayingIndex;
            }
            break;
        default:
            //작품을 직접 선택해서 플레이했을 때
            if (parseInt(nowPlayingIndex) == nextPlayListArray.length - 1 || parseInt(nowPlayingIndex) < 1) {
                nowPlayingIndex = 2;
            } else {
                nowPlayingIndex = parseInt(playingIndex) + 1;
            }
            idx = nowPlayingIndex;
            break;
    }
    switch (playingIndex) {
        case 'next':
            //다음 플레이 했을 때
            if (kind == 'ended') {
                nextPlayList('ended');
            } else {
                nextPlayList();
            }
            break;
        case 'prev':
            //이전 플레이 했을 때
            if (initialIndex > 1) {
                prevPlayList();
            } else {
                showToastModal(messagePlayer.firstArtwork);
            }
            break;
        default:
            break;
    }
    setTimeout(function () {
        if (!(playingIndex == 'prev' && initialIndex < 2)) {
            var nextPlayListNewArray = nextPlayListArray.slice(idx).concat(nextPlayListArray.slice(0, idx));
            for (var i = 0; i < nextPlayListNewArray.length - 1; i++) {
                $nextListItem.eq(i).find('a').attr('data-id', nextPlayListNewArray[i]['id']);
                $nextListItem.eq(i).find('.art-title').text(nextPlayListNewArray[i]['artwork']);
                $nextListItem.eq(i).find('.artist-name').text(nextPlayListNewArray[i]['artist']);
                $nextListItem.eq(i).css('background-image', nextPlayListNewArray[i]['thumbnail']);
                $nextListItem.eq(i).find('a').attr('value', nextPlayListNewArray[i]['href']);
            }
        }
    }, 2000);
}


//LG masic remote 매직리모콘 --------------------------------------------------------------------------------------------
//플레이어 버튼
$playButtonsButton.on('mouseenter', function (e) {
    e.target.focus();
})
$('.play-buttons button i').on('mouseenter', function (e) {
    e.target.parentElement.focus();
})

$('.collection-buttons').on('mouseenter', function (e) {
    $(this).find('div').addClass('active');
    $(this).find('div').addClass('hovers');
})

$('.collection-buttons').on('mouseleave', function (e) {
    $(this).find('div').removeClass('active');
    $(this).find('div').removeClass('hovers');
})

//컬렉션 담기,빼기 버튼
$('.collection-container .collection-list button div').on('click', function (e) {
    e.target.parentElement.previousElementSibling.focus();
})
//컬렉션 담기 버튼 클릭
$('.collection-container .collection-list button div').on('click', function (e) {
    e.target.parentElement.previousElementSibling.click();
})

//뒤로가기 버튼
$iconGoBack.on('click', function (e) {
    e.target.parentElement.focus();
})

//캐러셀
$('.next-list .item a, #other_curation .item a').on('click', function (e) {
    e.target.parentElement.focus();
})

//검색, 홈 버튼
$('.buttons a .btn-inactive-box').on('click', function (e) {
    e.target.parentElement.focus();
})

//마우스 아무데나 클릭시 UI 보임
$document.on('click', function (e) {
    if ($playContents.hasClass('disnone')) {
        $playContents.removeClass('disnone');
        $('.last-inactive').focus();
        fadein();
    } else if (e.target.classList.contains('wrap') || e.target.classList.contains('play-info') || e.target.classList.contains('gradiant-box-modal') ||
        e.target.classList.contains('fade-box') || e.target.classList.contains('play-info-artworkName')
    ) {
        clearTimeout(secondFadeoutClear);
        fadeoutSet();
    }
})

//(LG)플레이어 컨트롤러 버튼에 포커스 되어있을 때 휠업으로 마우스 포인터 생겼을때, 이후 아무 동작 없을시 5초 후 fadeout
if (!$playButtonsButton.hasClass('last-inactive')) {
    $document.on('mousewheel', function (e) {
        clearTimeout(fadeoutClear);
        fadeoutClear = setTimeout(fadeoutSet, 5000);
    })
}

//모달 닫혀있을 때 감상 시간 끝났으면 다음 작품으로
$btnGoBack.on('click', function () {
    if ($detailModal.css('display') == 'none' && $qrLoginModal.css('display') == 'none' && audio.ended == true) {
        changeNextPlayList('next');
    }
})

//컬렉션 플레이어일 때 전시 정보 숨김
function showInfoAtCollection() {
    var locationSearch = location.search;
    var queryValueArr = locationSearch.split('&');
    var lastValue = queryValueArr[parseInt(queryValueArr.length - 1)].split('=')[0]
    if (lastValue == 'myCollection') {
        $('.exhibition-info').css('display', 'none');
        $('.artwork-info, .sound-info').css('display', 'block');
        $artworkInfo.css('border-bottom', '1px solid rgb(158, 158, 158)');
        $('.sound-info').css('border-bottom', 'unset');
        inCollection = true;
    }
}

//GG 리모컨 빨간 이전 버튼 파란 다음 버튼 이벤트 처리
if (Cookies.get('provider') == 'Kt') {
    window.addEventListener('keydown', function (e) {
        if (remoteSwitch == 0) {
            remoteSwitch = 1;
            gigagenie.media.onRemoteKeyEvent = function (event) {
                if (keydownChecker == true) {
                    switch (event.key) {
                        case 'prev':
                            changeNextPlayList('prev');
                            break
                        case 'next':
                            changeNextPlayList('next');
                            break
                    }
                }
            }
        }
        //GG 리모콘에서 재생/일시정지 버튼 이벤트
        if (e.keyCode == 179) {
            $btnPause.click();
        }
    })
}

function goToTop() {
    $wrapPlay.css({
        'display': 'block',
        'opacity': '1'
    });
    $wrapCarousel.css('opacity', 1);
    $carousel.css({
        'top': '943px',
        'height': '480px'
    });
    $carouselContainer.css('top', '0px');
    $('.cate:nth-of-type(1), .gradiant-box').css('opacity', '1');
    $btnPause.focus();
}

$('.btn-go-top').on({
    'click': function () {
        goToTop();
    },
    'keydown': function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            goToTop();
        }
    }
})

if (getParameter('exh_id') != undefined || myCollection != undefined) {
    //audio가 일시정지
    audio.addEventListener('pause', function () {
        document.getElementById('icon_playing_img').setAttribute('src', '/img_v1_3_39/icon_pause.png');
    });
    //audio 플레이
    audio.addEventListener('play', function () {
        document.getElementById('icon_playing_img').setAttribute('src', '/img_v1_3_39/icon_playing.gif');
    });
}

//login 열렸을 때 현재 플레이 중이던 전시&작품 기억, 로그인 완료 후 해당 페이지 open
var loginModal = document.getElementById('qr_login_modal');
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.attributeName == 'style') {
            Cookies.remove('lastSeenExh');
            Cookies.remove('lastSeenArtwork');
            if (loginModal.style.display == 'block') {
                Cookies.set('lastSeenArtwork', art_id);
                if (exh_id !== '') {
                    Cookies.set('lastSeenExh', exh_id);
                }
            }
        }
    });
});
observer.observe(loginModal, {
    attributes: true
});