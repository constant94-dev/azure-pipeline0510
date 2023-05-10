package digital.patron.webmobile.controllers;

import digital.patron.webmobile.bulletinBoard.domain.AdminInquiry;
import digital.patron.webmobile.bulletinBoard.domain.AdminNotice;
import digital.patron.webmobile.bulletinBoard.domain.AdminOftenQuestion;
import digital.patron.webmobile.bulletinBoard.dto.InquiryDto;
import digital.patron.webmobile.bulletinBoard.dto.OftenQuestionDto;
import digital.patron.webmobile.bulletinBoard.dto.SubmitInquiryDto;
import digital.patron.webmobile.bulletinBoard.service.BulletinBoardService;
import digital.patron.webmobile.common.annotation.CurrentMember;
import digital.patron.webmobile.member.domain.GeneralMember;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;


@Controller
@Slf4j
@RequiredArgsConstructor
public class BulletinController {


    private final BulletinBoardService bulletinBoardService;

    @GetMapping("/{language}/mypage/help")
    public String notice(Model model,
                         @PathVariable String language,
                         @CurrentMember GeneralMember generalMember){
        List<AdminNotice> notices = bulletinBoardService.findNotices();
        model.addAttribute("notices", notices);
        model.addAttribute("generalMember", generalMember);
        model.addAttribute("language",language);
        return "mypage/help";
    }

    @GetMapping("/{language}/mypage/notice")
    public String noticeById(@RequestParam Long id, Model model,
                             @PathVariable String language,
                             @CurrentMember GeneralMember generalMember){
        AdminNotice notice = bulletinBoardService.findNoticeById(id);
        model.addAttribute("notice", notice);
        model.addAttribute("generalMember", generalMember);
        model.addAttribute("language",language);
        return "mypage/notice-promotion";
    }


    @GetMapping("/api/often-question")
    public ResponseEntity<?> oftenQuestions(@RequestParam(value = "type") String type){
        List<AdminOftenQuestion> oftenQuestions = bulletinBoardService.findOftenQuestionsByType(type);
        OftenQuestionDto oftenQuestionDto = bulletinBoardService.createOftenQuestionDto(oftenQuestions);
        return ResponseEntity.status(HttpStatus.OK).body(oftenQuestionDto);
    }

    @PostMapping("/api/inquiry")
    public ResponseEntity<?> myInquiry(@CurrentMember GeneralMember generalMember){
        List<AdminInquiry> adminInquiries = bulletinBoardService.findInquiryByEmail(generalMember.getEmail());
        InquiryDto inquiryDto = bulletinBoardService.createInquiryDto(adminInquiries);
        return ResponseEntity.status(HttpStatus.OK).body(inquiryDto);
    }

    @PostMapping("/api/submit-inquiry")
    public ResponseEntity<?> submitInquiry(@CurrentMember GeneralMember generalMember,
                                           SubmitInquiryDto submitInquiryDto){
        int response = bulletinBoardService.submitInquiry(generalMember.getEmail(),submitInquiryDto);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/api/delete-inquiry")
    public ResponseEntity<?> deleteInquiry(@CurrentMember GeneralMember generalMember,
                                           @RequestParam(value = "id") Long id){
        int response = bulletinBoardService.deleteInquiry(generalMember.getEmail(),id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
