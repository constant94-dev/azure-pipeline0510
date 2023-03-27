package digital.patron.webmobile.controllers;

import digital.patron.webmobile.artMagazine.service.ArtMagazineService;
import digital.patron.webmobile.artist.domain.Artist;
import digital.patron.webmobile.artist.service.ArtistService;
import digital.patron.webmobile.artwork.domain.Artwork;
import digital.patron.webmobile.artwork.domain.ArtworkTag;
import digital.patron.webmobile.artwork.dto.ArtworkAllDto;
import digital.patron.webmobile.artwork.dto.ArtworkDto;
import digital.patron.webmobile.artwork.service.ArtworkService;
import digital.patron.webmobile.common.annotation.CurrentMember;
import digital.patron.webmobile.exhibition.domain.Exhibition;
import digital.patron.webmobile.exhibition.dto.ExhibitionDto;
import digital.patron.webmobile.exhibition.service.ExhibitionService;
import digital.patron.webmobile.ipTable.service.IpTableService;
import digital.patron.webmobile.member.domain.Collection;
import digital.patron.webmobile.member.domain.GeneralMember;
import digital.patron.webmobile.member.dto.ArtworkMoreDto;
import digital.patron.webmobile.member.dto.CollectionDto;
import digital.patron.webmobile.member.service.LoginToTvService;
import digital.patron.webmobile.member.service.MembersStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.stream.Collectors;


@Controller
@Slf4j
@RequiredArgsConstructor
public class ArtStreamController {
    private static final String MAIN_EXHIBITION = "메인전시";
    private static final String WAITING_EXHIBITION = "전시그룹";
    private static final String HOME_THEME_1 = "테마1";
    private static final String HOME_THEME_2 = "테마2";
    private static final String HOME_THEME_3 = "테마3";
    private static final String HOME_THEME_4 = "테마4";
    private static final String HOME_THEME_5 = "테마5";

    private final ArtistService artistService;
    private final ArtworkService artworkService;
    private final ArtMagazineService artMagazineService;
    private final ExhibitionService exhibitionService;
    private final LoginToTvService loginToTvService;
    private final MembersStorageService membersStorageService;
    private final IpTableService ipTableService;

    @GetMapping("/{language}/artstream")
    public String home(@CurrentMember GeneralMember generalMember,
            @PathVariable String language,
            HttpServletRequest request,
            Model model) {
        String localization = ipTableService.getLocalizationByIp(request);
        Pageable pageable = PageRequest.ofSize(15);
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
            model.addAttribute("watchedArtworks", watchedArtworks);
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
        theme1.ifPresent(exhibition -> model.addAttribute("theme1", exhibition));
        theme2.ifPresent(exhibition -> model.addAttribute("theme2", exhibition));
        theme3.ifPresent(exhibition -> model.addAttribute("theme3", exhibition));
        theme4.ifPresent(exhibition -> model.addAttribute("theme4", exhibition));
        theme5.ifPresent(exhibition -> model.addAttribute("theme5", exhibition));
        model.addAttribute("exhibitionDuration", exhibitionDuration);
        model.addAttribute("mainExhibitions", mainExhibitions);
        model.addAttribute("exhibitions", exhibitions);
        model.addAttribute("newlyRegisteredArtworks", newlyRegisteredArtworks);
        model.addAttribute("generalMember", generalMember);
        model.addAttribute("language",language);
        return "artstream/artstream";
    }

    @GetMapping("/{language}/artstream/all")
    public String exhibitions(@RequestParam(name = "sortBy",required = false) String sortBy,
                              @CurrentMember GeneralMember generalMember,
                              @PathVariable String language,
                              HttpServletRequest request,
                              Model model) {
        Pageable pageable = PageRequest.ofSize(12);
        String localization = ipTableService.getLocalizationByIp(request);
        List<Exhibition> exhibitions = exhibitionService.getAllExhibitionsSorted(sortBy,localization,pageable);
        List<String> exhibitionDuration = exhibitionService.exhibitionListDuration(exhibitions, language);
        model.addAttribute("exhibitions",exhibitions);
        model.addAttribute("exhibitionDuration", exhibitionDuration);
        model.addAttribute("generalMember",generalMember);
        model.addAttribute("language",language);
        return "artstream/artstream-all";
    }
    @GetMapping("/{language}/artwork/all")
    public String artworks(@RequestParam(name = "sortBy",required = false) String sortBy,
                              @CurrentMember GeneralMember generalMember,
                              @PathVariable String language,
                              HttpServletRequest request,
                              Model model) {
        Pageable pageable = PageRequest.ofSize(20);
        String localization = ipTableService.getLocalizationByIp(request);
        List<Artwork> artworks = artworkService.getAllArtworksSorted(sortBy,localization,pageable);
        model.addAttribute("artworks",artworks);
        model.addAttribute("generalMember",generalMember);
        model.addAttribute("language",language);
        System.out.println(artworks.size());
        return "artstream/artwork-all";
    }
    @GetMapping("/{language}/api/artwork/all")
    public ResponseEntity<?> apiArtworks(@RequestParam(name = "sortBy",required = false) String sortBy,
                                            @PathVariable String language,
                                            HttpServletRequest request,
                                            @RequestParam("p") int page) {
        Pageable pageable = PageRequest.of(page-1,20);
        String localization = ipTableService.getLocalizationByIp(request);
        List<Artwork> artworks = artworkService.getAllArtworksSorted(sortBy,localization,pageable);
        ArtworkAllDto artworkDto = artworkService.createArtworkAllDto(artworks,language);
        return ResponseEntity.status(HttpStatus.OK).body(artworkDto);
    }
    @GetMapping("/{language}/api/artstream/all")
    public ResponseEntity<?> apiExhibitions(@RequestParam(name = "sortBy",required = false) String sortBy,
                                            @PathVariable String language,
                                            HttpServletRequest request,
                                            @RequestParam("p") int page) {
        Pageable pageable = PageRequest.of(page-1,12);
        String localization = ipTableService.getLocalizationByIp(request);
        List<Exhibition> exhibitions = exhibitionService.getAllExhibitionsSorted(sortBy,localization,pageable);
        ExhibitionDto exhibitionDto = exhibitionService.createExhibitionDto(exhibitions,language);
        return ResponseEntity.status(HttpStatus.OK).body(exhibitionDto);
    }

    @GetMapping("/{language}/player")
    public String exhibition(@RequestParam(value = "exh_id", required = false) Long exhibitionId,
                             @RequestParam(value = "art_id",required = false) Long artworkId,
                             @RequestParam(value = "artist_id",required = false) Long artistId,
                             @RequestParam(value = "jump", required = false) Boolean jump,
                             @PathVariable String language,
                             HttpServletRequest request,
                             @CurrentMember GeneralMember generalMember,
                             Model model) {
        String localization = ipTableService.getLocalizationByIp(request);

        if(generalMember!=null){
            String deviceName = loginToTvService.getLoggedInTvName(generalMember.getEmail());
            model.addAttribute("deviceName", deviceName);
        }
        model.addAttribute("generalMember",generalMember);
        Artwork artwork = null;
        Exhibition exhibition = null;
        Long parameterArtworkId = artworkId;
        if(artworkId == null && exhibitionId == null && artistId == null){
            return "redirect:/"+language+"/error";
        }
        if(exhibitionId != null) {
            exhibition = exhibitionService.findExhibitionById(localization, exhibitionId);
            if (artworkId == null) {
                artworkId = exhibition.getArtworkExhibitions().stream().findFirst().get().getArtwork().getId();
            }
            String exhibitionDuration = exhibitionService.exhibitionDuration(exhibition, language);
            Boolean exhibitionSaved = membersStorageService.isExhibitionInCollection(generalMember, exhibitionId);
//            List<Exhibition> similarExhibitions = exhibitionService.findSimilarExhibitions(localization, exhibition);
//            List<String> similarExhibitionsDuration = exhibitionService.exhibitionListDuration(similarExhibitions, language);
            exhibition.getExhibitionExhibitionTags().removeAll(exhibition.getExhibitionExhibitionTags().stream().filter(e -> !e.getExhibitionTag().getLanguage().equals(language)).collect(Collectors.toList()));
            List<Artwork> exhibitionArtworks = artworkService.sortArtworks(artworkId,exhibition.getArtworkExhibitions().stream().map(e->e.getArtwork()).collect(Collectors.toList()));
            model.addAttribute("exhibition", exhibition);
            model.addAttribute("exhibitionArtworkList", exhibitionArtworks);
            model.addAttribute("exhibitionCount", exhibition.getArtistExhibitions().size());
            model.addAttribute("exhibitionDocent", exhibition.getDocent());
            model.addAttribute("exhibitionFirst", exhibition.getArtworkExhibitions().stream().findFirst().get().getArtwork().getContentsHd().getDefaultImg());
            model.addAttribute("exhibitionSaved", exhibitionSaved);
//            model.addAttribute("similarExhibitions", similarExhibitions);
//            model.addAttribute("similarExhibitionsDuration", similarExhibitionsDuration);
            model.addAttribute("exhibitionDuration", exhibitionDuration);

        }
        List<Artwork> recommendedList = null;
        if(artistId != null){
            Artist artist = artistService.findArtistById(artistId, localization);
            recommendedList = artist.getArtworks().stream().collect(Collectors.toList());
            if(artworkId == null){
                artworkId = artist.getArtworks().stream().findFirst().get().getId();
            }
            model.addAttribute("artist",artist);
        }
        artwork = artworkService.findArtworkById(localization, artworkId);
        List<Artwork> otherArtistArtworks = artwork.getArtist().getArtworks().stream().filter(ar->ar.getLocalization().contains(localization)).sorted(Comparator.comparing(a->a.getNumberOfViews())).limit(15).collect(Collectors.toList());
        List<ArtworkTag> artworkTags = artwork.getArtworkArtworkTags().stream().filter(t->t.getArtworkTag().getLanguage().equals(language)).map(a->a.getArtworkTag()).limit(15).collect(Collectors.toList());
        List<Exhibition> otherExhibitions = artwork.getArtworkExhibitions().stream().filter(e->e.getExhibition().getLocalization().contains(localization)).map(a->a.getExhibition()).collect(Collectors.toList());
        otherExhibitions.addAll(artwork.getArtist().getArtistExhibitions().stream().filter(e->e.getExhibition().getLocalization().contains(localization)).map(a->a.getExhibition()).collect(Collectors.toList()));
        Set<Exhibition> exhibitionSet = new HashSet<Exhibition>(otherExhibitions);
        List<Exhibition> recommendedExhibitions = new ArrayList<Exhibition>(exhibitionSet).stream().limit(16).collect(Collectors.toList());
        if(exhibitionId != null){
            recommendedExhibitions.remove(exhibitionService.findExhibitionById(localization,exhibitionId));
        }
        List<String> recommendedExhibitionsDuration = exhibitionService.exhibitionListDuration(recommendedExhibitions, language);
        if(artistId == null){
            recommendedList = artworkService.findSubsequentArtworkWatchingList(artwork,localization);
//            Artist artist = artistService.findArtistById(artistId, localization);
//            List<Artwork> artistExhibitionsFirstArtwork = recommendedExhibitions.stream().map(a->a.getArtworkExhibitions().stream()
//                    .filter(art->art.getArtwork().getArtist().equals(artist)).findFirst().get().getArtwork()).collect(Collectors.toList());
//            model.addAttribute("artistExhibitionsFirstArtwork",artistExhibitionsFirstArtwork);

        }
        model.addAttribute("recommendedList",recommendedList);
        model.addAttribute("otherArtistArtworks",otherArtistArtworks);
        model.addAttribute("artworkTags",artworkTags);
        model.addAttribute("recommendedExhibitions",recommendedExhibitions);
        model.addAttribute("recommendedExhibitionsDuration",recommendedExhibitionsDuration);
        model.addAttribute("title", exhibition != null ?
                exhibition.getExhibitionDetails().stream().filter(e->e.getLanguage().equals(language)).findFirst().get().getExhibitionName() :
                artwork.getArtworkDetails().stream().filter(a->a.getLanguage().equals(language)).findFirst().get().getArtworkName());
        model.addAttribute("description", exhibition != null ?
                exhibition.getExhibitionDetails().stream().filter(e->e.getLanguage().equals(language)).findFirst().get().getIntro() :
                artwork.getArtworkDetails().stream().filter(a->a.getLanguage().equals(language)).findFirst().get().getIntro());
        model.addAttribute("artwork",artwork);
        model.addAttribute("artworkId",artworkId);
        model.addAttribute("jump",jump);
        model.addAttribute("language",language);
//        String ogText;
//        switch (language){
//            case "ko": ogText = "그림과 음악으로 시간을 채워보세요.";break;
//            case "ja": ogText = "絵と音楽で時間を満たしてください。";break;
//            default: ogText = "Fill your time with art and music.";break;
//        }
        //OG태그용
        if(artworkId==null){
            model.addAttribute("ogImg",artwork.getContentsThumbnail().getDefaultImg());
//            model.addAttribute("ogText",exhibition.getExhibitionDetails().stream().filter(e->e.getLanguage().equals(language)).findFirst().get().getExhibitionName()+ogText);
            model.addAttribute("ogUrl", request.getRequestURL().append('?').append(request.getQueryString()));
        }else{
            model.addAttribute("ogImg",artwork.getContentsThumbnail().getDefaultImg());
//            model.addAttribute("ogText",artwork.getArtworkDetails().stream().filter(a->a.getLanguage().equals(language)).findFirst().get().getArtworkName()+ogText);
            model.addAttribute("ogUrl", request.getRequestURL().append('?').append(request.getQueryString()));
            model.addAttribute("directArtworkId",parameterArtworkId);
            if (parameterArtworkId != null ){
                model.addAttribute("directArtworkImg",artwork.getContentsHd().getDefaultImg());
            }
        }
        return  "artstream/artstream-detail";
    }

    @PostMapping("/{language}/api/artwork-detail")
    public ResponseEntity<?> artworkDetails(Long artworkId,
                                            @RequestParam(required = false) Long exhibitionId,
                                            @PathVariable String language,
                                            HttpServletRequest request){
        System.out.println(exhibitionId);
        String localization = ipTableService.getLocalizationByIp(request);
        Artwork artwork = artworkService.findArtworkById(localization, artworkId);
        ArtworkDto artworkDto = artworkService.createArtworkDto(language, localization, artwork, exhibitionId);
        return ResponseEntity.status(HttpStatus.OK).body(artworkDto);
    }

    @PostMapping("/api/add-to-collection-detail")
    public ResponseEntity<?> addToCollectionDetail(@RequestParam(name = "art_id") Long artId,
                                                   @NotNull @CurrentMember GeneralMember generalMember,
                                                   HttpServletRequest request){
        String localization = ipTableService.getLocalizationByIp(request);
        Pageable pageable = PageRequest.ofSize(100);
        if (artId == null) {return ResponseEntity.status(HttpStatus.OK).body(-2);}
        List<Collection> collections = membersStorageService.findArtworkCollection(generalMember.getEmail(),localization, pageable).getContent();
        Artwork artwork = artworkService.findArtworkById(localization, artId);
        CollectionDto collectionDto = membersStorageService.createCollectionDto(collections,artwork);
        return ResponseEntity.status(HttpStatus.OK).body(collectionDto);
    }
    @PostMapping("/{language}/api/artwork-more")
    public ResponseEntity<?> artworkMore(@CurrentMember GeneralMember generalMember,
                                         @RequestParam(value = "art_id") Long artworkId,
                                         @RequestParam(value = "exh_id",required = false) Long exhibitionId,
                                         @PathVariable String language,
                                         HttpServletRequest request){
        String localization = ipTableService.getLocalizationByIp(request);
        Artwork artwork = artworkService.findArtworkById(localization, artworkId);
        Boolean artworkLiked = membersStorageService.isArtworkLikedByMember(generalMember, artwork);
        Boolean exhibitionSaved = null;
        String artworkDescription = artwork.getArtworkDetails().stream().filter(a->a.getLanguage().equals(language)).findFirst().get().getIntro();
        if(exhibitionId != null){
            exhibitionSaved = membersStorageService.isExhibitionInCollection(generalMember, exhibitionId);
        } else {
            Exhibition exhibition  = artworkService.getArtworksFirstExhibition(localization,artwork);
            exhibitionId = exhibition != null ? exhibition.getId() : null;
        }
        ArtworkMoreDto artworkMoreDto = new ArtworkMoreDto(
                artworkLiked,
                exhibitionSaved,
                exhibitionId,
                artworkDescription
        );
        return ResponseEntity.status(HttpStatus.OK).body(artworkMoreDto);
    }
    @PostMapping("/api/share/exhibition")
    public ResponseEntity<?> shareExhibition(@RequestParam(value = "exh_id") Long exhibitionId){
        int response = exhibitionService.shareExhibition(exhibitionId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/api/share/artist")
    public ResponseEntity<?> shareArtist(@RequestParam(value = "artist_id") Long artistId){
        int response = artistService.shareArtist(artistId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/api/share/artwork")
    public ResponseEntity<?> shareArtwork(@RequestParam(value = "art_id") Long artworkId){
        int response = artworkService.shareArtwork(artworkId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @GetMapping("/api/shop-url")
    public ResponseEntity<?> shopUrl(@RequestParam Long artworkId){
        String shopUrl = artworkService.findShopUrlById(artworkId);
        return ResponseEntity.status(HttpStatus.OK).body(shopUrl);
    }
}