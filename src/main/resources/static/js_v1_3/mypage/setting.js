if(sessionStorage.getItem('languageChange')==='true'){
    toastPopup('success',saved);
    sessionStorage.setItem('languageChange',null);
}

//링크 이동 (서비스 내 이동)
let linkHref = (link) => {
    location.href = serverUrl + location.pathname.split('/')[1] + "/" + link;
}

//계정 비밀번호 변경 클릭시
const pwReset = (provider) => {
    if(provider.dataset.provider === 'General'){
        linkHref('mypage/password/reset');
    } else {
        modalOpen('modal-changed-pw');
    }
}

//마케팅 및 알림 수신 버튼 toggle
const receiveToggle = (self) => {
    let status = self.querySelector('span').innerText;
    status === doNotReceiveMarketing ? status = true : status = false;
    // console.log(status)
    //마케팅 및 알림 수신 통신
    $.ajax ({
        url: "/api/marketing",
        method: "POST",
        type: "json",
        data: {
            status: status
        },
        success: function(){
            // console.log("성공")
        },
        error: function (request) {
        }
    })

    //버튼 css 변화
    if(self.querySelector('.marketing-text').classList.contains('blue')){
        self.querySelector('.icon_confirm').style.display = 'none';
        self.querySelector('.marketing-text').classList.remove('blue');
        self.querySelector('.marketing-text').innerText = doNotReceiveMarketing;
    } else {
        self.querySelector('.icon_confirm').style.display = 'inline-block';
        self.querySelector('.marketing-text').classList.add('blue');
        self.querySelector('.marketing-text').innerText = receieveMarketing;
    }
}


//감상,검색 기록 전부 지우기
const removeAllHistory = (param) => {
    let apiUrl = '';
    //감상기록,검색기록에 따라 url 변경
    param === 'seen-artworks' ? apiUrl = '/api/seen-artworks/remove/all' : apiUrl = '/api/deleteHistory/all';

    //통신
    $.ajax ({
        url: apiUrl,
        method: "POST",
        type: "json",
        success: function(data){
            // console.log(data)
            // console.log("성공")
            document.querySelector('.watched-artworks-list').innerHTML = '';
        },
        error: function (request) {
        }
    })
}

//감상기록 개별 지우기
const deleteArtworkHistory = (self) => {
    //감상기록에서 삭제할 작품의 id값 필요
    let artworkId = self.parentElement.dataset.id;
    // console.log(artworkId)

    //통신
    $.ajax ({
        url: "/api/seen-artworks/remove",
        method: "POST",
        type: "json",
        data: {
            artworkId: artworkId
        },
        success: function(data){
            self.parentElement.remove();
        },
        error: function (request) {
        }
    })
}

//검색 기록 개별 지우기
const deleteSearchHistory = (self,keyword) => {
    // console.log(keyword);
    //통신
    $.ajax ({
        url: "/api/deleteHistory/keyword",
        method: "POST",
        type: "json",
        data: {
            keyword: keyword
        },
        success: function(data){
            // console.log(data)
            // console.log("성공")
            self.parentElement.remove();
        },
        error: function (request) {
        }
    })
}

//이름 입력 유효성검사
const checkName = (val) => {
    let regExp = new RegExp(/^[a-zA-z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]{2,16}$/);
    let spe = new RegExp(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

    //공백 유무, 특수문자 체크
    if(val.search(/\s/) === -1 && spe.test(val) === false){
        return regExp.test(val);
    }
}

//탈퇴사유 직접입력
const checkTextarea = (self) => {
    // console.log(self.value)
    // console.log(self.value.length)
    if(self.value.length > 1){
        colorToBlue(true,'btn_save');
    } else if(self.value.length < 2){
        document.getElementById('btn_save').classList.remove('blue');
        document.getElementById('btn_save').disabled = true;
    }

    let textarea = document.querySelector(".write-area");
    let textCount = document.querySelector(".number-of-text span.now-number-of-text");
    if(textarea){
        textarea.addEventListener("keyup", function() {
            textCount.innerHTML = this.value.length;
        });
    }
}

//생년월일 유효성검사
const checkBirth = (val) => {
    let regExp = new RegExp(/^[a-zA-z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]$/);
    let spe = new RegExp(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

    let date = new Date();
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let today = year + month + day;

    // inputData를 Date로 변환
    let inputData = val.split('');
    inputData.splice(4,0,'-')
    inputData.splice(7,0,'-')
    inputData = inputData.join('');
    let inputDate = new Date(Date.parse(inputData));
    let lastYear = (date.getTime() - inputDate.getTime())/(1000*3600*24*365);


    //한글, 영어, 특수문자, 띄어쓰기 안됨 && 8자 이상이어야 함 && 입력값이 오늘보다 미래면 안됨
    if(val.search(/\s/) === -1 && regExp.test(val) === false && spe.test(val) === false && val.length > 7
        && parseInt(today) > parseInt(val) && 14 < lastYear && lastYear < 120
    ){
        return true;
    }
}

//프로필 편집 - 모달에서 값 선택
const selectValue = (val, type) => {
    //value값을 받아 div값 변경
    document.getElementById('selected_value').innerText = val;
    document.getElementById('selected_value').style.color = '#0a0a0a';
    colorToBlue(true,'btn_save');
    slideModalClose();

    //탈퇴사유 - 그 외(직접입력)일때
    if(type === 'other'){
        let html =
          `<textarea placeholder="${reasonToWithdrawl}" class="write-area" maxlength="500" onkeyup="checkTextarea(this);"></textarea>
            <span class="number-of-text"><span class="now-number-of-text">0</span><span>/500</span></span>`
        document.getElementById('left_textarea').innerHTML = html;
        document.getElementById('btn_save').disabled = false;
        document.getElementById('btn_save').classList.remove('blue');
    } else if(type === 'left' && document.querySelectorAll('#left_textarea textarea').length > 0){
        document.getElementById('left_textarea').removeChild(document.getElementById('left_textarea').firstElementChild);
        document.getElementById('left_textarea').removeChild(document.getElementById('left_textarea').lastElementChild);
    } else {
        document.getElementById('btn_save').disabled = false;
        colorToBlue(true,'btn_save');
    }
}

//버튼 활성화 (설정)
function btnActivation (self,btn) {
    switch (self.type) {
        case 'text' :
            if(self.getAttribute('id') === 'code_input'){
                colorToBlue(self.value.length > 1, btn);
            } else {
                colorToBlue(checkName(self.value), btn);
            }
            break;
        case 'number':
            colorToBlue(checkBirth(self.value), btn);
            break;
    }
}

//프로필 편집 + 언어 변경
const editProfile = (ele, type) => {
    //이름, 생년월일, 성별, 국가에 따라  url 설정
    let content;
    switch (type){
        case 'name':
            content = document.getElementById('edit_username').value;
            $.ajax ({
                url: "/api/account-info-change",
                method: "POST",
                type: "json",
                data: {
                    name: content
                },
                success: function(data){
                    // console.log(data);
                    if(data === 1){
                        document.querySelector('.profile-name').innerText = content;
                        closeProfileEditModal();
                        toastPopup('success',saved);
                    }
                },
                error: function (request) {

                }
            })
            break;
        case 'birth':
            content = document.getElementById('edit_birth').value;
            let birth = content.slice(0,4) + '-' + content.slice(4,6) + '-' + content.slice(6,8);
            // console.log(birth)
            // console.log(typeof birth)
            $.ajax ({
                url: "/api/account-info-change",
                method: "POST",
                type: "json",
                data: {
                    birth: birth
                },
                success: function(data){
                    // console.log(data);
                    if(data === 1){
                        document.querySelector('.profile-birth').innerText = birth;
                        closeProfileEditModal();
                        toastPopup('success',saved);
                    }
                },
                error: function (request) {

                }
            })
            break;
        case 'gender':
            content = document.getElementById('selected_value').innerText;
            $.ajax ({
                url: "/api/account-info-change",
                method: "POST",
                type: "json",
                data: {
                    gender: content
                },
                success: function(data){
                    // console.log(data);
                    if(data === 1){
                        document.querySelector('.profile-gender').innerText = content;
                        closeProfileEditModal();
                        toastPopup('success',saved);
                    }
                },
                error: function (request) {

                }
            })
            break;
        case 'nationality':
            content = document.getElementById('selected_value').innerText;
            $.ajax ({
                url: "/api/account-info-change",
                method: "POST",
                type: "json",
                data: {
                    nationality: content
                },
                success: function(data){
                    // console.log(data);
                    if(data === 1){
                        document.querySelector('.profile-nationality').innerText = content;
                        closeProfileEditModal();
                        toastPopup('success',saved);
                    }
                },
                error: function (request) {

                }
            })
            break;
        case 'language':
            content = document.getElementById('selected_value').innerText;
            $.ajax ({
                url: "/api/account-info-change",
                method: "POST",
                type: "json",
                data: {
                    preferredLanguage: content
                },
                success: function(data){
                    // console.log(data);
                    if(data === 1){
                        // closeProfileEditModal();
                        sessionStorage.setItem('languageChange','true');
                        switch(content){
                            case('한국어'):
                                location.href = '/ko/mypage/setting';
                                break;
                            case('English'):
                                location.href = '/en/mypage/setting';
                                break;
                            case('日本語'):
                                location.href = '/ja/mypage/setting';
                                break;
                        }
                    }
                },
                error: function (request) {

                }
            })
            break;
    }
}

//프로필 편집 모달 닫기
const closeProfileEditModal = () => {
    document.getElementById('modal_profile_edit').innerHTML = '';
    $('header').css('display','block');
}

//프로필 편집 모달(사용자 이름, 생년월일, 성별, 국가) + 언어
const editProfileModal = (type) => {
    let apiUrl;
    switch (type){
        case 'name':
            apiUrl = '/' + location.pathname.split('/')[1] +  '/mypage/profile/name';
            break;
        case 'birth':
            apiUrl = '/' + location.pathname.split('/')[1] +  '/mypage/profile/birth';
            break;
        case 'gender':
            apiUrl = '/' + location.pathname.split('/')[1] +  '/mypage/profile/gender';
            break;
        case 'nationality':
            apiUrl = '/' + location.pathname.split('/')[1] +  '/mypage/profile/nation';
            break;
        case 'language':
            apiUrl = '/' + location.pathname.split('/')[1] +  '/mypage/language';
            break;
    }
    $.ajax ({
        url: apiUrl,
        method: "GET",
        type: "json",
        success: function(data){
            document.getElementById('modal_profile_edit').innerHTML = data;
            if(apiUrl === '/' + location.pathname.split('/')[1] +  '/mypage/language'){
                $('#selected_value').text() === 'Korean' ? $('#selected_value').text('한국어') : '';
            } else if(apiUrl === '/' + location.pathname.split('/')[1] +  '/mypage/profile/birth'){
                let birth = $('#birth_data').val();
                birth = birth.replaceAll('-','');
                $('#edit_birth').val(birth);
                $('header').css('display','none');
            } else if(apiUrl === '/' + location.pathname.split('/')[1] +  '/mypage/profile/nation'){
                sortNations()
                $('header').css('display','none');
            }else{
                $('header').css('display','none');
            }
        },
        error: function (request) {
        }
    })
}

//input에서 엔터버튼 클릭시 버튼이벤트 동작
document.getElementById('modal_profile_edit') && document.getElementById('modal_profile_edit').addEventListener('keydown',(event)=>{
    if(event.keyCode === 13) {
        document.getElementById('btn_save').click();
    }
})
//change header default home icon
function changeToModalHeader(){
    document.getElementById('btn_gnb').innerHTML = ` 
        <button type="button" id="btn_goback" class="btn-goback" onclick="closeProfileEditModal(); changeToCommonHeader(); hideNavMenu();">
            <img src="/img/icon_go_back.png" alt="icon_go_back">
        </button>`;
    // if(document.getElementById('btn_tv_connection')){
    //     document.getElementById('btn_tv_connection').style.display = 'none';
    // }
}

function checkNowSortingStandard(selector){
    let standard = selector.textContent.toString().trim();
    let standards = [];
    const confirmIcons = document.querySelectorAll('.select-option-box .icon-confirm');
    for(let i=0; i<confirmIcons.length; i++){
        confirmIcons[i].style.opacity = '0';
    }
    const standardsTag = document.querySelectorAll('.select-options .language');
    for(let j=0; j<standardsTag.length; j++){
        standards.push(standardsTag[j].textContent.trim());
    }
    let thisStandardIndex = standards.indexOf(standard);
    confirmIcons[thisStandardIndex].style.opacity = '1';
}

//프로필 편집일 경우 뒤로가기 버튼 아님
let pathNameList = location.pathname.split('/');
let lastPathName = pathNameList[pathNameList.length -1];
console.log(lastPathName.trim());
if(lastPathName.trim() === 'profile'){
    //TODO
    let targetLocation = `${location.href.split('/profile')[0]}/setting`;
    console.log(targetLocation);
    document.getElementById('btn_goback').setAttribute('onclick',`location.href='${targetLocation}'`);
}

function sortNations(){
    const list = document.getElementById("nations-list");
    const items = Array.from(list.querySelectorAll("li")).slice(3);
    items.sort((a, b) => a.textContent.localeCompare(b.textContent));
    items.forEach(item => list.appendChild(item));
}
