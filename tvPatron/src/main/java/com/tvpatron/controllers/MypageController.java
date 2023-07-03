package com.tvpatron.controllers;

import com.tvpatron.artist.domain.Artist;
import com.tvpatron.artist.service.ArtistService;
import com.tvpatron.artwork.domain.Artwork;
import com.tvpatron.artwork.service.ArtworkService;
import com.tvpatron.exhibition.domain.Exhibition;
import com.tvpatron.exhibition.service.ExhibitionService;
import com.tvpatron.integrate.service.IntegrateService;
import com.tvpatron.ipTable.service.IpTableService;
import com.tvpatron.member.domain.Collection;
import com.tvpatron.member.domain.CollectionArtwork;
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
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/{language}")
public class MypageController {
    private final LoginToTvService loginToTvService;
    private final MemberService memberService;
    private final MemberStorageService memberStorageService;
    private final ArtworkService artworkService;
    private final ArtistService artistService;
    private final ExhibitionService exhibitionService;
    private final IpTableService ipTableService;
    private final IntegrateService integrateService;
    @GetMapping("/storage")
    public String storage(
            HttpSession session,
            HttpServletRequest request,
            @PathVariable String language,
            Model model) {
        Pageable pageable = PageRequest.ofSize(15);
        String email = (String) session.getAttribute("email_session");
        String provider = (String) session.getAttribute("provider_session");
        if(email == null) {return "redirect:"+language+"/error";}
        model.addAttribute("loginStatus", true);
        String localization = ipTableService.getLocalizationByIp(request);
        GeneralMember member = memberService.getMemberByEmail(email);
        List<Collection> artworkCollections = memberStorageService.findArtworkCollections(email,localization,pageable);
        List<Collection> exhibitionsCollections = memberStorageService.findExhibitionsCollection(email,localization,language, pageable);
        List<String> exhibitionsCollectionsDuration = integrateService.exhibitionListDuration(exhibitionsCollections.stream().map(Collection::getExhibition).collect(Collectors.toList()), language);
        List<Exhibition> waitingExhibitions = memberStorageService.findWaitingExhibition(email,localization, language, pageable);
        List<String> waitingExhibitionsDuration = integrateService.exhibitionListDuration(waitingExhibitions,language);
        List<Artwork> watchedArtworks = artworkService.findSeenArtworks(email,localization, language, pageable);
        List<Artist> likedArtists = artistService.findLikedArtists(email,localization, language, pageable);
        List<Artwork> likedArtworks = artworkService.findLikedArtworks(email,localization, language, pageable);
        List<Long> leftTimeTillExhibition = exhibitionService.calculateLeftTimeTillExhibition(waitingExhibitions);
        List<CollectionArtwork> lastAddedArtworkInArtworkCollection = memberStorageService.lastAddedArtworkInArtworkCollection(artworkCollections);
        model.addAttribute("provider", provider);
        model.addAttribute("artworkCollections", artworkCollections);
        model.addAttribute("language", language);
        model.addAttribute("likedArtists", likedArtists);
        model.addAttribute("likedArtworks", likedArtworks);
        model.addAttribute("exhibitionsCollections", exhibitionsCollections);
        model.addAttribute("exhibitionsCollectionsDuration", exhibitionsCollectionsDuration);
        model.addAttribute("watchedArtworks", watchedArtworks);
        model.addAttribute("nickName", member.getName());
        model.addAttribute("waitingExhibitions", waitingExhibitions);
        model.addAttribute("waitingExhibitionsDuration", waitingExhibitionsDuration);
        model.addAttribute("leftTimeTillExhibition", leftTimeTillExhibition);
        model.addAttribute("lastAddedArtworkInArtworkCollection", lastAddedArtworkInArtworkCollection);
        return "storage/storage";
    }
    @PostMapping("/api/waiting")
    public ResponseEntity<?> addToWaitingList(@RequestParam(value = "exh_id") Long exh_id,
                                              @RequestParam(value = "waiting")Boolean waiting,
                                              HttpSession session) {
        String email = (String) session.getAttribute("email_session");
        if(email==null) {return ResponseEntity.status(HttpStatus.FORBIDDEN).body(0);}
        if (waiting) {
            memberStorageService.addToWaitingExhibitions(exh_id, email);
        } else {
            memberStorageService.removeFromWaitingExhibitions(exh_id, email);
        }
        return ResponseEntity.status(HttpStatus.OK).body(1);
    }
    @PostMapping("/api/like-artist")
    public ResponseEntity<?> likeArtist(@RequestParam(name = "art_id") Long artistId,
                                        @RequestParam(name = "like") Boolean like,
                                        HttpSession session){
        int response;
        String email = (String) session.getAttribute("email_session");
        if(email==null) {return ResponseEntity.status(HttpStatus.FORBIDDEN).body(0);}
        GeneralMember generalMember = memberService.getMemberByEmail(email);
        if(generalMember == null || like == null){return ResponseEntity.status(HttpStatus.OK).body(-2);}
        if (like) {
            response = memberStorageService.addToLikedArtists(artistId, generalMember);
        } else {
            response = memberStorageService.removeFromLikedArtists(artistId, generalMember);
        }
        // -2 bad request, 0 error, 1 success
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
