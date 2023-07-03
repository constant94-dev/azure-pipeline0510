var isPlay = true;
document.getElementById('nftPlayerVideo').oncanplay = function (){
    document.getElementById('nftPlayerVideo').style.display = 'block';
    document.querySelector('.black-img').style.opacity = '0';
    setTimeout(function (){
        document.getElementById('nftPlayerVideo').play();
        $('.btn-text').css('display','block');
    },100);
}
var keydownFadeInSwitch = true;
function fadeOutSet(){
    $('.gradiant-box').css('opacity','0');
    $('.wrap-play').css('opacity','0');
    $('.btn-text').css('display','none');
    keydownFadeInSwitch = false;
}
function fadeIn(){
    $('.gradiant-box').css('opacity','1');
    $('.wrap-play').css('opacity','1');
    $('.btn-text').css('display','block');
    setTimeout(function (){
        keydownFadeInSwitch = true;
    },100)
}
var fadeout;
var icon = document.querySelector('.icon-play');
document.addEventListener('keydown', function (e){
    clearTimeout(fadeout);
    fadeIn()
    fadeout = setTimeout(function (){
        fadeOutSet()
    },5000)
    if (keydownFadeInSwitch){
        switch (e.keyCode){
            case 13:
                if(isPlay == true){
                    document.getElementById('nftPlayerVideo').pause();
                    icon.classList.remove('pause');
                    $pauseText.text('재생');
                    isPlay = false;
                    clearTimeout(fadeout);
                }else {
                    document.getElementById('nftPlayerVideo').play();
                    icon.classList.add('pause');
                    $pauseText.text('일시정지');
                    isPlay = true;
                }
        }
    }
});
fadeout = setTimeout(function (){
    fadeOutSet()
},5000);


//LG masic remote 매직리모콘 --------------------------------------------------------------------------------------------
//플레이어 버튼
$('.play-buttons button, .play-buttons button i').on('mouseenter',function(e){
    e.target.focus();
})
//플레이어 버튼 클릭
$document.on('click',function(e){
    if(isPlay == true){
        document.getElementById('nftPlayerVideo').pause();
        icon.classList.remove('pause');
        $pauseText.text('재생');
        isPlay = false;
        clearTimeout(fadeout);
    }else {
        document.getElementById('nftPlayerVideo').play();
        icon.classList.add('pause');
        $pauseText.text('일시정지');
        isPlay = true;
    }
})
