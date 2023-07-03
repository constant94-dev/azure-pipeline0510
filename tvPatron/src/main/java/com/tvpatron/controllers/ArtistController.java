package com.tvpatron.controllers;

import com.tvpatron.artist.domain.Artist;
import com.tvpatron.artist.dto.ArtistDto;
import com.tvpatron.artist.service.ArtistService;
import com.tvpatron.artwork.domain.Artwork;
import com.tvpatron.common.utils.BaseTimeEntity;
import com.tvpatron.exhibition.domain.Exhibition;
import com.tvpatron.exhibition.domain.ExhibitionExhibitionTag;
import com.tvpatron.exhibition.service.ExhibitionService;
import com.tvpatron.integrate.domain.ArtworkExhibition;
import com.tvpatron.integrate.service.IntegrateService;
import com.tvpatron.ipTable.service.IpTableService;
import com.tvpatron.member.domain.GeneralMember;
import com.tvpatron.member.service.MemberService;
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
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/{language}")
public class ArtistController {
    private final ArtistService artistService;
    private final ExhibitionService exhibitionService;
    private final MemberService memberService;
    private final IpTableService ipTableService;
    private final IntegrateService integrateService;
    @GetMapping("/artist")
    public String artistProfile(@RequestParam(value = "artist_id") Long artistId,
                                @PathVariable String language,
                                HttpServletRequest request,
                                HttpSession session,
                                Model model) {
        String email = (String) session.getAttribute("email_session");
        String localization = ipTableService.getLocalizationByIp(request);
        Artist artist = artistService.findArtistById(artistId);
        List<Exhibition> artistExhibitions = exhibitionService.findExhibitionsByArtistId(artist, localization);
        boolean isLiked = email != null && artistService.checkIfArtistIsLikedByMember(memberService.getMemberByEmail(email), artist);
        List<Artwork> artworks = new ArrayList<>(artist.getArtworks());
        artworks.removeIf(a->!a.getLocalization().contains(localization));
        List<Artwork> artistExhibitionsFirstArtwork = artistService.getFirstArtistExhibitionsFirstArtwork(artistExhibitions,artist);
        List<String> artistExhibitionsDuration = integrateService.exhibitionListDuration(artistExhibitions, language);
        model.addAttribute("loginStatus", email != null);
        model.addAttribute("isLiked", isLiked);
        model.addAttribute("artist", artist);
        model.addAttribute("artistExhibitions", artistExhibitions);
        model.addAttribute("artistExhibitionsDuration", artistExhibitionsDuration);
        model.addAttribute("artistExhibitionsFirstArtwork", artistExhibitionsFirstArtwork);
        model.addAttribute("artworks",artworks);
        model.addAttribute("language",language);
        return "artist/artist";
    }

    @GetMapping("/artists-all")
    public String artistsAll(@PathVariable String language,
                             HttpSession session,
                             Model model){
        String email = (String) session.getAttribute("email_session");
        model.addAttribute("loginStatus", email != null);
        model.addAttribute("language",language);
        return "artist/artist-all";
    }

    @PostMapping("/api/artists")
    public ResponseEntity<?> apiArtists(Integer page,
                                        HttpServletRequest request,
                                        @PathVariable String language){
        String localization = ipTableService.getLocalizationByIp(request);
        Pageable pageable = PageRequest.of(page-1,18);
        List<Artist> firstNArtists = artistService.getSortedArtists(localization, pageable);
        ArtistDto artistDto = artistService.createArtistDto(firstNArtists, language);
        return ResponseEntity.status(HttpStatus.OK).body(artistDto);
    }
}