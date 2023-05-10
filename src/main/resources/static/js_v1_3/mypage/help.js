window.onload = () => {
    let type = window.location.search.split('=')[1];
    switch (type){
        case 'notice':
            document.getElementById('help_notice').click();
            break;
        case 'FAQ':
            document.getElementById('help_FAQ').click();
            break;
        case 'QnA':
            document.getElementById('help_QnA').click();
            break;
    }
}

const titleTarget = $('.help-notice-title');
const tab1 = $('.help-tab .help-tab-title:nth-of-type(1)');
const tab2 = $('.help-tab .help-tab-title:nth-of-type(2)');
const tab3 = $('.help-tab .help-tab-title:nth-of-type(3)');

const owl = $('.owl-carousel');
let owl1, owl2, owl3, owl_stage, owlPanel1, owlPanel2, owlPanel3;

titleTarget.on('click',function (){
    let target = $(this).attr('href');
    let parent = $(this).parent('.panel-heading')
    // bar 조절
    if($(target).css('display') === 'block'){
        setTimeout(function (){
            parent.removeClass('active');
        },350)
    } else {
        parent.addClass('active');
        setTimeout(function (){
            document.querySelector('.panel-heading.active .help-notice-title').focus();
        },0);
    }
});

owl.owlCarousel({
    loop:false,
    items:$('.help-tab-title').length,
    autoWidth:true,
    //drag false
    mouseDrag:false,
    touchDrag:false,
    pullDrag:false,
    freeDrag:false
});

owl_stage = $('.owl-stage');
owlPanel1 = $('.owl-item:nth-of-type(1) .panel-group');
owlPanel2 = $('.owl-item:nth-of-type(2) .panel-group');
owlPanel3 = $('.owl-item:nth-of-type(3) .panel-group');
owl1 =  $('.owl-stage .owl-item:nth-of-type(1)');
owl2 =  $('.owl-stage .owl-item:nth-of-type(2)');
owl3 =  $('.owl-stage .owl-item:nth-of-type(3)');

owlPanel1.attr('id','accordion');
owlPanel2.attr('id','accordion2');
owlPanel3.attr('id','accordion3');

// tab 이동
owl.on('changed.owl.carousel', function(event) {
    switch (event.item.index){
        case 0:
            owlPanel1.attr('id','accordion');
            owlPanel2.attr('id','accordion2');
            owlPanel3.attr('id','accordion3');

            tab1.addClass('active');
            tab2.removeClass('active');
            tab3.removeClass('active');
            break
        case 1:
            owlPanel1.attr('id','accordion1');
            owlPanel2.attr('id','accordion');
            owlPanel3.attr('id','accordion3');

            tab1.removeClass('active');
            tab2.addClass('active');
            tab3.removeClass('active');
            break
        case 2:
            owlPanel1.attr('id','accordion1');
            owlPanel2.attr('id','accordion2');
            owlPanel3.attr('id','accordion');

            tab1.removeClass('active');
            tab2.removeClass('active');
            tab3.addClass('active');
            break
    }
    if($('.owl-item .panel-heading.active').length > 0){
        $('.owl-item .panel-heading.active .help-notice-title').click();
    }
});

// click 이동
$('.help-tab .help-tab-title').on('click',function (){
    switch ($(this).index()){
        case 0:
            owlPanel1.attr('id','accordion');
            owlPanel2.attr('id','accordion2');
            owlPanel3.attr('id','accordion3');

            owl_stage.addClass('webview-carousel-0');
            owl_stage.removeClass('webview-carousel-1');
            owl_stage.removeClass('webview-carousel-2');

            owl1.addClass('active');
            owl2.removeClass('active');
            owl3.removeClass('active');
            tab1.addClass('active');
            tab2.removeClass('active');
            tab3.removeClass('active');
            break
        case 2:
            owlPanel1.attr('id','accordion1');
            owlPanel2.attr('id','accordion');
            owlPanel3.attr('id','accordion3');

            owl_stage.removeClass('webview-carousel-0');
            owl_stage.addClass('webview-carousel-1');
            owl_stage.removeClass('webview-carousel-2');

            owl1.removeClass('active');
            owl2.addClass('active');
            owl3.removeClass('active');
            tab1.removeClass('active');
            tab2.addClass('active');
            tab3.removeClass('active');
            break
        case 4:
            owlPanel1.attr('id','accordion1');
            owlPanel2.attr('id','accordion2');
            owlPanel3.attr('id','accordion');

            owl_stage.removeClass('webview-carousel-0');
            owl_stage.removeClass('webview-carousel-1');
            owl_stage.addClass('webview-carousel-2');

            owl1.removeClass('active');
            owl2.removeClass('active');
            owl3.addClass('active');
            tab1.removeClass('active');
            tab2.removeClass('active');
            tab3.addClass('active');
            break
    }
    if($('.owl-item .panel-heading.active').length > 0){
        $('.owl-item .panel-heading.active .help-notice-title').click();
    }
});

function checkNowSortingStandard(selector){
    const target = selector;
    const standard = target.textContent.trim();
    let standards = [];
    const confirmIcons = document.querySelectorAll('#sorting_options .icon-confirm');
    for(let i=0; i<confirmIcons.length; i++){
        confirmIcons[i].style.opacity = '0';
    }
    const standardsTag = document.querySelectorAll('#sorting_options .sort-standard-text');
    for(let j=0; j<standardsTag.length; j++){
        standards.push(standardsTag[j].textContent.trim());
    }
    const thisStandardIndex = standards.indexOf(standard);
    if(thisStandardIndex < 0){
        confirmIcons[0].style.opacity = '1';
    }else{
        confirmIcons[thisStandardIndex].style.opacity = '1';
    }
}

const checkTextarea = (self) => {
    if(self.value.length > 1 && document.getElementById("QnA_type").value !== ""){
        colorToBlue(true,'btn_save');
    } else if(self.value.length < 2){
        document.getElementById('btn_save').classList.remove('active');
        document.getElementById('btn_save').classList.remove('blue');
        document.getElementById('btn_save').disabled = true;
    }
}

//1:1문의 작성하기 모달
const modalInquiryWrite = () => {
    $.ajax({
        url:"/" + location.pathname.split('/')[1] + "/mypage/QnA-write",
        success: function(data){
            document.getElementById('modal_wrote_inquiry').innerHTML = data;
            document.querySelector('main').style.display = 'none';
            let content = document.getElementById('QnA_content');
            let content_count = document.getElementById('content_count_value');
            content.addEventListener('keyup',()=>{
                content_count.innerText = content.value.length;
            })
        }
    })
}

function changeInquiryText(selector, selector2){
    const targetSelector = document.querySelector(selector);
    //console.log(targetSelector)
    const textToChange = selector2.textContent.trim();
    targetSelector.value = textToChange;
    targetSelector.setAttribute('value',textToChange);
    targetSelector.style.color = '#0a0a0a';
    if(document.getElementById('btn_save').disabled = true){
        colorToBlue(true,'btn_save');
    }
}

//1:1문의글 삭제하기
const deleteInquiry = (self) => {
    let id = self.parentElement.parentElement.dataset.id;

    $.ajax({
        url:'/api/delete-inquiry',
        method: "POST",
        dataType: "json",
        data: {
            id: id
        },
        success: function(data){
            //통신 성공후 해당 게시글 리스트에서 삭제
            self.parentElement.parentElement.remove();
            toastPopup('success',deleted);
        },
        error: function(request){
            // if(request.status === 403){
            //     return adminLogout();
            // }
        }
    })
}

//1:1문의 모달 닫기
const closeModalInquiry = () => {
    document.querySelector('main').style.display = 'block';
    document.getElementById('modal_wrote_inquiry').innerHTML = '';
}

//문의하기
const writeInquiry = () => {
    let type = document.getElementById('QnA_type').value;
    let content = document.getElementById('QnA_content').value;

    $.ajax({
        url:'/api/submit-inquiry',
        method: "POST",
        dataType: "json",
        data: {
            type: type,
            content: content
        },
        success: function(data){
            closeModalInquiry();
            inquiryList();
            toastPopup('success',inquirySubmited);
        },
        error: function(request){
            // if(request.status === 403){
            //     return adminLogout();
            // }
        }
    })
}

//자주하는질문 리스트
const oftenQuestionList = (type) => {
    $.ajax({
        url:'/api/often-question?type='+type,
        method: "GET",
        success: function(data){
            // console.log(data)
            let html = '';
            for(let i=0; i<data.id.length; i++){
                html += `
                <div class="panel panel-default">
                    <div class="panel-heading" tabindex="-1" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFAQ${data.id[i]}" aria-expanded="false">
                      <a class="help-notice-title">
                        ${data.title[i]}
                      </a>
                    </div>
                    <div id="collapseFAQ${data.id[i]}" class="panel-collapse collapse" role="tabpanel">
                      <div class="panel-body">
                        ${data.content[i]}
                      </div>
                    </div>
                </div>`
            }
            document.querySelector('.FAQ-list').innerHTML = html;
        },
        error: function(request){
            // if(request.status === 403){
            //     return adminLogout();
            // }
        }
    })
}

//1:1문의 리스트
const inquiryList = () => {
    $.ajax({
        url:'/api/inquiry',
        method: "POST",
        success: function(data){
            // console.log(data)
            let html = '';
            for(let i=0; i<data.id.length; i++){
                let answerWaiting;
                data.answer[i] == null ? answerWaiting = waitingForAnswer : answerWaiting = answerComplete;
                let createTime = data.createTime[i].split('T')[0];
                if(answerWaiting == waitingForAnswer){
                    html += `
                <div class="panel panel-default" data-id="${data.id[i]}">
                    <div class="panel-heading" tabindex="-1" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseQnA${data.id[i]}" aria-expanded="false">
                      <div class="help-content-header">
                        <div class="help-notice-writer">${answerWaiting}</div>
                        <div class="help-notice-date">${createTime}</div>
                      </div>
                      <a class="help-notice-title">
                        ${data.type[i]}
                      </a>
                      <div class="QnA-delete" onclick="deleteInquiry(this)">${deleteJs}</div>
                    </div>
                    <div id="collapseQnA${data.id[i]}" class="panel-collapse collapse" role="tabpanel">
                      <div class="panel-body">
                        <div>
                            <p class="QnA-collapse-title">${question}</p>
                            <p class="QnA-collapse-content">${data.content[i]}</p>
                        </div>
                      </div>
                    </div>
                </div>`
                }else{
                    html += `
                <div class="panel panel-default" data-id="${data.id[i]}">
                    <div class="panel-heading" tabindex="-1" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseQnA${data.id[i]}" aria-expanded="false">
                      <div class="help-content-header">
                        <div class="help-notice-writer">${answerWaiting}</div>
                        <div class="help-notice-date">${createTime}</div>
                      </div>
                      <a class="help-notice-title">
                        ${data.type[i]}
                      </a>
                      <div class="QnA-delete" onclick="deleteInquiry(this)">${deleteJs}</div>
                    </div>
                    <div id="collapseQnA${data.id[i]}" class="panel-collapse collapse" role="tabpanel">
                      <div class="panel-body">
                        <div class="QnA-collapse-question">
                            <p class="QnA-collapse-title">${question}</p>
                            <p class="QnA-collapse-content">${data.content[i]}</p>
                        </div>
                        <div>
                            <p class="QnA-collapse-title">${answer}</p>
                            <p class="QnA-collapse-content">${data.answer[i]}</p>
                        </div>
                      </div>
                    </div>
                </div>`
                }
            }
            document.querySelector('.QnA-list').innerHTML = html;
        },
        error: function(request){
            // if(request.status === 403){
            //     return adminLogout();
            // }
        }
    })
}
inquiryList();

//언어별로 탭 길이 변경
let firstTabWidth = $('#help_notice').css('width');
let secondTabWidth = $('#help_FAQ').css('width');
let thirdTabWidth = $('#help_QnA').css('width');
if($('#help_notice').length>0 ){
    $('.help-tab-notice-bar').css({'width':`${firstTabWidth}`})
}
let leftCssFirst = ((parseInt(firstTabWidth) + 18) + 'px').toString();
let leftCssSecond = ((parseInt(firstTabWidth) + (parseInt(secondTabWidth) + 30) + 'px')).toString();
if($('#help_FAQ').length>0 && $('.help-tab-FAQ-bar').length > 0){
    $('.help-tab-FAQ-bar').css({'width':`${secondTabWidth}`, 'left': `${leftCssFirst}`});
}
if($('#help_QnA').length>0){
    $('.help-tab-QnA-bar').css({'width':`${thirdTabWidth}`, 'left': `${leftCssSecond}`});
    console.log('here3')
}