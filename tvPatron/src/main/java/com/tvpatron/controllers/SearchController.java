package com.tvpatron.controllers;

import com.tvpatron.artist.domain.Artist;
import com.tvpatron.artist.service.ArtistService;
import com.tvpatron.artwork.domain.Artwork;
import com.tvpatron.artwork.domain.RecommendedTags;
import com.tvpatron.artwork.service.ArtworkService;
import com.tvpatron.ipTable.service.IpTableService;
import com.tvpatron.member.domain.GeneralMember;
import com.tvpatron.member.dto.SearchDto;
import com.tvpatron.member.service.MemberService;
import com.tvpatron.member.service.SearchHistoryService;
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
public class SearchController {
    private final SearchHistoryService searchHistoryService;
    private final ArtworkService artworkService;
    private final ArtistService artistService;
    private final MemberService memberService;
    private final IpTableService ipTableService;
    @GetMapping("/search")
    public String search(Model model,
                         HttpServletRequest request,
                         @PathVariable String language,
                         HttpSession session) {
        String email = (String) session.getAttribute("email_session");
        model.addAttribute("loginStatus", email != null);
        getSearchTags(model, email, language);
        return "search/search";
    }

    private void getSearchTags(Model model, String email, String language) {
        String localization;
        switch (language){
            case "ko" : localization = "kr";break;
            case "ja" : localization = "jp"; break;
            default: localization = "en"; break;
        }
        List<String> keywords = null;
        if(email!=null){
            GeneralMember generalMember = memberService.getMemberByEmail(email);
            keywords = searchHistoryService.getSearchHistoryKeywords(generalMember);
            model.addAttribute("provider",generalMember.getProvider());
        }
        List<RecommendedTags> recommendedTags = artworkService.getRecommendedTags(localization);
        List<RecommendedTags> fixedTags = artworkService.filterTagsByFixed(recommendedTags,true);
        List<RecommendedTags> randomizeTags = artworkService.filterTagsByFixed(recommendedTags,false);
        List<Long> fixedTagsArtworkCount = fixedTags.stream().map(a->artworkService.getTagCountByTagName(localization, a.getArtworkTag().getTagName())).collect(Collectors.toList());
        List<Long> randomizeTagsArtworkCount = randomizeTags.stream().map(a->artworkService.getTagCountByTagName(localization, a.getArtworkTag().getTagName())).collect(Collectors.toList());
        model.addAttribute("keywords",keywords);
        model.addAttribute("randomizeTags",randomizeTags);
        model.addAttribute("fixedTags",fixedTags);
        model.addAttribute("fixedTagsArtworkCount",fixedTagsArtworkCount);
        model.addAttribute("randomizeTagsArtworkCount",randomizeTagsArtworkCount);
    }
    @GetMapping("/search-result")   // Get 127.0.0.1:8080/search-result?keyword=서양화
    public String searchResult(@RequestParam(value = "keyword", required = false) String keyword,
                               HttpSession session,
                               HttpServletRequest request,
                               @PathVariable String language,
                               //@RequestParam(required = false) String locale,
                               Model model) {

        String email = (String) session.getAttribute("email_session");
        model.addAttribute("loginStatus", email != null);
        String localization = ipTableService.getLocalizationByIp(request);
        //String localization = locale;
        if(email!=null){
            GeneralMember generalMember = memberService.getMemberByEmail(email);
            searchHistoryService.saveSearchKeyword(generalMember,keyword);
        }
        Pageable pageable = PageRequest.ofSize(16);
        List<Artwork> artworks = artworkService.searchArtworksByKeyword(keyword,localization,pageable);
        pageable = PageRequest.ofSize(100);
        List<Artist> artists = artistService.findArtistsByKeyword(keyword, localization,pageable);
        model.addAttribute("keyword", keyword);
        if (artworks.size() == 0 && artists.size() == 0) {
            getSearchTags(model, email, language);
            model.addAttribute("keyword", keyword);
            return "search/search-noresult";
        }
        model.addAttribute("artworkCount", artworks.size());
        model.addAttribute("artworks", artworks);
        model.addAttribute("artists", artists);
        return "search/search-result";
    }

    @GetMapping("/search-noresult")
    public String searchNoResult(@RequestParam(value = "keyword", required = false) String keyword,
                                 HttpSession session,
                                 HttpServletRequest request,
                                 //@RequestParam(required = false) String locale,
                                 @PathVariable String language,
                                 Model model) {
        String email = (String) session.getAttribute("email_session");
        model.addAttribute("loginStatus", email != null);
        getSearchTags(model, email, language);
        model.addAttribute("keyword", keyword);
        return "search/search-noresult";
    }
    @GetMapping("/error")
    public String error(HttpSession session,
                         HttpServletRequest request,
                         @PathVariable String language,
                         Model model) {
        String email = (String) session.getAttribute("email_session");
        model.addAttribute("loginStatus", email != null);
        getSearchTags(model, email, language);
        return "common/error-page";
    }

    @GetMapping("/api/search-result")
    @ResponseBody
    public ResponseEntity<?> searchResultJson(@RequestParam(value = "keyword", required = false) String keyword,
                                              HttpServletRequest request, @PathVariable String language) {
        //작품 개수 수정
        String localization = ipTableService.getLocalizationByIp(request);
        Pageable pageable = PageRequest.ofSize(100);
        List<Artwork> artworks = artworkService.searchArtworksByKeyword(keyword,localization,pageable);
        SearchDto searchDto = new SearchDto(artworks.size(),
                artworks.stream().map(Artwork::getId).collect(Collectors.toList()),
                artworks.stream().map(a->a.getArtworkDetails().stream().filter(ad->ad.getLanguage().equals(language)).findFirst().get().getArtworkName()).collect(Collectors.toList()),
                artworks.stream().map(a->a.getContentsThumbnail().getDefaultImg()).collect(Collectors.toList()),
                artworks.stream().map(a->a.getArtist().getArtistDetails().stream().filter(ad->ad.getLanguage().equals(language)).findFirst().get().getArtistName()).collect(Collectors.toList()));
        return ResponseEntity.status(HttpStatus.OK).body(searchDto);
    }

    @PostMapping(value = "/api/deleteHistory/all")
    public ResponseEntity<?> deleteAllSearchHistory(HttpSession session){
        String email = (String) session.getAttribute("email_session");
        GeneralMember generalMember = memberService.getMemberByEmail(email);
        Integer response = memberService.deleteSearchHistoryByGeneralMember(generalMember);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
