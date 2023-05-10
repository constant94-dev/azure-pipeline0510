let currentCollectionName;
//처음 타임리프로 받아온 artwork 들을 addedList에 담아주는 함수
function initEditCollection(){
    addedList = [];
    artworkList = document.querySelectorAll('.selected-artwork');
    prevTitle = document.getElementById('collection_new_title').value;
    for(let i=0; i<artworkList.length; i++){
        var data = {} ;
        data.artworkId = artworkList[i].dataset.id;
        artistNationality = artworkList[i].querySelector('.artist-nationality').value;
        data.artistName = artworkList[i].querySelector('.korean-name').innerText.trim();
        // data.artistKorName = artworkList[i].querySelector('.korean-name').innerText.trim();
        // data.artistEngName = artworkList[i].querySelector('.english-name').innerText.trim();
        // if (artistNationality === '대한민국' || artistNationality === '한국'){
        //     data.artistBracketName = `(${artworkList[i].querySelector('.english-name').innerText.trim()})`
        // }else{
        //     data.artistBracketName = '';
        // }
        data.artworkName= artworkList[i].querySelector('.artwork-name').innerText.trim();
        data.thumbnail= artworkList[i].querySelector('img').getAttribute('src')
        addedList.push(data) ;
    }
    if(document.getElementById('sortable').querySelectorAll('li').length !== 0){
        document.querySelector('.selected-artworks-info').style.display = 'flex';
    }else{
        document.querySelector('.selected-artworks-info').style.display = 'none';
    }
}

//새 컬렉션 만들기 - 저장버튼 클릭시
const editCollection = () => {
    //필요값: 컬렉션 이름(필수), 담긴 작품(선택)
    let title = document.getElementById('collection_new_title').value;
    let artworkArr = [];
    document.querySelectorAll('.selected-artwork').forEach((e)=>{
        artworkArr.push(e.dataset.id);
    })
    if(title == ''){
        alert(noTitle)
        return false;
    }
    if(title === prevTitle){
        title = null;
    }
    $.ajax({
        url:'/api/collection/edit',
        method: "POST",
        type: "json",
        data: {
            'previousName' : prevTitle,
            'name' : title,
            'artIds' : artworkArr
        },
        success: function(result){
            if(result === 1){
                sessionStorage.setItem('sessionForCollection','create');
                if(document.referrer !== ''){
                    location.href = document.referrer;
                }else{
                    sessionStorage.setItem('sessionForCollection', undefined);
                    history.back();
                }
            } else {
                modalPopup('modal-error');
            }
        },
        error: function (request) {
            if(request === -2){
                modalPopup('modal-error');
            }
            return false
        }
    })
}

//컬렉션 삭제하기
const deleteCollection = () => {
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

initEditCollection();