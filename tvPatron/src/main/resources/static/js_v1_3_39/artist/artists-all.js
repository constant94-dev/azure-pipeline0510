var page = 1;
var initCheck = true;
var lastData = false;
var scrolled = false;
var numberOfItem = 6;
var numberOfVisibleItem = 24
var numberOfLoadedItem = 18


$document.on('focus', '.item-a', function () {
    $(this).find('.item-border').css('opacity', '1')
})
$document.on('blur', '.item-a', function () {
    $(this).find('.item-border').css('opacity', '0')
})
$btnArtistsClose.on({
    keydown: function (e) {
        switch (e.keyCode) {
            case 37:
                return false;
                break;
            case 38:
                return false;
                break;
            case 39:
                if ($lastFocused.length > 0) {
                    $lastFocused.eq(0).focus();
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
    click: function () {
        history.back();
    },
    'focus mouseenter': function () {
        $goBackGuide.css('display', 'block');
        $iconGoBack.addClass('active');
    },
    'blur mouseleave': function () {
        $goBackGuide.css('display', 'none');
        $iconGoBack.removeClass('active');
    }
})

function moveList(item, height, container) {
    $document.on('focus', item, function () {
        $self = $(this);
        var liNumber = $self.parents('li').index();
        var rowNumber = parseInt(liNumber / numberOfItem);
        var listTop = -rowNumber * height;
        var $container = $(container);
        $container.css('top', listTop);
        $(item).parents('li').css('opacity', '1');
        for (var i = 0; i <= liNumber; i++) {
            var rowIdx = parseInt(i / 4);
            if (rowIdx < rowNumber) {
                $(item).parents('li:nth-of-type(' + (i + 1) + ')').css('opacity', '0');
            }
        }
    });
    $document.on('blur', item, function () {
        $self = $(this);
    });
}

moveList('.all-artists-list a', 311, '.item-container');
//결과 이동
$allArtistsContainerItemBox.on('keydown', 'li', function (e) {
    var itemNthOfType = $(this).index() + 1;
    var artistIndexNumber = $(this).index() + 1;
    var artistTotalDataLength = $('.all-artists-container li').length;
    var nowRow;
    nowRow = parseInt(artistIndexNumber / numberOfItem);
    switch (e.keyCode) {
        case 37:
            if (artistIndexNumber % numberOfItem !== 1) {
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
            if (nowRow > 0) {
                for (var q = numberOfItem * (nowRow - 1); q < numberOfItem * nowRow; q++) {
                    $('li:nth-of-type(' + Number(q + 1) + ') .artist-img').css('display', 'block')

                }
                for (var p = numberOfItem * (nowRow + 2); p < numberOfItem * (nowRow + 3); p++) {
                    $('li:nth-of-type(' + Number(p + 1) + ') .artist-img').css('display', 'none')
                }
            }
            if (artistIndexNumber <= numberOfItem) {
                return false;
            } else {
                $('.all-artists-container li:nth-of-type(' + (artistIndexNumber - numberOfItem) + ') a').focus()
                return false;
            }
        case 39:
            if (artistIndexNumber % numberOfItem !== 0) {
                $(this).next().find('a').focus();
                return false;
            } else {
                return false;
            }
        case 40:
            //1번째 줄에서 상향키 다시 한번 눌렀을 때
            if (artistTotalDataLength >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - numberOfLoadedItem && !scrolled) {
                scrolled = true;
                appendArtists();
            }
            if (nowRow > 0) {
                for (var j = numberOfItem * (nowRow - 1); j < numberOfItem * nowRow; j++) {
                    $('li:nth-of-type(' + Number(j + 1) + ') .artist-img').css('display', 'none')
                }
                for (var k = numberOfItem * (nowRow + 1); k < numberOfItem * (nowRow + 4); k++) {
                    $('li:nth-of-type(' + Number(k + 1) + ') .artist-img').css('display', 'block')
                }
            }
            var $allArtistsListLiLastA = $('.all-artists-list li:last-of-type a');
            switch (artistTotalDataLength % numberOfItem) {
                case 0:
                    if (artistTotalDataLength >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - numberOfItem) {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber - artistTotalDataLength + numberOfItem) + ') a').focus();
                        for (var j = 0; j < numberOfVisibleItem; j++) {
                            $('li:nth-of-type(' + Number(j + 1) + ') .artist-img').css('display', 'block')
                        }
                    } else {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber + numberOfItem) + ') a').focus();
                    }
                    return false;
                case 1:
                    if (artistTotalDataLength - 1 >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - numberOfItem) {
                        $allArtistsListLiLastA.focus();
                        for (var j = 0; j < numberOfVisibleItem; j++) {
                            $('li:nth-of-type(' + Number(j + 1) + ') .artist-img').css('display', 'block')
                        }
                    } else if (artistTotalDataLength >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - 1) {
                        $('.all-artists-list li:nth-of-type(1) a').focus();
                        for (var j = 0; j < numberOfVisibleItem; j++) {
                            $('li:nth-of-type(' + Number(j + 1) + ') .artist-img').css('display', 'block')
                        }
                    } else {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber + numberOfItem) + ') a').focus();
                    }
                    return false;
                case 2:
                    if (artistTotalDataLength - 2 >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - numberOfItem) {
                        $allArtistsListLiLastA.focus();
                        for (var j = 0; j < numberOfVisibleItem; j++) {
                            $('li:nth-of-type(' + Number(j + 1) + ') .artist-img').css('display', 'block')
                        }
                    } else if (artistTotalDataLength >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - 2) {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber - artistTotalDataLength + 2) + ') a').focus();
                        for (var j = 0; j < numberOfVisibleItem; j++) {
                            $('li:nth-of-type(' + Number(j + 1) + ') .artist-img').css('display', 'block')
                        }
                    } else {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber + numberOfItem) + ') a').focus();
                    }
                    return false;
                case 3:
                    if (artistTotalDataLength - 3 >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - numberOfItem) {
                        $allArtistsListLiLastA.focus();
                        for (var j = 0; j < numberOfVisibleItem; j++) {
                            $('li:nth-of-type(' + Number(j + 1) + ') .artist-img').css('display', 'block')
                        }
                    } else if (artistTotalDataLength >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - 3) {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber - artistTotalDataLength + 3) + ') a').focus();
                        for (var j = 0; j < numberOfVisibleItem; j++) {
                            $('li:nth-of-type(' + Number(j + 1) + ') .artist-img').css('display', 'block')
                        }
                    } else {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber + numberOfItem) + ') a').focus();
                    }
                    return false;
                case 4:
                    if (artistTotalDataLength - 3 >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - numberOfItem) {
                        $allArtistsListLiLastA.focus();
                        for (var j = 0; j < numberOfVisibleItem; j++) {
                            $('li:nth-of-type(' + Number(j + 1) + ') .artist-img').css('display', 'block')
                        }
                    } else if (artistTotalDataLength >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - 4) {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber - artistTotalDataLength + 4) + ') a').focus();
                        for (var j = 0; j < numberOfVisibleItem; j++) {
                            $('li:nth-of-type(' + Number(j + 1) + ') .artist-img').css('display', 'block')
                        }
                    } else {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber + numberOfItem) + ') a').focus();
                    }
                    return false;
                case 5:
                    if (artistTotalDataLength - 3 >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - numberOfItem) {
                        $allArtistsListLiLastA.focus();
                        for (var j = 0; j < numberOfVisibleItem; j++) {
                            $('li:nth-of-type(' + Number(j + 1) + ') .artist-img').css('display', 'block')
                        }
                    } else if (artistTotalDataLength >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - 5) {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber - artistTotalDataLength + 5) + ') a').focus();
                        for (var j = 0; j < numberOfVisibleItem; j++) {
                            $('li:nth-of-type(' + Number(j + 1) + ') .artist-img').css('display', 'block')
                        }
                    } else {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber + numberOfItem) + ') a').focus();
                    }
                    return false;
                case 6:
                    if (artistTotalDataLength - 3 >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - numberOfItem) {
                        $allArtistsListLiLastA.focus();
                        for (var j = 0; j < numberOfVisibleItem; j++) {
                            $('li:nth-of-type(' + Number(j + 1) + ') .artist-img').css('display', 'block')
                        }
                    } else if (artistTotalDataLength >= artistIndexNumber && artistIndexNumber > artistTotalDataLength - 6) {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber - artistTotalDataLength + 6) + ') a').focus();
                        for (var j = 0; j < numberOfVisibleItem; j++) {
                            $('li:nth-of-type(' + Number(j + 1) + ') .artist-img').css('display', 'block')
                        }
                    } else {
                        $('.all-artists-list li:nth-of-type(' + (artistIndexNumber + numberOfItem) + ') a').focus();
                    }
                    return false;
            }

    }
})

function appendArtists() {
    if (!lastData) {
        $.ajax({
            url: urlLanguage + '/api/artists',
            type: 'POST',
            data: {
                page: page
            },
            success: function (result) {
                page++
                var artistArray = result;
                if (artistArray.id.length < numberOfLoadedItem) {
                    lastData = true
                }
                for (var i = 0; i < artistArray.id.length; i++) {
                    var artistImg = artistArray.profileImg[i];
                    var artistId = artistArray.id[i];
                    var artistName = artistArray.name[i];
                    var artistsAll =
                        '<li class="items visible-item visible-death-item test hoverTrue">' +
                        '    <a href="' + urlLanguage + '/artist?artist_id=' + artistId + '" class="item-a">' +
                        '        <div class="item-border"></div>' +
                        '           <img class="artist-img" src="' + artistImg + '">' +
                        '    </a>' +
                        '    <span class="artist-name">' + artistName + '</span>' +
                        '</li>';
                    $itemBox.append(artistsAll);
                }
                if (initCheck) {
                    $('.item-box li:first-child a').focus();
                    initCheck = false;
                }
                scrolled = false;
            }
        })
    }
}

window.onload = function () {
    appendArtists();
}