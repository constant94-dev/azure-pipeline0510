package digital.patron.webmobile.bulletinBoard.service;

import digital.patron.webmobile.bulletinBoard.domain.AdminInquiry;
import digital.patron.webmobile.bulletinBoard.domain.AdminNotice;
import digital.patron.webmobile.bulletinBoard.domain.AdminOftenQuestion;
import digital.patron.webmobile.bulletinBoard.dto.InquiryDto;
import digital.patron.webmobile.bulletinBoard.dto.OftenQuestionDto;
import digital.patron.webmobile.bulletinBoard.dto.SubmitInquiryDto;
import digital.patron.webmobile.bulletinBoard.repository.InquiryRepository;
import digital.patron.webmobile.bulletinBoard.repository.NoticeRepository;
import digital.patron.webmobile.bulletinBoard.repository.OftenQuestionRepository;
import digital.patron.webmobile.common.utils.BaseTimeEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class BulletinBoardServiceImpl implements BulletinBoardService{

    private final NoticeRepository noticeRepository;
    private final InquiryRepository inquiryRepository;
    private final OftenQuestionRepository oftenQuestionRepository;

    //NOTICE
    //공지사항 받기
    @Override
    public List<AdminNotice> findNotices(){
        return noticeRepository.findAll();
    }
    @Override
    public AdminNotice findNoticeById(Long id){return noticeRepository.findById(id)
            .orElseThrow(()->new NoSuchElementException());}
    //Often question
    @Override
    public List<AdminOftenQuestion> findOftenQuestionsByType(String type){return oftenQuestionRepository.findAllByType(type);}
    @Override
    public OftenQuestionDto createOftenQuestionDto(List<AdminOftenQuestion> oftenQuestionList){
        return new OftenQuestionDto(
                oftenQuestionList.stream().map(AdminOftenQuestion::getId).collect(Collectors.toList()),
                oftenQuestionList.stream().map(AdminOftenQuestion::getType).collect(Collectors.toList()),
                oftenQuestionList.stream().map(AdminOftenQuestion::getTitle).collect(Collectors.toList()),
                oftenQuestionList.stream().map(AdminOftenQuestion::getName).collect(Collectors.toList()),
                oftenQuestionList.stream().map(AdminOftenQuestion::getAttach_file).collect(Collectors.toList()),
                oftenQuestionList.stream().map(AdminOftenQuestion::getFix_top).collect(Collectors.toList()),
                oftenQuestionList.stream().map(AdminOftenQuestion::getContent).collect(Collectors.toList()),
                oftenQuestionList.stream().map(AdminOftenQuestion::getNumber_of_views).collect(Collectors.toList())
        );
    }
    //INQUIRY
    @Override
    public List<AdminInquiry> findInquiryByEmail(String email){
        return inquiryRepository.findAllByWriter(email);
    }

    @Override
    public InquiryDto createInquiryDto(List<AdminInquiry> adminInquiryList){
        return new InquiryDto(
                adminInquiryList.stream().map(AdminInquiry::getId).collect(Collectors.toList()),
                adminInquiryList.stream().map(AdminInquiry::getWriter).collect(Collectors.toList()),
                adminInquiryList.stream().map(AdminInquiry::getType).collect(Collectors.toList()),
                adminInquiryList.stream().map(AdminInquiry::getContent).collect(Collectors.toList()),
                adminInquiryList.stream().map(AdminInquiry::getAnswer).collect(Collectors.toList()),
                adminInquiryList.stream().map(BaseTimeEntity::getCreateTime).collect(Collectors.toList())
        );
    }

    @Override
    public int submitInquiry(String email, SubmitInquiryDto submitInquiryDto){
        try {
            AdminInquiry adminInquiry = new AdminInquiry(
                    email,
                    submitInquiryDto.getType(),
                    submitInquiryDto.getContent(),
                    null
            );
            inquiryRepository.save(adminInquiry);
            return 1;
        }catch (Exception e){
            log.error("Submit inquiry exception : " + e);
            return 0;
        }
    }
    @Override
    public int deleteInquiry(String email, Long id){
        try{
            int response = inquiryRepository.deleteByIdAndEmail(email,id);
            return response;
        }catch (Exception e){
            log.error("Exception : " + e);
            return 0;
        }
    }
}
