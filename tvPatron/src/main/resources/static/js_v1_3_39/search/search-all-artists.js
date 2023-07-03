var numberOfItem = 6;
var numberOfVisibleItem = 24
var numberOfLoadedItem = 18

//더보기 모달 열기
$('#btn_more_artist').on({
    'click': function() {
        $('.all-artists-container').css('display', 'block');
        $btnArtistsClose.focus();
        $('.all-artists-list').find('li').eq(0).find('a').focus();
    }
})
var targetLi;
var mouseMoveSwitch = false;
$allArtistsContainerItemBox.on('keydown', 'li', function(e) {
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

$btnArtistsClose.on({
    keydown: function(e) {
        switch (e.keyCode) {
            case 37:
                return false;
                break;
            case 38:
                return false;
                break;
            case 39:
                if ($('.last-focused').length > 0) {
                    $('.last-focused').eq(0).focus();
                } else {
                    $allArtistsContainerItemBox.find('li').eq(0).find('a').focus();
                }
                return false;
                break;
            case 40:
                return false;
                break;
        }
    },
    click: function() {
        $('.all-artists-container').css('display', 'none');
        $('#btn_more_artist').focus();
        $itemContainer.css('top', '0');
    },
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
})
$('.all-artists-container a').on({
    'focus': function() {
        $(this).find('.item-border').css('opacity', '1');
    },
    'blur': function() {
        $(this).find('.item-border').css('opacity', '0');
    }
})
$allArtistsContainerItemBox.on('keydown', 'li', function(e) {
    var itemNthOfType = $(this).index() + 1;
    var artistIndexNumber = $(this).index() + 1;
    var artistTotalDataLength = $('.all-artists-container li').length;
    switch (e.keyCode) {
        case 37:
            if (artistIndexNumber % numberOfItem != 1) {
                $(this).prev().find('a').focus();
                return false;
            } else if (itemNthOfType == 1 || (itemNthOfType - 1) % 6 == 0) {
                $itemA.removeClass('last-focused');
                $(this).find('a').addClass('last-focused');
                $btnArtistsClose.focus();
                return false;
            } else {
                return false;
            }
        case 38:
            if (artistIndexNumber <= numberOfItem) {
                return false;
            } else {
                $('.all-artists-container li:nth-of-type(' + (artistIndexNumber - numberOfItem) + ') a').focus()
                return false;
            }
        case 39:
            if (artistIndexNumber % numberOfItem != 0) {
                $(this).next().find('a').focus();
                return false;
            } else {
                return false;
            }
        case 40:
            switch (artistTotalDataLength % numberOfItem) {
                case 0:
                    if (artistTotalDataLength >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - numberOfItem) {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber - artistTotalDataLength + numberOfItem) + ') a').focus();
                    } else {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber + numberOfItem) + ') a').focus();
                    }
                    return false;
                case 1:
                    if (artistTotalDataLength - 1 >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - numberOfItem) {
                        $('.all-artists-list li:last-of-type a').focus();
                    } else
                    if (artistTotalDataLength >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - 1) {
                        $('.all-artists-list li:nth-of-type(1) a').focus();
                    } else {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber + numberOfItem) + ') a').focus();
                    }
                    return false;
                case 2:
                    if (artistTotalDataLength - 2 >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - numberOfItem) {
                        $('.all-artists-list li:last-of-type a').focus();
                    } else
                    if (artistTotalDataLength >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - 2) {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber - artistTotalDataLength + 2) + ') a').focus();
                    } else {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber + numberOfItem) + ') a').focus();
                    }
                    return false;
                case 3:
                    if (artistTotalDataLength - 3 >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - numberOfItem) {
                        $('.all-artists-list li:last-of-type a').focus();
                    } else
                    if (artistTotalDataLength >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - 3) {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber - artistTotalDataLength + 3) + ') a').focus();
                    } else {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber + numberOfItem) + ') a').focus();
                    }
                    return false;
                case 4:
                    if (artistTotalDataLength - 3 >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - numberOfItem) {
                        $('.all-artists-list li:last-of-type a').focus();
                    } else
                    if (artistTotalDataLength >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - 4) {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber - artistTotalDataLength + 4) + ') a').focus();
                    } else {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber + numberOfItem) + ') a').focus();
                    }
                    return false;
                case 5:
                    if (artistTotalDataLength - 3 >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - numberOfItem) {
                        $('.all-artists-list li:last-of-type a').focus();
                    } else
                    if (artistTotalDataLength >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - 5) {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber - artistTotalDataLength + 5) + ') a').focus();
                    } else {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber + numberOfItem) + ') a').focus();
                    }
                    return false;
                case 6:
                    if (artistTotalDataLength - 3 >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - numberOfItem) {
                        $('.all-artists-list li:last-of-type a').focus();
                    } else
                    if (artistTotalDataLength >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - 6) {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber - artistTotalDataLength + 6) + ') a').focus();
                    } else {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber + numberOfItem) + ') a').focus();
                    }
                    return false;
            }
    }
})

function moveList(item, height, container) {
    var $container = $(container);
    $document.on('focus', item, function() {
        $self = $(this); // 지금 focus 된 a 태그
        var liNumber = $self.parents('li').index(); // 지금 li의 index
        var rowNumber = parseInt(liNumber / numberOfItem); //몇번째 줄인지
        var listTop = -rowNumber * height //캐러셀이 올라가거나 내려가는 높이
        $container.css('top', listTop); //carousel box top 변경
        $(item).parents('li').css('opacity', '1'); //.art-slides a 의 li의 opacity를 1로 변경
        for (var i = 0; i <= liNumber; i++) {
            var rowIdx = parseInt(i / 4);
            if (rowIdx < rowNumber) {
                $(item).parents('li:nth-of-type(' + (i + 1) + ')').css('opacity', '0');
            }
        }
    });
    $document.on('blur', item, function() {
        $self = $(this); // 지금 focus 된 a 태그
    });
}
moveList('.all-artists-list a', 311, '.item-container');