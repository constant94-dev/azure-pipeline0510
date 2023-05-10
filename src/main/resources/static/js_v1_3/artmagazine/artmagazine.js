$(document).ready(function(){
    $(".owl-carousel").owlCarousel({
        loop:false,
        items:2,
        autoWidth:true,
        margin:8
    });
});


const getArtmagazine = (type, target) => {
    sessionStorage.setItem('artMagazineTab',type);
    $.ajax({
        url:"/api/art-magazine?type=" + type,
        type:"POST",
        dataType: "json",
        success: function(data){
            let html;
            for(let i=0; i<data.id.length; i++){
                // console.log(data.title[i])
                html += `<li data-id="${data.id[i]}">
                            <a href="/art-magazine-detail?artMagazineId=${data.id[i]}">
                              <ul class="art-magazine-item">
                                <li>
                                  <p class="art-magazine-category">${data.type[i]}</p>
                                  <p class="art-magazine-title">${data.title[i]}</p>
                                  <p class="art-magazine-time"><span>${data.createTime[i].split('T')[0]}</span></p>
                                </li>
                                <li>
                                  <img src="${data.thumbnail[i]}" alt="${data.title[i]}">
                                </li>
                              </ul>
                            </a>
                        </li>`;
            }
            document.getElementById(target).querySelector('.art-magazine-container').innerHTML = html;

        },
        error: function(){
        }
    })
}
function showMagazineItem(selector){
    const magazineWrap = document.querySelectorAll('.magazine-content');
    const targetModal = document.querySelector(selector);
    magazineWrap.forEach(function(element){
        element.style.display = 'none';
    })
    targetModal.style.display = 'block';
}
function showUnderBar(selector){
    const focusBar = document.querySelectorAll('.focus-bar');
    let tablinkTitles = document.querySelectorAll('.tablink-title');
    focusBar.forEach(function(element){
        element.style.opacity = '0';
    });
    tablinkTitles.forEach(function(element){
        element.style.color = 'rgba(245, 245, 245, 0.65)';
    });
    // selector.children.namedItem('focus-bar').style.display = 'block'
    selector.children.namedItem('focus-bar').style.opacity = '1';
    selector.querySelector('.tablink-title').style.color = '#fff';
}

function initArtMagazineMain(){
    showMagazineItem('#article_all');
}

function moveLeft(selector, num){
    const target = document.getElementById(selector);
    let scrollLeftNow;
    scrollLeftNow = target.scrollLeft;
    target.scrollLeft = scrollLeftNow + num ;
}

initArtMagazineMain();
if(sessionStorage.getItem('artMagazineTab') !== null){
    getArtmagazine(sessionStorage.getItem('artMagazineTab'),'article_trend');
    showMagazineItem('#article_trend');
    let magazineArray = [];
    document.querySelectorAll('.tablinks').forEach(a=>magazineArray.push(a.querySelector('.tablink-title').innerText))
    showUnderBar(document.querySelectorAll('.tablinks')[magazineArray.indexOf(sessionStorage.getItem('artMagazineTab'))]);
    moveLeft('art_magazine_tab', -500)
}
