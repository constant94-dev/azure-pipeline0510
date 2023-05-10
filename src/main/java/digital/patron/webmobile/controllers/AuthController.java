package digital.patron.webmobile.controllers;

import digital.patron.webmobile.artwork.service.ArtworkService;
import digital.patron.webmobile.common.annotation.CurrentMember;
import digital.patron.webmobile.common.security.AuthenticationService;
import digital.patron.webmobile.common.security.KakaoAPI;
import digital.patron.webmobile.email.dto.TempDto;
import digital.patron.webmobile.email.service.EmailSendService;
import digital.patron.webmobile.exhibition.domain.Exhibition;
import digital.patron.webmobile.exhibition.service.ExhibitionService;
import digital.patron.webmobile.ipTable.service.IpTableService;
import digital.patron.webmobile.member.domain.DisabledMember;
import digital.patron.webmobile.member.domain.GeneralMember;
import digital.patron.webmobile.member.dto.MemberDto;
import digital.patron.webmobile.member.repository.LoginStatusRepository;
import digital.patron.webmobile.member.service.LoginToTvService;
import digital.patron.webmobile.member.service.MembersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationService authenticationService;
    private final ExhibitionService exhibitionService;
    private final EmailSendService mss;
    private final LoginToTvService loginToTvService;
    private final LoginStatusRepository loginStatusRepository;
    private final MembersService membersService;
    private final IpTableService ipTableService;
    private final ArtworkService artworkService;

    @Value("${jwt.secret}")
    private String secret;

    KakaoAPI kakaoApi = new KakaoAPI();

    @GetMapping("/")
    public String user(@AuthenticationPrincipal OAuth2User principal,
                       @RequestParam(name = "code",required = false) String code,
                       HttpServletRequest request,
                       HttpServletResponse response,
                       HttpSession session,
                       RedirectAttributes redirectAttributes,
                       Model model){
        String localization = ipTableService.getLocalizationByIp(request);
        String language;
        switch (localization){
            case "kr" : language = "ko";break;
            case "jp" : language = "ja";break;
            default: language = "en";break;
        }
        if(SecurityContextHolder.getContext().getAuthentication().getName()!=null && principal == null &&
                !SecurityContextHolder.getContext().getAuthentication().getName().equalsIgnoreCase("anonymousUser")){
            Object deviceId = session.getAttribute("deviceId");
            if(deviceId==null){return "redirect:/"+language+"/home";}
            Optional<GeneralMember> generalMember = membersService.getByEmail(SecurityContextHolder.getContext().getAuthentication().getName());
            language = membersService.getPreferredLanguageAbbreviation(generalMember.get().getPreferredLanguage());
            String deviceName = loginToTvService.getLoggedInTvName(generalMember.get().getName());
            redirectAttributes.addAttribute("deviceId", deviceId);
            redirectAttributes.addAttribute("deviceName", deviceName);
            redirectAttributes.addAttribute("generalMemberEmail",generalMember.get().getEmail());
            return "redirect:/"+language+"/login";
        }
        if(code == null && principal == null){
            SecurityContextHolder.clearContext();
            return "redirect:/"+language+"/home";
        }
        String provider = null;
        String email = null;
        String nickname = null;
        if(code!=null){
            //KAKAO
            String accessToken = kakaoApi.getAccessToken(code,request);
            HashMap<String, Object> userInfo = kakaoApi.getUserInfo(accessToken);
            if(userInfo.get("email") == null){
                kakaoApi.unlink(accessToken);
                redirectAttributes.addAttribute("provider","kakaoaccounthasnoemailregistered");
                SecurityContextHolder.clearContext();
                return "redirect:/"+language+"/login";
            }
            email = userInfo.get("email").toString();
            nickname = userInfo.get("nickname") == null ?
                    email.split("@")[0] : userInfo.get("nickname").toString();
            provider = "Kakao";
        }
        if(principal!=null){
            //FACEBOOK AND GOOGLE
            if(principal.getAttribute("email") == null){
                redirectAttributes.addAttribute("provider","accounthasnoemailregistered");
                SecurityContextHolder.clearContext();
                return "redirect:/"+language+"/login";
            }
            email = principal.getAttribute("email").toString();
            nickname = principal.getAttribute("name") == null ?
                    "Unknown" : principal.getAttribute("name").toString();
            provider = principal.getAttribute("iss") != null ?
                    "Google" : "Facebook";
        }
        if(email == null) {
            SecurityContextHolder.clearContext();
            return "redirect:/"+language+"/login";}
        //Left member
        if(membersService.isMemberALeftMember(email).isPresent()){
            redirectAttributes.addAttribute("provider","thisisleftmember");
            SecurityContextHolder.clearContext();
            return "redirect:/"+language+"/login";
        }
        Optional<GeneralMember> generalMember = membersService.getByEmail(email);
        if (generalMember.isEmpty()) {
            model.addAttribute("email",email);
            model.addAttribute("nickname",nickname);
            model.addAttribute("provider",provider);
            model.addAttribute("language", language);
            SecurityContextHolder.clearContext();
            return "login/accept-service";
        }
        if (!generalMember.get().getProvider().equalsIgnoreCase(provider)) {
            redirectAttributes.addAttribute("provider", generalMember.get().getProvider());
            SecurityContextHolder.clearContext();
            return "redirect:/"+language+"/login";
        }
        authenticationService.login(generalMember.get());
        model.addAttribute("generalMember",generalMember.get());
        Object deviceId = session.getAttribute("deviceId");
        language = membersService.getPreferredLanguageAbbreviation(generalMember.get().getPreferredLanguage());
        if(deviceId==null){return "redirect:/"+language+"/home";}
        String deviceName = loginToTvService.getLoggedInTvName(generalMember.get().getName());
        redirectAttributes.addAttribute("deviceId", deviceId);
        redirectAttributes.addAttribute("deviceName", deviceName);
        redirectAttributes.addAttribute("generalMemberEmail",generalMember.get().getEmail());
        return "redirect:/"+language+"/login";
    }


    @PostMapping("/api/sns-register")
    public ResponseEntity<?> acceptService(@RequestParam(value = "email") String email,
                                @RequestParam(value = "nickname") String nickname,
                                @RequestParam(value = "provider") String provider,
                                HttpServletRequest request,
                                @RequestParam(value = "marketing") Boolean marketing){
        String localization = ipTableService.getLocalizationByIp(request);
        MemberDto memberDto = new MemberDto(email,nickname,secret,provider,marketing);
        GeneralMember memberToLogin = authenticationService.create(memberDto,localization);
        if(memberToLogin == null){return ResponseEntity.status(HttpStatus.OK).body(0);}
        authenticationService.login(memberToLogin);
        String language = membersService.getPreferredLanguageAbbreviation(memberToLogin.getPreferredLanguage());
        return ResponseEntity.status(HttpStatus.OK).body(language);
    }

    @GetMapping("/{language}/login")
    public String login(@CurrentMember GeneralMember generalMember,
                        @RequestParam(required = false) String deviceId,
                        @RequestParam(required = false) String deviceName,
                        @RequestParam(required = false) String provider,
                        HttpSession session,
                        @PathVariable String language,
                        HttpServletRequest request,
                        Model model) {
        String localization = ipTableService.getLocalizationByIp(request);
        if(language == null){
            switch (localization){
                case "kr" : language = "ko";break;
                case "jp" : language = "ja";break;
                default: language = "en";break;
            }
        }
        model.addAttribute("language",language);
        model.addAttribute("provider",provider);
        if(deviceId == null && generalMember == null){return"login/login";}
        if(deviceId == null){return "redirect:/"+language+"/home";}
        session.setAttribute("deviceId",deviceId);
        model.addAttribute("deviceId",deviceId);
        loginToTvService.getLoginCode(deviceId,deviceName);
        if(generalMember==null){return "login/login";}
        if(loginStatusRepository.findByEmail(generalMember.getEmail()).isPresent()){
            String loginDeviceName = loginStatusRepository.findByEmail(generalMember.getEmail()).get().getDeviceName();
            model.addAttribute("loginDeviceName", loginDeviceName);
        }
        model.addAttribute("generalMemberEmail",generalMember.getEmail());
        return "login/login-tv";
    }

    @PostMapping("/api/previous-page")
    public ResponseEntity<?> requestPreviousPage(HttpServletRequest request){
        System.out.println(request.getHeader("Referer"));
        return ResponseEntity.status(HttpStatus.OK).body(request.getHeader("Referer"));
    }
    @GetMapping("/{language}/signup")
    public String signup(@PathVariable String language,
                        Model model) {
        model.addAttribute("language", language);
        return "login/signup";
    }

    @GetMapping("/{language}/login-success")
    public String loginSuccess(@CurrentMember GeneralMember generalMember,
                               HttpSession session,
                               HttpServletRequest request,
                               @PathVariable String language,
                               Model model) {
        if(generalMember==null){return "redirect:/";}
        String localization = ipTableService.getLocalizationByIp(request);
        Object deviceId = session.getAttribute("deviceId");
        if(deviceId!=null){
            String deviceName = loginToTvService.getLoggedInTvName(generalMember.getName());
            model.addAttribute("deviceName", deviceName);
            model.addAttribute("generalMemberEmail",generalMember.getEmail());
            return "login/login-tv";
        }
        Integer artworkCount = artworkService.findAllArtworksCountByLocalization(localization);
        List<Exhibition> mainExhibitions = exhibitionService.findExhibitionsByGroupName("메인전시",localization,null);
        Exhibition mainExhibition = mainExhibitions.stream().findFirst().isPresent() ?
                mainExhibitions.stream().findFirst().get() : null;
        model.addAttribute("mainExhibition", mainExhibition);
        model.addAttribute("artworkCount", artworkCount);
        model.addAttribute("language", language);
        return "login/login-success";
    }


    @GetMapping("/{language}/password-find")
    public String passwordReset() {
        return "login/password-find";
    }

    //인증메일 발송 api (아이디 체크일 경우 type=email, 비밀번호 리셋일 경우 type=password)
    @PostMapping("/api/email-verification")
    public ResponseEntity<?> emailVerification(TempDto tempDto) {
        if(!tempDto.getType().equalsIgnoreCase("email") &&
                !tempDto.getType().equalsIgnoreCase("password")){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(-1);
        }
        String authKey = tempDto.getType().equalsIgnoreCase("email") ?
                mss.sendRegistrationAuthMailToGeneralMember(tempDto.getEmail()) : mss.sendFindPasswordAuthMailToGeneralMember(tempDto.getEmail());
        int response = authenticationService.createTemp(tempDto.getEmail(),authKey);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    //인증코드 확인 api
    @PostMapping("/api/email-verify")
    public ResponseEntity<?> emailVerify(TempDto tempDto) {
        int response = authenticationService.verifyEmail(tempDto.getEmail(),tempDto.getAuthKey());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/api/signup")
    public ResponseEntity<?> signup(@Valid MemberDto memberDto,
                                    HttpServletRequest request) {
        memberDto.setProvider("General");
        String localization = ipTableService.getLocalizationByIp(request);
        GeneralMember generalMember = authenticationService.create(memberDto,localization);
        if(generalMember == null){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0);
        }
        authenticationService.login(generalMember);
        return ResponseEntity.status(HttpStatus.OK).body(1);
    }



    //이메일 가입여부 체크 api
    @PostMapping("/api/email-check")
    public ResponseEntity<?> checkEmail(MemberDto memberDto){
        if(membersService.isMemberALeftMember(memberDto.getEmail()).isPresent()){
            return ResponseEntity.status(HttpStatus.OK).body(-2);}
        Optional<String> provider = membersService.getProviderByEmail(memberDto.getEmail());
        if(provider.isPresent()){return ResponseEntity.status(HttpStatus.OK).body(provider);}
        Optional<String> disabledProvider = membersService.getDisabledMemberProviderByEmail(memberDto.getEmail());
        if (disabledProvider.isEmpty()) {return ResponseEntity.status(HttpStatus.OK).body(-1);}
        DisabledMember disabledMember = membersService.getDisabledMemberByEmail(memberDto.getEmail());
        authenticationService.moveDisabledToGeneral(disabledMember);
        return ResponseEntity.status(HttpStatus.OK).body(disabledProvider);
    }


    @PostMapping("/api/password-reset")
    public ResponseEntity<?> passwordReset(MemberDto memberDto){
        int response = authenticationService.resetPassword(memberDto.getEmail(),memberDto.getPassword());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/api/delete-verification-code")
    public ResponseEntity<?> deleteVerificationCode(MemberDto memberDto){
        int response = authenticationService.deleteVerificationCode(memberDto.getEmail());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


    @GetMapping("/login/tv")
    public String loginTv(@CurrentMember GeneralMember generalMember,
                          Model model){
        model.addAttribute("generalMemberEmail",generalMember.getEmail());
        return "login/login-tv";
    }

    @GetMapping("/testLogin")
    public String testLogin() {
        return "login";
    }
}
