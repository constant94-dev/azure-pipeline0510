//새 컬렉션 만들기 - 저장버튼 클릭시
const saveNewCollection = () => {
    //console.log('hello!!!');
    //필요값: 컬렉션 이름(필수), 담긴 작품(선택)
    let title = document.getElementById('collection_new_title').value;
    if(title == ''){
        alert(noTitle)
        return false;
    }
    if(!checkName(title)){
        alert(specialNotAllowed)
        return false;
    }
    let artworkArr = [];
    document.querySelectorAll('.selected-artwork').forEach((e)=>{
        artworkArr.push(e.dataset.id);
    })
    //console.log(title, artworkArr, '새컬렉션 만들기')
    $.ajax({
        url:'/api/collection/create',
        method: "POST",
        type: "json",
        data: {
            'name' : title,
            'artIds' : artworkArr
        },
        success: function(result){
            if(result == -1){
                toastPopup('normal',tooManyCollections)
            }else if(result == -2){
                toastPopup('normal',collectionExist)
            }else if(result == 0){
                modalPopup('modal-error');
            }else{
                sessionStorage.setItem('sessionForCollection','create');
                location.href = '/' + location.pathname.split('/')[1] + "/mypage"
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
const checkName = (val) => {
    let regExp = new RegExp(/^[a-zA-z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]{2,16}$/);
    let spe = new RegExp(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

    //공백 유무, 특수문자 체크
    if(val.search(/\s/) === -1 && spe.test(val) === false){
        return regExp.test(val);
    }
}
