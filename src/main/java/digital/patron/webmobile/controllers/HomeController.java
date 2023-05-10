package digital.patron.webmobile.controllers;

import digital.patron.webmobile.artist.domain.Artist;
import digital.patron.webmobile.artist.service.ArtistService;
import digital.patron.webmobile.artwork.domain.Artwork;
import digital.patron.webmobile.artwork.service.ArtworkService;
import digital.patron.webmobile.common.annotation.CurrentMember;
import digital.patron.webmobile.exhibition.domain.Exhibition;
import digital.patron.webmobile.exhibition.service.ExhibitionService;
import digital.patron.webmobile.ipTable.service.IpTableService;
import digital.patron.webmobile.member.domain.GeneralMember;
import digital.patron.webmobile.member.repository.LoginStatusRepository;
import digital.patron.webmobile.member.service.MembersStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Controller
@Slf4j
@RequiredArgsConstructor
public class  HomeController {
    private static final String MAIN_EXHIBITION = "메인전시";
    private static final String WAITING_EXHIBITION = "전시그룹";
    private static final String HOME_THEME_1 = "테마1";
    private static final String HOME_THEME_2 = "테마2";
    private static final String HOME_THEME_3 = "테마3";
    private static final String HOME_THEME_4 = "테마4";
    private static final String HOME_THEME_5 = "테마5";

    private final ArtistService artistService;
    private final ExhibitionService exhibitionService;
    private final ArtworkService artworkService;
    private final MembersStorageService membersStorageService;
    private final LoginStatusRepository loginStatusRepository;
    private final IpTableService ipTableService;

    @GetMapping("/{language}/home")
    public String home(@CurrentMember GeneralMember generalMember,
                       @RequestParam(name = "error",required = false) String error,
                       HttpServletRequest request,
                       @PathVariable String language,
                       HttpSession session,
                       Model model) {
        Pageable pageable = PageRequest.ofSize(15);
        String localization = ipTableService.getLocalizationByIp(request);
        List<Exhibition> mainExhibitions = exhibitionService.findExhibitionsByGroupName(MAIN_EXHIBITION,localization,language);
        List<String> exhibitionDuration = exhibitionService.exhibitionListDuration(mainExhibitions, language);
        Optional<Exhibition> theme1 = exhibitionService.findExhibitionsByGroupName(HOME_THEME_1,localization,language).stream().findFirst();
        Optional<Exhibition> theme2 = exhibitionService.findExhibitionsByGroupName(HOME_THEME_2,localization,language).stream().findFirst();
        Optional<Exhibition> theme3 = exhibitionService.findExhibitionsByGroupName(HOME_THEME_3,localization,language).stream().findFirst();
        Optional<Exhibition> theme4 = exhibitionService.findExhibitionsByGroupName(HOME_THEME_4,localization,language).stream().findFirst();
        Optional<Exhibition> theme5 = exhibitionService.findExhibitionsByGroupName(HOME_THEME_5,localization,language).stream().findFirst();
        List<Artwork> newlyRegisteredArtworks = artworkService.findNewlyRegisteredArtworks(localization);

        if(generalMember != null){
            List<Artwork> watchedArtworks = artworkService.findSeenArtworks(generalMember.getEmail(),localization,pageable).getContent();
            List<Artwork> likedArtworks = artworkService.findLikedArtworks(generalMember.getEmail(),localization,pageable).getContent();
            String refererUrl = request.getHeader("Referer");
            if(refererUrl.contains("deviceName")){
                System.out.println("deviceName is contained in referer");
                if(loginStatusRepository.findByEmail(generalMember.getEmail()).isPresent()){
                    model.addAttribute("tvLoginSuccess", "success");
                }else{
                    model.addAttribute("tvLoginSuccess", "fail");
                }
            }
            model.addAttribute("watchedArtworks", watchedArtworks);
            model.addAttribute("likedArtworks", likedArtworks);
        }
        List<Exhibition> exhibitions = exhibitionService.findExhibitionsByGroupName(WAITING_EXHIBITION, localization, language);
        if(exhibitions != null){
            List<Boolean> alreadyWaiting = new ArrayList<>();
            for(Exhibition exhibition : exhibitions){
                alreadyWaiting.add(membersStorageService.checkIfAlreadyInWaitingList(generalMember,exhibition));
            }
            List<Long> leftTimeTillExhibition = exhibitionService.calculateLeftTimeTillExhibition(exhibitions);
            model.addAttribute("alreadyWaiting", alreadyWaiting);
            model.addAttribute("leftTimeTillExhibition", leftTimeTillExhibition);
        }
        List<Artist> artists = artistService.findArtistsByArtistGroupName(localization, pageable);
        model.addAttribute("error",error);
        theme1.ifPresent(exhibition -> {
            model.addAttribute("theme1", exhibition);
            model.addAttribute("theme1DurationTime", exhibitionService.exhibitionDuration(exhibition, language));
        });
        theme2.ifPresent(exhibition -> {
            model.addAttribute("theme2", exhibition);
            model.addAttribute("theme2DurationTime", exhibitionService.exhibitionDuration(exhibition, language));
        });
        theme3.ifPresent(exhibition -> {
            model.addAttribute("theme3", exhibition);
            model.addAttribute("theme3DurationTime", exhibitionService.exhibitionDuration(exhibition, language));
        });
        theme4.ifPresent(exhibition -> {
            model.addAttribute("theme4", exhibition);
            model.addAttribute("theme4DurationTime", exhibitionService.exhibitionDuration(exhibition, language));
        });
        theme5.ifPresent(exhibition -> {
            model.addAttribute("theme5", exhibition);
            model.addAttribute("theme5DurationTime", exhibitionService.exhibitionDuration(exhibition, language));
        });

        model.addAttribute("exhibitionDuration", exhibitionDuration);
        model.addAttribute("mainExhibitions", mainExhibitions);
        model.addAttribute("exhibitions", exhibitions);
        model.addAttribute("exhibitionsDurationTime", exhibitionService.exhibitionListDuration(exhibitions, language));

        model.addAttribute("newlyRegisteredArtworks", newlyRegisteredArtworks);
        model.addAttribute("generalMember", generalMember);
        model.addAttribute("artists", artists);
        Object deviceId = session.getAttribute("deviceId");
        if(deviceId != null){
            model.addAttribute("deviceId", deviceId);
            session.removeAttribute("deviceId");
        }
        model.addAttribute("language",language);
        return "home/home";
    }

}
