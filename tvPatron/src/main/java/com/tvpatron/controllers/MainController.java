package com.tvpatron.controllers;

import com.tvpatron.advertisement.domain.Advertisement;
import com.tvpatron.advertisement.service.AdvertisementService;
import com.tvpatron.artist.domain.Artist;
import com.tvpatron.artist.service.ArtistService;
import com.tvpatron.artwork.domain.Artwork;
import com.tvpatron.artwork.service.ArtworkService;
import com.tvpatron.exhibition.domain.Exhibition;
import com.tvpatron.exhibition.service.ExhibitionService;
import com.tvpatron.integrate.domain.ArtworkExhibition;
import com.tvpatron.integrate.service.IntegrateService;
import com.tvpatron.ipTable.service.IpTableService;
import com.tvpatron.member.domain.GeneralMember;
import com.tvpatron.member.service.LoginToTvService;
import com.tvpatron.member.service.MemberService;
import com.tvpatron.member.service.MemberStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Controller
@Slf4j
@RequiredArgsConstructor
public class MainController {
    private static final String MAIN_EXHIBITION = "메인전시";
    private static final String WAITING_EXHIBITION = "전시그룹";
    private static final String HOME_THEME_1 = "테마1";
    private static final String HOME_THEME_2 = "테마2";
    private static final String HOME_THEME_3 = "테마3";
    private static final String HOME_THEME_4 = "테마4";
    private static final String HOME_THEME_5 = "테마5";


    private final ArtistService artistService;
    private final ArtworkService artworkService;
    private final ExhibitionService exhibitionService;
    private final MemberStorageService memberStorageService;
    private final AdvertisementService advertisementService;
    private final LoginToTvService loginToTvService;
    private final IntegrateService integrateService;
    private final MemberService memberService;
    private final IpTableService ipTableService;
    @GetMapping("/index")
    @ResponseBody
    public String index() {
        return "main/home";
    }
    @GetMapping("/{language}/home")
    public String home(
            HttpSession session,
            HttpServletRequest request,
            @PathVariable String language,
            Model model) {
        Pageable pageable = PageRequest.ofSize(15);
        String email = (String) session.getAttribute("email_session");
        String provider = (String) session.getAttribute("provider_session");
        model.addAttribute("loginStatus", email != null);
        String localization = ipTableService.getLocalizationByIp(request);
        List<Exhibition> mainExhibitions = exhibitionService.findExhibitionsByGroupName(MAIN_EXHIBITION,localization,language);
        List<String> exhibitionDuration = integrateService.exhibitionListDuration(mainExhibitions, language);
        Optional<Exhibition> theme1 = exhibitionService.findExhibitionsByGroupName(HOME_THEME_1,localization,language).stream().findFirst();
        Optional<Exhibition> theme2 = exhibitionService.findExhibitionsByGroupName(HOME_THEME_2,localization,language).stream().findFirst();
        Optional<Exhibition> theme3 = exhibitionService.findExhibitionsByGroupName(HOME_THEME_3,localization,language).stream().findFirst();
        Optional<Exhibition> theme4 = exhibitionService.findExhibitionsByGroupName(HOME_THEME_4,localization,language).stream().findFirst();
        Optional<Exhibition> theme5 = exhibitionService.findExhibitionsByGroupName(HOME_THEME_5,localization,language).stream().findFirst();
        List<Exhibition> exhibitions = exhibitionService.findExhibitionsByGroupName(WAITING_EXHIBITION, localization, language);
        List<Boolean> alreadyWaiting = new ArrayList<>();
        if(email!=null){
            GeneralMember member = memberService.getMemberByEmail(email);
            for(Exhibition exhibition : exhibitions){
                alreadyWaiting.add(memberStorageService.checkIfAlreadyInWaitingList(member,exhibition));
            }
            List<Artwork> watchedArtworks = artworkService.findSeenArtworks(email,localization,language,pageable);
            List<Artwork> likedArtworks = artworkService.findLikedArtworks(email,localization,language,pageable);
            model.addAttribute("nickName", member.getName());
            model.addAttribute("watchedArtworks", watchedArtworks);
            model.addAttribute("likedArtworks", likedArtworks);
        }else{
            for(Exhibition ignored : exhibitions) {
                alreadyWaiting.add(false);
            }
        }
        List<Long> leftTimeTillExhibition = exhibitionService.calculateLeftTimeTillExhibition(exhibitions);
        List<Artwork> newlyRegisteredArtworks = artworkService.findNewlyRegisteredArtworks(localization);
        List<Artist> artists = artistService.findArtistsByArtistGroupName(localization, pageable);
        theme1.ifPresent(exhibition -> {
            model.addAttribute("theme1", exhibition);
            model.addAttribute("theme1DurationTime", integrateService.exhibitionDuration(exhibition, language));
        });
        theme2.ifPresent(exhibition -> {
            model.addAttribute("theme2", exhibition);
            model.addAttribute("theme2DurationTime", integrateService.exhibitionDuration(exhibition, language));
        });
        theme3.ifPresent(exhibition -> {
            model.addAttribute("theme3", exhibition);
            model.addAttribute("theme3DurationTime", integrateService.exhibitionDuration(exhibition, language));
        });
        theme4.ifPresent(exhibition -> {
            model.addAttribute("theme4", exhibition);
            model.addAttribute("theme4DurationTime", integrateService.exhibitionDuration(exhibition, language));
        });
        theme5.ifPresent(exhibition -> {
            model.addAttribute("theme5", exhibition);
            model.addAttribute("theme5DurationTime", integrateService.exhibitionDuration(exhibition, language));
        });
        model.addAttribute("exhibitionDuration", exhibitionDuration);
        model.addAttribute("mainExhibitions", mainExhibitions);
        model.addAttribute("exhibitions", exhibitions);
        model.addAttribute("alreadyWaiting", alreadyWaiting);
        model.addAttribute("exhibitionsDuration", integrateService.exhibitionListDuration(exhibitions,language));
        model.addAttribute("leftTimeTillExhibition", leftTimeTillExhibition);
        model.addAttribute("newlyRegisteredArtworks", newlyRegisteredArtworks);
        model.addAttribute("artists", artists);
        model.addAttribute("language",language);
        model.addAttribute("provider", provider);
        return "home/home";
    }

    //not used yet
    @GetMapping("/api/sound")
    public ResponseEntity<?> getSound(@RequestParam(value = "art_id",required = false) Long art_id,
                                      @RequestParam(value = "artist_id",required = false) Long artist_id,
                                      @RequestParam(value = "exh_id",required = false) Long exh_id){
        String soundUrl = null;

        if (art_id != null) {
            Artwork artwork = artworkService.findArtworkById(art_id);
            soundUrl = artwork.getSound().getSoundUrl();
        } else if (artist_id != null) {
            Artist artist = artistService.findArtistById(artist_id);
            Artwork artwork = artist.getArtworks().stream().findFirst().orElse(null);
            if (artwork != null) {
                soundUrl = artwork.getSound().getSoundUrl();
            }
        } else if (exh_id != null) {
            Exhibition exhibition = exhibitionService.findExhibitionByIdIgnoreShowing(exh_id);
            ArtworkExhibition artworkExhibition = exhibition.getArtworkExhibitions().stream().findFirst().orElse(null);
            if (artworkExhibition != null) {
                soundUrl = artworkExhibition.getArtwork().getSound().getSoundUrl();
            }
        }

        if (soundUrl != null) {
            return ResponseEntity.status(HttpStatus.OK).body(soundUrl);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(0);
        }
    }
    @GetMapping("/advertisement")
    public ResponseEntity<?> advertisement(@RequestParam(name = "name") String name) {
        Advertisement advertisement = advertisementService.getAdvertisementByName(name);
        return ResponseEntity.status(HttpStatus.OK).body(advertisement);
    }

    @GetMapping("/")
    public String indexpage(
            @RequestParam(required = false, name = "deviceName") String deviceName,
            @RequestParam(required = false, name = "deviceId") String deviceId,
            @RequestParam(required = false, name = "provider") String provider,
            HttpServletRequest request,
            HttpSession session) {
        String email = (String) session.getAttribute("email_session");
        String language = "en";
        if (email != null) {
            if (deviceId == session.getAttribute("deviceId_session") && loginToTvService.checkLoginStatus(deviceId).isPresent()) {
                language = memberService.getPreferredLanguage(email);
                return "redirect:/" + language + "/home";
            } else {
                loginToTvService.logout(email);
                session.invalidate();
            }
        }
        request.getSession().setAttribute("deviceId_session", deviceId);
        request.getSession().setAttribute("deviceName_session", deviceName);
        request.getSession().setAttribute("provider_session", provider);
        String localization = ipTableService.getLocalizationByIp(request);
        switch (localization) {
            case "kr":
                return "redirect:/ko/smartTvLogin";
            case "jp":
                return "redirect:/ja/smartTvLogin";
            default:
                break;
        }
        return "redirect:/" + language + "/smartTvLogin";
    }
    @GetMapping("/smartTvLogin")
    public String redirectToLogin(@RequestParam(required = false, name = "provider") String provider,
                                  @RequestParam(required = false, name = "duid") String deviceId,
                                  @RequestParam(required = false, name = "deviceName") String deviceName,
                                  HttpServletRequest request,
                                  HttpSession session) {
        String email = (String) session.getAttribute("email_session");
        String language = "en";
        if(email!=null){
            if(deviceId == session.getAttribute("deviceId_session")){
                language = memberService.getPreferredLanguage(email);
                return "redirect:/" + language + "/home";
            }else{
                loginToTvService.logout(email);
                session.invalidate();
            }
        }
        if(!deviceId.equalsIgnoreCase("kt")){
            request.getSession().setAttribute("deviceId_session", deviceId);
            request.getSession().setAttribute("deviceName_session", deviceName);
            request.getSession().setAttribute("provider_session", provider);
        }
        String localization = ipTableService.getLocalizationByIp(request);
        switch (localization) {
            case "kr":
                return "redirect:/ko/smartTvLogin";
            case "jp":
                return "redirect:/ja/smartTvLogin";
            default:
                break;
        }
        return "redirect:https://tvpatron.com/" + language + "/smartTvLogin";
    }
    @GetMapping("/{language}/smartTvLogin")
    public String samsungLogin(@PathVariable String language) {
        return "smartTvLogin/login";
    }
    //service
    @GetMapping("/service_policy_kr")
    public String service_policy_kr(){
        return "txt/service_policy_kr.txt";
    }
    @GetMapping("/service_policy_en")
    public String service_policy_en(){
        return "txt/service_policy_en.txt";
    }
    @GetMapping("/service_policy_ja")
    public String service_policy_ja(){
        return "txt/service_policy_ja.txt";
    }
    //private
    @GetMapping("/private_policy_kr")
    public String private_policy_kr(){
        return "txt/private_policy_kr.txt";
    }
    @GetMapping("/private_policy_en")
    public String private_policy_en(){
        return "txt/private_policy_en.txt";
    }
    @GetMapping("/private_policy_ja")
    public String private_policy_ja(){
        return "txt/private_policy_ja.txt";
    }
    //account
    @GetMapping("/account_policy_kr")
    public String account_policy_kr(){
        return "txt/account_policy_kr.txt";
    }
    @GetMapping("/account_policy_en")
    public String account_policy_en(){
        return "txt/account_policy_en.txt";
    }
    @GetMapping("/account_policy_ja")
    public String account_policy_ja(){
        return "txt/account_policy_ja.txt";
    }
}