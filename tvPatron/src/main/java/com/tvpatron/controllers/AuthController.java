package com.tvpatron.controllers;

import com.tvpatron.member.dto.MemberDto;
import com.tvpatron.member.service.LoginToTvService;
import com.tvpatron.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Optional;


@RestController
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final MemberService memberService;
    private final LoginToTvService loginToTvService;


    @PostMapping("login/request-code")
    public ResponseEntity<?> loginRequestCode(MemberDto memberDto){
        String code = loginToTvService.getLoginCode(memberDto.getDeviceId(),memberDto.getDeviceName());
        return ResponseEntity.status(HttpStatus.OK).body(code);
    }
    @PostMapping("login/check-code")
    public ResponseEntity<?> checkCode(MemberDto memberDto){
        String code = loginToTvService.checkLoginCode(memberDto.getDeviceId(),memberDto.getDeviceName());
        return ResponseEntity.status(HttpStatus.OK).body(code);
    }
    @PostMapping("login/delete-code")
    public ResponseEntity<?> deleteCode(MemberDto memberDto){
        int response = loginToTvService.deleteCode(memberDto.getDeviceId());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @PostMapping("login/check-status")
    public ResponseEntity<?> checkStatus(MemberDto memberDto){
        Optional<String> optionalEmail = loginToTvService.checkLoginStatus(memberDto.getDeviceId());
        String email = optionalEmail.orElse(null);
        return ResponseEntity.status(HttpStatus.OK).body(email);
    }
    @PostMapping("/login/logout")
    public ResponseEntity<?> logout(HttpServletRequest request,HttpSession session){
        String email = (String) session.getAttribute("email_session");
        int response = loginToTvService.logout(email);
        session.invalidate();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/session")
    public ResponseEntity<?> saveEmailInSession(@RequestBody MemberDto memberDto, HttpServletRequest request){
        request.getSession().setAttribute("email_session", memberDto.getEmail());
        request.getSession().setAttribute("deviceId_session", memberDto.getDeviceId());
        memberService.authenticateUser(memberDto);
        String language = memberService.getPreferredLanguage(memberDto.getEmail());
        return ResponseEntity.status(HttpStatus.OK).body(language);
    }

    @PostMapping("/destroy")
    public ResponseEntity<?> destroySession(HttpServletRequest request) {
        request.getSession().invalidate();
        return ResponseEntity.status(HttpStatus.OK).body(1);
    }
}
