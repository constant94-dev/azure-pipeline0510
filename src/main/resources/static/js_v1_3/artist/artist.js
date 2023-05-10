//artist nation과 artist english name을 가져와야 함 (.korean-name, .bracket-english-name, .english-name)

//변수 모음
let artistId;
let artistThumbnail;
let artistName;
let likeCount;
let artistNationality;

//=======================infinite scroll==============================
let pageNumber = 2;
let sortNumber = 0;
let artistLoading;
let container = document.querySelector('.contents-wrap');
let scrolled = false;


function getAllArtistData(){
    $.ajax({
        url:"/" + location.pathname.split('/')[1] + "/api/artists?page="+pageNumber+"&sortBy="+sortBy[sortNumber],
        method: "POST",
        type: "json",
        data:{
        },
        success: function(result){
            if(result['id'].length !== 0){
                artistId = result['id'];
                artistThumbnail = result['profileImg'];
                // artistKorName = result['korName'];
                // artistEngName = result['engName'];
                artistName = result['name'];
                artistNationality = result['nationality'];
                likeCount = result['numberOfLikes'];
                let forCount;
                if(artistId.length < 20){
                    forCount = artistId.length
                }else{
                    forCount = 20;
                }
                for(let i=0; i<forCount; i++){
                    // if (artistNationality[i] === '대한민국' || artistNationality[i] === '한국') {
                    //     artistBracketName = '';
                    // }else{
                    //     artistBracketName = `(${artistEngName[i]})`;
                    // }
                    let post = document.createElement('div');
                    post.className = 'artist-item';
                    post.innerHTML = `
                    <a href="` + "/"  + location.pathname.split('/')[1] + `/artists/detail?artist_id=` + artistId[i] + `">
                        <div class="item-img-wrap">
                            <img src="` + artistThumbnail[i] + `" alt="`+ artistName[i] +`">
                        </div>
                        <p class="artist-name">
                            <span class="korean-name">${artistName[i]}</span>
                        </p>
                    </a>`
                    container.appendChild(post);
                    showArtistNameWithLan();
                }
            } else {
                $('.loading').css('display','none');
                artistLoading = 'end';
            }
            pageNumber = pageNumber + 1;
            scrolled = false;
        }
    });
}
//=======================infinite scroll==============================

//========================sorting=====================================
let sortBy = ['최신순','인기순','가나다순','공유순']
function sortArtists(option){
    pageNumber = 1;
    artistLoading = 'true';
    $('.loading').css('display','block');
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
        url: "/" + location.pathname.split('/')[1] + "/api/artists?page="+pageNumber+"&sortBy="+sortBy[sortNumber],
        method: "POST",
        type: "json",
        data:{
        },
        success: function(result){
            artistId = result['id']
            artistThumbnail = result['profileImg']
            // artistKorName = result['korName'];
            // artistEngName = result['engName'];
            artistName = result['name'];
            artistNationality = result['nationality'];
            likeCount = result['numberOfLikes']
            // console.log(result);
            let sortedData=document.createElement('div');
            for(let i=0; i<artistId.length; i++){
                // if (artistNationality[i] === '대한민국' || artistNationality[i] === '한국') {
                //     artistBracketName = '';
                // }else{
                //     artistBracketName = `(${artistEngName[i]})`;
                // }
                let post = document.createElement('div');
                post.className = 'artist-item';
                post.innerHTML = `
                    <a href="` + "/"  + location.pathname.split('/')[1] + `/artists/detail?artist_id=` + artistId[i] + `">
                        <div class="item-img-wrap">
                            <img src="` + artistThumbnail[i] + `" alt="`+ artistName[i] +`">
                        </div>
                        <p class="artist-name">
                            <span class="korean-name">${artistName[i]}</span>
                        </p>
                    </a>`
                sortedData.appendChild(post);
            }
            container.innerHTML = sortedData.innerHTML;
            showArtistNameWithLan();
            pageNumber = pageNumber + 1;
        }
    });
}
function checkNowSortingStandard(selector){
    let standard = selector.textContent.toString().trim();
    let standards = [];
    const confirmIcons = document.querySelectorAll('.sorting-options .icon-confirm');
    for(let i=0; i<confirmIcons.length; i++){
        confirmIcons[i].style.opacity = '0';
    }
    const standardsTag = document.querySelectorAll('#sorting_options .sort-standard-text');
    for(let j=0; j<standardsTag.length; j++){
        standards.push(standardsTag[j].textContent.trim());
    }
    // const standards = ['최신순','인기순','가나다순','공유순'];
    let thisStandardIndex = standards.indexOf(standard);
    confirmIcons[thisStandardIndex].style.opacity = '1';
}
//========================sorting=====================================

// email copy modal popup
if(document.querySelectorAll('.cta-button').length>0){
    document.querySelector('.cta-button').onclick = function (){
        toastPopup('normal',emailCopied);
        const copyElement = document.createElement("textarea");
        document.body.appendChild(copyElement);
        copyElement.value = "artist@patron.digital";
        copyElement.select();
        document.execCommand('copy');
        document.body.removeChild(copyElement);
    }
}

// console.log('artist')
window.addEventListener('scroll',function(){
    console.log('scrooleed ')
    let scrollHeight = document.documentElement.scrollHeight;
    let scrollTop = document.documentElement.scrollTop;
    let clientHeight = document.documentElement.clientHeight;
    if( (scrollTop + clientHeight) > (scrollHeight - 100) && artistLoading !== 'end' && !scrolled){
        scrolled = true;
        getAllArtistData();
    }
});

