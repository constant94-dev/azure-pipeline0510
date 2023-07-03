package com.tvpatron.controllers;

import com.tvpatron.artist.domain.Artist;
import com.tvpatron.artist.service.ArtistService;
import com.tvpatron.artwork.domain.Artwork;
import com.tvpatron.artwork.domain.ArtworkArtworkTag;
import com.tvpatron.artwork.domain.ArtworkTag;
import com.tvpatron.artwork.service.ArtworkService;
import com.tvpatron.exhibition.domain.Exhibition;
import com.tvpatron.exhibition.service.ExhibitionService;
import com.tvpatron.integrate.domain.ArtistExhibition;
import com.tvpatron.integrate.domain.ArtworkExhibition;
import com.tvpatron.integrate.service.IntegrateService;
import com.tvpatron.ipTable.service.IpTableService;
import com.tvpatron.member.domain.Collection;
import com.tvpatron.member.domain.GeneralMember;
import com.tvpatron.member.dto.PlayerDto;
import com.tvpatron.member.service.MemberService;
import com.tvpatron.member.service.MemberStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/{language}")
public class PlayerController {
    private final MemberService memberService;
    private final MemberStorageService memberStorageService;
    private final ArtworkService artworkService;
    private final ArtistService artistService;
    private final ExhibitionService exhibitionService;
    private final IpTableService ipTableService;
    private final IntegrateService integrateService;

    @PostMapping(value = "/player")
    public ResponseEntity<?> player(@RequestParam(required = false, name = "art_id") Long artworkId,
                                    @RequestParam(required = false, name = "exh_id") Long exhibitionId,
                                    @RequestParam(required = false, name = "like") Boolean like,
                                    @RequestParam(required = false, name = "add_art") Boolean add_art_to_col,
                                    @RequestParam(required = false, name = "add_exh") Boolean add_exh_to_col,
                                    @RequestParam(required = false, name = "colName") String colName,
                                    @PathVariable String language,
                                    HttpSession session,
                                    Model model) {
        String email = (String) session.getAttribute("email_session");
        if(email==null) {return ResponseEntity.status(HttpStatus.FORBIDDEN).body(0);}
        GeneralMember member = memberService.getMemberByEmail(email);
        int response = 0;
        model.addAttribute("provider", member.getProvider());
        if (artworkId != null) {
            //like/dislike
            if (like != null) {
                response = like ? memberStorageService.addToLikedArtworks(artworkId, email) : memberStorageService.removeFromLikedArtworks(artworkId, email);
            }
            //add/remove artwork to/from collection
            if (add_art_to_col != null) {
                response = add_art_to_col ? memberStorageService.addArtworkToCollectionArtwork(artworkId, email, colName) : memberStorageService.removeArtworkFromCollectionArtwork(artworkId, email, colName);
            }
        }
        if (exhibitionId != null) {
            //add/remove exhibition to/from collection
            if (add_exh_to_col != null) {
                response = add_exh_to_col ? memberStorageService.addExhibitionToCollection(exhibitionId,language, email) : memberStorageService.removeExhibitionFromCollection(exhibitionId, email);
            }
        }
        // -2 collection is not present, -1 already done, 0 internal error, 1 OK
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


    @PostMapping(value = "/player/viewcount")
    public ResponseEntity<?> player(@RequestParam(name = "art_id") Long artworkId,
                                    HttpSession session) {
        String email = (String) session.getAttribute("email_session");
        if(email==null) {return ResponseEntity.status(HttpStatus.OK).body(0);}
        int response = memberStorageService.addToSeenArtworks(artworkId, email);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/player")
    public String player(@RequestParam(value = "exh_id", required = false) Long exhibitionId,
                         @RequestParam(value = "art_id", required = false) Long artworkId,
                         @RequestParam(value = "artist_id", required = false) Long artistId,
                         HttpSession session,
                         HttpServletRequest request,
                         @PathVariable String language,
                         @RequestParam(value = "myCollection", required = false) String myCollection,
                         Model model) {
        String email = (String) session.getAttribute("email_session");
        String provider = (String) session.getAttribute("provider_session");
        model.addAttribute("loginStatus", email != null);
        String localization = ipTableService.getLocalizationByIp(request);
        GeneralMember member = email != null ?  memberService.getMemberByEmail(email) : null;
        String title = null;
        List<Artwork> subsequentWatchingList = null;
        if(artworkId == null && exhibitionId == null && artistId == null) return "redirect:/"+ language+"/error";
        Artwork artwork;
        if(exhibitionId != null){
            Exhibition exhibition = exhibitionService.findExhibitionById(exhibitionId,language,localization);
            if(artworkId == null) artworkId = exhibition.getArtworkExhibitions().stream().findFirst().orElseGet(null).getArtwork().getId();
            Integer artistsInExhibition = exhibition.getArtistExhibitions().size()-1;
            Boolean exhibitionInCollection = member != null ? memberStorageService.isExhibitionInCollection(member, exhibition) : null;
            subsequentWatchingList = artworkService.findSubsequentWatchingList(exhibitionId, artworkId,localization);
            title = exhibition.getExhibitionDetails().stream().filter(a->a.getLanguage().equals(language)).findFirst().get().getExhibitionName();
            model.addAttribute("exhibitionInCollection", exhibitionInCollection);
            model.addAttribute("subsequentWatchingList", subsequentWatchingList);
            model.addAttribute("exhibition", exhibition);
            model.addAttribute("artistsInExhibition",artistsInExhibition);
        }
        if(artistId != null){
            Artist artist = artistService.findArtistById(artistId);
            if(!artist.getLocalization().contains(localization)){
                return "redirect:https://tvpatron.com/"+ language+"/error";
            }
            if(artworkId == null) artworkId = artist.getArtworks().stream().filter(a -> a.getLocalization().contains(localization)).findFirst().get().getId();
            subsequentWatchingList = artworkService.findSubsequentArtistWatchingList(artistId, artworkId,localization);
            model.addAttribute("subsequentWatchingList", subsequentWatchingList);
            model.addAttribute("artist", artist);
        }
        if(myCollection != null && member != null){
            Collection collection = memberStorageService.findCollectionByNameAndMemberAndExhibitionNull(myCollection,member,localization);
            if(artworkId == null) artworkId = collection.getCollectionArtworks().stream().findFirst().get().getId();
            subsequentWatchingList = memberStorageService.findSubsequentArtworkInCollection(member, artworkId, collection, localization);
            title = myCollection;
            model.addAttribute("subsequentWatchingList", subsequentWatchingList);
            model.addAttribute("myCollection", myCollection);
        }
        artwork = artworkService.findArtworkById(artworkId);
        if(!artwork.getLocalization().contains(localization)) return "redirect:https://tvpatron.com/" + language + "/error";
        if(exhibitionId == null && artistId == null && myCollection == null){
            subsequentWatchingList = artworkService.findSubsequentArtworkWatchingList(artwork,localization);
            model.addAttribute("subsequentWatchingList", subsequentWatchingList);
        }
        if(member!=null){
            Boolean artworkLiked = memberStorageService.isArtworkLikedByMember(member, artwork);
            List<Collection> allCollections = memberStorageService.getAllCollections(member);
            List<Boolean> artworkInCollection = memberStorageService.isArtworkInCollections(allCollections,artwork);
            LocalDate lastViewTime = memberStorageService.getLastViewTime(artwork,member);
            if (allCollections.size() > 1) {
                List<Collection> recentCollections = memberStorageService.findFirst3RecentCollections(allCollections);
                List<Boolean> artworkInRecentCollection = memberStorageService.isArtworkInCollections(recentCollections, artwork);
                model.addAttribute("recentCollections", recentCollections.stream().map(Collection::getCollectionName).collect(Collectors.toList()));
                model.addAttribute("artworkInRecentCollection", artworkInRecentCollection);
            }
            model.addAttribute("allCollections",allCollections);
            model.addAttribute("artworkInCollection",artworkInCollection);
            model.addAttribute("artworkLiked", artworkLiked);
            model.addAttribute("lastViewTime",lastViewTime);
            model.addAttribute("nickName", member.getName());
        }
        title = "PATRON | " + (title == null ? artwork.getArtworkDetails().stream().filter(a->a.getLanguage().equals(language)).findFirst().get().getArtworkName() : title);
        System.out.println(title);
        model.addAttribute("artwork", artwork);
        model.addAttribute("provider", provider);
        model.addAttribute("language", language);
        model.addAttribute("title",title);
        return "player/player";
    }

    @GetMapping("/nft-player")
    public String nftPlayer(
            @RequestParam(required = false, name = "playUrl") String playUrl,
            @RequestParam(required = false, name = "title") String title,
            @RequestParam(required = false, name = "artist") String artist,
            Model model){
        model.addAttribute("playUrl",playUrl);
        model.addAttribute("title",title);
        model.addAttribute("artist",artist);
        return "player/nft-player";
    }

    @GetMapping("/api/player")
    @ResponseBody
    public ResponseEntity<?> nextPlayer(@RequestParam(value = "exh_id", required = false) Long exhibitionId,
                                        @RequestParam(value = "art_id", required = false) Long artworkId,
                                        @RequestParam(value = "artist_id", required = false) Long artistId,
                                        HttpSession session,
                                        HttpServletRequest request,
                                        @PathVariable String language,
                                        @RequestParam(value = "myCollection", required = false) String myCollection) {
        String email = (String) session.getAttribute("email_session");
        String localization = ipTableService.getLocalizationByIp(request);
        Exhibition exhibition = exhibitionId != null ? exhibitionService.findExhibitionById(exhibitionId,language,localization) : null;
        if(artworkId == null && exhibitionId == null && artistId == null && myCollection == null) return ResponseEntity.status(HttpStatus.OK).body(0);
        GeneralMember member = email != null ? memberService.getMemberByEmail(email) : null;
        if(artworkId == null){
            if(exhibitionId != null){
                artworkId = integrateService.findFirstArtworkIdByExhibitionId(exhibitionId,language,localization);
            }else if(artistId != null){
                artworkId = integrateService.findFirstArtworkIdByArtistId(artistId,language,localization);
            }else if(member != null){
                artworkId = integrateService.findFirstArtworkIdByCollectionName(myCollection,member,localization);
            }else{
                return ResponseEntity.status(HttpStatus.OK).body(0);
            }
        }
        Artwork artwork = artworkService.findArtworkById(artworkId);
        if(!artwork.getLocalization().contains(localization)) return ResponseEntity.status(HttpStatus.OK).body(0);
        PlayerDto playerDto = integrateService.createPlayerDto(artwork,exhibition,member,language,localization);
        return ResponseEntity.status(HttpStatus.OK).body(playerDto);
    }

    @GetMapping("/api/shop-url")
    public ResponseEntity<?> shopUrl(@RequestParam Long artworkId){
        String shopUrl = artworkService.findShopUrlById(artworkId);
        return ResponseEntity.status(HttpStatus.OK).body(shopUrl);
    }
}
