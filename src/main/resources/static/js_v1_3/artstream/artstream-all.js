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
            getAllArtStreamData();
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
function getAllArtStreamData(){
    pageNumber = pageNumber + 1;
    $.ajax({
        url:"/" + location.pathname.split('/')[1] + "/api/artstream/all?sortBy="+sortBy[sortNumber]+"&p="+pageNumber,
        method: "get",
        type: "json",
        data:{
        },
        success: function(result){
            console.log(result)
            if (result.id.length < 12){
                infiniteScrollChecker = false;
                $('.loading').remove();
            }
            if (result !== []){
                let forCount;
                exhibitionId = result['id']
                exhibitionThumb = result['exhibitionThumb']
                exhibitionName = result['exhibitionName']
                durationTime = result['durationTime']
                artistNationality = result['exhibitionArtistNationality'];
                // artistKorName = result['exhibitionArtistKorName'];
                // artistEngName = result['exhibitionArtistEngName'];
                artistName = result['exhibitionArtistName'];
                artistCount = result['artistCount']
                artworksCount = result['artworksCount']
                durationTime = result['durationTime']

                exhibitionId.length < 12 ? forCount = exhibitionId.length : forCount = 12;
                for(let i=0; i<forCount; i++){
                    // if (artistNationality[i] === '대한민국' || artistNationality[i] === '한국') {
                    //     artistBracketName = '';
                    // }else{
                    //     artistBracketName = `(${artistEngName[i]})`;
                    // }
                    if (artistCount[i] > 2){
                        switch(location.pathname.split('/')[1]){
                            case "ja" : artistCountText = ` ほか ${artistCount[i]}名様です`; break;
                            case "ko" : artistCountText = ` 외 ${artistCount[i]}명`; break;
                            default : artistCountText =  ` and ${artistCount[i]} others`; break;
                        }
                    }else{
                        artistCountText = '';
                    }
                    var post = document.createElement('div');
                    post.className = 'contents-wrap';
                    post.innerHTML = `
                <div class="contents-wrap-div">
                    <div class="exh-item">
                        <a href="/` + location.pathname.split('/')[1]  + `/player?exh_id=${exhibitionId[i]}">
                            <div class="item-gradation"></div>
                            <img class="icon-exhibition" src="/img/icon_exhibition.png" alt="icon_exhibition">
                            <div class="item-img-wrap">
                                <img src="${exhibitionThumb[i]}" alt="${exhibitionName[i]}">
                            </div>
                            <p class="item-exh-title">${exhibitionName[i]}</p>
                        </a>
                        <div class="item-text-wrap">
                            <p class="item-exh-artist ">
                                <span class="korean-name">${artistName[i]}</span>
<!--                                <span class="etc-number-of-artists">${artistCountText}</span>-->
                            </p>
                            <div class="exh-info-wrap">
                                <span class="exh-total-artwork">${artworksCount[i]}${artwork}</span>, <span class="exh-total-time">${durationTime[i]}</span>
                            </div>
                        </div>
                    </div>
                </div>`
                    container.appendChild(post);
                    showArtistNameWithLan();
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
        url:"/" + location.pathname.split('/')[1] + "/api/artstream/all?sortBy="+sortBy[sortNumber]+"&p="+pageNumber,
        method: "get",
        type: "json",
        data:{
        },
        success: function(result){
            exhibitionId = result['id'];
            exhibitionThumb = result['exhibitionThumb'];
            exhibitionName = result['exhibitionName'];
            durationTime = result['durationTime'];
            artistNationality = result['exhibitionArtistNationality'];
            // artistKorName = result['exhibitionArtistKorName'];
            // artistEngName = result['exhibitionArtistEngName'];
            artistName = result['exhibitionArtistName'];
            artistCount = result['artistCount'];
            artworksCount = result['artworksCount'];
            durationTime = result['durationTime']

            let sortedData=document.createElement('div');
            for(let i=0; i<12; i++){
                // if (artistCount[i] > 0){
                //     switch(location.pathname.split('/')[1]){
                //         case "ja" : artistCountText = ` ほか${artistCount[i]}名様です`; break;
                //         case "ko" : artistCountText = ` 외 ${artistCount[i]}명`; break;
                //         default : artistCountText =  ` and ${artistCount[i]} others`; break;
                //     }
                // }else{
                //     artistCountText = '';
                // }
                var post = document.createElement('div');
                post.className = 'contents-wrap-div';
                post.innerHTML = `
                    <div class="exh-item">
                        <a href="/` + location.pathname.split('/')[1]  + `/player?exh_id=${exhibitionId[i]}">
                            <div class="item-gradation"></div>
                            <img class="icon-exhibition" src="/img/icon_exhibition.png" alt="icon_exhibition">
                            <div class="item-img-wrap">
                                <img src="${exhibitionThumb[i]}" alt="${exhibitionName[i]}">
                            </div>
                            <p class="item-exh-title">${exhibitionName[i]}</p>
                        </a>
                        <div class="item-text-wrap">
                            <p class="item-exh-artist">
                                <span class="korean-name">${artistName[i]}</span>
                                // <span class="etc-number-of-artists">${artistCountText}</span>
                            </p>
                            <div class="exh-info-wrap">
                                <span class="exh-total-artwork">${artworksCount[i]}${artwork}</span>, <span class="exh-total-time">${durationTime[i]}</span>
                            </div>
                        </div>
                    </div>`
                sortedData.appendChild(post);
            }
            container.innerHTML= sortedData.innerHTML;
            showArtistNameWithLan();
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
