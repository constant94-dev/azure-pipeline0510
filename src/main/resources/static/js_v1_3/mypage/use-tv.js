function moveLeft(selector, num){
    const target = document.getElementById(selector);
    let scrollLeftNow;
    scrollLeftNow = target.scrollLeft;
    target.scrollLeft = scrollLeftNow + num ;
}
//tv 이용방법 페이지 탭 버튼 클릭
const useTv = (tv) => {
    let contents = document.getElementById('use_tv_contents');

    switch (tv){
        case 'SAMSUNG':
            document.querySelector('.nav-samsung').classList.add('blue');
            document.querySelector('.nav-lg').classList.remove('blue');
            document.querySelector('.nav-chromecast').classList.remove('blue');
            document.querySelector('.nav-kt').classList.remove('blue');
            contents.innerHTML =
                `${samsungDescription}
<!--                <p class="use-tv-guide">-->
<!--                        삼성 QLED TV에서 파트론을 실행하려면<br>TV홈 화면에서 시작하여 아래 단계를 따르세요.-->
<!--                    </p>-->
<!--                    <ul class="use-tv-info">-->
<!--                        <li><span class="numbering">1.</span><span>TV 홈 화면에서 <strong>Apps<i class="icon_apps_btn"></i></strong> 로 이동합니다.<br><br></span></li>-->
<!--                        <li><span class="numbering">2.</span><span>진입한 화면에서 오른쪽 상단의<br><strong>검색 아이콘<i class="icon_search_btn"></i></strong>을 선택합니다.<br><br></span></li>-->
<!--                        <li><span class="numbering">3.</span><span><strong>검색창에 "patron"을 입력</strong>한 후 결과에서<br>앱을 선택합니다.<br><br></span></li>-->
<!--                        <li><span class="numbering">4.</span><span><strong>설치 버튼</strong>을 선택하여 앱을 설치합니다.<br><br></span></li>-->
<!--                        <li><span class="numbering">5.</span><span>TV 홈 화면에서 <strong>Patron 앱</strong>을 실햅합니다.<br><br></span></li>-->
<!--                        <li><span class="numbering">6.</span><span>휴대폰으로 화면에 보이는 <strong>QR코드<i class="icon_code"></i></strong> 를<br>스캔하여 로그인 합니다.<br><br></span></li>-->
<!--                    </ul>-->
<!--                    <div class="use-tv-reference">-->
<!--                        <div>-->
<!--                            <strong class="text-min-box">참고</strong>-->
<!--                            <p>-->
<!--                                2018년도부터 출시된 모든 QLED TV에서<br>파트론을 만나볼 수 있습니다. Tizen 4.0 이상-->
<!--                            </p>-->
<!--                        </div>-->
<!--                    </div>-->
                `
            moveLeft('use_tv_nav', -1500)
            break;
        case 'LG':
            document.querySelector('.nav-samsung').classList.remove('blue');
            document.querySelector('.nav-lg').classList.add('blue');
            document.querySelector('.nav-chromecast').classList.remove('blue');
            document.querySelector('.nav-kt').classList.remove('blue');
            contents.innerHTML =
                `${lgDescription}
<!--                <p class="use-tv-guide">-->
<!--                        LG OLED TV에서 파트론을 실행하려면<br>TV홈 화면에서 시작하여 아래 단계를 따르세요.-->
<!--                    </p>-->
<!--                    <ul class="use-tv-info">-->
<!--                        <li><span class="numbering">1.</span><span>TV홈 화면에서 <strong>LG 콘텐츠 스토어<i class="icon_apps_btn"></i></strong> 로 이동합니다.<br><br></span></li>-->
<!--                        <li><span class="numbering">2.</span><span>진입한 스토어 화면에서<br>오른쪽 상단 메뉴 중 <strong>앱<i class="icon_LG_apps"></i></strong> 을 선택합니다.<br><br></span></li>-->
<!--                        <li><span class="numbering">3.</span><span>진입한 화면에서 오른쪽 상단의<br><strong>검색 아이콘 <i class="icon_search_btn"></i></strong> 을 선택합니다.<br><br></span></li>-->
<!--                        <li><span class="numbering">4.</span><span><strong>검색창에 "patron"을 입력</strong>한 후 결과에서<br>앱을 선택합니다.<br><br></span></li>-->
<!--                        <li><span class="numbering">5.</span><span><strong>설치 버튼</strong> 을 선택하여 앱을 설치합니다.<br><br></span></li>-->
<!--                        <li><span class="numbering">6.</span><span>TV 홈 화면에서 <strong>Patron 앱</strong>을 실행합니다.<br><br></span></li>-->
<!--                        <li><span class="numbering">7.</span><span>휴대폰으로 화면에 보이는 <strong>QR코드<i class="icon_code"></i></strong> 를<br>스캔하여 로그인 합니다.<br><br></span></li>-->
<!--                    </ul>-->
<!--                    <div class="use-tv-reference">-->
<!--                        <div>-->
<!--                            <strong class="text-min-box">참고</strong>-->
<!--                            <p>-->
<!--                                2018년도부터 출시된 모든 OLED TV에서<br>파트론을 만나볼 수 있습니다. webOS 4.0 이상-->
<!--                            </p>-->
<!--                        </div>-->
<!--                    </div>-->
                `
            moveLeft('use_tv_nav', -1500)
            break;
        case 'CHROMECAST':
            document.querySelector('.nav-samsung').classList.remove('blue');
            document.querySelector('.nav-lg').classList.remove('blue');
            document.querySelector('.nav-chromecast').classList.add('blue');
            document.querySelector('.nav-kt').classList.remove('blue');
            contents.innerHTML =
                `${chromecastDescription}
<!--                <p class="use-tv-guide">-->
<!--                        크롬캐스트(Google TV)에서 파트론을 실행하려면<br>TV 홈 화면에서 아래 단계를 따르세요.-->
<!--                    </p>-->
<!--                    <ul class="use-tv-info">-->
<!--                        <li><span class="numbering">1.</span><span>TV 홈 화면의 상단메뉴 중 <strong>앱</strong>으로 이동합니다.<br><br></span></li>-->
<!--                        <li><span class="numbering">2.</span><span>진입한 화면에서 화면 하단의 <strong>앱 및 게임 검색</strong>을<br>선택합니다.<br><br></span></li>-->
<!--                        <li><span class="numbering">3.</span><span><strong>검색창에 “patron”을 입력</strong>한 후 결과에서<br>앱을 선택합니다.<br><br></span></li>-->
<!--                        <li><span class="numbering">4.</span><span><strong>설치 버튼</strong>을 선택하여 앱을 설치합니다.<br><br></span></li>-->
<!--                        <li><span class="numbering">5.</span><span>TV 홈 화면 또는 내 앱에서<br><strong>Patron 앱</strong>을 실행합니다.<br><br></span></li>-->
<!--                        <li><span class="numbering">6.</span><span>휴대폰으로 화면에 보이는 <strong>QR코드<i class="icon_code"></i></strong>를<br>스캔하여 로그인 합니다.<br><br></span></li>-->
<!--                    </ul>-->
                `
            moveLeft('use_tv_nav', -1500)
            break;
        case 'KT':
            document.querySelector('.nav-samsung').classList.remove('blue');
            document.querySelector('.nav-lg').classList.remove('blue');
            document.querySelector('.nav-chromecast').classList.remove('blue');
            document.querySelector('.nav-kt').classList.add('blue');
            contents.innerHTML =
                `${ktDescription}
<!--                <p class="use-tv-guide">-->
<!--                        더이상 미술작품 전시 보러 멀리가지 마세요.<br>"지니야, 파트론 틀어줘" 한마디로 우리집이 내가 꿈꾸던<br>나만의 홈 갤러리가 됩니다.-->
<!--                    </p>-->
<!--                    <ul class="use-tv-info">-->
<!--                        <li><span class="numbering">1.</span><span>기가지니 홈 화면에서 <strong>"우리집 갤러리"</strong> 또는<br>메뉴에서 우리집 갤러리 앱을 실행하세요.<br><br></span></li>-->
<!--                        <li><span class="numbering">2.</span><span>별도 절차 없이 <strong>단말 가입 정보 활용 동의</strong>로<br>간편하게 이용할 수 있습니다.<br><br></span></li>-->
<!--                        <li><span class="numbering">3.</span><span>추천하는 전시를 감상하거나,<br>마음에 드는 작품을 골라 감상해보세요.<br><br></span></li>-->
<!--                        <li><span class="numbering">4.</span><span>감상 중 '액자모드'를 통해 음악 없이<br><strong>우리집 액자로 활용</strong>할 수도 있습니다.<br><br></span></li>-->
<!--                    </ul>-->
<!--                    <div class="use-tv-reference">-->
<!--                        <div>-->
<!--                            <strong class="text-min-box">참고</strong>-->
<!--                            <p>-->
<!--                                KT 기가지니용 단말 가입자에게 별도 제공되는<br>‘우리집 갤러리’ 서비스입니다. PC와 모바일에서<br>가입한 회원의 연동은 불가합니다.-->
<!--                            </p>-->
<!--                        </div>-->
<!--                        <div>-->
<!--                            <strong class="text-min-box">제공</strong>-->
<!--                            <p>-->
<!--                                기가지니1, 기가지니2, 기가지니3, 기가지니A-->
<!--                            </p>-->
<!--                        </div>-->
<!--                    </div>-->
                `
            moveLeft('use_tv_nav', 1500)
            break;
    }
}
window.onload = () =>{
    // let type = 'lg'?
    let type = window.location.search.split('=')[1];
    // console.log(type)
    switch (type){
        case 'samsung':
            useTv('SAMSUNG');
            moveLeft('use_tv_nav', -1500)
            break;
        case 'lg':
            useTv('LG');
            moveLeft('use_tv_nav', -1500)
            break;
        case 'chromecast':
            useTv('CHROMECAST');
            moveLeft('use_tv_nav', -1500)
            break;
        case 'kt':
            useTv('KT');
            moveLeft('use_tv_nav', 1500)
            break;
        default :
            useTv('SAMSUNG');
            moveLeft('use_tv_nav', -1500)
    }
    changeToModalHeader();
}