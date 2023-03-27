package digital.patron.webmobile.controllers;

import digital.patron.webmobile.artist.domain.Artist;
import digital.patron.webmobile.artist.dto.ArtistDto;
import digital.patron.webmobile.artist.service.ArtistService;
import digital.patron.webmobile.artwork.domain.Artwork;
import digital.patron.webmobile.artwork.service.ArtworkService;
import digital.patron.webmobile.common.annotation.CurrentMember;
import digital.patron.webmobile.exhibition.domain.Exhibition;
import digital.patron.webmobile.exhibition.dto.ExhibitionDto;
import digital.patron.webmobile.exhibition.service.ExhibitionService;
import digital.patron.webmobile.ipTable.service.IpTableService;
import digital.patron.webmobile.member.domain.Collection;
import digital.patron.webmobile.member.domain.CollectionArtwork;
import digital.patron.webmobile.member.domain.GeneralMember;
import digital.patron.webmobile.member.domain.MemberWaitingExhibition;
import digital.patron.webmobile.member.dto.AddEditCollectionDto;
import digital.patron.webmobile.member.dto.ArtworkDataListDto;
import digital.patron.webmobile.member.dto.CollectionInfoDto;
import digital.patron.webmobile.member.service.LoginToTvService;
import digital.patron.webmobile.member.service.MembersService;
import digital.patron.webmobile.member.service.MembersStorageService;
import digital.patron.webmobile.member.service.SearchHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
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
import java.util.List;
import java.util.stream.Collectors;

@Controller
@Slf4j
@RequiredArgsConstructor
public class MyPageController {
    
    private final ArtworkService artworkService;
    private final ExhibitionService exhibitionService;
    private final SearchHistoryService searchHistoryService;
    private final ArtistService artistService;
    private final LoginToTvService loginToTvService;
    private final MembersService membersService;
    private final MembersStorageService membersStorageService;
    private final IpTableService ipTableService;

    @GetMapping("/{language}/mypage")
    public String myPage(@CurrentMember GeneralMember generalMember,
            HttpServletRequest request,
            @PathVariable String language,
            Model model) {
        String localization = ipTableService.getLocalizationByIp(request);
        if(generalMember == null){
            return "redirect:/";
        }
        Pageable pageable = PageRequest.ofSize(15);
        Page<Collection> artworkCollectionsPage = membersStorageService.findArtworkCollection(generalMember.getEmail(),localization, pageable);
        Page<Collection> exhibitionsCollectionsPage = membersStorageService.findExhibitionsCollection(generalMember.getEmail(),localization,pageable);
        Page<MemberWaitingExhibition> waitingExhibitionsPage = membersStorageService.findMemberWaitingExhibition(generalMember.getEmail(),localization, pageable);
        Page<Artwork> likedArtworksPage = artworkService.findLikedArtworks(generalMember.getEmail(),localization, pageable);
        Page<Artwork> watchedArtworksPage = artworkService.findSeenArtworks(generalMember.getEmail(),localization, pageable);
        Page<Artist> likedArtistsPage = membersStorageService.getLikedArtists(generalMember, localization, pageable);

        List<Collection> artworkCollections = artworkCollectionsPage.getContent();
        List<String> artworkCollectionDuration = membersStorageService.artworkCollectionListDuration(artworkCollections, language);
        List<Collection> exhibitionsCollections = exhibitionsCollectionsPage.getContent();
        List<String> exhibitionsCollectionsDuration = exhibitionService.exhibitionListDuration(exhibitionsCollections.stream().map(e->e.getExhibition()).collect(Collectors.toList()), language);
        List<Exhibition> waitingExhibitions = membersStorageService.getExhibitionListFromMemberWaitingExhibition(waitingExhibitionsPage.getContent());
        List<Long> leftTimeTillExhibition = exhibitionService.calculateLeftTimeTillExhibition(waitingExhibitions);
        List<Artwork> likedArtworks = likedArtworksPage.getContent();
        List<Artwork> watchedArtworks = watchedArtworksPage.getContent();
        List<Artist> likedArtists = likedArtistsPage.getContent();
        List<CollectionArtwork> lastAddedArtworkInArtworkCollection = membersStorageService.lastAddedArtworkInArtworkCollection(artworkCollections);

        model.addAttribute("artworkCollectionsCount", artworkCollectionsPage.getTotalElements());
        model.addAttribute("exhibitionsCollectionsCount", exhibitionsCollectionsPage.getTotalElements());
        model.addAttribute("waitingExhibitionsCount", waitingExhibitionsPage.getTotalElements());
        model.addAttribute("likedArtworksCount", likedArtworksPage.getTotalElements());
        model.addAttribute("likedArtistsCount", likedArtistsPage.getTotalElements());
        model.addAttribute("watchedArtworksCount", watchedArtworksPage.getTotalElements());

        model.addAttribute("artworkCollections", artworkCollections);
        model.addAttribute("lastAddedArtworkInArtworkCollection", lastAddedArtworkInArtworkCollection);
        model.addAttribute("artworkCollectionDuration", artworkCollectionDuration);
        model.addAttribute("exhibitionsCollections", exhibitionsCollections);
        model.addAttribute("exhibitionsCollectionsDuration", exhibitionsCollectionsDuration);
        model.addAttribute("waitingExhibitions", waitingExhibitions);
        model.addAttribute("waitingExhibitionsDurationTime", exhibitionService.exhibitionListDuration(waitingExhibitions, language));
        model.addAttribute("leftTimeTillExhibition", leftTimeTillExhibition);
        model.addAttribute("likedArtworks", likedArtworks);
        model.addAttribute("likedArtists", likedArtists);
        model.addAttribute("watchedArtworks", watchedArtworks);
        model.addAttribute("language",language);

        model.addAttribute("generalMember", generalMember);
        return "mypage/mypage";
    }

    @GetMapping("/{language}/collection-detail")
    public String collectionDetail(@PathVariable String language,
                                    HttpServletRequest request,
                                    @RequestParam(name = "col_id") Long colId,
                                   @CurrentMember GeneralMember generalMember,
                                   Model model){
        String localization = ipTableService.getLocalizationByIp(request);
        Collection collection = membersStorageService.findCollectionById(colId);
        List<CollectionArtwork> collectionArtwork = membersStorageService.sortedArtworksInArtworkCollection(localization,collection);
        if(collectionArtwork == null || collectionArtwork.size() == 0) {
            return "redirect:/"+language+"/mypage";
        }
        String artworkCollectionDuration = membersStorageService.artworkCollectionDuration(collection, language);
        List<Exhibition> collectionExhibitions = membersStorageService.getExhibitionsInArtworkCollection(localization, collectionArtwork);
        List<String> collectionExhibitionDuration = exhibitionService.exhibitionListDuration(collectionExhibitions, language);
        List<Artist> collectionArtists = membersStorageService.getArtistsInArtworkCollection(collectionArtwork);
        model.addAttribute("collection",collection);
        model.addAttribute("collectionArtwork",collectionArtwork);
        model.addAttribute("artworkCollectionDuration",artworkCollectionDuration);
        model.addAttribute("collectionExhibitions",collectionExhibitions);
        model.addAttribute("collectionExhibitionDuration",collectionExhibitionDuration);
        model.addAttribute("collectionArtists",collectionArtists);
        model.addAttribute("generalMember", generalMember);
        model.addAttribute("language",language);
        return "collection/collection-detail";
    }


    @PostMapping(value = "/api/like-artwork")
    public ResponseEntity<?> likeArtwork(@RequestParam(name = "art_id") Long artworkId,
                                  @RequestParam(name = "like") Boolean like,
                                  @CurrentMember GeneralMember generalMember){
        int response;
        if (generalMember == null || like == null) {return ResponseEntity.status(HttpStatus.OK).body(-2);}
        if (like) {
            response = membersStorageService.addToLikedArtworks(artworkId, generalMember);
        } else {
            response = membersStorageService.removeFromLikedArtworks(artworkId, generalMember);
        }
        // -2 bad request, 0 error, 1 liked or 2 disliked success
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @PostMapping(value = "/api/like-artist")
    public ResponseEntity<?> likeArtist(@RequestParam(name = "art_id") Long artistId,
                                  @RequestParam(name = "like") Boolean like,
                                  @CurrentMember GeneralMember generalMember){
        int response;
        if(generalMember == null || like == null){return ResponseEntity.status(HttpStatus.OK).body(-2);}
        if (like) {
            response = membersStorageService.addToLikedArtists(artistId, generalMember);
        } else {
            response = membersStorageService.removeFromLikedArtists(artistId, generalMember);
        }
        // -2 bad request, 0 error, 1 success
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @PostMapping(value = "/api/collection/artwork")
    public ResponseEntity<?> collectArtwork(@RequestParam(name = "art_id") Long artworkId,
                                  @RequestParam(name = "col_name") String colName,
                                  @RequestParam(name = "add_art") Boolean add_art,
                                  @CurrentMember GeneralMember generalMember){
        int response;
        if (generalMember == null || add_art == null) {return ResponseEntity.status(HttpStatus.OK).body(-2);}
        if (add_art) {
            // 0 internal error, -1 collection not found, 1 success
            response = membersStorageService.addArtworkToCollectionArtwork(artworkId, generalMember,colName);
        } else {
            response = membersStorageService.removeArtworkFromCollectionArtwork(artworkId, generalMember, colName);
        }
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping(value = "/api/collection/exhibition")
    public ResponseEntity<?> collectExhibition(@RequestParam(name = "exh_id") Long exhibitionId,
                                                @RequestParam(name = "add_exh") Boolean add_exh,
                                               @CurrentMember GeneralMember generalMember){
        int response;
        if (add_exh == null || generalMember == null) {return ResponseEntity.status(HttpStatus.OK).body(-2);}
        if (add_exh) {
            // 0 error, 1success
            response = membersStorageService.addExhibitionToCollection(exhibitionId, generalMember);
        } else {
            // 0 error, 1success
            response = membersStorageService.removeExhibitionFromCollection(exhibitionId, generalMember);
        }
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @PostMapping("/api/collection/create")
    public ResponseEntity<?> createCollection(@CurrentMember GeneralMember generalMember,
                                                AddEditCollectionDto addEditCollectionDto){
        int response = membersStorageService.createNewCollection(addEditCollectionDto.getName(), addEditCollectionDto.getArtIds(),generalMember);
        //-2 already exist, -1 too many collections, 0 error, 1 success
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @PostMapping("/api/collection/edit")
    public ResponseEntity<?> editCollection(@CurrentMember GeneralMember generalMember,
                                            AddEditCollectionDto addEditCollectionDto){
        int response = membersStorageService.editCollection(addEditCollectionDto.getPreviousName(), addEditCollectionDto.getName(), addEditCollectionDto.getArtIds(),generalMember);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @PostMapping("/api/collection/delete")
    public ResponseEntity<?> deleteCollection(@CurrentMember GeneralMember generalMember,
                                            @RequestParam("name") String name){
        int response = membersStorageService.deleteCollection(name,generalMember);
        //-2 less than 1collection,1 success, 0 fail
        System.out.println(response);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @PostMapping(value = "/api/viewCount")
    public ResponseEntity<?> viewCount(@CurrentMember GeneralMember generalMember,
                                       @RequestParam(name = "art_id") Long artworkId,
                                       @RequestParam(required = false,name = "exh_id") Long exhibitionId) {
        System.out.println(exhibitionId);
        if(exhibitionId != null){
            int response = membersStorageService.removeFromWaitingExhibitions(exhibitionId, generalMember);
            System.out.println(response);
        }
        int response = membersStorageService.addToSeenArtworks(artworkId, generalMember);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


    @PostMapping("/api/waiting")
    public ResponseEntity<?> addToWaitingList(@CurrentMember GeneralMember generalMember,
                                              @RequestParam(value = "exh_id") Long exh_id,
                                              HttpServletRequest request) {
        int response;
        Exhibition exhibition = exhibitionService.getById(exh_id);
        Boolean waiting = membersStorageService.checkIfAlreadyInWaitingList(generalMember,exhibition);
        System.out.println(waiting);
        if (waiting) {
            response = membersStorageService.removeFromWaitingExhibitions(exh_id, generalMember);
        } else {
            response = membersStorageService.addToWaitingExhibitions(exh_id, generalMember);
        }
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @PostMapping("/{language}/api/waiting-all")
    public ResponseEntity<?> allWaitingExhibitions(@CurrentMember GeneralMember generalMember,
                                                   @RequestParam(value = "page") Integer page,
                                                   HttpServletRequest request,
                                                   @PathVariable String language) {
        Pageable pageable = PageRequest.of(page-1,20);
        String localization = ipTableService.getLocalizationByIp(request);
        List<Exhibition> waitingExhibitions = membersStorageService.findMemberWaitingExhibition(generalMember.getEmail(),localization,pageable).getContent().stream().map(MemberWaitingExhibition::getExhibition).collect(Collectors.toList());
        ExhibitionDto exhibitionDto = exhibitionService.createExhibitionDto(waitingExhibitions, language);
        return ResponseEntity.status(HttpStatus.OK).body(exhibitionDto);
    }
    @PostMapping("/{language}/api/last-seen-artworks")
    public ResponseEntity<?> lastSeenArtworks(@CurrentMember GeneralMember generalMember,
                                              @RequestParam(value = "page") Integer page,
                                              HttpServletRequest request,
                                              @PathVariable String language,
                                              @RequestParam(value = "collection",required = false) Long collectionId){
        Pageable pageable = PageRequest.of(page-1,20);
        String localization = ipTableService.getLocalizationByIp(request);
        List<Artwork> lastSeenArtworks = artworkService.findSeenArtworks(generalMember.getEmail(), localization, pageable).getContent();
        ArtworkDataListDto artworkDataListDto = membersStorageService.createArtworkDataListDto(lastSeenArtworks, collectionId, language);
        return ResponseEntity.status(HttpStatus.OK).body(artworkDataListDto);
    }

    @PostMapping("/{language}/api/liked-artworks")
    public ResponseEntity<?> likedArtworks(@CurrentMember GeneralMember generalMember,
                                           @RequestParam(value = "page") Integer page,
                                           HttpServletRequest request,
                                           @PathVariable String language,
                                           @RequestParam(value = "collection",required = false) Long collectionId){
        Pageable pageable = PageRequest.of(page-1,20);
        String localization = ipTableService.getLocalizationByIp(request);

        List<Artwork> likedArtworks = artworkService.findLikedArtworks(generalMember.getEmail(),localization,pageable).getContent();
        ArtworkDataListDto artworkDataListDto = membersStorageService.createArtworkDataListDto(likedArtworks, collectionId, language);
        return ResponseEntity.status(HttpStatus.OK).body(artworkDataListDto);
    }
    @PostMapping("/{language}/api/liked-artists")
    public ResponseEntity<?> likedArtists(@CurrentMember GeneralMember generalMember,
                                           HttpServletRequest request,
                                           @PathVariable String language,
                                           @RequestParam(value = "page") Integer page){
        Pageable pageable = PageRequest.of(page-1,20);
        String localization = ipTableService.getLocalizationByIp(request);

        List<Artist> likedArtists = membersStorageService.getLikedArtists(generalMember,localization, pageable).getContent();
        ArtistDto artistDto = artistService.createArtistDto(likedArtists, language);
        return ResponseEntity.status(HttpStatus.OK).body(artistDto);
    }
    @PostMapping("/{language}/api/artwork-collections")
    public ResponseEntity<?> artworkCollections(@CurrentMember GeneralMember generalMember,
                                                HttpServletRequest request,
                                                @PathVariable String language,
                                                Integer page){
        Pageable pageable = PageRequest.of(page-1,20);
        String localization = ipTableService.getLocalizationByIp(request);
        List<Collection> artworkCollections = membersStorageService.findArtworkCollection(generalMember.getEmail(),localization,pageable).getContent();
        CollectionInfoDto collectionInfoDto = membersStorageService.createCollectionInfoDtoForArtworkCollection(language, localization, artworkCollections);
        return ResponseEntity.status(HttpStatus.OK).body(collectionInfoDto);
    }

    @PostMapping("/{language}/api/exhibition-collections")
    public ResponseEntity<?> exhibitionCollections(@CurrentMember GeneralMember generalMember,
                                                HttpServletRequest request,
                                                @PathVariable String language,
                                                Integer page){
        Pageable pageable = PageRequest.of(page-1,20);
        String localization = ipTableService.getLocalizationByIp(request);
        List<Collection> exhibitionsCollection = membersStorageService.findExhibitionsCollection(generalMember.getEmail(),localization,pageable).getContent();
        CollectionInfoDto collectionInfoDto = membersStorageService.createCollectionInfoDtoForExhibitionCollection(exhibitionsCollection,language,localization);
        return ResponseEntity.status(HttpStatus.OK).body(collectionInfoDto);
    }
    @PostMapping("/{language}/api/artwork-data")
    public ResponseEntity<?> artworkData(List<Long> artworkIds,
                                         HttpServletRequest request,
                                         @PathVariable String language){
        String localization = ipTableService.getLocalizationByIp(request);
        List<Artwork> artworks = artworkService.findArtworksByIds(localization, artworkIds);
        ArtworkDataListDto artworkDataListDto = membersStorageService.createArtworkDataListDto(language,artworks);
        return ResponseEntity.status(HttpStatus.OK).body(artworkDataListDto);
    }

    @PostMapping("/api/search-history")
    public ResponseEntity<?> searchHistory(@CurrentMember GeneralMember generalMember){
        List<String> searchHistories = searchHistoryService.getSearchHistoryKeywords(generalMember);
        return ResponseEntity.status(HttpStatus.OK).body(searchHistories);
    }



    //프로필 편집
    @GetMapping("/{language}/mypage/profile")
    public String profile(@CurrentMember GeneralMember generalMember,
                          @PathVariable String language,
                          Model model) {
        String nickName = membersService.getNickName(generalMember.getEmail());
        String birth = membersService.getBirth(generalMember.getEmail());
        String gender = membersService.getGender(generalMember.getEmail());
        String nationality = membersService.getNationality(generalMember.getEmail());
        model.addAttribute("nickName",nickName);
        model.addAttribute("birth",birth);
        model.addAttribute("gender",gender);
        model.addAttribute("nationality",nationality);
        model.addAttribute("generalMember",generalMember);
        model.addAttribute("language",language);
        return "mypage/profile";
    }
    @GetMapping("/{language}/mypage/seen-artworks")
    public String seenArtworks(@CurrentMember GeneralMember generalMember,
                               Integer page,
                               HttpServletRequest request,
                               @PathVariable String language,
                               Model model){
        String localization = ipTableService.getLocalizationByIp(request);
        Pageable pageable = PageRequest.of(page-1,100);
        List<Artwork> artworkList = artworkService.findSeenArtworks(generalMember.getEmail(),localization, pageable).getContent();
        model.addAttribute("artworkList", artworkList);
        model.addAttribute("generalMember",generalMember);
        model.addAttribute("language",language);
        return "mypage/seen-artworks";
    }
    //내 컬렉션 편집
    @GetMapping("/{language}/collection-edit")
    public String collectionEdit(@RequestParam(value = "col_id") Long collectionId,
                                 @CurrentMember GeneralMember generalMember,
                                 HttpServletRequest request,
                                 @PathVariable String language,
                                 Model model) {
        String localization = ipTableService.getLocalizationByIp(request);
        Collection collection = membersStorageService.findCollectionById(collectionId);
        List<CollectionArtwork> sortedArtworkCollection = membersStorageService.sortedArtworksInArtworkCollection(localization,collection);
        model.addAttribute("sortedArtworkCollection",sortedArtworkCollection);
        model.addAttribute("collection",collection);
        model.addAttribute("generalMember",generalMember);
        model.addAttribute("language",language);
        return "collection/collection-edit";
    }

    @GetMapping("/{language}/mypage/language")
    public String language(@CurrentMember GeneralMember generalMember,
                           @PathVariable String language,
                           Model model) {
        model.addAttribute("generalMember",generalMember);
        model.addAttribute("language",language);
        return "mypage/language";
    }

    //프로필 편집 - 이름
    @GetMapping("/{language}/mypage/profile/name")
    public String profileName(@CurrentMember GeneralMember generalMember,
                              @PathVariable String language,
                              Model model) {
        model.addAttribute("generalMember",generalMember);
        model.addAttribute("language",language);
        return "mypage/profile-name";
    }
  
    //프로필 편집 - 생년월일
    @GetMapping("/{language}/mypage/profile/birth")
    public String profileBirth(@CurrentMember GeneralMember generalMember,
                               @PathVariable String language,
                               Model model) {
        model.addAttribute("generalMember",generalMember);
        model.addAttribute("language",language);
        return "mypage/profile-birth";
    }

    //프로필 편집 - 성별
    @GetMapping("/{language}/mypage/profile/gender")
    public String profileGender(@CurrentMember GeneralMember generalMember,
                                @PathVariable String language,
                                Model model) {
        model.addAttribute("generalMember",generalMember);
        model.addAttribute("language",language);
        return "mypage/profile-gender";
    }

    //프로필 편집 - 국가
    @GetMapping("/{language}/mypage/profile/nation")
    public String profileNation(@CurrentMember GeneralMember generalMember,
                                @PathVariable String language,
                                Model model) {
        model.addAttribute("generalMember",generalMember);
        model.addAttribute("language",language);
        return "mypage/profile-nation";
    }

    //탈퇴사유
    @GetMapping("/{language}/mypage/profile/left")
    public String profileLeft(@CurrentMember GeneralMember generalMember,
                              @PathVariable String language,
                              Model model) {
        model.addAttribute("generalMember",generalMember);
        model.addAttribute("language",language);
        return "mypage/profile-left";
    }

    //비밀번호 변경
    @GetMapping("/{language}/mypage/password/reset")
    public String passwordReset(@CurrentMember GeneralMember generalMember,
                                @PathVariable String language,
                                Model model) {
        model.addAttribute("generalMember",generalMember);
        model.addAttribute("language",language);
        return "mypage/password-reset";
    }

    //디바이스 및 앱 - 로그인된 tv
    @GetMapping("/{language}/mypage/application/tv")
    public String loggedInTv(@CurrentMember GeneralMember generalMember,
                             @PathVariable String language,
                             Model model) {
        if(generalMember!=null){
            String deviceName = loginToTvService.getLoggedInTvName(generalMember.getEmail());
            model.addAttribute("deviceName", deviceName);
        }
        model.addAttribute("generalMember",generalMember);
        model.addAttribute("language",language);
        return "mypage/application-tv";
    }

    //디바이스 및 앱 - tv연결
    @GetMapping("/{language}/mypage/connect/tv")
    public String connectingTv(@CurrentMember GeneralMember generalMember,
                               @PathVariable String language,
                               Model model){
        if(generalMember!=null){
            String deviceName = loginToTvService.getLoggedInTvName(generalMember.getEmail());
            model.addAttribute("deviceName", deviceName);
        }
        model.addAttribute("language",language);
        model.addAttribute("generalMember",generalMember);
        return "mypage/connect-tv";
    }

    //tv 이용방법
    @GetMapping("/{language}/mypage/use-tv")
    public String useTv(@CurrentMember GeneralMember generalMember,
                        @PathVariable String language,
                        Model model) {
        model.addAttribute("generalMember",generalMember);
        model.addAttribute("language",language);
        return "mypage/use-tv";
    }

    //마케팅 및 알림
    @GetMapping("/{language}/mypage/marketing")
    public String marketing(@CurrentMember GeneralMember generalMember,
                            @PathVariable String language,
                            Model model) {
        boolean status = membersService.getMarketingStatus(generalMember);
        model.addAttribute("status", status);
        model.addAttribute("generalMember",generalMember);
        model.addAttribute("language",language);
        return "mypage/marketing";
    }

    //앱 정보
    @GetMapping("/{language}/mypage/application/info")
    public String appInfo(@CurrentMember GeneralMember generalMember,
                          @PathVariable String language,
                          Model model) {
        model.addAttribute("generalMember",generalMember);
        model.addAttribute("language",language);
        return "mypage/application-info";
    }

    //기록 및 데이터 - 검색기록
    @GetMapping("/{language}/mypage/search-history")
    public String searchHistory(@CurrentMember GeneralMember generalMember,
                                @PathVariable String language,
                                Model model) {
        model.addAttribute("generalMember",generalMember);
        model.addAttribute("language",language);
        return "mypage/search-history";
    }
    //사용자 약관
    @GetMapping("/{language}/mypage/terms-of-service")
    public String termsOfService(@CurrentMember GeneralMember generalMember,
                                 @PathVariable String language,
                                 Model model) {
        if(generalMember!=null){
            model.addAttribute("generalMember",generalMember);
        }
        model.addAttribute("language",language);
        return "mypage/terms-of-service";
    }
    //QNA
    @GetMapping("/{language}/mypage/QnA-write")
    public String QnAwrite(@CurrentMember GeneralMember generalMember,
                           @PathVariable String language,
                           Model model) {
        model.addAttribute("generalMember",generalMember);
        model.addAttribute("language",language);
        return "mypage/QnA-write";
    }

    //새 컬렉션 만들기
    @GetMapping("/{language}/collection-new")
    public String collectionNew(@CurrentMember GeneralMember generalMember,
                                @PathVariable String language,
                                Model model) {
        model.addAttribute("generalMember",generalMember);
        model.addAttribute("language",language);
        return "collection/collection-new";
    }




}
