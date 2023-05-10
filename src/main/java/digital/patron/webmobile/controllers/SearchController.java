package digital.patron.webmobile.controllers;

import digital.patron.webmobile.artist.domain.Artist;
import digital.patron.webmobile.artist.service.ArtistService;
import digital.patron.webmobile.artwork.domain.Artwork;
import digital.patron.webmobile.artwork.domain.RecommendedTags;
import digital.patron.webmobile.artwork.service.ArtworkService;
import digital.patron.webmobile.common.annotation.CurrentMember;
import digital.patron.webmobile.exhibition.domain.Exhibition;
import digital.patron.webmobile.exhibition.service.ExhibitionService;
import digital.patron.webmobile.ipTable.service.IpTableService;
import digital.patron.webmobile.member.domain.GeneralMember;
import digital.patron.webmobile.member.dto.SearchDto;
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
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.List;


@Controller
@Slf4j
@RequiredArgsConstructor
public class SearchController {

    private final ArtworkService artworkService;
    private final ArtistService artistService;
    private final ExhibitionService exhibitionService;
    private final SearchHistoryService generalMemberService;
    private final IpTableService ipTableService;


    @GetMapping("/{language}/search") //  GET 127.0.0.1/search
    public String search(@CurrentMember GeneralMember generalMember,
                         HttpServletRequest request,
                         @PathVariable String language,
                         Model model) {
        String localization;
        switch (language){
            case "ko" : localization = "kr";break;
            case "ja" : localization = "jp"; break;
            default: localization = "en"; break;
        }
        List<RecommendedTags> recommendedTags = artworkService.getRecommendedTags(localization);
        if(generalMember!=null){
            List<String> keywords = generalMemberService.getSearchHistoryKeywords(generalMember);
            keywords = keywords.size()>20 ? keywords.subList(0,20) : keywords;
            model.addAttribute("keywords",keywords);
        }
        List<RecommendedTags> fixedTags = artworkService.filterTagsByFixed(recommendedTags,true);
        List<RecommendedTags> randomizeTags = artworkService.filterTagsByFixed(recommendedTags,false);
        model.addAttribute("language",language);
        model.addAttribute("fixedTags",fixedTags);
        model.addAttribute("randomizeTags",randomizeTags);
        model.addAttribute("generalMember",generalMember);
        return "search/search";
    }
    //TODO CLARE
    @GetMapping("/{language}/error") //  GET 127.0.0.1/search
    public String error(@CurrentMember GeneralMember generalMember,
                         HttpServletRequest request,
                         @PathVariable String language,
                         Model model) {
        String localization;
        switch (language){
            case "ko" : localization = "kr";break;
            case "ja" : localization = "jp"; break;
            default: localization = "en"; break;
        }
        List<RecommendedTags> recommendedTags = artworkService.getRecommendedTags(localization);
        if(generalMember!=null){
            List<String> keywords = generalMemberService.getSearchHistoryKeywords(generalMember);
            keywords = keywords.size()>20 ? keywords.subList(0,20) : keywords;
            model.addAttribute("keywords",keywords);
        }
        List<RecommendedTags> fixedTags = artworkService.filterTagsByFixed(recommendedTags,true);
        List<RecommendedTags> randomizeTags = artworkService.filterTagsByFixed(recommendedTags,false);
        model.addAttribute("language",language);
        model.addAttribute("fixedTags",fixedTags);
        model.addAttribute("randomizeTags",randomizeTags);
        model.addAttribute("generalMember",generalMember);
        return "common/error";
    }

    @GetMapping("/{language}/search-result")   // Get 127.0.0.1:8080/search-result?keyword=서양화
    public String searchResult(@CurrentMember GeneralMember generalMember,
                               @RequestParam(value = "keyword", required = false) String keyword,
                               RedirectAttributes redirectAttributes,
                               HttpServletRequest request,
                               @PathVariable String language,
                               Model model) {
        Pageable pageable = PageRequest.ofSize(6);
        String localization = ipTableService.getLocalizationByIp(request);
        List<Artwork> artworks = artworkService.searchArtworksByKeyword(keyword,localization,pageable).getContent();
        List<Artist> artists =  artistService.findArtistsByKeyword(keyword,localization,pageable).getContent();
        List<Exhibition> exhibitions = exhibitionService.searchExhibitionsByKeyword(keyword, localization, pageable).getContent();
        List<String> exhibitionDuration = exhibitionService.exhibitionListDuration(exhibitions, language);
        if(generalMember!=null){
            generalMemberService.saveSearchKeyword(generalMember,keyword);
        }
        if (artworks.size() == 0 && artists.size() == 0 && exhibitions.size() == 0) {
            redirectAttributes.addAttribute("keyword",keyword);
            return "redirect:/"+language+"/search-noresult";
        }
        model.addAttribute("keyword", keyword);
        model.addAttribute("artworks", artworks);
        model.addAttribute("artists", artists);
        model.addAttribute("exhibitions",exhibitions);
        model.addAttribute("exhibitionDuration",exhibitionDuration);
        model.addAttribute("generalMember",generalMember);
        model.addAttribute("language",language);
        return "search/search-result";
    }

    @GetMapping("/{language}/search-noresult")   // Get 127.0.0.1:8080/search-result?keyword=서양화
    public String searchNoResult(@CurrentMember GeneralMember generalMember,
                                 @RequestParam(value = "keyword", required = false) String keyword,
                                 @PathVariable String language,
                                 HttpServletRequest request,
                                 Model model) {
        String localization;
        model.addAttribute("keyword", keyword);
        model.addAttribute("message", "검색 결과가 없습니다.");
        if(generalMember!=null){
            generalMemberService.saveSearchKeyword(generalMember,keyword);
        }
        switch (language){
            case "ko" : localization = "kr";break;
            case "ja" : localization = "jp"; break;
            default: localization = "en"; break;
        }
        List<RecommendedTags> recommendedTags = artworkService.getRecommendedTags(localization);
        List<RecommendedTags> fixedTags = artworkService.filterTagsByFixed(recommendedTags,true);
        List<RecommendedTags> randomizeTags = artworkService.filterTagsByFixed(recommendedTags,false);
        model.addAttribute("fixedTags",fixedTags);
        model.addAttribute("randomizeTags",randomizeTags);
        model.addAttribute("language",language);
        return "search/search-noresult";
    }

    @PostMapping("/{language}/api/search")
    public ResponseEntity<?> searchResultJson(SearchDto searchDto,
                                              HttpServletRequest request,
                                              @PathVariable String language) {
        String localization = ipTableService.getLocalizationByIp(request);
        Pageable pageable = PageRequest.of(searchDto.getP(),20);
        SearchDto responseDto = null;
        if("Artwork".equalsIgnoreCase(searchDto.getType())){
            Page<Artwork> artworksQuery = artworkService.searchArtworksByKeyword(searchDto.getKeyword(),localization,pageable);
            responseDto = artworkService.createSearchDto(language,artworksQuery);
        }else if("Artist".equalsIgnoreCase(searchDto.getType())){
            Page<Artist> artistsQuery = artistService.findArtistsByKeyword(searchDto.getKeyword(),localization,pageable);
            responseDto = artistService.createSearchDto(language,artistsQuery);
        }else if("Exhibition".equalsIgnoreCase(searchDto.getType())){
            Page<Exhibition> exhibitionsQuery = exhibitionService.searchExhibitionsByKeyword(searchDto.getKeyword(),localization,pageable);
            responseDto = exhibitionService.createSearchDto(language,exhibitionsQuery);
        }
        return ResponseEntity.status(HttpStatus.OK).body(responseDto!=null ? responseDto : 0);

    }

    @PostMapping(value = "/api/deleteHistory/all")
    public ResponseEntity<?> deleteAllSearchHistory(@CurrentMember GeneralMember generalMember){
        Integer response = generalMemberService.deleteSearchHistoryByGeneralMember(generalMember);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping(value = "/api/deleteHistory/keyword")
    public ResponseEntity<?> deleteSearchHistoryByKeyword(String keyword,@CurrentMember GeneralMember generalMember){
        Integer response = generalMemberService.deleteSearchHistoryByKeyword(generalMember,keyword);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
