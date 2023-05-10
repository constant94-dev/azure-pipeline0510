let prevTitle;
$( async function() {
    // await $( "#sortable" ).sortable();
    await $( "#sortable" ).sortable({
        connectWith: ".ui-sortable-handle",
        handle: ".btn-move",
        scroll: true,
        cancel: ".ui-state-default",
        helper: "clone",
        drag: function(event,ui){
            ui.helper.offset(ui.position);
        }
    });
    checkCollectionList()
} );

document.getElementById('collection_new_title').addEventListener('focus',()=>{
    document.getElementById('collection_new_title').style.opacity = '1';
})
document.getElementById('collection_new_title').addEventListener('keyup',()=>{
    document.getElementById('collection_new_title').style.opacity = '1';
})


//컬렉션 리스트 수정 검사
const checkCollectionList = () =>{
    console.log('checkcollection working?')
    let collectionList = document.querySelectorAll('#sortable li.selected-artwork .ui-sortable-handle');
    console.log(collectionList.length)
    for(let i = 0; i < collectionList.length; i ++) {
        console.log("here")
        collectionList[i].addEventListener('mousedown',
            () => {
                document.getElementById('btn_save').classList.add('blue');
                document.getElementById('btn_save').disabled = false;
            }
        )
    }
    document.getElementById('btn_select').addEventListener('click',function(){
        if(location.pathname !== '/'+  location.pathname.split('/')[1] + '/collection-new') {
            document.getElementById('btn_save').classList.add('blue');
            document.getElementById('btn_save').disabled = false;
        }
    })
}


//컬렉션이름 입력 유효성검사
const checkCollectionName = (val) => {
    // let regExp = new RegExp(/^[a-zA-z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]{2,16}$/);
    // let spe = new RegExp(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
    //공백 유무, 특수문자 체크
    // if(val.search(/\s/) === -1 && spe.test(val) === false){
        // console.log(regExp.test(val))
        // return regExp.test(val);
    // }
    const patternSpc =/[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/; // 특수문자 정규표현식(유효성 검사용)
    if (val.trim(' ') !=='' && !patternSpc.test(val)) {
        return !patternSpc.test(val);
    }
}

//버튼 활성화 (설정)
const btnActivation = (self,btn) => {
    colorToBlue(checkCollectionName(self.value), btn);
}

//x버튼 눌렀을 때 입력 중이던 것 없애는 함수
function eraseTxt(selector){
    const target = document.querySelector(selector)
    target.value = '';
    document.getElementById('btn_save').disabled = 'true';
    document.getElementById('btn_save').classList.remove('blue');
    document.getElementById('btn_erase').style.opacity = '0';
}

//삭제모드 클릭시 버튼 변화
const deleteToggle = () => {
    let mode = document.getElementById('delete_mode');
    if(mode.innerText === deleteMode){
        mode.innerText = deleteModeOff;
        document.querySelectorAll('.btn-move img').forEach((e)=>{
            e.setAttribute('src','/img/icon_delete.png');
            e.parentElement.classList.add('btn-delete');
        })
        if(document.querySelector('.remove-collection')){
            document.querySelector('.remove-collection').style.display = 'flex';
        }
        document.querySelector('.add-collection').style.display = 'none';
        document.getElementById('btn_save').innerText = saveChanges;
        document.getElementById('btn_save').classList.add('update');
    } else {
        mode.innerText = deleteMode;
        document.querySelectorAll('.btn-delete img').forEach((e)=>{
            e.setAttribute('src','/img/icon_change_sequence.png');
            e.parentElement.classList.remove('btn-delete');
            e.parentElement.parentElement.style.display = 'flex';
        })
        if(document.querySelector('.remove-collection')){
            document.querySelector('.remove-collection').style.display = 'none';
            document.getElementById('btn_save').innerText = saveChanges;
        } else {
            document.getElementById('btn_save').innerText = save;
        }
        document.querySelector('.add-collection').style.display = 'block';
        document.getElementById('btn_save').classList.remove('update');

        if(document.getElementById('sortable').querySelectorAll('li').length !== 0){
            document.querySelector('.selected-artworks-info').style.display = 'flex';
        }else{
            document.querySelector('.selected-artworks-info').style.display = 'none';
        }

    }
}

//컬렉션 내 작품 지우기
const deleteArtwork = (self) => {
    // console.log(self.classList.contains('btn-delete'))
    self.classList.contains('btn-delete') ? self.parentElement.remove() : '';
    let artworkTargetId = self.parentElement.dataset.id;
    // console.log(artworkTargetId)
    for(let i=0; i<addedList.length; i++){
        addedList[i].artworkId == artworkTargetId ? addedList.splice(i,1) : ''
    }
    let sortableLis = document.querySelectorAll('.collection-li');
    for(let j=0; j<sortableLis.length; j++){
        if(sortableLis[j].dataset.id === artworkTargetId){
            sortableLis[j].querySelector('.btn-img').setAttribute('src','/img/icon_check_inactive2.png');
            sortableLis[j].querySelector('.btn-img').setAttribute('alt','icon_check_inactive');
            sortableLis[j].querySelector('.recent-artworks').disabled = false;
            sortableLis[j].querySelector('.recent-artworks').classList.remove('disabled');
        }
    }
}

//다른 작품 더 추가하기 - 선택완료 활성화/비활성화
function activeBtn(){
    if(toggleCheckArray.length > 0){
        document.getElementById('btn_select').disabled = false;
        document.getElementById('btn_select').style.backgroundColor = '#2841fa';
    }else{
        document.getElementById('btn_select').disabled = true;
        document.getElementById('btn_select').style.backgroundColor = '#EBEBEB;';
    }
}
//최근에 감상한 작품 box
const lastSeenArtworksList = document.querySelectorAll('.recent-artworks-list')[0];
const favoriteArtworksList = document.querySelectorAll('.recent-artworks-list')[1];
//스크롤 할 때 마다 li 추가
window.addEventListener('scroll',function(){
    var scrollHeight = document.documentElement.scrollHeight;
    var scrollTop = document.documentElement.scrollTop;
    var clientHeight = document.documentElement.clientHeight;
    if( (scrollTop + clientHeight) > (scrollHeight - 1)){
        if(tabButtonNow === 'latest'){
            //최근에 감상한 작품 통신
            leftSeenArtworks > 0 ? getLastSeenArtworks() : console.log('')
        }else{
            //좋아한 작품 통신
            leftFavoriteArtworks > 0 ? getFavoriteArtworks() : console.log('')
        }
    }
});
let seenPageNumber = 1; //최근에 감상한 작품 page
let favoritePageNumber = 1; //좋아한 작품 page
let artistName;
let artworkId;
let artworkName;
let thumbnail;
let forCount;
let inCollection;
let leftSeenArtworks;
let seenArtworkSwitch = true;
let collectionId
let artistNationality
let artistKorName
let artistEngName
function getLastSeenArtworks(){
    collectionId = location.href.split('col_id=')[1]
    if(leftSeenArtworks > 0 || leftSeenArtworks === undefined ){
        $.ajax({
            url: "/" + location.pathname.split('/')[1] + "/api/last-seen-artworks",
            method:"post",
            data:{
                'page' : seenPageNumber,
                'collection' : collectionId
            },
            success:function (result){
                container = lastSeenArtworksList;
                artistNationality = result['artistNationality'];
                artistName = result['artistName'];
                // artistKorName = result['artistKorName'];
                // artistEngName = result['artistEngName'];
                artworkId = result['id'];
                inCollection = result['inCollection'];
                artworkName= result['name'];
                thumbnail= result['thumbnail'];
                if(seenArtworkSwitch){
                    leftSeenArtworks = artworkId.length;
                    if(leftSeenArtworks === 0){
                        lastSeenArtworksList.innerHTML = '';
                        var post = document.createElement('li');
                        post.innerHTML = `<p style="color:#f5f5f5; font-size:16px">${noSeenArtworks}</p>`;
                        container.appendChild(post);
                    }else{
                        leftSeenArtworks < 20 ? forCount = leftSeenArtworks : forCount = 20;
                        for(let i=0; i<forCount; i++) {
                            // if (artistNationality[i] === '대한민국' || artistNationality[i] === '한국') {
                            //     artistBracketName = '';
                            // }else{
                            //     artistBracketName = `(${artistEngName[i]})`;
                            // }
                            var post = document.createElement('li');
                            post.className = 'collection-li';
                            post.dataset.id = artworkId[i];
                            if(inCollection === null){
                                post.innerHTML =
                                    `<a class="recent-artworks" onclick="toggleCheckUI(this); toggleCheckArrayFunction('`+ artworkId[i] +`'); activeBtn(); makeNewCollectionArray(this, '`+ artworkId[i] +`')">
                                        <div class="artwork-info-wrap">
                                             <div class="recent-artworks-img-wrap">
                                            <img src="${thumbnail[i]}" alt="${artworkName[i]}">
                                        </div>
                                        <ul class="artwork-txt-info">
                                            <li class="artwork-name artwork-info">${artworkName[i]}</li>
                                            <li class="artist-name artwork-info">
                                                <span class="korean-name">${artistName[i]}</span>
                                                <input type="hidden" class="artist-nationality" name="artist-nationality" value="${artistNationality[i]}">
                                            </li>
                                        </ul>
                                    </div>
                                    <img class="btn-img" src="/img/icon_check_inactive2.png" alt="icon_check_inactive">
                                </a>`
                            }else{
                                if(inCollection[i]!==true){
                                    post.innerHTML =
                                        `<a class="recent-artworks" onclick="toggleCheckUI(this); toggleCheckArrayFunction('`+ artworkId[i] +`'); activeBtn(); makeNewCollectionArray(this, '`+ artworkId[i] +`')">
                                    <div class="artwork-info-wrap">
                                        <div class="recent-artworks-img-wrap">
                                            <img src="${thumbnail[i]}" alt="${artworkName[i]}">
                                        </div>
                                        <ul class="artwork-txt-info">
                                            <li class="artwork-name artwork-info">${artworkName[i]}</li>
                                            <li class="artist-name artwork-info"> 
                                                <span class="korean-name">${artistName[i]}</span>
                                                <input type="hidden" class="artist-nationality" name="artist-nationality" value="${artistNationality[i]}">
                                            </li>
                                        </ul>
                                    </div>
                                    <img class="btn-img" src="/img/icon_check_inactive2.png" alt="icon_check_inactive">
                                </a>`
                                }else{
                                    post.innerHTML =
                                        `<button class="recent-artworks disabled" onclick="toggleCheckUI(this); toggleCheckArrayFunction('`+ artworkId[i] +`'); activeBtn(); makeNewCollectionArray(this, '`+ artworkId[i] +`')" disabled>
                                            <div class="artwork-info-wrap">                                    
                                                <span class="recent-artworks-img-wrap">
                                                <span class="already-contained-text">담겨있음</span>
                                                    <img src="${thumbnail[i]}" alt="${artworkName[i]}">
                                                </span>
                                                <span class="artwork-txt-info">
                                                    <span class="artwork-name artwork-info">${artworkName[i]}</span>
                                                    <span class="artist-name artwork-info">
                                                        <span class="korean-name">${artistName[i]}</span>
                                                        <input type="hidden" class="artist-nationality" name="artist-nationality" value="${artistNationality[i]}">
                                                    </span>
                                                </span>
                                            </div>
                                        <img class="btn-img" src="/img/icon_check_inactive2.png" alt="icon_check_inactive">
                                    </button>`
                                }
                            }

                            container.appendChild(post);
                            showArtistNameWithLan();
                            leftSeenArtworks > 20 ? leftSeenArtworks = leftSeenArtworks-20 : leftSeenArtworks = 0;
                        }
                    }
                    seenArtworkSwitch = false;
                }else{
                    if(leftSeenArtworks !== 0){
                        leftSeenArtworks < 20 ? forCount = leftSeenArtworks : forCount = 20;
                        for(let i=0; i<forCount; i++) {
                            var post = document.createElement('li');
                            post.className = 'collection-li';
                            post.dataset.id = artworkId[i];
                            post.innerHTML =
                                `<a class="recent-artworks" onclick="toggleCheckUI(this); toggleCheckArrayFunction('`+ artworkId[i] +`'); activeBtn(); makeNewCollectionArray(this, '`+ artworkId[i] +`')">
                                    <div class="artwork-info-wrap">
                                        <div class="recent-artworks-img-wrap">
                                            <img src="${thumbnail[i]}" alt="${artworkName[i]}">
                                        </div>
                                        <ul class="artwork-txt-info">
                                            <li class="artwork-name artwork-info">${artworkName[i]}</li>
                                            <li class="artist-name artwork-info">
                                                <span class="korean-name">${artistName[i]}</span>
                                                <input type="hidden" class="artist-nationality" name="artist-nationality" value="${artistNationality[i]}">
                                            </li>
                                        </ul>   
                                    </div>
                                    <img class="btn-img" src="/img/icon_check_inactive2.png" alt="icon_check_inactive">
                                </a>`
                            container.appendChild(post);
                            leftSeenArtworks > 20 ? leftSeenArtworks = leftSeenArtworks-20 : leftSeenArtworks = 0;
                            showArtistNameWithLan();
                        }
                    }

                }
            }
        })
        seenPageNumber = seenPageNumber + 1;
    }
}
let leftFavoriteArtworks;
let favoriteArtworkSwitch = true;
function getFavoriteArtworks(initOrNot={}){
    collectionId = location.href.split('col_id=')[1]
    if(leftFavoriteArtworks > 0 || leftFavoriteArtworks === undefined ){
        $.ajax({
            url: "/" + location.pathname.split('/')[1] + "/api/liked-artworks",
            method:"post",
            data:{
                'page' : favoritePageNumber,
                'collection' : collectionId
            },
            success:function (result){
                container = favoriteArtworksList;
                artistNationality = result['artistNationality'];
                artistName = result['artistName'];
                // artistKorName = result['artistKorName'];
                // artistEngName = result['artistEngName'];
                artworkId = result['id'];
                inCollection = result['inCollection'];
                artworkName= result['name'];
                thumbnail= result['thumbnail'];
                if(favoriteArtworkSwitch){
                    leftFavoriteArtworks = artworkId.length;
                    if(leftFavoriteArtworks === 0){
                        favoriteArtworksList.innerHTML = '';
                        var post = document.createElement('li');
                        post.innerHTML = `<p style="color:#f5f5f5; font-size:16px">${noLikedArtworks}</p>`;
                        container.appendChild(post);
                    }else{
                        leftFavoriteArtworks < 20 ? forCount = leftFavoriteArtworks : forCount = 20;
                        for (let j = 0; j < forCount; j++) {
                            // if (artistNationality[j] === '대한민국' || artistNationality[j] === '한국') {
                            //     artistBracketName = '';
                            // }else{
                            //     artistBracketName = `(${artistEngName[j]})`;
                            // }
                            var post = document.createElement('li');
                            post.className = 'collection-li';
                            post.dataset.id = artworkId[j];
                            if(inCollection === null){
                                post.innerHTML =
                                    `<a class="recent-artworks" onclick="toggleCheckUI(this); toggleCheckArrayFunction('` + artworkId[j] + `'); activeBtn(); makeNewCollectionArray(this, '` + artworkId[j] + `')">
                                        <div class="artwork-info-wrap">
                                              <div class="recent-artworks-img-wrap">
                                                <img src="${thumbnail[j]}" alt="${artworkName[j]}">
                                            </div>
                                            <ul class="artwork-txt-info">
                                                <li class="artwork-name artwork-info">${artworkName[j]}</li>
                                                <li class="artist-name artwork-info">
                                                    <span class="korean-name">${artistName[j]}</span>
                                                    <input type="hidden" class="artist-nationality" name="artist-nationality" value="${artistNationality[j]}">
                                                </li>
                                            </ul>
                                        </div>
                                        <img class="btn-img" src="/img/icon_check_inactive2.png" alt="icon_check_inactive">
                                    </a>`
                            }else{
                                if(inCollection[j]!==true){
                                    post.innerHTML =
                                        `<a class="recent-artworks" onclick="toggleCheckUI(this); toggleCheckArrayFunction('` + artworkId[j] + `'); activeBtn(); makeNewCollectionArray(this, '` + artworkId[j] + `')">
                                <div class="artwork-info-wrap">
                                    <div class="recent-artworks-img-wrap">
                                        <img src="${thumbnail[j]}" alt="${artworkName[j]}">
                                    </div>
                                    <ul class="artwork-txt-info">
                                        <li class="artwork-name artwork-info">${artworkName[j]}</li>
                                        <li class="artist-name artwork-info">
                                            <span class="korean-name">${artistName[j]}</span>
                                            <input type="hidden" class="artist-nationality" name="artist-nationality" value="${artistNationality[j]}">
                                        </li>
                                    </ul>
                                </div>
                                <img class="btn-img" src="/img/icon_check_inactive2.png" alt="icon_check_inactive">
                            </a>`
                                }else{
                                    post.innerHTML =
                                        `<button class="recent-artworks disabled" onclick="toggleCheckUI(this); toggleCheckArrayFunction('` + artworkId[j] + `'); activeBtn(); makeNewCollectionArray(this, '` + artworkId[j] + `')" disabled>
                                <div class="artwork-info-wrap">     
                                    <span class="recent-artworks-img-wrap">
                                        <span class="already-contained-text">담겨있음</span>
                                        <img src="${thumbnail[j]}" alt="${artworkName[j]}">
                                    </span>
                                    <span class="artwork-txt-info">
                                        <span class="artwork-name artwork-info">${artworkName[j]}</span>
                                        <span class="artist-name artwork-info">
                                            <span class="korean-name">${artistName[j]}</span>
                                            <input type="hidden" class="artist-nationality" name="artist-nationality" value="${artistNationality[j]}">
                                        </span>
                                    </span>
                                </div>
                                <img class="btn-img" src="/img/icon_check_inactive2.png" alt="icon_check_inactive">
                            </button>`
                                }
                            }
                            container.appendChild(post);
                            showArtistNameWithLan();
                            leftFavoriteArtworks > 20 ? leftFavoriteArtworks = leftFavoriteArtworks-20 : leftFavoriteArtworks = 0;
                        }
                    }
                    favoriteArtworkSwitch = false;
                }else{
                    if(leftFavoriteArtworks !== 0){
                        leftFavoriteArtworks < 20 ? forCount = leftFavoriteArtworks : forCount = 20;
                        for (let j = 0; j < forCount; j++) {
                            var post = document.createElement('li');
                            post.className = 'collection-li';
                            post.dataset.id = artworkId[j];
                            post.innerHTML =
                                `<a class="recent-artworks" onclick="toggleCheckUI(this); toggleCheckArrayFunction('` + artworkId[j] + `'); activeBtn(); makeNewCollectionArray(this, '` + artworkId[j] + `')">
                <div class="artwork-info-wrap">
                       <div class="recent-artworks-img-wrap">
                        <img src="${thumbnail[j]}" alt="${artworkName[j]}">
                    </div>
                    <ul class="artwork-txt-info">
                        <li class="artwork-name artwork-info">${artworkName[j]}</li>
                        <li class="artist-name artwork-info">
                            <span class="korean-name">${artistName[j]}</span>
                            <input type="hidden" class="artist-nationality" name="artist-nationality" value="${artistNationality[j]}">
                        </li>
                    </ul>
                </div>
                <img class="btn-img" src="/img/icon_check_inactive2.png" alt="icon_check_inactive">
            </a>`
                            container.appendChild(post);
                            showArtistNameWithLan();
                            leftFavoriteArtworks > 20 ? leftFavoriteArtworks = leftFavoriteArtworks-20 : leftFavoriteArtworks = 0;
                        }

                    }

                }
            }
        })
        favoritePageNumber = favoritePageNumber + 1;
    }
}
getLastSeenArtworks();
getFavoriteArtworks();
//다른 작품 더 추천하기 > 탭메뉴 클릭 시 통신 및 ui 동작
let tabButtonNow = 'latest'; //tab스위치. latest 또는 favorite
const otherArtworksSort = (self) => {
    //탭메뉴 클릭 시 해당 메뉴에 하이라이트됨
    const tabList = document.querySelector('.artwork-nav');
    const tabMenus = tabList.querySelectorAll('li');
    for(let i=0; i<tabMenus.length; i++){
        tabMenus[i].classList.remove('blue');
    }
    self.parentElement.classList.add('blue');
    //선택한 탭 메뉴에 따라 ui 변경해주고 통신
    switch (self.innerText){
        case lastSeenArtworks:
            tabButtonNow = 'latest';
            lastSeenArtworksList.style.display = 'block';
            favoriteArtworksList.style.display = 'none';
            break;
        case likedArtworks:
            tabButtonNow = 'favorite';
            favoriteArtworksList.style.display = 'block';
            lastSeenArtworksList.style.display = 'none';
            break;
    }
}


//다른 작품 더 추가하기 클릭
let firstClickSwitch = true;
const otherArtworksToggle = (val) => {
    switch (val){
        case '추가':
            document.querySelector('.collection-edit-section').style.display = 'none';
            document.querySelector('.collection-add-section').style.display = 'block';
            document.getElementById('btn_goback').style.opacity = '1';
            document.getElementById('btn_goback').disable = 'false';
            document.getElementById('btn_cancel').style.opacity = '0';
            document.getElementById('btn_cancel').disable = 'true';
            break;
        case '취소':
            document.querySelector('.collection-edit-section').style.display = 'block';
            document.querySelector('.collection-add-section').style.display = 'none';
            document.getElementById('btn_goback').style.opacity = '0';
            document.getElementById('btn_goback').disable = 'true';
            document.getElementById('btn_cancel').style.opacity = '1';
            document.getElementById('btn_cancel').disable = 'false';
    }
    if(firstClickSwitch === true){
        document.querySelectorAll('.recent-artworks-list')[0].style.display = 'block'
        firstClickSwitch = false;
    }
}
//최근 감상한 작품 불러오기

//다른 작품 더 추가하기 - 작품선택
const checkBox = (el) => {
    if (el.checked) {
        el.previousElementSibling.classList.add('active');
        //체크박스가 한개 이상 선택됐을 때 버튼 활설화
        colorToBlue(true, 'btn_select');
    } else {
        el.previousElementSibling.classList.remove('active');
        //체크박스가 선택되지 않았을 때 버튼 비활성화
        colorToBlue(false, 'btn_select');
    }
}

//완료, 저장, 변경사항 저장 버튼 처리
const btnEventClassification = (self) => {
    switch (self.value){
        case saveChanges:
            editCollection(self);
            break;
        case save:
            saveNewCollection(self);
            break;
        case complete:
            document.getElementById('btn_save').innerText = saveChanges;
            break;
    }
}
//addedList에 값 넣어주기
var addedList = [] ;
function makeNewCollectionArray(selector, artworkId){
    var data = {} ;
    data.artworkId = artworkId;
    artistNationality = selector.querySelector('.artist-nationality').value;
    data.artistName = selector.querySelector('.korean-name').innerText.trim();
    // data.artistKorName = selector.querySelector('.korean-name').innerText.trim();
    // data.artistEngName = selector.querySelector('.english-name').innerText.trim();
    // if (artistNationality === '대한민국' || artistNationality === '한국'){
    //     data.artistBracketName = `(${selector.querySelector('.english-name').innerText.trim()})`
    // }else{
    //     data.artistBracketName = '';
    // }
    data.artworkName= selector.querySelector('.artwork-name').innerText.trim();
    data.thumbnail= selector.querySelector('img').getAttribute('src');
    let toggle = selector.querySelector('.btn-img').getAttribute('alt');
    if(toggle === 'icon_check_active'){
        addedList.push(data) ;
    }else{
        for(let i=0; i<addedList.length; i++){
            addedList[i].artworkId == artworkId ? addedList.splice(i,1) : ''
        }
    }
}
//addedList 배열에 넣어주고 컬렉션 편집 메인 화면에 뿌려주기
function addToNewCollectionList(){
    //중복되는 작품 삭제
    addedList = addedList.filter((thing, index) => {
        const _thing = JSON.stringify(thing);
        return index === addedList.findIndex(obj => {
            return JSON.stringify(obj) === _thing;
        });
    });
    console.log(addedList)
    container = document.querySelector('.selected-artworks-list');
    container.innerHTML = '';
    for (let j = 0; j < addedList.length; j++) {
        var post = document.createElement('li');
        post.className = 'selected-artwork';
        post.dataset.id = addedList[j].artworkId;
        post.innerHTML =
            `<a class="ui-state-default selected-artworks" onclick="">
                    <div class="selected-artworks-img-wrap">
                        <img src="${addedList[j].thumbnail}" alt="${addedList[j].artworkName}">
                    </div>
                <ul class="artwork-txt-info">
                    <li class="artwork-name artwork-info">${addedList[j].artworkName}</li>
                    <li class="artist-name artwork-info">
                        <span class="korean-name">${addedList[j].artistName}</span>
                    </li>
                </ul>
            </a>
                <a class="btn-move" onclick="deleteArtwork(this)">
                    <img src="/img/icon_change_sequence.png" alt="icon_change_sequence">
                </a>`
        container.appendChild(post);
        showArtistNameWithLan();
    }
    document.querySelector('.selected-artworks-info').style.display = 'flex';
}

function toggleEraseBtn(selector){
    if(selector.value.length > 0){
        document.getElementById('btn_erase').style.opacity = '1';
    }else{
        document.getElementById('btn_erase').style.opacity = '0';
    }
}

