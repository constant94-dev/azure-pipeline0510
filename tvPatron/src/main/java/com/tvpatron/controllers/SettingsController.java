package com.tvpatron.controllers;

import com.tvpatron.common.config.MessageConfig;
import com.tvpatron.ipTable.service.IpTableService;
import com.tvpatron.member.domain.GeneralMember;
import com.tvpatron.member.dto.MemberDto;
import com.tvpatron.member.service.LoginToTvService;
import com.tvpatron.member.service.MemberService;
import com.tvpatron.member.service.MemberStorageService;
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

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
@Slf4j
@RequiredArgsConstructor
public class SettingsController {
    private final IpTableService ipTableService;
    private final LoginToTvService loginToTvService;
    private final MemberService memberService;
    private final MemberStorageService memberStorageService;
    private final MessageConfig messageConfig;

    @GetMapping("/{language}/confirm")
    public String confirmKt(
            @RequestParam(required = false, name = "duid") String deviceId,
            @RequestParam(required = false, name = "deviceName") String deviceName,
            @RequestParam(required = false, name = "provider") String provider,
            Model model) {
        model.addAttribute("deviceId", deviceId);
        model.addAttribute("deviceName", deviceName);
        model.addAttribute("provider", provider);
        return "confirm/confirm";
    }
    @PostMapping("/api/country-code")
    public ResponseEntity<?> getCountryCode(HttpServletRequest request){
        String response = ipTableService.getLocalizationByIp(request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @GetMapping("/{language}/setting")
    public String setting(
            HttpSession session,
            @PathVariable String language,
            Model model) {
        String email = (String) session.getAttribute("email_session");
        String provider = (String) session.getAttribute("provider_session");
        model.addAttribute("loginStatus", email != null);
        if(email!=null){
            GeneralMember member = memberService.getMemberByEmail(email);
            model.addAttribute("name", member.getName());
            model.addAttribute("email", email);
        }
        model.addAttribute("deviceId", "device");
        model.addAttribute("modelType", "model");
        model.addAttribute("language",language);
        model.addAttribute("provider", provider);
        return "setting/setting";
    }

    @PostMapping("/{language}/setting")
    public ResponseEntity<?> emptySeenArtworks(HttpSession session) {
        String email = (String) session.getAttribute("email_session");
        String deviceId = (String) session.getAttribute("deviceId_session");
        if (email == null || loginToTvService.checkLoginStatus(deviceId).isEmpty()) {
            session.invalidate();
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(0);
        }
        memberStorageService.emptySeenArtworks(email);
        return ResponseEntity.status(HttpStatus.OK).body(1);
    }

    @PostMapping("/setting/language")
    public ResponseEntity<?> changeLanguage(@RequestParam String language, HttpSession session) {
        String email = (String) session.getAttribute("email_session");
        String deviceId = (String) session.getAttribute("deviceId_session");
        if (email == null || loginToTvService.checkLoginStatus(deviceId).isEmpty()) {
            session.invalidate();
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(0);
        }
        memberStorageService.changeLanguage(email,language);
        return ResponseEntity.status(HttpStatus.OK).body(1);
    }
    @PostMapping("/api/device-data")
    public ResponseEntity<?> deviceData(HttpSession session){
        String deviceId = (String) session.getAttribute("deviceId_session");
        String deviceName = (String) session.getAttribute("deviceName_session");
        String provider = (String) session.getAttribute("provider_session");
        MemberDto memberDto = new MemberDto(
                null,
                deviceId,
                null,
                provider,
                deviceName
        );
        return ResponseEntity.status(HttpStatus.OK).body(memberDto);
    }
}
