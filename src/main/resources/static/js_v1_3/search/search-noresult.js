//init 함수
function initSearchResult(){
    const input = document.getElementById('input_search');
    const keyword = document.getElementById('searched_keyword').innerText;
    input.value = keyword;
    goFocus('#input_search');
}
//검색창 onkeyup 이벤트
function toggleModal(selector){
    if(selector.value.length > 0){
        showModalSimply('#text_eraser');
    }else{
        closeModalSimply('#text_eraser');
    }
}
//포커스 보내주는 함수
function goFocus(selector){
    const target = document.querySelector(selector);
    target.focus();
}
//text 바꿔주는 함수
function changeText(selector, txt){
    const target = document.querySelector(selector);
    target.innerText = txt;
}
//enter 눌렀을 때 검색페이지로 이동
function searchKeyword(selector){
    const target = document.querySelector(selector).value;
    const pattern_spc =/[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/; // 특수문자 정규표현식(유효성 검사용)
    //유효성 검사 : 공백 금지, 특수문자 금지==
    if (target.trim(' ')==='') {
        toastPopup('error', '검색어를 입력해주세요.');
        // location.href = `/search`
    }else if(pattern_spc.test(target)){
        toastPopup('error','특수문자는 검색할 수 없습니다.');
        // location.href=`/search`
    }else{
        location.href='/'+language+`/search-result?keyword=${target}`
    }
}
window.addEventListener("keydown", (e) => {
    if(e.keyCode===13){
        searchKeyword('#input_search')
    }
});
initSearchResult();