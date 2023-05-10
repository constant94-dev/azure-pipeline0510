const childElement = document.getElementById('child');
let messageSwitch = true;

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(function (){
        let nowLanguage = document.querySelector('html').getAttribute('lang');
        childElement.setAttribute('src',document.getElementById('child_url').innerText+'?trans_lang='+nowLanguage);
        setTimeout(function (){
            window.addEventListener( 'message',  function( e ){
                childElement.style.height = (e.data.height+100)+'px';
                childElement.style.opacity = '1';
                $('.contents_style').find('img').css('width','100%')
            });
            childElement.contentWindow.postMessage(0, '*');
            // console.clear();
        },1500);
    },2000);
});
window.addEventListener( 'message', async function ( e ) {
    messageSwitch = false;
    // console.clear();
})
setInterval(function (){
    if(messageSwitch){
        childElement.contentWindow.postMessage(0, '*');
    }
},4200)


setTimeout(function (){
    let currentLanguage = document.querySelector('html').getAttribute('lang');

    setInterval(function (){
        let nowLanguage = document.querySelector('html').getAttribute('lang');
        if(currentLanguage !== nowLanguage){
            location.reload();
        }
    },500)
},5000)

