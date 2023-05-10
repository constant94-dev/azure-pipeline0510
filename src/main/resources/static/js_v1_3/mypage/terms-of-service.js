function termsController(target) {
    document.getElementById('terms_of_'+target).onclick = function () {
        document.querySelectorAll('.active').forEach(e => e.classList.remove('active'))
        this.classList.add('active');
        document.querySelector('.terms-of-service-content-'+target).classList.add('active');
        if(target ==='account'){
            moveLeft('terms_of_service_tab', 1500)
        }else{
            moveLeft('terms_of_service_tab', -1500)
        }
    }
}
termsController('service');
termsController('privacy');
termsController('account');

window.onload = () => {
    let type = window.location.search.split('=')[1];
    // console.log(type)
    switch (type) {
        case 'service':
            document.getElementById('terms_of_service').click();
            break;
        case 'privacy':
            document.getElementById('terms_of_privacy').click();
            break;
        case 'account':
            document.getElementById('terms_of_account').click();
            break;
    }
}
//언어별로 탭 길이 변경
// let firstTabWidth = $('#terms_of_service').css('width');
// let secondTabWidth = $('#terms_of_privacy').css('width');
// let thirdTabWidth = $('#terms_of_account').css('width');
// if($('#terms_of_service').length>0 ){
//     $('#terms_of_service').addClass('active');
//     $('.terms-of-service-tab-service-bar').css({'width':`${firstTabWidth}`})
// }
// let leftCssFirst = ((parseInt(firstTabWidth) + 18) + 'px').toString();
// let leftCssSecond = ((parseInt(firstTabWidth) + (parseInt(secondTabWidth) + 30) + 'px')).toString();
// if($('#terms_of_privacy').length>0 && $('.terms-of-service-tab-privacy-bar').length > 0){
//     $('.terms-of-service-tab-privacy-bar').css({'width':`${secondTabWidth}`, 'left': `${leftCssFirst}`});
// }
// if($('#terms_of_account').length>0){
//     $('.terms-of-service-tab-account-bar').css({'width':`${thirdTabWidth}`, 'left': `${leftCssSecond}`});
// }

document.getElementById('terms_of_service_content_service').innerHTML = importantNotice;
document.getElementById('terms_of_service_content_privacy').innerHTML = contentPrivacy;
document.getElementById('terms_of_service_content_account').innerHTML = contentAccount;

//탭이동
function moveLeft(selector, num){
    const target = document.getElementById(selector);
    let scrollLeftNow;
    scrollLeftNow = target.scrollLeft;
    target.scrollLeft = scrollLeftNow + num ;
}

