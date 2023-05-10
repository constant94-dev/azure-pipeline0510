package digital.patron.webmobile.bulletinBoard.service;

import digital.patron.webmobile.bulletinBoard.domain.AdminInquiry;
import digital.patron.webmobile.bulletinBoard.domain.AdminNotice;
import digital.patron.webmobile.bulletinBoard.domain.AdminOftenQuestion;
import digital.patron.webmobile.bulletinBoard.dto.InquiryDto;
import digital.patron.webmobile.bulletinBoard.dto.OftenQuestionDto;
import digital.patron.webmobile.bulletinBoard.dto.SubmitInquiryDto;

import java.util.List;

public interface BulletinBoardService {
    //NOTICE
    //공지사항 받기
    List<AdminNotice> findNotices();

    AdminNotice findNoticeById(Long id);

    //Often question
    List<AdminOftenQuestion> findOftenQuestionsByType(String type);

    OftenQuestionDto createOftenQuestionDto(List<AdminOftenQuestion> oftenQuestionList);

    //INQUIRY
    List<AdminInquiry> findInquiryByEmail(String email);

    InquiryDto createInquiryDto(List<AdminInquiry> adminInquiryList);

    int submitInquiry(String email, SubmitInquiryDto submitInquiryDto);

    int deleteInquiry(String email, Long id);
}
