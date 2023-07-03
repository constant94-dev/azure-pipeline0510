//설명글 부분의 UI를 바꾸는 함수
function ChangeExplanation() {
    var $themeCuration = $('#theme_curation');
    var $themeCurationCurationName = $('#theme_curation .curation-name');
    var $themeCurationSize = $('#theme_curation .curation-size');
    var $themeCurationDuration = $('#theme_curation .curation-duration');
    var $themeCurationTitle = $('#theme_curation_title');
    var $themeCurationKoreanName = $('#theme_curation .artist-name');
    var $themeCurationProInfo = $('#theme_curation .pro-info p');
    //000님이 감상하신 작품이 포커스 됐을 때 main-exhibition 이 사라지고 played_artwork가 보인다.
    $('.play-history .visible-item a').on({
        focus: function() {
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
        }
    })
    //좋아한 작품에 포커스 되면
    $('#favorite_artworks .visible-item a').on({
        focus: function() {
            var index = $(this).parents('.visible-item').index();
            var likedArtworkDefault = document.getElementById('liked_artwork_default' + index).value;
            var likedArtworkName = document.getElementById('liked_artwork_name' + index).value;
            var likedArtistName = document.getElementById('liked_artist_name' + index).value;
            var likedArtistIntro = document.getElementById('liked_artist_intro' + index).value;
            $proArea.css('display', 'none');
            $('#favorite_artwork').css('display', 'block');
            $('#favorite_artwork_title').text(likedArtworkName);
            $('#favorite_artwork .artist-name').text(likedArtistName);
            $('#favorite_artwork .pro-info p').text(likedArtistIntro);
            $backImg.attr('src', likedArtworkDefault);
            $backImg.css('opacity', '1');
            sliceTxt('favorite_artwork_title', 40);
        }
    })
    //새롭게 선보이는 작품에 포커스 되면 new_artworks가 보인다
    $('.new-artworks .visible-item a').on({
        focus: function() {
            var index = $(this).parents('.visible-item').index();
            var newlyRegisteredArtworkDefault = document.getElementById('newly_registered_artwork_default' + index).value;
            var newlyRegisteredArtworkName = document.getElementById('newly_registered_artwork_name' + index).value;
            var newlyRegisteredArtistName = document.getElementById('newly_registered_artist_name' + index).value;
            var newlyRegisteredArtistIntro = document.getElementById('newly_registered_artist_intro' + index).value;
            $proArea.css('display', 'none');
            $('#new_artwork').css('display', 'block');
            $('#new_artwork_title').text(newlyRegisteredArtworkName);
            $('#new_artwork .artist-name').text(newlyRegisteredArtistName);
            $('#new_artwork .pro-info p').text(newlyRegisteredArtistIntro);
            $backImg.attr('src', newlyRegisteredArtworkDefault);
            $backImg.css('opacity', '1');
            sliceTxt('new_artwork_title', 40);
        }
    })
    //테마1
    $('.theme1 .visible-item a').on({
        focus: function() {
            var index = $(this).parents('.visible-item').index();
            var theme1ArtistIntro = document.getElementById('theme1_artist_intro' + index).value;
            var theme1ArtworkDefault = document.getElementById('theme1_artwork_default' + index).value;
            var theme1ArtworkName = document.getElementById('theme1_artwork_name' + index).value;
            var theme1ArtistName = document.getElementById('theme1_artist_name' + index).value;
            var curationName = $('#theme1 .title4').text();
            var numberOfCurationArtworks = $('#theme1 .title5 .number-of-artworks').text();
            var curationDuration = $('#theme1 .title5 .curation-duration').text();
            $backImg.attr('src', theme1ArtworkDefault);
            $proArea.css('display', 'none');
            $themeCuration.css('display', 'block');
            $themeCurationCurationName.text(curationName);
            $themeCurationSize.text(numberOfCurationArtworks + messageCommon.artworks);
            $themeCurationDuration.text(curationDuration);
            $themeCurationTitle.text(theme1ArtworkName);
            $themeCurationKoreanName.text(theme1ArtistName);
            $themeCurationProInfo.text(theme1ArtistIntro);
            $backImg.css('opacity', '1');
            sliceTxt('theme_curation_title', 40);
        }
    })
    //theme2를 클릭하면 theme2가 나온다.
    $('.theme2 .visible-item a').on({
        focus: function() {
            var index = $(this).parents('.visible-item').index();
            var theme2ArtworkDefault = document.getElementById('theme2_artwork_default' + index).value;
            var theme2ArtworkName = document.getElementById('theme2_artwork_name' + index).value;
            var theme2ArtistName = document.getElementById('theme2_artist_name' + index).value;
            var curationName = $('#theme2 .title4').text();
            var numberOfCurationArtworks = $('#theme2 .title5 .number-of-artworks').text();
            var curationDuration = $('#theme2 .title5 .curation-duration').text();
            var theme2ArtistIntro = document.getElementById('theme2_artist_intro' + index).value;
            $backImg.attr('src', theme2ArtworkDefault);
            $proArea.css('display', 'none');
            $themeCuration.css('display', 'block');
            $themeCurationCurationName.text(curationName);
            $themeCurationSize.text(numberOfCurationArtworks + messageCommon.artworks);
            $themeCurationDuration.text(curationDuration);
            $themeCurationTitle.text(theme2ArtworkName);
            $themeCurationKoreanName.text(theme2ArtistName);
            $themeCurationProInfo.text(theme2ArtistIntro);
            $backImg.css('opacity', '1');
            sliceTxt('theme_curation_title', 40);
        }
    })

    //theme3를 클릭하면 theme3가 나온다.
    $('.theme3 .visible-item a').on({
        focus: function() {
            var index = $(this).parents('.visible-item').index();
            var theme3ArtworkDefault = document.getElementById('theme3_artwork_default' + index).value;
            var theme3ArtworkName = document.getElementById('theme3_artwork_name' + index).value;
            var theme3ArtistName = document.getElementById('theme3_artist_name' + index).value;
            var curationName = $('#theme3 .title4').text();
            var numberOfCurationArtworks = $('#theme3 .title5 .number-of-artworks').text();
            var curationDuration = $('#theme3 .title5 .curation-duration').text();
            var theme3ArtistIntro = document.getElementById('theme3_artist_intro' + index).value;
            $backImg.attr('src', theme3ArtworkDefault);
            $proArea.css('display', 'none');
            $themeCuration.css('display', 'block');
            $themeCurationCurationName.text(curationName);
            $themeCurationSize.text(numberOfCurationArtworks + messageCommon.artworks);
            $themeCurationDuration.text(curationDuration);
            $themeCurationTitle.text(theme3ArtworkName);
            $themeCurationKoreanName.text(theme3ArtistName);
            $themeCurationProInfo.text(theme3ArtistIntro);
            $backImg.css('opacity', '1');
            sliceTxt('theme_curation_title', 40);
        }
    })

    //theme4를 클릭하면 theme4가 나온다.
    $('.theme4 .visible-item a').on({
        focus: function() {
            var index = $(this).parents('.visible-item').index();
            var theme4ArtworkDefault = document.getElementById('theme4_artwork_default' + index).value;
            var theme4ArtworkName = document.getElementById('theme4_artwork_name' + index).value;
            var theme4ArtistName = document.getElementById('theme4_artist_name' + index).value;
            var curationName = $('#theme4 .title4').text();
            var numberOfCurationArtworks = $('#theme4 .title5 .number-of-artworks').text();
            var curationDuration = $('#theme4 .title5 .curation-duration').text();
            var theme4ArtistIntro = document.getElementById('theme4_artist_intro' + index).value;
            $backImg.attr('src', theme4ArtworkDefault);
            $proArea.css('display', 'none');
            $themeCuration.css('display', 'block');
            $themeCurationCurationName.text(curationName);
            $themeCurationSize.text(numberOfCurationArtworks + messageCommon.artworks);
            $themeCurationDuration.text(curationDuration);
            $themeCurationTitle.text(theme4ArtworkName);
            $themeCurationKoreanName.text(theme4ArtistName);
            $themeCurationProInfo.text(theme4ArtistIntro);
            $backImg.css('opacity', '1');
            sliceTxt('theme_curation_title', 40);
        }
    })

    //theme5를 클릭하면 theme5가 나온다.
    $('.theme5 .visible-item a').on({
        focus: function() {
            var index = $(this).parents('.visible-item').index();
            var theme5ArtworkDefault = document.getElementById('theme5_artwork_default' + index).value;
            var theme5ArtworkName = document.getElementById('theme5_artwork_name' + index).value;
            var theme5ArtistName = document.getElementById('theme5_artist_name' + index).value;
            var curationName = $('#theme5 .title4').text();
            var numberOfCurationArtworks = $('#theme5 .title5 .number-of-artworks').text();
            var curationDuration = $('#theme5 .title5 .curation-duration').text();
            var theme5ArtistIntro = document.getElementById('theme5_artist_intro' + index).value;
            $backImg.attr('src', theme5ArtworkDefault);
            $proArea.css('display', 'none');
            $themeCuration.css('display', 'block');
            $themeCurationCurationName.text(curationName);
            $themeCurationSize.text(numberOfCurationArtworks + messageCommon.artworks);
            $themeCurationDuration.text(curationDuration);
            $themeCurationTitle.text(theme5ArtworkName);
            $themeCurationKoreanName.text(theme5ArtistName);
            $themeCurationProInfo.text(theme5ArtistIntro);
            $backImg.css('opacity', '1');
            sliceTxt('theme_curation_title', 40);
        }
    })
    //작가를 클릭하면 작가설명이 나온다.
    $('#artist_list .visible-item a').on({
        focus: function() {
            if ($(this).parents('.visible-death-item').hasClass('more-artist')) {
                $proArea.css('display', 'none');
                $('#all_artist').css('display', 'block');
            } else if ($(this).parents('.visible-death-item').index() >= 0) {
                var index = $(this).parents('.visible-death-item').index();
                var artistDefault = document.getElementById('recommended_artist_default' + index).value;
                $backImg.attr('src', artistDefault);
                var artistName = document.getElementById('recommended_artist_name' + index).value;
                var artistIntro = document.getElementById('recommended_artist_intro' + index).value;
                $proArea.css('display', 'none');
                $('#artist').css('display', 'block');
                $('#artist .artist-name').text(artistName);
                $('#artist .pro-artist-info p').text(artistIntro);
                $backImg.css('opacity', '1');
            }
        }
    })
}
ChangeExplanation();