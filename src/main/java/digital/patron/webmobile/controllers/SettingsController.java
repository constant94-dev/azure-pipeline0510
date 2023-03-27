package digital.patron.webmobile.controllers;

import digital.patron.webmobile.advertisement.domain.Advertisement;
import digital.patron.webmobile.advertisement.service.AdvertisementService;
import digital.patron.webmobile.artwork.service.ArtworkService;
import digital.patron.webmobile.common.annotation.CurrentMember;
import digital.patron.webmobile.common.security.AuthenticationService;
import digital.patron.webmobile.ipTable.service.IpTableService;
import digital.patron.webmobile.member.domain.GeneralMember;
import digital.patron.webmobile.member.dto.DeleteAccountDto;
import digital.patron.webmobile.member.dto.MemberDto;
import digital.patron.webmobile.member.dto.MemberInfoDto;
import digital.patron.webmobile.member.service.LoginToTvService;
import digital.patron.webmobile.member.service.MembersService;
import digital.patron.webmobile.member.service.MembersStorageService;
import digital.patron.webmobile.socket.service.SocketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@Slf4j
@RequiredArgsConstructor
public class SettingsController {
    private final LoginToTvService loginToTvService;
    private final ArtworkService artworkService;
    private final AuthenticationService authenticationService;
    private final AdvertisementService advertisementService;
    private final SocketService socketService;
    private final MembersService membersService;
    private final MembersStorageService membersStorageService;
    private final IpTableService ipTableService;


    //tv 이용방법
    @GetMapping("/{language}/mypage/setting")
    public String setting(@CurrentMember GeneralMember generalMember,
                          @PathVariable String language,
                          Model model) {
        if(generalMember == null){return "redirect:/";}
        model.addAttribute("generalMember",generalMember);
        model.addAttribute("language",language);

        return "mypage/setting";
    }

    @GetMapping(value = "/api/tvLogin")
    public ResponseEntity<?> loginToTv(@CurrentMember GeneralMember generalMember,
                                       @RequestParam("code") String code){
        String response = loginToTvService.loginToTv(generalMember.getEmail(), code);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @GetMapping(value = "/{language}/loggedInTv")
    public String loggedInTvs(@CurrentMember GeneralMember generalMember,
                              @PathVariable String language,
                              Model model){
        if(generalMember!=null){
            String deviceName = loginToTvService.getLoggedInTvName(generalMember.getEmail());
            model.addAttribute("deviceName", deviceName);
        }
        model.addAttribute("language",language);
        return "mypage/application-tv";
    }
    @GetMapping(value = "/api/logoutTv")
    public ResponseEntity<?> logoutTv(@CurrentMember GeneralMember generalMember){
        int response = loginToTvService.logoutTv(generalMember.getEmail());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @GetMapping("/api/connect")
    public ResponseEntity<?> requestConnectionToDevice(@CurrentMember GeneralMember generalMember,
                                                       @RequestParam(value = "code") String code){
        int response = socketService.requestConnectionToDevice(generalMember.getEmail(),generalMember.getName(),code);
        //1 success, 0 server error, -1 already have connection to another device, -2 code is wrong, -3 too many connections
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @GetMapping("/api/socket-deviceName")
    public ResponseEntity<?> getDeviceNameOfConnectedDevice(@CurrentMember GeneralMember generalMember){
        String deviceName = "undefined";
        if(generalMember != null){
            deviceName = socketService.getConnectedDeviceNameByEmail(generalMember.getEmail());
        }
        return ResponseEntity.status(HttpStatus.OK).body(deviceName);
    }
    @GetMapping("/api/request-player")
    public ResponseEntity<?> requestPlayer(@CurrentMember GeneralMember generalMember,
                                           @RequestParam(value = "art_id",required = false) Long art_id,
                                           @RequestParam(value = "exh_id",required = false) Long exh_id,
                                           @RequestParam(value = "play", required = false) Boolean play){
        int response = socketService.requestTvToPlayArtwork(art_id,exh_id,play,generalMember.getEmail());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @PostMapping("/api/disconnect")
    public ResponseEntity<?> disconnectDeviceFromTv(@CurrentMember GeneralMember generalMember){
        int response = socketService.disconnectDeviceFromTv(generalMember.getEmail());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @PostMapping("/api/marketing")
    public ResponseEntity<?> changeMarketingStatus(@CurrentMember GeneralMember generalMember,
                                                   Boolean status){
        int response = membersService.changeMarketingStatus(generalMember,status);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @PostMapping("/api/check-password")
    public ResponseEntity<?> checkPassword(@CurrentMember GeneralMember generalMember,
                                           MemberDto memberDto){
        Integer response = membersService.checkIfPasswordMatch(generalMember,memberDto.getPassword());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @PostMapping("/api/new-password")
    public ResponseEntity<?> newPassword(@CurrentMember GeneralMember generalMember,
                                           MemberDto memberDto){
        int response = membersService.setNewPassword(generalMember,memberDto.getPassword());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/api/seen-artworks/remove")
    public ResponseEntity<?> removeSeenArtwork(@CurrentMember GeneralMember generalMember,
                                               Long artworkId){
        int response = membersStorageService.removeSeenArtwork(generalMember,artworkId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @PostMapping("/api/seen-artworks/remove/all")
    public ResponseEntity<?> removeAllSeenArtworks(@CurrentMember GeneralMember generalMember){
        int response = membersStorageService.removeAllSeenArtwork(generalMember);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/api/account-info-change")
    public ResponseEntity<?> changeAccountInfo(@CurrentMember GeneralMember generalMember,
                                               MemberInfoDto memberInfoDto){
        int response = 0;
        if(memberInfoDto.getName()!=null){
            response = membersService.changeName(memberInfoDto.getName(),generalMember);
        }
        if(memberInfoDto.getBirth()!=null){
            response = membersService.changeBirthday(memberInfoDto.getBirth(),generalMember);
        }
        if(memberInfoDto.getGender()!=null){
            response = membersService.changeGender(memberInfoDto.getGender(),generalMember);
        }
        if(memberInfoDto.getNationality()!=null){
            response = membersService.changeNationality(memberInfoDto.getNationality(),generalMember);
        }
        if(memberInfoDto.getPreferredLanguage()!=null){
            response = membersService.changePreferredLanguage(memberInfoDto.getPreferredLanguage(),generalMember);
        }
        GeneralMember editedGeneralMember = membersService.getById(generalMember.getId());
        SecurityContextHolder.clearContext();
        authenticationService.login(editedGeneralMember);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/api/delete-account")
    public ResponseEntity<?> deleteAccount(@CurrentMember GeneralMember generalMember,
                                           DeleteAccountDto deleteAccountDto){
        int response = membersService.deleteAccount(generalMember,deleteAccountDto);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @GetMapping("/api/advertisement")
    public ResponseEntity<?> advertisement(@RequestParam(name = "name") String name){
        Advertisement advertisement = advertisementService.getAdvertisementByName(name);
        return ResponseEntity.status(HttpStatus.OK).body(advertisement);
    }
}
