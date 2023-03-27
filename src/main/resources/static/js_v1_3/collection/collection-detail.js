showCollectionUpdateModal();

//테스트용
let itemIndex = 0;
let first = true;
let artworkJson;
//연결되었는지 체크
// $.ajax ({
//     url: "/api/socket-deviceName",
//     method: "GET",
//     success: function (data) {
//         if(data !== 'undefined' && data !== ''){
//             // console.log('connect data 입니다', data);
//             connect = data;
//             if(document.querySelector('.tv-model-name')){
//                 let tvModelNames = document.querySelectorAll('.tv-model-name');
//                 for(let i=0; i<tvModelNames.length; i++){
//                     tvModelNames[i].innerText = connect;
//                 }
//             }
//             document.getElementById('tv_connection_notice').style.display = 'block';
//             document.querySelector('.connect-text-ui').style.display = 'block'
//             document.querySelector('.player-gradation').classList.add('connected-gradation');
//             document.querySelectorAll('.connect-text-ui').forEach(a=>a.classList.add('connected-gradation'));
//             // document.querySelector('#btn_connect_tv img').setAttribute('src','/img/icon_connect_tv_active.png')
//         }
//     }
// });



//전시 리스트
function jumpToArtwork(){
    if(document.getElementById('directArtworkId')!==null){
        let jumpToArtworkTargetDom = 'exh_artworks_list_'+document.getElementById('directArtworkId').innerText;
        setTimeout(function (){
            document.getElementById(jumpToArtworkTargetDom).click();
        },1000)
    }
}

let artworkList = [];
const total_exh_count = document.getElementById('exh_artworks_list').children.length;
async function artworkJsonData() {
    let firstArtwork = $('#exh_artworks_list .artwork-list:nth-of-type(1) .icon-show-option').find('.artwork-id').val();
    let firstArtist = $('#exh_artworks_list .artwork-list:nth-of-type(1) .icon-show-option').find('.artist-id').val();
    setTimeout(async function () {
        // if(artworkList.length === 0){
        //     let total_exh_artwork_id_array = Array.from(document.querySelectorAll('#exh_artworks_list input[name=\'artwork-id\']')).map(e => e.value);
        //     for (let i = 0; i < total_exh_artwork_id_array.length; i++) {
        //         await $.ajax({
        //             url:"/" + location.pathname.split('/')[1] + "/api/artwork-detail",
        //             method: "post",
        //             data: {
        //                 artworkId: total_exh_artwork_id_array[i]
        //             },
        //             success: function (result) {
        //                 artworkList.push(result)
        //             }
        //         })
        //     }
        // }
        getArtworkDetail(true, firstArtwork)
        // initArtStreamDetail();
        // jumpToArtwork();
    }, 1500)
}

let id, category, video, soundUrl, hd;
// const docentSound = document.getElementById('docent_div').innerText;

let playedItem,btn;

function showIntro(){
    // first = false;
    // document.getElementById('now_playing_info').style.display = 'none'
    clearTimeout(hideBControllers);
    // hideBControllers = setTimeout(function (){
    //     // if(connect === '') {
    //         $('.controllers').fadeOut(1000);
    //     // }
    //     $('.player-gradation').fadeOut(1000);
    //     $('.play-time').fadeOut(1000);
    //     $('#fullScreen').fadeOut(1000);
    // },5000);
    hd = document.getElementById('collectionFirstImage').innerText;
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
// function playDocent(){
//     $('#player_box').fadeOut(1500);
//     if(connect !== '') {
//         sendPlayerInfo(false);
//     }
//     setTimeout(function (){
//         $('#player_box').fadeIn(1500);
//         let docent;
//         container = document.getElementById('player_box');
//         docent = `<div class="play-step-2">
//                 <button type="button" id="btn_skip_docent" class="btn-skip-docent" onclick= "fillCurrentArtworkInfo('index',0).then();">
//                     도슨트 건너뛰기
//                 </button>
//                 <img src="${hd}" alt="artwork_image">
//                 <div class="play-bar">
//                     <span class="fixed-bar"></span>
//                     <span class="playing-bar"></span>
//                 </div>
//             </div>
//             <audio id="played_audio">
//                 <source src="${docentSound}" type="audio/mp3">
//             </audio>`;
//         container.innerHTML = docent;
//         playedItem = document.getElementById('played_audio'); // audio 태그 음악파일이 실행되는 DOM
//         if(connect === '') {
//             playedItem.play();
//             document.querySelector('.play-time').style.display = 'block';
//             document.querySelector('.play-bar').style.display = 'block';
//         }else{
//             document.querySelector('.play-time').style.display = 'none';
//             document.querySelector('.play-bar').style.display = 'none';
//         }
//         showLeftTime();
//         changeProgressBar();
//         itemIndex = 0;
//     },3000)
// }

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
        document.getElementById('player_button').innerHTML = `<button class="btn_play" id="btn_play_blue" onclick="pauseItem();playToggleButton(this);">
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
                $.ajax({
                    url:"/api/viewCount",
                    method: "post",
                    data:{
                        art_id:artworkJson['id']
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
                    // $('.connect-text-ui').fadeOut(1000);
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
    blueButtonContainer = document.getElementById('player_button');
    if(first === true){
        button = `<button type="button" id="btn_play_exhibition" onclick="playToggleButton(this); playItemAgain()">
                    <img src="/img/icon_play_large.png" alt="icon_play_large">
                </button>`
        blueButton = ` <button class="btn_play" id="btn_play_blue" onclick="playItemAgain();playToggleButton(this);">
                            <img id="play_blue_img" src="/img/icon_play_blue.png" alt="play button">
                        </button>`
        hideBControllers = setTimeout(function (){
            // if(connect === '') {
                $('.controllers').fadeOut(1000)
            // }
            // $('.connect-text-ui').fadeOut(1000);
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
        $.ajax({
            url:"/api/viewCount",
            method: "post",
            data:{
                art_id:artworkJson['id']
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
            // if(connect === '') {
                $('.controllers').fadeOut(1000)
            // }
            $('.player-gradation').fadeOut(1000)
            $('.play-time').fadeOut(1000)
            // $('.connect-text-ui').fadeOut(1000);
            $('#fullScreen').fadeOut(1000);
        },5000);
    }
},1000);
function getArtworkDetail(firstPlay,artworkId){
    console.log('artworkId',artworkId)
    $.ajax({
        url: "/" + location.pathname.split('/')[1] + "/api/artwork-detail",
        method: "post",
        data: {
            artworkId: artworkId
        },
        success: function(data){
            artworkJson = data;
            console.log(data);
            if(firstPlay == true){
                initArtStreamDetail();
            }
            //작품구매
            $.ajax({
                url: "/api/shop-url",
                method: "get",
                data: {
                    artworkId: data['id']
                },
                success: function (urlData) {
                    if (urlData !== ''){
                        $('.btn-shop-url').css('display','block');
                        $('#btn_shop_url').attr('href',urlData);
                    }else{
                        $('.btn-shop-url').css('display','none');
                    }
                }
            })
        },
        error: function (request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error);
        },
    })
}
let firstIndex = true;
let nextArtworkSwitch = true
async function fillCurrentArtworkInfo(type,index,selector= null){
    let artworkId;
    let artistId;
    let exhId;
    clearTimeout(catchEnding);
    // if (connect !== ''){
    //     itemIndex = parseInt(index);
    //     slideModalOpen('modal-connected');
    //     document.getElementById('exhibition_id').innerText = artworkList[itemIndex]['exhId'];
    //     document.getElementById('now_playing_info_artwork_id').innerText = artworkList[itemIndex]['id'];
    //     preventScroll();
    // }
    // if (nextArtworkSwitch === true && connect === '') {
    if (nextArtworkSwitch === true) {
        nextArtworkSwitch = false;
        setTimeout(function (){
            nextArtworkSwitch = true
        },1500);
        switch (type){
            case 'Prev':
                itemIndex = itemIndex - 1;
                if(itemIndex < 0) {
                    toastPopup('error', firstArtwork)
                    // $('.play-step-3').fadeOut(1500);
                    // setTimeout(function (){
                    //     showIntro()
                    //     category === 'video'
                    //         ? playedItem = document.getElementById('played_video')
                    //         : playedItem = document.getElementById('played_audio');
                    //     playedItem.pause();
                    // },1500)
                }else{
                    getArtworkDetail(false,$('.collection-artworks-list').find('.artwork-list').eq(itemIndex).find('.artwork-id').val());
                }
                break
            case 'Next':
                itemIndex = itemIndex + 1;
                if(itemIndex === total_exh_count){
                    itemIndex = 0;
                }
                getArtworkDetail(false,$('.collection-artworks-list').find('.artwork-list').eq(itemIndex).find('.artwork-id').val());
                break
            case 'index' :
                if(firstIndex){
                    document.getElementById('played_audio').play();
                }
                itemIndex = parseInt(index);
                // artworkJson  = artworkList[itemIndex];
                if (selector !== null) {
                    getArtworkDetail(false,selector.querySelector('.artwork-id').value);
                }
                break
        }
        if(itemIndex >= 0){
            $('.artwork-list').removeClass('active');
            $('.artwork-list').eq(itemIndex).addClass('active');
            $('.artwork-list').eq(itemIndex).find('.playing-gif').attr('src','/img/icon_playing.gif');
            // document.getElementById('now_playing_info_img').setAttribute('src',artworkJson['thumbnail']);
            // document.getElementById('now_playing_info_artwork').innerText = artworkJson['name'];
            // document.querySelector('#now_playing_info_artist .korean-name').innerText = artworkJson['artistName'];
            // document.querySelector('#now_playing_info_artist .korean-name').innerText = artworkJson['artistKorName'];
            // document.querySelector('#now_playing_info_artist .english-name').innerText = artworkJson['artistEngName'];
            // if (artworkJson['artistNationality'] === '대한민국' || artworkJson['artistNationality'] === '한국'){
            //     document.querySelector('#now_playing_info_artist .bracket-english-name').innerText = '';
            // }else{
            //     document.querySelector('#now_playing_info_artist .bracket-english-name').innerText = '('+artworkJson['artistEngName']+')';
            // }
            // document.getElementById('now_playing_info_artwork_id').innerText = artworkJson['id'];
            // document.getElementById('now_playing_info_artist_id').innerText = artworkJson['artistId'];
            showArtistNameWithLan();
            // document.getElementById('now_playing_info').style.display = 'block';
            await playItem();
            // //작품구매
            // await $.ajax({
            //     url: "/api/shop-url",
            //     method: "get",
            //     data: {
            //         artworkId: artworkJson['id']
            //     },
            //     success: function (data) {
            //         if (data !== ''){
            //             $('.btn-shop-url').css('display','block');
            //             $('#btn_shop_url').attr('href',data);
            //         }else{
            //             $('.btn-shop-url').css('display','none');
            //         }
            //     }
            // })
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
                // $('.connect-text-ui').fadeOut(1000);
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
        let blueButtonContainer = document.getElementById('player_button');;
        if(nowButtonId === 'btn_pause'||nowButtonId === 'btn_pause_blue'){
            // document.getElementById('playing_gif').setAttribute('src','/img/icon_now_playing.png')
            button = `<button type="button" id="btn_play_exhibition" onclick="playItemAgain(); playToggleButton(this);">
                <img src="/img/icon_play_large.png" alt="icon_play_large">
            </button>`
            blueButton = ` <button class="btn_play" id="btn_play_blue" onclick="playItemAgain();playToggleButton(this);">
                            <img id="play_blue_img" src="/img/icon_play_blue.png" alt="play button">
                        </button>`
        }else{
            document.getElementById('playing_gif').setAttribute('src','/img/icon_playing.gif')
            button = `<button type="button" id="btn_pause" class="btn-pause" onclick="pauseItem(); playToggleButton(this); ">
                        <img src="/img/icon_pause_large.png" alt="icon_pause_large">
            </button>`
            blueButton = ` <button class="btn_play" id="btn_pause_blue" onclick="pauseItem(); playToggleButton(this);">
                            <img id="play_pause_img" src="/img/icon_pause_blue.png" alt="play button">
                        </button>`
        }
        container.innerHTML = button;
        blueButtonContainer.innerHTML = blueButton;
        clearTimeout(hideBControllers);
        hideBControllers = setTimeout(function (){
            // if(connect === '') {
                $('.controllers').fadeOut(1000)
            // }
            $('.player-gradation').fadeOut(1000)
            $('.play-time').fadeOut(1000)
            // $('.connect-text-ui').fadeOut(1000);
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
        // if(connect === '') {
            $('.controllers').fadeOut(1000)
        // }
        $('.player-gradation').fadeOut(1000)
        $('.play-time').fadeOut(1000)
        // $('.connect-text-ui').fadeOut(1000);
        $('#fullScreen').fadeOut(1000);
    },5000);
})

function initArtStreamDetail(){
    id = artworkJson['id'];
    category = artworkJson['category'];
    video = artworkJson['video'];
    soundUrl = artworkJson['soundUrl'];
    hd = artworkJson['hd'];
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
    $.ajax({
        url: "/api/artwork-more?art_id=" + showArtworkId,
        type:"POST",
        success: function(data){
        },
        error: function (request, status, error) {
            // console.log("code = " + request.status + " message = " + request.responseText + " error = " + error);
        },
    }).done(function (data) {
        if (data['artworkLiked']) {
            likeImg = '/img/icon_already_like.png'
            likeText = liked
        } else {
            likeImg = '/img/icon_like.png';
            likeText = like
        }
        let container = document.getElementById('artwork_option_box');
        let thumbnail = document.getElementById('now_playing_info_img').getAttribute('src');
        let title = document.getElementById('now_playing_info_artwork').innerText;
        let artistId = document.getElementById('now_playing_info_artist_id').innerText;
        let artistName = document.getElementById('now_playing_info_artist').innerText;
        let loggedIn;
        document.getElementById('ogImg').setAttribute('content',thumbnail);
        // switch(location.pathname.split('/')[1]){
        //     case "ja" : document.getElementById('ogText').setAttribute('content',`絵と音楽で時間を満たしてください。`); break;
        //     case "ko" : document.getElementById('ogText').setAttribute('content',`그림과 음악으로 시간을 채워보세요.`); break;
        //     default : document.getElementById('ogText').setAttribute('content',`Fill your time with art and music.`); break;
        // }
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
                        <img src="/img/icon_save_exhibition.png" alt="전시저장">
                        <span>${saveExhibition}</span>
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
function setModalData(selector){
    let artworkId = selector.children.namedItem('artwork-id').value;
    let likeImg;
    let likeText
    $.ajax({
        url:"/" + location.pathname.split('/')[1] + "/api/artwork-more?art_id=" + artworkId,
        type:"POST",
        success: function(data){
        },
        error: function (request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error);
        },
    }).done(function (data) {
        if(data.artworkLiked){
            likeImg = '/img/icon_already_like.png'
            likeText = liked
        }  else {
            likeImg = '/img/icon_like.png';
            likeText = like
        }

        let container = document.getElementById('artwork_option_box');
        let thumbnail = selector.previousElementSibling.querySelector('img').getAttribute('src');
        let title = selector.previousElementSibling.querySelector('.artwork-txt-info span:nth-of-type(1)').textContent;
        let artistName = selector.previousElementSibling.querySelector('.artist-name').textContent;
        // if(selector.previousElementSibling.querySelector('.artist-english-name')){
        //     let artistEnglishName = selector.previousElementSibling.querySelector('.artist-english-name').textContent;
        //     artistName = artistKoreanName + '(' + artistEnglishName + ')';
        // }else{
        //     artistName = artistKoreanName;
        // }
        let onclickFunction = selector.previousSibling.previousSibling.getAttribute('onclick');
        let loggedIn;
        document.querySelector('.loggedIn').value === 'true' ? loggedIn = 'setAddArtworkModalData('+artworkId+').then()' : loggedIn = 'NonMemberInAccessible();"';
        let content = `
            <div class="modal-gradation-box" onclick="closeModal('#artwork_option_box')"></div>
            <ul id="artwork_options" class="artwork-options">
                <li class="artwork-wrap">
                    <a href="#" class="exh-artwork" onclick="showArtworkInfo(this)">
                        <img id="current_img" src="${thumbnail}" alt="${title}">
                        <input type="hidden" class="artwork-id" name="artwork-id" value="${artworkId}">
                        <ul class="artwork-txt-info">
                            <li class="artwork-info" id="current_title">${title}</li>
                            <li class="artwork-info" id="current_name">${artistName}</li>
                        </ul>
                        <img class="icon-more" src="/img/icon_more.png" alt="icon_more">
                    </a>
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
            </ul>
            <button type="button" id="btn_artwork_options_close" class="btn-artwork-options-close" onclick="closeModal('#artwork_option_box')">
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

//컬렉션 삭제하기
prevTitle = document.getElementById('collection_title').innerText;
function deleteCollection(){
    //컬렉션 아이디값 필요
    $.ajax({
        url:'/api/collection/delete',
        method: "POST",
        type: "json",
        data: {
            'name' : prevTitle,
        },
        success: function(result){
            if(result == -2){
                toastPopup('normal', cantDeleteCollection);
            }else if(result == 1){
                sessionStorage.setItem('sessionForCollection','delete');
                location.href = '/' + location.pathname.split('/')[1] + "/mypage"
            }else{
                modalPopup('modal-error');
            }
            //console.log(result);
            // toastPopup('normal','컬렉션을 삭제했습니다.');
        },
        error: function (request) {
            return false
        }
    })
}
//삭제하시겠습니까 모달 삭제
function ModalForCollectionDelete(){
    document.querySelector('.modal-delete-collection').remove();
}
//컬렉션을 삭제하시겠습니까? 모달 생성
function ShowModalDeleteCollection(){
    if(scrollModalBoolean){
        preventsScroll();
    }
    let divEle = document.createElement('div');
    divEle.setAttribute('class','modal-delete-collection');
    document.querySelector('main').append(divEle);
    let html = `<div class="modal-content">
                    <div class="modal-area">
                        <p class="modal-title">
                            <span class="modal-title-top">${collectionModalTitle}</span>
                        </p>
                        <button type="button" id="btn_login_signup" class="btn btn-login-signup" onclick="deleteCollection()">${collectionModalDelete}</button>
                        <button type="button" class="btn-cancel" onclick="modalClose();ModalForCollectionDelete();">${collectionModalCancel}</button>
                    </div>
                </div>`
    document.querySelector('.modal-delete-collection').innerHTML = html;
}
