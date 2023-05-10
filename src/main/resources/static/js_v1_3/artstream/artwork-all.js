//artist nation과 artist english name을 가져와야 함 (.korean-name, .bracket-english-name, .english-name)
$(document).ready(function(){
    $(".owl-carousel").owlCarousel({
        loop:false,
        autoWidth:true,
        margin:8
    });
    showArtistNameWithLan();
});
//=======================infinite scroll==============================
let infiniteScrollChecker = true;
let pageNumber = 1;
let sortNumber = 0;
const container = document.querySelector('.art-stream-list');
window.addEventListener('scroll',function(){
    var scrollHeight = document.documentElement.scrollHeight;
    var scrollTop = document.documentElement.scrollTop;
    var clientHeight = document.documentElement.clientHeight;
    if( (scrollTop + clientHeight) > (scrollHeight - 1)){
        if(infiniteScrollChecker){
            getAllArtworkData();
        }
    }
});
let exhibitionId;
let exhibitionThumb;
let exhibitionName;
let durationTime;
let artistCount;
let artworksCount;
let artistNationality;
let artistKorName;
let artistEngName;
let artistBracketName;
let artistCountText;
function getAllArtworkData(){
    pageNumber = pageNumber + 1;
    $.ajax({
        url:"/" + location.pathname.split('/')[1] + "/api/artwork/all?sortBy="+sortBy[sortNumber]+"&p="+pageNumber,
        method: "get",
        type: "json",
        data:{
        },
        success: function(result){
            console.log(result)
            if (result.id.length < 20){
                infiniteScrollChecker = false;
                $('.loading').remove();
            }
            if (result !== []){
                let forCount;
                artworkId = result['id']
                artworkThumb = result['thumbnail']
                artworkName = result['name']
                artistName = result['artistName']
                artworkId.length < 20 ? forCount = artworkId.length : forCount = 20;
                for(let i=0; i<forCount; i++){
                    var post = document.createElement('div');
                    post.className = 'contents-wrap';
                    post.innerHTML = `
                <div class="contents-wrap-div">
                    <div class="exh-item">
                        <a href="/` + location.pathname.split('/')[1]  + `/player?art_id=${artworkId[i]}">
                            <div class="item-img-wrap">
                                <img src="${artworkThumb[i]}" alt="${artworkName[i]}">
                            </div>
                            <p class="item-exh-title">${artworkName[i]}</p>
                            <span class="korean-name">${artistName[i]}</span> 
                        </a>
                    </div>
                </div>`
                    container.appendChild(post);
                }
            }
        }
    });
}
//=======================infinite scroll==============================
//========================sorting=====================================
let sortBy = ['최신순','인기순','가나다순','공유순'];
function sortArtStream(option){
    switch (option) {
        case 'latest':
            pageNumber = 1;
            sortNumber = 0;
            break;
        case 'popular':
            pageNumber = 1;
            sortNumber = 1;
            break;
        case 'alphabet':
            pageNumber = 1;
            sortNumber = 2;
            break;
        case 'share':
            pageNumber = 1;
            sortNumber = 3;
            break;
        default:
    }
    $.ajax({
        url:"/" + location.pathname.split('/')[1] + "/api/artwork/all?sortBy="+sortBy[sortNumber]+"&p="+pageNumber,
        method: "get",
        type: "json",
        data:{
        },
        success: function(result){
            artworkId = result['id'];
            artworkThumb = result['thumbnail'];
            artworkName = result['name'];
            artistName = result['artistName'];

            let sortedData=document.createElement('div');
            for(let i=0; i<20; i++){
                var post = document.createElement('div');
                post.className = 'contents-wrap';
                post.innerHTML = `
                <div class = "contents-wrap-div">
                    <div class="exh-item">
                        <a href="/` + location.pathname.split('/')[1]  + `/player?art_id=${artworkId[i]}">
                            <div class="item-img-wrap">
                                <img src="${artworkThumb[i]}" alt="${artworkName[i]}">
                            </div>
                            <p class="item-exh-title">${artworkName[i]}</p>
                            <span class="korean-name">${artistName[i]}</span>
                        </a>
                    </div>
                </div>`
                sortedData.appendChild(post);
            }
            container.innerHTML= sortedData.innerHTML;
        }
    });
}
function checkNowSortingStandard(selector){
    const standard = selector.textContent.trim();
    const confirmIcons = document.querySelectorAll('#sorting_options .icon-confirm');
    for(let i=0; i<confirmIcons.length; i++){
        confirmIcons[i].style.opacity = '0';
    }
    const standards = ['최신순','인기순','가나다순','공유순'];
    const thisStandardIndex = standards.indexOf(standard);
    confirmIcons[thisStandardIndex].style.opacity = '1';
}
//========================sorting=====================================
