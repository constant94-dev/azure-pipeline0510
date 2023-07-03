//변수 =========================
var headerNFTMenu = document.getElementById('header_NFT'); //헤더 NFT메뉴
var title2 = document.querySelector('.title2'); //제목
var focused = document.activeElement; //포커스된 요소
var headerHome = document.getElementById('header_home') //홈 메뉴
var NFTItemBox = document.getElementById('slide')//NFT 컨텐츠 박스
var tag = '';
var tags = '';
var article1 = document.getElementById('article1');
var article2 = document.getElementById('article2');
var article3 = document.getElementById('article3');
var progressBar = document.getElementById('nftProgress');
var media_url
var artworkTitle
var artistName
var thumbnail
var qrCode = document.getElementById('qrCode');
var guideText = document.querySelector('#article1 .title2');
var qrFrame = document.querySelector('.frame-img');
var allItemLength = 0;
//session
var sKlaytnLength = Cookies.get('sKlaytnLength');
var sUserNftDataArray = [];
var sOwnerAddress = Cookies.get('ownerAddress');
var klaytnLength;
var page = '/klipdrops';


// ui 시작
function fakeFocusOn(fake, button){
    fake.on('focus', function(){
        button.focus();
    })
}

// showToastModal(Cookies.get('provider'));

// function
var addItem

var targetLi;
var mouseMoveSwitch=false;
$('.art-slides li a').on('keydown',function (){
    if(document.querySelectorAll('li:hover').length>0){
        targetLi = document.querySelectorAll('li:hover')[0];
        targetLi.classList.remove('hoverTrue');
        mouseMoveSwitch = true;
    }
});
window.addEventListener('mousemove',function (e){
    if(mouseMoveSwitch){
        targetLi.classList.add('hoverTrue');
        mouseMoveSwitch = false;
    }
})

//헤더 동작
$('.gnb a, .lnb a').on({
    keydown:function (e){
        switch (e.keyCode){
            case 38:
                if($(this).hasClass('setting')){
                    $('.NFT').focus();
                    return false;
                }else{
                    $(this).parent('li').prev().find('a').focus();
                    return false;
                }
                break;
            case 39:
                if($('.article1').hasClass('targetArticle1')){
                    $('#qrCode').focus();
                    return false;
                }
                break;
            case 40:
                if($(this).hasClass('NFT')){
                    $('.setting').focus();
                    return false;
                }else{
                    $(this).parent('li').next().find('a').focus();
                    return false;
                }
                break;
        }
    }
})

function artworkViewStyle(){
    $carousel.css('top','271px');
}
artworkViewStyle();
// hideBox(); // 박스 숨기는 함수
function moveList(item, height, container) {
    $('.opacity-box1').css('opacity',0)
    $document.on('focus', item, function () {
        $self = $(this); // 지금 focus 된 a 태그
        var liNumber = $self.parents('li').index(); // 지금 li의 index
        var liLast = $('.art-item').last().index(); // 현재 li들의 마지막 인덱스
        var rowNumber = parseInt(liNumber / 4); //몇번째 줄인지
        var listTop = -rowNumber * height//캐러셀이 올라가거나 내려가는 높이
        // $self.addClass('target');
        $container.css('top', listTop); //carousel box top 변경
        $(item).parents('li').css('opacity', '1'); //.art-slides a 의 li의 opacity를 1로 변경
        for (var i = 0; i <= liNumber; i++) {
            var rowIdx = parseInt(i / 4);
            if (rowIdx < rowNumber) {
                $(item).parents('li:nth-of-type(' + (i + 1) + ')').css('opacity', '0');
            }
        }
    });
    $document.on('blur', item, function () {
        $self = $(this); // 지금 focus 된 a 태그
        // $self.removeClass('target');
    });
}

moveList('.art-slides a', 265, '#carousel-container');
//a태그에 포커스 오면 테두리줌/나가면 안줌
$document.on('focus', 'a', function () {
    $(this).next().next().css('border', '8px solid #fff');
    $(this).next().next().css('opacity', '1');
});
$document.on('blur', 'a', function () {
    // $(this).next().next().css('border', 'none');
    $(this).next().next().css('opacity', '0');
});


function contentsFocus(item){
    $document.on('focus',item,function(){
        $(item).removeClass('contents-focus');
    })
    $document.on('blur',item,function() {
        var $this = $(this);
        $this.addClass('contents-focus');
    })
}

contentsFocus('.art-slides a'); //헤더 <-> 컨텐츠 포커스 이동방식
// ui 끝
function init(){
    if(sOwnerAddress == null){
        qrCode.focus(); //맨처음 진입시 NFT메뉴에 포커스한다
    }
    if(focused.id == 'header_NFT'){ //nft메뉴에 포커스됐을 때
        title2.className += ' active';
    }
}
init();

function controlKeyCode(){
    $('#qrCode').on('keydown',function(event){
        if(event.keyCode == 37){
            $('#header_NFT').focus();
            return false;
        } else if(event.keyCode == 38 ||event.keyCode == 39 || event.keyCode == 40){
            return false;
        }
    })
}
controlKeyCode();

//https://stpatron001.blob.core.windows.net/container-patron-renewal/klipdrops/nftArray.txt
var userNftDataArray = [];
var cursorArray = [];
var klipDropsJson = [];
var j = 0;
var totalSupply = 0;
var dateStart;

$.getJSON('/cursorArray',function (e){cursorArray = e});
$.getJSON('/nftArray',function (e){klipDropsJson = e});

function initialNFTItems(callback, media_url, artworkTitle, artistName, thumbnail){
    if( media_url.length > 12){
        for(var i=0; i<12; i++){
            tag =  '<li class="art-item hoverTrue">'+
                '<div class="art-gradbox">'+
                '<img src="' + thumbnail[i]  + '">'+
                '<a tabindex="1" class="art-gradbox-anchor" href="/nft-player?nftPlayer=klaytn&playUrl=' + media_url[i] + '&title=' + artworkTitle[i].replace(/&/g,"%26").replace(/\//g,"%2F").replace(/=/g,"%3D").replace(/\?/g,"%3F").replace(/:/g,'%3A').replace(/#/g,'%23').replace(/!/g,'%21') + '&artist=' + artistName[i].replace(/&/g,"%26").replace(/\//g,"%2F").replace(/=/g,"%3D").replace(/\?/g,"%3F").replace(/:/g,'%3A').replace(/#/g,'%23').replace(/!/g,'%21') + '"></a>'+
                '<div class="art-grad"></div>'+
                '<div class="art-border"></div>'+
                '</div>'+
                '<span class="art-title">' + artworkTitle[i] +'</span>'+
                '<span class="art-artist">' + artistName[i] +'</span>'+
                '</li>';
            tags = tags + tag;
        }
        NFTItemBox.innerHTML = tags;
        callback(media_url, artworkTitle, artistName, thumbnail);
    } else {
        for(var j=0; j<media_url.length; j++){
            tag =
                '<li class="art-item hoverTrue">'+
                '<div class="art-gradbox">'+
                '<img src="' + thumbnail[j]  + '">'+
                '<a tabindex="1" class="art-gradbox-anchor" href="/nft-player?nftPlayer=klaytn&playUrl=' + media_url[i] + '&title=' + artworkTitle[i].replace(/&/g,"%26").replace(/\//g,"%2F").replace(/=/g,"%3D").replace(/\?/g,"%3F").replace(/:/g,'%3A').replace(/#/g,'%23').replace(/!/g,'%21') + '&artist=' + artistName[i].replace(/&/g,"%26").replace(/\//g,"%2F").replace(/=/g,"%3D").replace(/\?/g,"%3F").replace(/:/g,'%3A').replace(/#/g,'%23').replace(/!/g,'%21') + '"></a>'+
                '<div class="art-grad"></div>'+
                '<div class="art-border"></div>'+
                '</div>'+
                '<span class="art-title">' + artworkTitle[j] +'</span>'+
                '<span class="art-artist">' + artistName[j] +'</span>'+
                '</li>';
            tags = tags + tag;
        }
        NFTItemBox.innerHTML = tags;
    }
    setTimeout(function(){
        document.querySelector('.art-gradbox-anchor').focus()
    },100);
}
//12개 이후서부터 하향키 눌렀을 때 4개씩 작품 더해주는 함수
function addLeftNFTItems(media_url, artworkTitle, artistName, thumbnail){
    var itemLength = 0 ;
    addItem = function (){
        if (event.keyCode == 40  && media_url.length > itemLength ) {
            if((media_url.length - allItemLength) > 4){
                var leftItemCount = 4;
            }else{
                var leftItemCount = media_url.length - allItemLength;
            }
            var liSelector = [];
            liSelector = document.querySelectorAll('.art-item');
            var current_show_imageUrl = liSelector.length; // 마지막으로 출력되는 li 의 index 번호
            var num = 0;

            for (var k = current_show_imageUrl; k < current_show_imageUrl + leftItemCount; k++) {

                var itemLiNew = document.createElement('li');
                itemLiNew.className = 'art-item art-item-later hoverTrue';

                var itemDivGradbox = document.createElement('div');
                itemDivGradbox.className = 'art-gradbox';

                var itemSpanTitle = document.createElement('span');
                itemSpanTitle.className = 'art-title';
                itemSpanTitle.setAttribute('id', 'art-title-' + current_show_imageUrl + num);

                var itemSpanArtist = document.createElement('span');
                itemSpanArtist.className = 'art-artist';
                itemSpanArtist.setAttribute('id', 'art-artist-' + current_show_imageUrl + num);

                var itemImg = document.createElement('img');
                itemImg.setAttribute('id', 'img-' + current_show_imageUrl + num);

                var itemA = document.createElement('a');
                itemA.className = 'art-gradbox-anchor';
                itemA.setAttribute('id', 'art-gradbox-anchor-' + current_show_imageUrl + num);
                itemA.setAttribute('tabubdex', '1');

                var itemDivGrad = document.createElement('art-grad');
                itemDivGrad.className = 'art-grad';

                var itemDivArtBorder = document.createElement('art-border');
                itemDivArtBorder.className = 'art-border';

                document.querySelector('.slide').appendChild(itemLiNew); // ul 태그 안의 li 추가

                //li 태그 안에 art-gradbox,art-title,art-artist
                itemLiNew.appendChild(itemDivGradbox);
                itemLiNew.appendChild(itemSpanTitle);
                itemLiNew.appendChild(itemSpanArtist);

                //art-gradbox 안에 img, a, art-grad, art-border 추가
                itemDivGradbox.appendChild(itemImg);
                itemDivGradbox.appendChild(itemA);
                itemDivGradbox.appendChild(itemDivGrad);
                itemDivGradbox.appendChild(itemDivArtBorder);

                document.getElementById('art-title-' + current_show_imageUrl + num).innerText = artworkTitle[current_show_imageUrl + num];
                document.getElementById('art-artist-' + current_show_imageUrl + num).innerText = artistName[current_show_imageUrl + num];
                document.getElementById('img-' + current_show_imageUrl + num).setAttribute('src', thumbnail[current_show_imageUrl + num]);
                document.getElementById('art-gradbox-anchor-' + current_show_imageUrl + num).setAttribute('href', '/nft-player?nftPlayer=klaytn&playUrl=' + media_url[current_show_imageUrl + num] + '&title=' + artworkTitle[current_show_imageUrl + num].replace(/&/g,"%26").replace(/\//g,"%2F").replace(/=/g,"%3D").replace(/\?/g,"%3F").replace(/:/g,'%3A').replace(/#/g,'%23').replace(/!/g,'%21') + '&artist=' + artistName[current_show_imageUrl + num].replace(/&/g,"%26").replace(/\//g,"%2F").replace(/=/g,"%3D").replace(/\?/g,"%3F").replace(/:/g,'%3A').replace(/#/g,'%23').replace(/!/g,'%21'));

                num++
            }
            setTimeout(function () {
                $('.contents-focus').focus()
            }, 100);
        }
    }
    $document.on('keydown', '.art-item a', function (event) {
        if(event.keyCode == 40 && media_url.length > itemLength){
            itemLength = document.querySelectorAll('.art-item').length;
        }else{
            itemLength = '';
        }
    });
}

console.log('sOwnerAddress : ' + sOwnerAddress)
//저장된 address가 있을 경우 QR없이 재통신
if(sOwnerAddress !== null && sOwnerAddress !== '' && sOwnerAddress !== undefined){
    console.log('wallet!!!!')
    $('.article1.targetArticle1').remove();
    // KAS api
    $.ajax({
        type: 'get',
        url: '/api-klipdrops?ownerAddress='+sOwnerAddress,
        // url: '/api-klipdrops?ownerAddress=',
        success:function (kasApiResult){
            var klaytnNftData = kasApiResult['items'];
            klaytnLength = klaytnNftData.length;
            // QR제거 이후 스피너 동작
            article2.style.display = 'block';
            document.getElementById('nftProgress').setAttribute('max',klaytnLength);
            document.getElementById('nftProgress').setAttribute('value','0');
            dateStart = new Date().getTime();
            if(sKlaytnLength == klaytnLength){
                nft4KDataArraySplit();
            } else {
                for(var i=0;i<klaytnLength;i++) {
                    // uri data
                    var dropUri = klaytnNftData[i]['tokenUri'];
                    var index = cursorArray.indexOf(dropUri);
                    if ( index !== -1 && klipDropsJson[index]['animation_url'] !== undefined){
                        var resultJson = {
                            'videoFile': 'https://stpatron001.blob.core.windows.net/container-patron-renewal/klipdrops/KlipDropsAnimationEncoding_FHD2/' + klipDropsJson[index]['animation_url'].replace(/https:\/\/media.klipwallet.com\/drops\/animation\//g,''),
                            'title': klipDropsJson[index]['name'],
                            'artist': klipDropsJson[index]['group_name'],
                            'thumbnail': 'https://stpatron001.blob.core.windows.net/container-patron-renewal/klipdrops/KlipDropsThumbnailEncoding/JPEG/' + klipDropsJson[index]['image'].replace(/https:\/\/media.klipwallet.com\/drops\/image\//g,'')
                        }
                        userNftDataArray.push(resultJson);
                        document.getElementById('nftProgress').setAttribute('value', (j + 1).toString());
                    }
                    if(i==klaytnLength-1){
                        // alert('if문 진입')
                        setTimeout(function (){
                            nft4KDataArraySplit();
                        },100)
                    }
                }
            }
        }
    })
} else {
    article1.style.display = 'block';
    // klip api prepare
    $.ajax({
        type:'post',
        url:'https://a2a-api.klipwallet.com/v2/a2a/prepare',
        contentsType:'application/json',
        // kakao klipwallet 에서 보이는 우리의 정보
        data:JSON.stringify({'bapp': { 'name' : 'Patron NFT' }, 'callback': { 'success': 'klipwallet success', 'fail': 'klipwallet fail' }, 'type': 'auth' }),
        success:function(klipApiPrepareResult) {
            // Deep link Qrcode
            new QRCode(document.getElementById('qrCodeDivWrap'), {
                text: 'kakaotalk://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key='+klipApiPrepareResult['request_key'],
                colorDark : '#000000',
                colorLight : '#ffffff',
                width: 320,
                height: 320,
                correctLevel : QRCode.CorrectLevel.H
            });
            setTimeout(function (){
                $('#qrCode img').css({
                    width: '320px!important',
                    height: '320px!important',
                    position: 'relative'
                })
                $('#qrCode').css('opacity','1');
                $('.breadcrumb').css('opacity','1')
            },10)
            var key = klipApiPrepareResult['request_key'];
            var ajaxUrlNumber = 0;
            var checkUserAddress = setInterval(function (){
                ajaxUrlNumber += 1;
                // klip api (get userAddress)
                $.ajax({
                    type:'get',
                    url:'https://a2a-api.klipwallet.com/v2/a2a/result?request_key=' + key + '&ajaxUrlNumber=' + ajaxUrlNumber.toString(),
                    cache: 'false',
                    success:function (klipApiData){
                        if(klipApiData['status'] == 'completed'){
                            clearInterval(checkUserAddress);
                            var ownerAddress = klipApiData['result']['klaytn_address'];
                            // //alert(ownerAddress);
                            console.log('ownerAdderess')
                            console.log(ownerAddress)
                            // KAS api
                            $.ajax({
                                type: 'get',
                                url: '/api-klipdrops?ownerAddress='+ownerAddress,
                                // url: '/api-klipdrops?ownerAddress=',
                                success:function (kasApiResult){
                                    // alert(kasApiResult);
                                    if(kasApiResult.items.length > 0){
                                        var klaytnNftData = kasApiResult['items'];
                                        klaytnLength = klaytnNftData.length;
                                        console.log('klatnLength : ', klaytnLength);
                                        //QR제거 이후 session값 체크
                                        Cookies.set('sKlaytnLength',klaytnLength,{domain:cookieDomain});

                                        // QR제거 이후 스피너 동작
                                        guideText.innerText = 'Klip Drops에서 회원님의 작품을 불러오는 중입니다';
                                        qrFrame.style.display = 'none';
                                        article1.style.display = 'none';
                                        article1.className = 'article1';
                                        document.getElementById('qrCode').style.display = 'none';
                                        article2.style.display = 'block';
                                        // document.querySelector('.black-img').style.opacity = '1';

                                        document.getElementById('nftProgress').setAttribute('max',klaytnLength);
                                        document.getElementById('nftProgress').setAttribute('value','0');
                                        for (var i = 0; i < klaytnLength; i++) {
                                            // uri data
                                            var dropUri = klaytnNftData[i]['tokenUri'];
                                            var index = cursorArray.indexOf(dropUri);
                                            if (index !== -1 && klipDropsJson[index]['animation_url'] !== undefined) {
                                                var resultJson = {
                                                    'videoFile': 'https://stpatron001.blob.core.windows.net/container-patron-renewal/klipdrops/KlipDropsAnimationEncoding_FHD2/' + klipDropsJson[index]['animation_url'].replace(/https:\/\/media.klipwallet.com\/drops\/animation\//g, ''),
                                                    'title': klipDropsJson[index]['name'],
                                                    'artist': klipDropsJson[index]['group_name'],
                                                    'thumbnail': 'https://stpatron001.blob.core.windows.net/container-patron-renewal/klipdrops/KlipDropsThumbnailEncoding/JPEG/' + klipDropsJson[index]['image'].replace(/https:\/\/media.klipwallet.com\/drops\/image\//g, '')
                                                }
                                                userNftDataArray.push(resultJson);
                                                document.getElementById('nftProgress').setAttribute('value', (j + 1).toString());
                                            }
                                            if (i == klaytnLength - 1) {
                                                setTimeout(function () {
                                                    //session에 address저장
                                                    Cookies.set('ownerAddress', JSON.stringify(ownerAddress),{domain:cookieDomain});
                                                    // Cookies.set('ownerAddress', JSON.stringify(ownerAddress));
                                                    //session에 배열 저장하고 split
                                                    sessionStorage.setItem('sUserNftDataArray',JSON.stringify(userNftDataArray))
                                                    nft4KDataArraySplit();
                                                }, 1000)
                                            }
                                        }
                                    } else {
                                        //보유한 nft작품이 없을때
                                        // QR제거 이후 스피너 동작
                                        guideText.innerText = 'Klip Drops에서 회원님의 작품을 불러오는 중입니다';
                                        qrFrame.style.display = 'none';
                                        article1.style.display = 'none';
                                        article1.className = 'article1';
                                        document.getElementById('qrCode').style.display = 'none';
                                        article3.style.display = 'block';
                                        article3.style.left = '0';
                                        article3.focus();
                                        //session에 address저장
                                        Cookies.set('ownerAddress', ownerAddress.toString(),{domain:cookieDomain});
                                        // Cookies.set('ownerAddress', ownerAddress.toString());
                                        //session에 배열 저장하고 split
                                        // sessionStorage.setItem('sUserNftDataArray',JSON.stringify(userNftDataArray))
                                    }
                                }
                            })
                        }
                    },
                    error:function (e){
                        // alert('klip api 통신 실패');
                        // //alert(e);
                    }
                })
            },4000);
        },
        error:function (e){
            // alert('klip api prepare 통신 실패');
            // alert(e);
        }
    })
}


/*
1. app 실행 후 최초 QR코드 진입시 session에
 */
function nft4KDataArraySplit(){
    media_url = [];
    artworkTitle = [];
    artistName = [];
    thumbnail = [];

    //session 배열에서 꺼내오기
    var sArr = sessionStorage.getItem('sUserNftDataArray');
    sUserNftDataArray = JSON.parse(sArr);
    // if(sUserNftDataArray.length < 1 || userNftDataArray.length < 1){
    //     article1.style.display = 'none';
    //     article2.style.display = 'none';
    //     article3.style.display = 'block';
    //     article3.style.left = '0';
    //     article3.focus();
    // } else {
        for(var q=0; q<sUserNftDataArray.length; q++){
            media_url[q] = sUserNftDataArray[q]['videoFile'];
            artworkTitle[q] = sUserNftDataArray[q]['title'];
            artistName[q] = sUserNftDataArray[q]['artist'];
            thumbnail[q] = sUserNftDataArray[q]['thumbnail'];
            if( q == sUserNftDataArray.length-1 ){
                //맨 처음 12개 항목 ui 세팅해주는 함수
                initialNFTItems(addLeftNFTItems, media_url, artworkTitle, artistName, thumbnail)
            }
        }

        //변수에 저장한 배열 split
        for(var q=0; q<userNftDataArray.length; q++){
            media_url[q] = userNftDataArray[q]['videoFile'];
            artworkTitle[q] = userNftDataArray[q]['title'];
            artistName[q] = userNftDataArray[q]['artist'];
            thumbnail[q] = userNftDataArray[q]['thumbnail'];
            if( q == userNftDataArray.length-1 ){
                //맨 처음 12개 항목 ui 세팅해주는 함수
                initialNFTItems(addLeftNFTItems, media_url, artworkTitle, artistName, thumbnail)
            }
        }
    // }



}

$('#article3').on('keydown',function(e){
    switch (e.keyCode){
        case 37:
            $('#header_NFT').focus();
            return false;
        case 38: case 39: case 40:
            return false;
    }
})

//결과 이동
setTimeout(function (){
    $('.art-slides.category .slide').on('keydown','li',function (e){
        var indexNumber = $(this).index()+1;
        var totalDataLength = parseInt(klaytnLength);
        switch (e.keyCode){
            case 37:
                if(indexNumber%4 !== 1 ){
                    $(this).prev().find('a').focus();
                    return false;
                } else if(indexNumber%4 == 1){
                    $('#header_NFT').focus();
                    return false;
                } else {
                    return false;
                }
            case 38:
                if(indexNumber<=4){
                    return false;
                } else {
                    $('.art-slides li:nth-of-type(' + parseInt(indexNumber-4) + ') a').focus()
                    return false;
                }
            case 39:
                if(indexNumber%4 !== 0){
                    $(this).next().find('a').focus();
                    return false;
                } else {
                    return false;
                }
            case 40:
                allItemLength = $('.art-item').length;
                addItem();
                switch (totalDataLength%4){
                    case 0:
                        if(totalDataLength >= indexNumber && indexNumber > totalDataLength-4){
                            $('.art-slides li:nth-of-type(' + parseInt(indexNumber-totalDataLength+4) +') a').focus();
                        } else {
                            $('.art-slides li:nth-of-type(' + parseInt(indexNumber+4) + ') a').focus();
                        }
                        return false;
                    case 1:
                        if(totalDataLength-1 >= indexNumber && indexNumber > totalDataLength-4){
                            $('.art-slides li:last-of-type a').focus();
                        } else
                        if(totalDataLength >= indexNumber && indexNumber > totalDataLength-1){
                            $('.art-slides li:nth-of-type(1) a').focus();
                        } else {
                            $('.art-slides li:nth-of-type(' + parseInt(indexNumber+4) + ') a').focus();
                        }
                        return false;
                    case 2:
                        if(totalDataLength-2 >= indexNumber && indexNumber > totalDataLength-4){
                            $('.art-slides li:last-of-type a').focus();
                        } else
                        if(totalDataLength >= indexNumber && indexNumber > totalDataLength-2){
                            $('.art-slides li:nth-of-type(' + parseInt(indexNumber-totalDataLength+2) +') a').focus();
                        } else {
                            $('.art-slides li:nth-of-type(' + parseInt(indexNumber+4) + ') a').focus();
                        }
                        return false;
                    case 3:
                        if(totalDataLength-3 >= indexNumber && indexNumber > totalDataLength-4){
                            $('.art-slides li:last-of-type a').focus();
                        } else
                        if(totalDataLength >= indexNumber && indexNumber > totalDataLength-3){
                            $('.art-slides li:nth-of-type(' + parseInt(indexNumber-totalDataLength+3) +') a').focus();
                        } else {
                            $('.art-slides li:nth-of-type(' + parseInt(indexNumber+4) + ') a').focus();
                        }
                        return false;
                }
        }
    })
},500)

var wheelBoolean = true;
setTimeout(function (){
    $document.on('mousewheel',function(e){
        if(wheelBoolean == true){
            var wheel = e.originalEvent.wheelDelta;
            var up = $.Event('keydown');
            up.which = 38;
            up.keyCode = 38;
            var down = $.Event('keydown');
            down.which = 40;
            down.keyCode = 40;
            if(wheel>0){
                $focus.trigger(up)
            } else {
                $focus.trigger(down)
                var itemLength = 0 ;
                addItem = function (){
                    if (media_url.length > itemLength ) {
                        console.log('하향키 눌렀을때 추가작품2')
                        if((media_url.length - allItemLength) > 4){
                            var leftItemCount = 4;
                        }else{
                            var leftItemCount = media_url.length - allItemLength;
                        }
                        // var leftItemCount = (media_url.length - allItemLength) > 4 ? 4 : media_url.length - allItemLength;
                        var liSelector = [];
                        liSelector = document.querySelectorAll('.art-item');
                        var total_imageUrl = userNftDataArray.length; // 서버에서 전달받은 전체 이미지 url 사이즈
                        var current_show_imageUrl = liSelector.length; // 마지막으로 출력되는 li 의 index 번호
                        var rest_imageUrl = total_imageUrl - current_show_imageUrl; // 전체 이미지 사이즈 - 마지막으로 출력되는 li index
                        var num = 0;

                        for (var k = current_show_imageUrl; k < current_show_imageUrl + leftItemCount; k++) {

                            // nftContentsPaging(userNftDataArray.length);

                            var itemLiNew = document.createElement('li');
                            itemLiNew.className = 'art-item art-item-later';

                            var itemDivGradbox = document.createElement('div');
                            itemDivGradbox.className = 'art-gradbox';

                            var itemSpanTitle = document.createElement('span');
                            itemSpanTitle.className = 'art-title';
                            itemSpanTitle.setAttribute('id', 'art-title-' + current_show_imageUrl + num);

                            var itemSpanArtist = document.createElement('span');
                            itemSpanArtist.className = 'art-artist';
                            itemSpanArtist.setAttribute('id', 'art-artist-' + current_show_imageUrl + num);

                            var itemImg = document.createElement('img');
                            itemImg.setAttribute('id', 'img-' + current_show_imageUrl + num);

                            var itemA = document.createElement('a');
                            itemA.className = 'art-gradbox-anchor';
                            itemA.setAttribute('id', 'art-gradbox-anchor-' + current_show_imageUrl + num);
                            itemA.setAttribute('tabubdex', '1');

                            var itemDivGrad = document.createElement('art-grad');
                            itemDivGrad.className = 'art-grad';

                            var itemDivArtBorder = document.createElement('art-border');
                            itemDivArtBorder.className = 'art-border';

                            document.querySelector('.slide').appendChild(itemLiNew); // ul 태그 안의 li 추가

                            //li 태그 안에 art-gradbox,art-title,art-artist
                            itemLiNew.appendChild(itemDivGradbox);
                            itemLiNew.appendChild(itemSpanTitle);
                            itemLiNew.appendChild(itemSpanArtist);

                            //art-gradbox 안에 img, a, art-grad, art-border 추가
                            itemDivGradbox.appendChild(itemImg);
                            itemDivGradbox.appendChild(itemA);
                            itemDivGradbox.appendChild(itemDivGrad);
                            itemDivGradbox.appendChild(itemDivArtBorder);

                            document.getElementById('art-title-' + current_show_imageUrl + num).innerText = artworkTitle[current_show_imageUrl + num];
                            document.getElementById('art-artist-' + current_show_imageUrl + num).innerText = artistName[current_show_imageUrl + num];
                            document.getElementById('img-' + current_show_imageUrl + num).setAttribute('src', thumbnail[current_show_imageUrl + num]);
                            document.getElementById('art-gradbox-anchor-' + current_show_imageUrl + num).setAttribute('href', '/nft-player?nftPlayer=klaytn&playUrl=' + media_url[current_show_imageUrl + num] + '&title=' + artworkTitle[current_show_imageUrl + num].replace(/&/g,"%26").replace(/\//g,"%2F").replace(/=/g,"%3D").replace(/\?/g,"%3F").replace(/:/g,'%3A').replace(/#/g,'%23').replace(/!/g,'%21') + '&artist=' + artistName[current_show_imageUrl + num].replace(/&/g,"%26").replace(/\//g,"%2F").replace(/=/g,"%3D").replace(/\?/g,"%3F").replace(/:/g,'%3A').replace(/#/g,'%23').replace(/!/g,'%21'));

                            num++
                        }
                        setTimeout(function () {
                            $('.contents-focus').focus()
                        }, 100);
                    }
                }
                $document.on('keydown', '.art-item a', function (event) {
                    if(media_url.length > itemLength){
                        itemLength = document.querySelectorAll('.art-item').length;
                    }else{
                        itemLength = '';
                    }
                });
            }
            wheelBoolean = false;
            setTimeout(function (){
                wheelBoolean = true;
            },250)
        }
    });
},1500)

//LG masic remote 매직리모콘 --------------------------------------------------------------------------------------------
//작가 전체 검색결과
$document.on('click','.art-slides .art-item .art-border',function(e){
    e.target.previousElementSibling.previousElementSibling.focus();
})

//작품 클릭
$document.on('click','.art-slides .slide',function(e){
    e.target.parentElement.querySelector('a').click();
})





//KLIPDROPS move=------------------------------------------------------------------------------------------------------
document.getElementById('qrCode').addEventListener('keydown',function (e){
    switch (e.keyCode){
        case 37:
            $('#header_NFT').focus();
    }
});
$('#qrCode').focus();
