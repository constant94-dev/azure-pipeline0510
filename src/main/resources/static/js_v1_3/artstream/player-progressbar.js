//테스트용
let itemIndex = 0;
let first = true
let artworkJson;
let numberOfArtwork = ('.artwork-list').length;
//연결되었는지 체크
// $.ajax ({
//     url: "/api/socket-deviceName",
//     method: "GET",
//     success: function (data) {
//         if(data !== 'undefined'){
//             // console.log('connect data 입니다', data);
//             connect = data;
//             if(document.querySelector('.tv-model-name')){
//                 let tvModelNames = document.querySelectorAll('.tv-model-name');
//                 for(let i=0; i<tvModelNames.length; i++){
//                     tvModelNames[i].innerText = connect;
//                 }
//             }
//             if(connect !== ''){
//                 document.getElementById('tv_connection_notice').style.display = 'block';
//                 document.querySelector('.connect-text-ui').style.display = 'block'
//                 document.querySelector('#btn_connect_tv img').setAttribute('src','/img/icon_connect_tv_active.png')
//             }
//         }
//     }
// });



//전시 리스트
function jumpToArtwork(){
    if(document.getElementById('directArtworkId')!==null){
        let jumpToArtworkTargetDom = 'exh_artworks_list_'+document.getElementById('directArtworkId').innerText
        setTimeout(function (){
            document.getElementById(jumpToArtworkTargetDom).click();
        },1000)
    }
}

let artworkList = [];
const total_exh_count = document.getElementById('exh_artworks_list').querySelector('.exh-artworks-list').children.length;
async function artworkJsonData() {
    let firstArtwork = $('#exh_artworks_list .artwork-list:nth-of-type(1) .icon-show-option').find('.artwork-id').val();
    let firstArtist = $('#exh_artworks_list .artwork-list:nth-of-type(1) .icon-show-option').find('.artist-id').val();
    // setTimeout(async function () {
        // if(artworkList.length === 0){
        //     let total_exh_artwork_id_array = Array.from(document.querySelectorAll('#exh_artworks_list input[name=\'artwork-id\']')).map(e => e.value);
        //     for (let i = 0; i < total_exh_count; i++) {
        //         await $.ajax({
        //             url: "/" + location.pathname.split('/')[1] + "/api/artwork-detail",
        //             method: "post",
        //             data: {
        //                 artworkId: total_exh_artwork_id_array[i]
        //             },
        //             success: function (result) {
        //                 console.log('result')
        //                 console.log(result)
        //                 artworkList.push(result)
        //             }
        //         })
        //     }
        // }
        getArtworkDetail(true, firstArtwork);
        // jumpToArtwork();
    // }, 100)
    setLike(firstArtwork);
    if(page = 'curationPlayer'){
        let firstExh = $('#exh_artworks_list .artwork-list:nth-of-type(1) .icon-show-option').find('.exhibition-id').val();
        setShowOption(firstArtwork,firstArtist,firstExh,0)
    }else{
        setShowOption(firstArtwork,firstArtist,null,0)
    }
}

let id, category, video, soundUrl, hd;
const docentSound = document.getElementById('docent_div').innerText;

let playedItem,btn;

function showIntro(){
    // first = false;
    if(page !== 'curationPlayer'){
        // document.getElementById('now_playing_info').style.display = 'none'
    }
    clearTimeout(hideBControllers);
    // hideBControllers = setTimeout(function (){
    //     console.log('here4')
    //     // if(connect === '') {
    //     $('.controllers').fadeOut(1000);
    //     // }
    //     $('.player-gradation').fadeOut(1000);
    //     $('.play-time').fadeOut(1000);
    //     $('#fullScreen').fadeOut(1000);
    // },5000);
    hd = document.getElementById('docent_img_div').innerText;
    container = document.getElementById('player_box');
    $('#player_box').fadeIn(1500);
    const parameter = window.location.search.split('art_id=');
    artworkId = parameter[1];
    // if(artworkId !== undefined){
    //     playerIntro = `<div class="play-step-1" id="play_step_1">
    //                     <div class="loading">
    //                       <img src="/img/spinner.png" alt="spinner">
    //                     </div>
    //                   </div>`;
    // }else{
    document.getElementById('artwork_image').setAttribute('src',hd);
    // document.getElementById('btn_play_status_container').innerHTML =
    //     `<button type="button" id="btn_play_exhibition" class="btn-play-exhibition" onclick="fillCurrentArtworkInfo('index',0).then();">
    //         <img src="/img/icon_play_large.png" alt="icon_play_large">
    //      </button>`
    // playerIntro = `<div class="play-step-1" id="play_step_1">
    //                 <ul class="controllers">
    //                     <li id="btn_play_status_container">
    //                        <button type="button" id="btn_play_exhibition" class="btn-play-exhibition" onclick="fillCurrentArtworkInfo('index',0).then();">
    //                             <img src="/img/icon_play_large.png" alt="icon_play_large">
    //                         </button>
    //                     </li>
    //                 </ul>
    //                 <div class="player-gradation"></div>
    //                 <img src="${hd}" alt="artwork_image">
    //             </div>`;
    // }

    // container.innerHTML = playerIntro;
}

//도슨트
function playDocent(){
    $('#player_box').fadeOut(1500);
    // if(connect !== '') {
    //     sendPlayerInfo(false);
    // }
    setTimeout(function (){
        $('#player_box').fadeIn(1500);
        let docent;
        container = document.getElementById('player_box');
        docent = `<div class="play-step-2">
                <button type="button" id="btn_skip_docent" class="btn-skip-docent" onclick= "fillCurrentArtworkInfo('index',0).then();">
                    도슨트 건너뛰기
                </button>
                <img src="${hd}" alt="artwork_image">
                <div class="play-bar">
                    <span class="fixed-bar"></span>
                    <span class="playing-bar"></span>
                </div>
            </div>
            <audio id="played_audio">
                <source src="${docentSound}" type="audio/mp3">
            </audio>`;
        container.innerHTML = docent;
        playedItem = document.getElementById('played_audio'); // audio 태그 음악파일이 실행되는 DOM
        // if(connect === '') {
        playedItem.play();
        document.querySelector('.play-time').style.display = 'block';
        document.querySelector('.play-bar').style.display = 'block';
        // }else{
        //     document.querySelector('.play-time').style.display = 'none';
        //     document.querySelector('.play-bar').style.display = 'none';
        // }
        showLeftTime();
        changeProgressBar();
        itemIndex = 0;
    },3000)
}

//일시 정지
function pauseItem(){
    if(playToggleBoolean) {
        category === 'video'
            ? playedItem = document.getElementById('played_video')
            : playedItem = document.getElementById('played_audio');
        playedItem.pause();
        $('.artwork-list.active .playing-gif').attr('src','/img/icon_now_playing.png');
    }
}

//일시 정지 했다가 다시 시작
function playItemAgain(){
    if(playToggleBoolean) {
        category === 'video'
            ? playedItem = document.getElementById('played_video')
            : playedItem = document.getElementById('played_audio');
        // if (connect === '') {
        playedItem.play();
        document.querySelector('.play-time').style.display = 'block';
        document.querySelector('.play-bar').style.display = 'block';
        $('.artwork-list.active .playing-gif').attr('src','/img/icon_playing.gif');
        // } else {
        //     document.querySelector('.play-time').style.display = 'none';
        //     document.querySelector('.play-bar').style.display = 'none';
        // }
    }
}

function playItem() {
    if(first){
        document.getElementById('player_button').innerHTML = `<button class="btn_play" id="btn_play_blue" onclick="checkGAEvent('player_play');pauseItem();playToggleButton(this);">
                            <img id="play_pause_img" src="/img/icon_pause_blue.png" alt="play button">
                        </button>`
    }
    $('.play-step-3').fadeOut(1500);
    if(document.body.clientWidth > 481){
        window.scrollTo({top:0,behavior: "smooth"})
    }
    setTimeout(function (){
        category = artworkJson['category'];
        category === 'video' ? playVideoItem() : playImgItem();
        showLeftTime();
        changeProgressBar();
        catchEnding = setInterval(function(){
            if(current > 30 && intervalCount !== itemIndex){
                let exhId = window.location.search.split('exh_id=')[1] != undefined ? window.location.search.split('exh_id=')[1].split('&')[0] : null
                $.ajax({
                    url:"/api/viewCount",
                    method: "post",
                    data:{
                        art_id:artworkJson['id'],
                        exh_id:exhId
                    },
                    success:function (){
                        intervalCount = itemIndex;
                    }
                })
            }
            if(current===duration && current !== undefined && duration !== undefined){
                clearTimeout(hideBControllers)
                document.getElementById('btn_next_artwork') !== null
                && document.getElementById('btn_next_artwork').click();
                document.getElementById('btn_skip_docent') !== null
                && document.getElementById('btn_skip_docent').click();
                hideBControllers = setTimeout(function (){
                    console.log('here5')
                    // if(connect === '') {
                    $('.controllers').fadeOut(1000)
                    // }
                    $('.player-gradation').fadeOut(1000)
                    // if(connect !== '') {
                    //     $('.play-time').fadeOut(1000)
                    // }else{
                    $('.play-time').css('display','none');
                    $('#fullScreen').fadeOut(1000);
                    // }
                    $('.connect-text-ui').fadeOut(1000);
                },5000);
            }
        },1000);
    },1500);
}

//프로그레스 바
function changeProgressBar(){
    playedItem.removeEventListener('timeupdate', updateTime);
    category === 'video'
        ? playedItem = document.getElementById('played_video')
        : playedItem = document.getElementById('played_audio');
    playedItem.addEventListener('timeupdate', updateTime);
}

// 프로그레스 바 변경
function updateTime() {
    let playingBar = document.querySelector('.playing-bar'); // span 태그 음악파일 진행률을 보여주는 DOM
    let playingPos = this.currentTime / this.duration;
    if(playingBar !== null){
        playingBar.style.width = playingPos * 100 + "%";
    }
}

//다음 작품까지 남은 시간
function showLeftTime(){
    playedItem.removeEventListener('timeupdate', checkRemainingTime);
    category === 'video'
        ? playedItem = document.getElementById('played_video')
        : playedItem = document.getElementById('played_audio');
    playedItem.addEventListener('timeupdate', checkRemainingTime);
}

let duration,current,totalHour,totalMin,totalSec,leftTime,hour,min,sec;
// 재생시간
function checkRemainingTime() {
    duration = playedItem.duration;
    if(duration !== undefined && duration.toString() !== 'NaN') {
        current = playedItem.currentTime;
        leftTime = duration - current;
        // totalHour = Math.floor(parseInt(duration / 3600));
        totalMin = Math.floor(parseInt((duration)/60));
        totalSec = Math.floor(duration % 60);
        // hour = Math.floor(parseInt(leftTime / 3600));
        min = Math.floor(parseInt((current)/60));
        sec = Math.floor(current % 60);
        totalMin < 10 ? totalMin = '0'+ totalMin : '';
        totalSec < 10 ? totalSec = '0'+ totalSec : '';
        min < 10 ? min = '0'+ min : '';
        sec < 10 ? sec = '0'+ sec : '';
        if(document.getElementById("current") !== null){
            isNaN(min) || isNaN(sec)
                ? document.getElementById("current").innerHTML = totalHour+":"+totalMin+":" + totalSec
                : document.getElementById("current").innerHTML = min+":"+sec+" / "+totalMin+":"+totalSec
        }
    }
}

//================== player ============================
// let artworkContents;
function playImgItem(){
    let {id, category, duration, soundUrl, hd} = artworkJson;
    // totalHour = Math.floor(parseInt(duration / 3600));
    // totalMin = Math.floor(parseInt((duration % 3600)/60));
    // totalSec = Math.floor(duration % 60);
    // totalMin < 10 ? totalMin = '0'+ totalMin : '';
    // totalSec < 10 ? totalSec = '0'+ totalSec : '';

    // container = document.getElementById('player_box');
    document.getElementById('btn_play_exhibition') ? document.getElementById('btn_play_exhibition').click() : "";
    document.querySelector('#btn_pause img') ? document.querySelector('#btn_pause img').setAttribute('src','/img/icon_pause_large.png'): "";
    document.querySelector('#btn_play_exhibition img') ? document.querySelector('#btn_play_exhibition img').setAttribute('src','/img/icon_pause_large.png'): "";
    document.getElementById('btn_pause')? document.getElementById('btn_pause').setAttribute('onclick','pauseItem(); playToggleButton(this);'):"";
    document.getElementById('played_audio').src = soundUrl;
    // document.getElementById('current').innerText = totalHour+":"+totalMin+":"+totalSec;
    document.getElementById('fullScreen').querySelector('img').style.display = 'block';
    document.getElementById('btn_next_artwork').style.display = 'block';
    document.getElementById('btn_prev_artwork').style.display = 'block';
    document.getElementById('artwork_image').setAttribute('src',hd);

    // document.getElementById('btn_play_status_container').innerHTML =
    //     `<button type="button" id="btn_pause" class="btn-pause" onclick="pauseItem(); playToggleButton(this); ">
    //                             <img src="/img/icon_pause_large.png" alt="icon_pause_large">
    //                         </button>`
    // artworkContents = `<div class="play-step-3">
    //             <div class="player-gradation"></div>
    //             <img src="${hd}" alt="artwork_image">
    //             <ul class="controllers">
    //                 <li>
    //                     <button type="button" id="btn-prev-artwork" class="btn-prev-artwork" onclick="fillCurrentArtworkInfo('Prev');">
    //                         <img src="/img/icon_previous_artwork.png" alt="icon_previous_artwork">
    //                     </button>
    //                 </li>
    //                 <li id="btn_play_status_container">
    //                     `+button+`
    //                 </li>
    //                 <li>
    //                     <button type="button" id="btn_next_artwork" class="btn-next-artwork" onclick="fillCurrentArtworkInfo('Next');">
    //                         <img src="/img/icon_next_artwork.png" alt="icon_next_artwork">
    //                     </button>
    //                 </li>
    //             </ul>
    //             <div class="play-time">
    //                 <span>다음 작품까지 </span>
    //                 <span id="current">` + totalHour+":"+totalMin+":"+totalSec + `</span>
    //             </div>
    //             <div class="play-bar">
    //                 <span class="fixed-bar"></span>
    //                 <span class="playing-bar"></span>
    //             </div>
    //         </div>`
    // container.innerHTML = artworkContents;
    playedItem = document.getElementById('played_audio'); // audio 태그 음악파일이 실행되는 DOM
    $('.play-bar ').show();
    $('.play-step-3').fadeIn(1500);
    // if(connect === '') {
    // document.querySelector('.play-time').style.display = 'block';
    document.querySelector('.play-bar').style.display = 'block';
    // }else{
    //     document.querySelector('.play-time').style.display = 'none';
    //     document.querySelector('.play-bar').style.display = 'none';
    // }
    playedItem.play();
}
function playVideoItem(){
    let {id, category, video, duration}  = artworkJson;

    totalHour = Math.floor(parseInt(duration / 3600));
    totalMin = Math.floor(parseInt((duration % 3600)/60));
    totalSec = Math.floor(duration % 60);
    totalMin < 10 ? totalMin = '0'+ totalMin : '';
    totalSec < 10 ? totalSec = '0'+ totalSec : '';

    container = document.getElementById('player_box');
    let button;
    let blueButton;
    let blueButtonContainer;
    // let blueButtonBlankContainer;
    // if($('#now_playing_info').css('display') === 'flex' || $('#now_playing_info').css('display') === 'block'){
    //     blueButtonContainer = document.getElementById('top_player_button');
    //     blueButtonBlankContainer = document.getElementById('player_button');
    // }else{
        blueButtonContainer = document.getElementById('player_button');
        // blueButtonBlankContainer = document.getElementById('top_player_button');
    // }
    if(first === true){
        button = `<button type="button" id="btn_play_exhibition" onclick="playItemAgain();playToggleButton(this);">
                    <img src="/img/icon_play_large.png" alt="icon_play_large">
                </button>`
        blueButton = ` <button class="btn_play" id="btn_play_blue" onclick="checkGAEvent('player_play');playItemAgain();playToggleButton(this);">
                            <img id="play_blue_img" src="/img/icon_play_blue.png" alt="play button">
                        </button>`
        hideBControllers = setTimeout(function (){
            console.log('here6')
            // if(connect === '') {
            $('.controllers').fadeOut(1000)
            // }
            $('.connect-text-ui').fadeOut(1000);
        },5000);
    }else{
        button = `<button type="button" id="btn_pause" class="btn-pause" onclick="playToggleButton(this); pauseItem()">
                            <img src="/img/icon_pause_large.png" alt="icon_pause_large">
                </button>`
        blueButton = ` <button class="btn_play" id="btn_pause_blue" onclick="pauseItem(); playToggleButton(this); ">
                            <img id="play_pause_img" src="/img/icon_pause_blue.png" alt="play button">
                        </button>`
    }
    blueButtonContainer.innerHTML = blueButton;
    // blueButtonBlankContainer.innerHTML = ``;
    first = false;
    artworkContents = `  <div class="play-step-3">
                <div class="player-gradation"></div>
                <video id="played_video">
                    <source src="${video}" type="video/mp4">
                </video>
                <ul class="controllers">
                    <li>`+ button + `</li>
                    <li id="btn_play_status_container">
                        <button type="button" id="btn_pause" class="btn-pause" onclick="playToggleButton(this); pauseItem()">
                            <img src="/img/icon_pause_large.png" alt="icon_pause_large">
                        </button>
                    </li>
                    <li>
                        <button type="button" id="btn_next_artwork" class="btn-next-artwork" onclick="fillCurrentArtworkInfo('Next');">
                            <img src="/img/icon_next_artwork.png" alt="icon_next_artwork">
                        </button>
                    </li>
                </ul>
                <div class="play-time">
                    <span>다음 작품까지</span>
                    <span id="current">${duration}</span>
                </div>
                <div class="play-bar">
                    <span class="fixed-bar"></span>
                    <span class="playing-bar"></span>
                </div>
            </div>
        `
    container.innerHTML = artworkContents;
    playedItem = document.getElementById('played_video'); // audio 태그 음악파일이 실행되는 DOM
    $('.play-bar ').show();
    $('#player_box').fadeIn(1500);
    // if(connect === '') {
    playedItem.play();
    document.querySelector('.play-time').style.display = 'block';
    document.querySelector('.play-bar').style.display = 'block';
    // }else{
    //     document.querySelector('.play-time').style.display = 'none';
    //     document.querySelector('.play-bar').style.display = 'none';
    // }
}

//다음 재생
let intervalCount = -1;
let catchEnding = setInterval(function(){
    if(current > 30 && intervalCount !== itemIndex){
        let exhId;
        if(page == 'curationPlayer'){
            exhId = window.location.search.split('exh_id=')[1] != undefined ? window.location.search.split('exh_id=')[1].split('&')[0] : null;
            $.ajax({
                url:"/api/viewCount",
                method: "post",
                data:{
                    art_id:artworkJson['id'],
                    exh_id:exhId
                },
                success:function (){
                    intervalCount = itemIndex;
                }
            })
        }else{
            $.ajax({
                url: "/api/viewCount",
                method: "post",
                data: {
                    art_id: artworkJson['id']
                },
                success: function () {
                    intervalCount = itemIndex;
                }
            })
        }
    }
    if(current===duration && current !== undefined && duration !== undefined){
        clearTimeout(hideBControllers)
        document.getElementById('btn_next_artwork') !== null
        && document.getElementById('btn_next_artwork').click();
        document.getElementById('btn_skip_docent') !== null
        && document.getElementById('btn_skip_docent').click();
        hideBControllers = setTimeout(function (){
            // if(connect === '') {
            $('.controllers').fadeOut(1000)
            // }
            $('.player-gradation').fadeOut(1000)
            $('.play-time').fadeOut(1000)
            $('.connect-text-ui').fadeOut(1000);
            $('#fullScreen').fadeOut(1000);
        },5000);
    }
},1000);

function getArtworkDetail(firstPlay,artworkId){
    let exhId = $('#exh_artworks_list .artwork-list:nth-of-type(1) .icon-show-option').find('.exhibition-id').val();
    $.ajax({
        url: "/" + location.pathname.split('/')[1] + "/api/artwork-detail",
        method: "post",
        data: {
            artworkId: artworkId,
            exhibitionId:  exhId !== undefined ? exhId : null
                },
        success: function(data){
            artworkJson = data;
            console.log(data);
            let domain = location.href.split('/')[2];
            let linkToBeCopied;
            linkToBeCopied = 'https://' + domain + '/' + location.pathname.split('/')[1] + '/player?art_id='+artworkJson['id'];
            let linkPasteButton = document.getElementById('btn_copy_link');
            let twitterButton = document.getElementById('btn_share_twitter');
            let kakaoButton = document.getElementById('btn_share_kakaotalk');
            let facebookButton = document.getElementById('btn_share_facebook');
            twitterButton.setAttribute('value',linkToBeCopied);
            kakaoButton.setAttribute('value',linkToBeCopied);
            facebookButton.setAttribute('value',linkToBeCopied);
            linkPasteButton.addEventListener('click',function(){copyToClipboard(linkToBeCopied)});
            if(firstPlay == true){
                initArtStreamDetail();
            }
            if(location.search.indexOf("artist_id") == -1){
                changeArtistArtwork();
            }
            changeCategory();
            changeRecommendedCuration();
            if(page === 'curationPlayer'){
                $('#share_options .exh-id').val(exhId);
            }else if(page === 'artwork'){
                $('#share_options .art-id').val(artworkId);
                changeArtist();
                document.getElementById('now_playing_info_artwork').innerText = artworkJson['name'];
                document.querySelector('#now_playing_info_artist .korean-name').innerText = artworkJson['artistName'];
                document.getElementById('now_playing_info_description').innerText = artworkJson['artistIntro'];
            }
            var owl = $('.owl-carousel').owlCarousel();

// Destroy the existing instance
            owl.trigger('destroy.owl.carousel');

// Reinitialize the carousel with updated settings and data
            $('.owl-carousel').owlCarousel({
                onDragged: function(event) {
                    var currentItemIndex = event.item.index;
                    if(currentItemIndex !=0){
                        var closestOwlItemParent = $(event.target).closest('.owl-item.active');
                        if(closestOwlItemParent.prevObject.eq(0).children(0).children(0).children(0).eq(currentItemIndex).children(0).is(':hidden')){
                            console.log(closestOwlItemParent.prevObject.eq(0).children(0).children(0).children(0).eq(currentItemIndex))
                            if(currentItemIndex == 1){
                                closestOwlItemParent.prevObject.eq(0).children(0).children(0).animate({ left: 0 }, 300);
                            }else{
                                closestOwlItemParent.prevObject.eq(0).children(0).children(0).animate({ left: -332*(currentItemIndex-1) }, 300);
                            }
                        }
                    }
                },
                loop:false,
                items:2, // for example, update to 4 items
                autoWidth:true,
                margin:12,
                nav:true
            });
        },
        error: function (request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error);
        },
    })
}
//TODO LEO
let firstIndex = false;
// let firstIndex = true;
let nextArtworkSwitch = true;
async function fillCurrentArtworkInfo(type,index,selector= null,direct={}){
    let artworkId;
    let artistId;
    let exhId;
    clearTimeout(catchEnding);
    if (nextArtworkSwitch === true) {
        nextArtworkSwitch = false;
        setTimeout(function (){
            nextArtworkSwitch = true
        },1500);
        switch (type) {
            case 'Prev':
                itemIndex = itemIndex - 1;
                if (itemIndex < 0) {
                    toastPopup('error', firstArtwork)
                    // $('.play-step-3').fadeOut(1500);
                    // setTimeout(function () {
                    //     showIntro()
                    //     category === 'video'
                    //         ? playedItem = document.getElementById('played_video')
                    //         : playedItem = document.getElementById('played_audio');
                    //     playedItem.pause();
                    // }, 1500)
                }else{
                    artworkId = $('.exh-artworks-list').find('.artwork-list').eq(itemIndex).find('.artwork-id').val();
                    artistId = $('.exh-artworks-list').find('.artwork-list').eq(itemIndex).find('.artist-id').val();
                    exhId = $('#exh_artworks_list .artwork-list:nth-of-type(1) .icon-show-option').find('.exhibition-id').val();
                    getArtworkDetail(false,artworkId);
                    setLike(artworkId);
                    setShowOption(artworkId,artistId,exhId,itemIndex)
                }
                break
            case 'Next':
                itemIndex = itemIndex + 1;
                if (itemIndex === total_exh_count) {
                    itemIndex = 0;
                }
                artworkId = $('.exh-artworks-list').find('.artwork-list').eq(itemIndex).find('.artwork-id').val();
                artistId = $('.exh-artworks-list').find('.artwork-list').eq(itemIndex).find('.artist-id').val();
                exhId = $('#exh_artworks_list .artwork-list:nth-of-type(1) .icon-show-option').find('.exhibition-id').val();
                getArtworkDetail(false,artworkId);
                setLike(artworkId);
                setShowOption(artworkId,artistId,exhId,itemIndex);
                break
            case 'index' :
                if (direct === true) {
                    itemIndex = parseInt(document.getElementById('exh_artworks_list_' + index).getAttribute('artworkindex'));
                    // artworkJson = artworkList[itemIndex]
                } else {
                    itemIndex = parseInt(index);
                    // artworkJson = artworkList[ite
                }
                // if (firstIndex && itemIndex === 0){
                //     // document.getElementById('played_audio').play();
                //     console.log('here1')
                //     playItem();
                //     firstIndex = false;
                // }else{
                    console.log('here2')
                    if(selector == true){
                        itemIndex = 0;
                        firstIndex = false;
                    }else{
                        if (selector !== null) {
                            artworkId = selector.querySelector('.artwork-id').value;
                            artistId = selector.querySelector('.artist-id').value;
                            getArtworkDetail(false,artworkId);
                            setLike(artworkId);
                            if(page == 'curationPlayer'){
                                exhId = $('#exh_artworks_list .artwork-list:nth-of-type(1) .icon-show-option').find('.exhibition-id').val();
                                setShowOption(artworkId,artistId,exhId,itemIndex);
                            }else{
                                setShowOption(artworkId,artistId,null,itemIndex);
                            }
                        }
                    }
                // }
        }
        if(itemIndex >= 0){
            if(itemIndex === 14){
                $('.artwork-list').css('display','flex');
            }
            $('.artwork-list').removeClass('active');
            $('.artwork-list').eq(itemIndex).addClass('active');
            $('.artwork-list').eq(itemIndex).find('.playing-gif').attr('src','/img/icon_playing.gif');
            // container = document.getElementById('current_artwork_wrap');
            // let artworkInfo = `<section class="current-artwork-section">
            //                             <ul>
            //                                 <li>
            //                                     <p class="carousel-artist-type"><span>`+document.querySelector('.exh-title').innerText+`</span> 감상중</p>
            //                                     <p class="carousel-exh-title">`+artworkJson['name']+`</p>
            //                                     <p class="carousel-exh-artist">`+artworkJson['artistName']+`</p>
            //                                 </li>
            //                                 <li>
            //                                     <button type="button" id="btn_connect_tv" class="btn-connect-tv" onclick="showModal('#tv_connection_modal')">
            //                                         <img src="/img/icon_connect_tv.png" alt="icon_connect_tv">
            //                                     </button>
            //                                 </li>
            //                             </ul>
            //                 </section>`;
            // container.innerHTML = artworkInfo;
            await playItem();
            //작품구매
            await $.ajax({
                url: "/api/shop-url",
                method: "get",
                data: {
                    artworkId: $('.artwork-list').eq(itemIndex).find('.artwork-id').val()
                },
                success: function (data) {
                    if (data !== ''){
                        $('.btn-shop-url').css('display','block');
                        $('#btn_shop_url').attr('href',data);
                    }else{
                        $('.btn-shop-url').css('display','none');
                    }
                }
            })
            // if(connect !== '') {
            //     await sendPlayerInfo(false);
            // }
            clearTimeout(hideBControllers);
            hideBControllers = setTimeout(function (){
                $('.player-gradation').fadeOut(1000)
                // if(connect !== '') {
                //     $('.play-time').fadeOut(1000)
                // }else{
                $('.controllers').fadeOut(1000)
                $('.play-time').css('display','none');
                $('#fullScreen').fadeOut(1000);
                // }
                $('.connect-text-ui').fadeOut(1000);
            },5000);
        }
    }
}
let hideBControllers;
let playToggleButtonSetTimeout;
function playToggleButton(selector){
    if(playToggleBoolean){
        playToggleBoolean=false;
        clearTimeout(playToggleButtonSetTimeout);
        container = document.getElementById('btn_play_status_container');
        let nowButtonId = selector.id;
        let button;
        let blueButton;
        let blueButtonContainer;
        let blueButtonBlankContainer;
        // if($('#now_playing_info').css('display') === 'flex' || $('#now_playing_info').css('display') === 'block'){
        //     console.log('top player에 버튼 있어야 함')
        //     blueButtonContainer = document.getElementById('top_player_button');
        //     blueButtonBlankContainer = document.getElementById('player_button');
        // }else{
        //     console.log('그냥 player에 버튼 있어야 함')
            blueButtonContainer = document.getElementById('player_button');
            // blueButtonBlankContainer = document.getElementById('top_player_button');
        // }
        if(nowButtonId === 'btn_pause'||nowButtonId === 'btn_pause_blue'){
            button = `<button type="button" id="btn_play_exhibition" onclick="playItemAgain(); playToggleButton(this);">
                <img src="/img/icon_play_large.png" alt="icon_play_large">
            </button>`
            blueButton = ` <button class="btn_play" id="btn_play_blue" onclick="checkGAEvent('player_play');playItemAgain();playToggleButton(this);">
                            <img id="play_blue_img" src="/img/icon_play_blue.png" alt="play button">
                        </button>`
        }else{
            button = `<button type="button" id="btn_pause" class="btn-pause" onclick="pauseItem(); playToggleButton(this);">
                        <img src="/img/icon_pause_large.png" alt="icon_pause_large">
            </button>`
            blueButton = ` <button class="btn_play" id="btn_pause_blue" onclick="pauseItem(); playToggleButton(this);">
                            <img id="play_pause_img" src="/img/icon_pause_blue.png" alt="play button">
                        </button>`
        }
        container.innerHTML = button;
        blueButtonContainer.innerHTML = blueButton;
        // blueButtonBlankContainer.innerHTML = ``;
        clearTimeout(hideBControllers);
        hideBControllers = setTimeout(function (){
            // if(connect === '') {
            $('.controllers').fadeOut(1000)
            // }
            $('.player-gradation').fadeOut(1000)
            $('.play-time').fadeOut(1000)
            $('.connect-text-ui').fadeOut(1000);
            $('#fullScreen').fadeOut(1000);
        },5000);
        playToggleButtonSetTimeout = setTimeout(function (){
            playToggleBoolean=true;
        },1500)
    }
}

//버튼 + 그라데이션이 나타나고 사라짐
$(document).on('click','#player_box img',function (){
    clearTimeout(hideBControllers);
    // if(connect === '') {
    $('.controllers').fadeIn(1000)
    // }
    $('.player-gradation').fadeIn(1000)
    // if(connect === ''){
    $('.play-time').fadeIn(1000)
    $('#fullScreen').fadeIn(1000);
    // }else{
    //     $('.connect-text-ui').fadeIn(1000);
    // }
    hideBControllers = setTimeout(function (){
        console.log('here3')
        // if(connect === '') {
        $('.controllers').fadeOut(1000)
        // }
        $('.player-gradation').fadeOut(1000)
        $('.play-time').fadeOut(1000)
        $('.connect-text-ui').fadeOut(1000);
        $('#fullScreen').fadeOut(1000);
    },5000);
})



function initArtStreamDetail(){
    id = artworkJson['id'];
    category = artworkJson['category'];
    video = artworkJson['video'];
    soundUrl = artworkJson['soundUrl'];
    hd = artworkJson['hd'];
    document.getElementById('artwork_image').setAttribute('src',hd);
}

//'현재 재생중인 작품'의 '자세히보기'버튼 클릭 했을 때 모달창 나옴
function setNowPlayedArtworkModalData(selector){
    //artworkId에 현재 재생중인 작품의 아이디를 넣어줘야함
    let showArtworkId = document.getElementById('now_playing_info_artwork_id').innerText ;
    let showExhibitionId = document.getElementById('exhibition_id').innerText;
    selector.parentElement.querySelector('.shared-link').setAttribute('href','/player?art_id='+showArtworkId);
    // selector.parentElement.querySelector('.shared-link').setAttribute('href','/player?art_id='+showArtworkId+'&exh_id='+showExhibitionId);
    getPlayerUrl(selector);
    let likeImg;
    let likeText
    let exhibitionImg;
    let exhibitionText;
    $.ajax({
        url:  "/" + location.pathname.split('/')[1] + "/api/artwork-more?art_id=" + showArtworkId + "&exh_id=" + showExhibitionId,
        type:"POST",
        success: function(data){
        },
        error: function (request, status, error) {
            // console.log("code = " + request.status + " message = " + request.responseText + " error = " + error);
        },
    }).done(function (data) {
        console.log('datatdatd')
        console.log(data);
        if (data['artworkLiked']) {
            likeImg = '/img/icon_already_like.png'
            likeText = liked
        } else {
            likeImg = '/img/icon_like.png';
            likeText = like
        }
        if(data['exhibitionSaved']){
            exhibitionImg = '/img/icon_already_save_collection.png';
            exhibitionText = alreadySaved;
        }else{
            exhibitionImg = '/img/icon_save_exhibition.png'
            exhibitionText = saveExhibition;
        }
        let container = document.getElementById('artwork_option_box');
        let thumbnail;
        let title;
        let artistId;
        let artistName;
        if(page !== 'curationPlayer'){
            // thumbnail = document.getElementById('now_playing_info_img').getAttribute('src');
            // title = document.getElementById('now_playing_info_artwork').innerText;
            // artistId = document.getElementById('now_playing_info_artist_id').innerText;
            // artistName = document.getElementById('now_playing_info_artist').innerText;
        }else{
            thumbnail = document.querySelector('.artwork-list.active .exh-artwork-img-wrap img:nth-of-type(1)').getAttribute('src');
            title = document.querySelector('.artwork-list.active .artwork-name').innerText;
            artistId = document.querySelector('.artwork-list.active .artist-id').innerText;
            artistName = document.querySelector('.artwork-list.active .artist-name').getAttribute('src');
        }

        let loggedIn;
        document.getElementById('ogImg').setAttribute('content',thumbnail);
        // switch(location.pathname.split('/')[1]){
        //     case "ja" : document.getElementById('ogText').setAttribute('content',`絵と音楽で時間を満たしてください。`); break;
        //     case "ko" : document.getElementById('ogText').setAttribute('content',`그림과 음악으로 시간을 채워보세요.`); break;
        //     default : document.getElementById('ogText').setAttribute('content',`Fill your time with art and music.`); break;
        // }
        // document.getElementById('ogText').setAttribute('content',`${title}와(과) 함께 그림 한 점 어때요?`);
        document.querySelector('.loggedIn').value === 'true' ? loggedIn = 'setAddArtworkModalData('+showArtworkId+').then()' : loggedIn = 'NonMemberInAccessible();"';
        const content = `
            <div class="modal-gradation-box" onclick="closeModal('#artwork_option_box')"></div>
            <ul id="artwork_options" class="artwork-options">
                <li class="artwork-wrap">
                    <button type="button" class="exh-artwork" onclick="showArtworkInfo(this)">
                        <img id="current_img" src="${thumbnail}" alt="${title}">
                        <input type="hidden" class="artwork-id" name="artwork-id" value="${showArtworkId}">
                        <ul class="artwork-txt-info">
                            <li class="artwork-info" id="current_title">${title}</li>
                            <li class="artwork-info" id="current_name">${artistName}</li>
                        </ul>
                        <img class="icon-more" src="/img/icon_more.png" alt="icon_more">
                    </button>
                </li>
                <li>
                    <button type="button" id="btn_add_collection" class="btn-add-collection" onclick="${loggedIn}">
                        <img src="/img/icon_add_collection.png" alt="icon_add_collection">
                        <span>${addToCollection}</span>
                    </button>
                </li>
                <li>
                    <button type="button" id="btn_like" class="btn-like" onclick="toggleLikeUI(this)">
                        <img src="${likeImg}" alt="icon_like">
                        <span>${likeText}</span>
                    </button>
                </li>
                <li>
                    <button type="button" class="btn-save-exhibition" onclick="toggleSaveUI(this)">
                        <img src="${exhibitionImg}" alt="전시저장">
                        <span>${exhibitionText}</span>
                    </button>
                </li>
                <li>
                    <button type="button" id="btn_share" class="btn-share" onclick="closeModal('#artwork_option_box'); showModal('#share_option_box')">
                        <img src="/img/icon_share.png" alt="icon_share">
                        <span>${shareTo}</span>
                    </button>
                </li>
                <li>
                    <a href="/` + location.pathname.split('/')[1]  + `/artists/detail?artist_id=${artistId}" id="artist_information" class="artist-information">
                        <img src="/img/icon_information.png" alt="icon_information">
                        <span>${artistInfo}</span>
                    </a>
                </li>
            </ul>
            <button type="button" id="btn_artwork_options_close" class="btn-artwork-options-close" onclick="closeModal('#artwork_option_box');">
                <img src="/img/icon_close_popup.png" alt="icon_close_popup">
            </button>`
        container.innerHTML = content;
    })
}

//fullscreen
let nowScreen = "normal";
let buttonEvent = false;
function fullscreen(){
    buttonEvent = true;
    window.scrollTo(0, 0);
    let target = $('.play-step-3');
    let wrap = $('#player_box');
    switch (nowScreen){
        case "normal":
            if (screen.width < 481) {
                target.addClass('fullScreen');
                wrap.addClass('fullScreenBlack');
                wrap.offset({top:0, left:0});
                target.offset({top:0, left:0});
                document.querySelector('header').style.display = "none";
                if (document.getElementById('player_box').requestFullscreen) {
                    document.getElementById('player_box').requestFullscreen();
                } else if (document.getElementById('player_box').msRequestFullscreen) {
                    document.getElementById('player_box').msRequestFullscreen();
                } else if (document.getElementById('player_box').mozRequestFullScreen) {
                    document.getElementById('player_box').mozRequestFullScreen();
                } else if (document.getElementById('player_box').webkitRequestFullscreen) {
                    document.getElementById('player_box').webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.getElementById('player_box').requestFullscreen) {
                    document.getElementById('player_box').requestFullscreen();
                } else if (document.getElementById('player_box').msRequestFullscreen) {
                    document.getElementById('player_box').msRequestFullscreen();
                } else if (document.getElementById('player_box').mozRequestFullScreen) {
                    document.getElementById('player_box').mozRequestFullScreen();
                } else if (document.getElementById('player_box').webkitRequestFullscreen) {
                    document.getElementById('player_box').webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
                setTimeout(function () {
                    document.getElementById('player_box').style.width = '100%';
                    document.getElementById('player_box').style.height = '100%';
                    document.getElementById('artwork_image').style.width = 'auto';
                    document.getElementById('artwork_image').style.height = '100%';
                    document.getElementById('artwork_image').style.marginLeft = '50%';
                    document.getElementById('artwork_image').style.transform = 'translateX(-50%)';
                    document.querySelector('.player-gradation').style.zIndex = '1';
                    document.querySelector('.controllers').style.zIndex = '2';
                    document.querySelector('.play-time').style.zIndex = '2';
                    document.querySelector('.play-bar').style.zIndex = '2';
                    document.querySelector('#fullScreen').style.zIndex = '2';
                },100)
            }
            document.getElementById('fullScreen').querySelector('img').setAttribute('src','/img/icon-smallscreen.png');
            nowScreen = "full";
            preventsScroll();
            break
        case "full":
            if (screen.width < 481) {
                target.removeClass('fullScreen');
                wrap.removeClass('fullScreenBlack');
                wrap.css({top:0, left:0});
                target.css({top:0, left:0});
                document.querySelector('header').style.display = "block";
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
                document.getElementById('player_box').style.width = 'inherit';
                document.getElementById('player_box').style.height = 'inherit';
                document.getElementById('artwork_image').style.width = 'inherit';
                document.getElementById('artwork_image').style.height = 'inherit';
                document.getElementById('artwork_image').style.marginLeft = 'unset';
                document.getElementById('artwork_image').style.transform = 'unset';
                document.querySelector('.player-gradation').style.zIndex = 'unset';
                document.querySelector('.player-gradation').style.zIndex = 'unset';
                document.querySelector('.controllers').style.zIndex = 'unset';
                document.querySelector('.play-time').style.zIndex = 'unset';
                document.querySelector('.play-bar').style.zIndex = 'unset';
                document.querySelector('#fullScreen').style.zIndex = 'unset';
            }
            document.getElementById('fullScreen').querySelector('img').setAttribute('src','/img/icon_fullScreen.png');
            nowScreen = "normal";
            preventsScroll();
            break
    }
}
window.addEventListener('fullscreenchange', () => {
    if (buttonEvent){
        buttonEvent = false;
    }else{
        fullscreen();
    }
});
window.addEventListener('webkitfullscreenchange', () => {
    if (buttonEvent){
        buttonEvent = false;
    }else{
        fullscreen();
    }
});

showIntro();
artworkJsonData().then();
//참여 아티스트
function changeArtist(){
    $('#participate_artist').find('.owl-stage').css('left','');

    if(artworkJson['otherArtistArtworksArtistName'].length === 0){
        $('#participate_artist').css('display','none');
    }else{
        $('#participate_artist').css('display','block');
        $('#participate_artist').find('.artist-list').css('display','none');
        $('#participate_artist').find('.artist-list').eq(0).find('a').attr('href','/'+ location.pathname.split('/')[1]+'/artists/detail?artist_id='+artworkJson['artistId']);
        $('#participate_artist').find('.artist-list').eq(0).find('.artist-profile-img img').attr('src',artworkJson['artistThumbnail']);
        $('#participate_artist').find('.artist-list').eq(0).find('.artist-profile-img img').attr('alt',artworkJson['artistName']);
        $('#participate_artist').find('.artist-list').eq(0).find('.artist-name').text(artworkJson['artistName']);
        $('#participate_artist').find('.artist-list').eq(0).css('display','block');
    }
}
//000의 인기 아트워크
function changeArtistArtwork(){
    console.log('here1')
    if(artworkJson['otherArtistArtworksId'].length === 0){
        $('#artist_artwork').css('display','none');
    }else{
        $('#artist_artwork').css('display','block');
        document.getElementById('artist_name').innerText = artworkJson['artistName'];
        $('#artist_artwork').find('.carousel-item').css('display','none');
        $('#artist_artwork').find('.owl-stage').css('left','');
        for(let i=0; i<artworkJson['otherArtistArtworksId'].length;i++){
            $('#artist_artwork').find('.carousel-item').eq(i).find('img').attr('src',artworkJson['otherArtistArtworksThumbnail'][i]);
            $('#artist_artwork').find('.carousel-item').eq(i).find('a').attr('href','/'+ location.pathname.split('/')[1]+'/player?art_id='+artworkJson['otherArtistArtworksId'][i]);
            $('#artist_artwork').find('.carousel-item').eq(i).find('.carousel-artwork-title').text(artworkJson['otherArtistArtworksName'][i]);
            $('#artist_artwork').find('.carousel-item').eq(i).find('.carousel-artwork-artist .artist-name').text(artworkJson['otherArtistArtworksArtistName'][i]);
            $('#artist_artwork').find('.carousel-item').eq(i).css('display','block');
        }
    }
}
//추천 큐레이션
function changeRecommendedCuration(){
    if(artworkJson['otherExhibitionName'].length === 0){
        $('#recommended_curation').css('display','none');
    }else{
        let artistCountText;
        $('#recommended_curation').css('display','block');
        $('#recommended_curation').find('.contents-wrap').css('display','none');
        $('#recommended_curation').find('.owl-stage').css('left','');
        for(let j=0; j<artworkJson['otherExhibitionName'].length;j++){
            if (artworkJson['otherExhibitionArtistMore'][j] > 2){
                switch(location.pathname.split('/')[1]){
                    case "ja" : artistCountText = ` ほか ${artworkJson['otherExhibitionArtistMore'][j]}名様です`; break;
                    case "ko" : artistCountText = ` 외 ${artworkJson['otherExhibitionArtistMore'][j]}명`; break;
                    default : artistCountText =  ` and ${artworkJson['otherExhibitionArtistMore'][j]} others`; break;
                }
            }else{
                artistCountText = '';
            }
            $('#recommended_curation').find('.contents-wrap').eq(j).find('a').attr('href','/'+ location.pathname.split('/')[1]+'/player?exh_id='+artworkJson['otherExhibitionId'][j]);
            $('#recommended_curation').find('.contents-wrap').eq(j).find('.item-img-wrap img').attr('src',artworkJson['otherExhibitionThumbnail'][j]);
            $('#recommended_curation').find('.contents-wrap').eq(j).find('.item-img-wrap img').attr('alt',artworkJson['otherExhibitionName'][j]);
            $('#recommended_curation').find('.contents-wrap').eq(j).find('.item-exh-title').text(artworkJson['otherExhibitionName'][j]);
            $('#recommended_curation').find('.contents-wrap').eq(j).find('.korean-name').text(artworkJson['otherExhibitionArtistName'][j]);
            $('#recommended_curation').find('.contents-wrap').eq(j).find('.and-more').text(artistCountText);
            $('#recommended_curation').find('.contents-wrap').eq(j).find('.exh-total-artwork').text(artworkJson['otherExhibitionArtworkCount'][j]+ artwork);
            $('#recommended_curation').find('.contents-wrap').eq(j).find('.exh-total-time').text(artworkJson['otherExhibitionDuration'][j]);
            $('#recommended_curation').find('.contents-wrap').eq(j).css('display','inline-flex');
        }
    }
}
//비슷한 카테고리
function changeCategory(){
    if(artworkJson['otherTagsName'].length === 0){
        $('#other_category').css('display','none');
    }else{
        $('#other_category').css('display','block');
        $('#other_category').find('.carousel-item').css('display','none');
        $('#other_category').find('.owl-stage').css('left','');

        for(let i=0; i<artworkJson['otherTagsName'].length;i++){
            $('#other_category').find('.carousel-item').eq(i).find('a').text(artworkJson['otherTagsName'][i])
            $('#other_category').find('.carousel-item').eq(i).find('a').attr('href','/'+location.pathname.split('/')[1]+ '/search-result?keyword=' + artworkJson['otherTagsName'][i])
            $('#other_category').find('.carousel-item').eq(i).css('display','block');
        }
    }
    $('.owl-carousel').trigger('refresh.owl.carousel')
}
//맨 상단 좋아요 버튼 아이콘
function setLike(artworkId){
    $.ajax({
        url: "/"+ location.pathname.split('/')[1] +"/api/artwork-more?art_id=" + artworkId,
        type:"POST",
        success: function(data){
            let likeImg;
            let likeText;
            if (data['artworkLiked']) {
                likeImg = '/img/icon_already_like.png';
                likeText = liked;
            } else {
                likeImg = '/img/icon_like.png';
                likeText = like;
            }
            $('#btn_like_artwork img').attr('src',likeImg);
            $('#btn_like_artwork .artwork-id').val(artworkId);
            $('#btn_like_artwork span').text(likeText);
        },
        error: function (request, status, error) {
            // console.log("code = " + request.status + " message = " + request.responseText + " error = " + error);
        },
    })
}
//참여 작가

//플레이 중인 작품이 바뀔 때 마다 맨 상단 버튼의 artwork, artist, exhibition id값 변경
function setShowOption(artworkId,artistId,ExhId,index){
    $('#btn_show_option .artwork-id').val(artworkId);
    $('#btn_show_option .artist-id').val(artistId);
    $('#btn_show_option .now-index').val(index);
    if(ExhId !== null){
        $('#btn_show_option .exhibition-id').val(ExhId);
    }
}
//맨 상단 '더보기' 버튼 눌렀을 때
function setExhModalData(selector){
    let artworkId = selector.querySelector('.artwork-id').value;
    let artistId = selector.querySelector('.artist-id').value;
    let exhId;
    if(page === 'curationPlayer'){
        exhId = selector.querySelector('.exhibition-id').value;
    }else if(page === 'artwork'){
        $('#share_options .art-id').val(artworkId);
    }
    let index = selector.querySelector('.now-index').value;
    $.ajax({
        url: "/" + location.pathname.split('/')[1] + "/api/artwork-detail",
        method: "post",
        data: {
            artworkId: artworkId
        },
        success: function(artworkData){
            let likeImg;
            let likeText;
            //공유하기
            let domain = location.href.split('/')[2];
            let linkToBeCopied;
            if(page === 'curationPlayer'){
                linkToBeCopied = 'https://' + domain + '/' + location.pathname.split('/')[1] + '/player?exh_id='+exhId+'&art_id='+artworkData['id'];
            }else{
                linkToBeCopied = 'https://' + domain + '/' + location.pathname.split('/')[1] + '/player?art_id='+artworkData['id'];
            }
            let linkPasteButton = document.getElementById('btn_copy_link');
            let twitterButton = document.getElementById('btn_share_twitter');
            let kakaoButton = document.getElementById('btn_share_kakaotalk');
            let facebookButton = document.getElementById('btn_share_facebook');
            console.log("IMPORTANT")
            console.log(linkToBeCopied)
            twitterButton.setAttribute('value',linkToBeCopied);
            kakaoButton.setAttribute('value',linkToBeCopied);
            facebookButton.setAttribute('value',linkToBeCopied);
            linkPasteButton.addEventListener('click',function(){copyToClipboard(linkToBeCopied)});
            //모달 내용 채워넣음
            let artworkMoreUrl;
            if(page === 'curationPlayer'){
                artworkMoreUrl = "/" + location.pathname.split('/')[1] + "/api/artwork-more?art_id=" + artworkId + "&exh_id="+ exhId
            }else{
                artworkMoreUrl = "/" + location.pathname.split('/')[1] + "/api/artwork-more?art_id=" + artworkId
            }
            $.ajax({
                url: artworkMoreUrl,
                type:"POST",
                success: function(data){
                },
                error: function (request, status, error) {
                    // console.log("code = " + request.status + " message = " + request.responseText + " error = " + error);
                },
            }).done(function (data) {
                if (data['artworkLiked']) {
                    likeImg = '/img/icon_already_like.png';
                    likeText = liked;
                } else {
                    likeImg = '/img/icon_like.png';
                    likeText = like;
                }
                const container = document.getElementById('artwork_option_box');
                let thumbnail = artworkData['thumbnail'];
                let title = artworkData['name'];
                let artistName = artworkData['artistName'];
                let onclickFunction = `fillCurrentArtworkInfo('index',${index},this).then()`;
                let loggedIn;
                document.getElementById('ogImg').setAttribute('content',thumbnail);
                document.querySelector('.loggedIn').value === 'true'? loggedIn = 'setAddArtworkModalData('+artworkId+').then()' : loggedIn = 'NonMemberInAccessible();"';
                const content = `
            <div class="modal-gradation-box" onclick="closeModal('#artwork_option_box')"></div>
            <ul id="artwork_options" class="artwork-options">
                <li class="artwork-wrap">
                    <button type="button" class="exh-artwork" onclick="showArtworkInfo(this)">
                        <img id="current_img" src="${thumbnail}" alt="${title}">
                        <input type="hidden" class="artwork-id" name="artwork-id" value="${artworkId}">
                        <span class="artwork-txt-info">
                            <span class="artwork-info" id="current_title">${title}</span>
                            <span class="artwork-info" id="current_name">${artistName}</span>
                        </span>
                        <img class="icon-more" src="/img/icon_more.png" alt="icon_more">
                    </button>
                </li>
                <!--<li>
                    <button type="button" id="btn_play" class="btn-play" onclick="${onclickFunction}; closeModal('#artwork_option_box')">
                        <img src="/img/icon_play.png" alt="icon_play">
                        <span>${watchThisArtwork}</span>
                    </button>
                </li>-->
                <li>
                    <button type="button" id="btn_add_collection" class="btn-add-collection" onclick="${loggedIn}">
                        <img src="/img/icon_add_collection.png" alt="icon_add_collection">
                        <span>${addToCollection}</span>
                    </button>
                </li>
                <li>
                    <button type="button" id="btn_like" class="btn-like" onclick="toggleLikeUI(this)">
                        <img src="${likeImg}" alt="icon_like">
                        <span>${likeText}</span>
                    </button>
                </li>
                <li>
                    <button type="button" id="btn_share" class="btn-share" onclick="closeModal('#artwork_option_box'); showModal('#share_option_box')">
                        <img src="/img/icon_share.png" alt="icon_share">
                        <span>${shareTo}</span>
                    </button>
                </li>
                <li>
                    <a href="/` + location.pathname.split('/')[1]  + `/artists/detail?artist_id=${artistId}" id="artist_information" class="artist-information">
                        <img src="/img/icon_information.png" alt="icon_information">
                        <span>${artistInfo}</span>
                    </a>
                </li>
            </ul>
            <button type="button" id="btn_artwork_options_close" class="btn-artwork-options-close" onclick="closeModal('#artwork_option_box');">
                <img src="/img/icon_close_popup.png" alt="icon_close_popup">
            </button>`
                container.innerHTML = content;
            })
            showModal('#artwork_option_box');
        },
        error: function (request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error);
        },
    })
}

var playerAudio = document.getElementById("played_audio");
//audio가 일시정지 TODO
console.log('first',first)
// playerAudio.addEventListener("pause", function() {
//     container = document.getElementById('btn_play_status_container');
//     blueButtonContainer = document.getElementById('player_button');
//     let button;
//     let blueButton;
//     let blueButtonContainer;
//     button = `<button type="button" id="btn_play_exhibition" onclick="playItemAgain(); playToggleButton(this);">
//                 <img src="/img/icon_play_large.png" alt="icon_play_large">
//             </button>`
//     blueButton = ` <button class="btn_play" id="btn_play_blue" onclick="checkGAEvent('player_play');playItemAgain();playToggleButton(this);">
//                             <img id="play_blue_img" src="/img/icon_play_blue.png" alt="play button">
//                         </button>`
//     container.innerHTML = button;
//     blueButtonContainer.innerHTML = blueButton;
// });
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        location.reload();
    }
});

//blue button event
const blueButton = document.getElementById('btn_play_blue');
const observer = new IntersectionObserver(entries => {
    // Check if the target element is intersecting with the viewport
    if (entries[0].isIntersecting) {
        if(first){
            $('#btn_pause').css('display','none');
        }
    }else{
        if(first){
            $('#btn_pause').css('display','block');
        }
    }
});
observer.observe(blueButton);