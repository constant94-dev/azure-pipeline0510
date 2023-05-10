//검색창 onkeyup 이벤트
function toggleModal(selector){
    if(selector.value.length > 0){
        document.querySelector('.recent-search-list-container').style.display = 'none';
        showModalSimply('#text_eraser');
    }else{
        if(document.querySelector('.recent-search')){
            document.querySelector('.recent-search-list-container').style.display = 'block';
        }
        closeModalSimply('#text_eraser');
    }
}
//검색창 x 버튼 클릭 이벤트
function clickTextEraser() {
    document.getElementById('text_eraser').addEventListener('click',function(){
        if(document.querySelector('.recent-search')){
            document.querySelector('.recent-search-list-container').style.display = 'block';
            document.querySelector('.recent-search-list-container').style.top = '80px';
            closeModalSimply('#text_eraser');
        }
    })
}
clickTextEraser();

//최근검색어 없을때 최근검색 안 보이게
function searchKeywordNone() {
    if(!document.querySelector('.recent-search')){
        document.querySelector('.recent-search-list-container').style.display = 'none';
    } else {
        document.querySelector('.recent-search-list-container').style.display = 'block';
    }
}
searchKeywordNone();

//스크롤 확인
document.querySelector('.search-wrap').addEventListener('scroll', function() {
    document.querySelector('.search-wrap').click();
});


function goFocus(selector){
    const target = document.querySelector(selector);
    target.focus();
}
function eraseTxt(selector){
    const target = document.querySelector(selector)
    target.value = '';
}
function changeText(selector, text){
    const targetSelector = document.querySelector(selector);
    targetSelector.textContent = text;
}
//enter 눌렀을 때 검색페이지로 이동
function searchKeyword(selector){
    const target = document.querySelector(selector).value;
    const pattern_spc =/[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/; // 특수문자 정규표현식(유효성 검사용)
    //유효성 검사 : 공백 금지, 특수문자 금지==
    if (target.trim(' ')==='') {
        toastPopup('error', inputSearchKeyword);
    }else if(pattern_spc.test(target)){
        toastPopup('error',symbolCantBeSearched);
    }else{
        location.href='/'+language+'/search-result?keyword='+target
    }
}
//최근 검색 기록 하나씩 지우기
function deleteSingleSearchKeyword(selector){
    const singleKeyword = selector.previousElementSibling.children.namedItem('single-keyword').value;
    const parentLi = selector.parentElement;
    $.ajax({
        url:"/api/deleteHistory/keyword",
        method: "POST",
        type: "json",
        data:{
            'keyword' : singleKeyword,
        },
        success: function(result){
            // console.log(result);
            parentLi.style.display = 'none';
        }
    });
}

//최근 검색 기록 모두 지우기
function deleteAllSearchKeyword(){
    const searchKeywordList = document.querySelector('.recent-search-list');
    const deleteAllButton = document.querySelector('.btn-delete-all');
    $.ajax({
        url:"/api/deleteHistory/all",
        method: "POST",
        type: "json",
        data:{
        },
        success: function(result){
            // console.log(result);
            searchKeywordList.style.display = 'none';
            deleteAllButton.style.display = 'none';
        }
    });
}
//이전 페이지 기억하기
function rememberHistory(){
    const previousPage = document.referrer;
    // console.log(previousPage);
}

function initSearch(){
    //enter 눌렀을 때 검색
    window.addEventListener("keydown", (e) => {
        if(e.keyCode===13){
            searchKeyword('#input_search')
        }
    });
    setTimeout(rememberHistory, 2000);
}
window.onload = function(){
    initSearch();
}
