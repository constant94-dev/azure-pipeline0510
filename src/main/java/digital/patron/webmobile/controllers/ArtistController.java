package digital.patron.webmobile.controllers;

import digital.patron.webmobile.artist.domain.Artist;
import digital.patron.webmobile.artist.dto.ArtistDto;
import digital.patron.webmobile.artist.service.ArtistService;
import digital.patron.webmobile.artwork.domain.Artwork;
import digital.patron.webmobile.common.annotation.CurrentMember;
import digital.patron.webmobile.exhibition.domain.Exhibition;
import digital.patron.webmobile.exhibition.service.ExhibitionService;
import digital.patron.webmobile.ipTable.service.IpTableService;
import digital.patron.webmobile.member.domain.GeneralMember;
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
import java.util.List;
import java.util.stream.Collectors;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/{language}")
public class ArtistController {

    private final ArtistService artistService;
    private final ExhibitionService exhibitionService;
    private final IpTableService ipTableService;
    @GetMapping("/artist/all")
    public String artists(@CurrentMember GeneralMember generalMember,
                          @RequestParam(required = false) String sortBy,
                          @PathVariable String language,
                          HttpServletRequest request,
                          Model model) {
        Pageable pageable;
        String localization = ipTableService.getLocalizationByIp(request);
        if(sortBy==null){sortBy="";}
        pageable = PageRequest.ofSize(20);
        List<Artist> firstNArtists = artistService.getSortedArtists(pageable,localization,sortBy);
        model.addAttribute("firstNArtists",firstNArtists);
        model.addAttribute("generalMember",generalMember);
        model.addAttribute("language", language);
        return "artist/artist";
    }
    @PostMapping("/api/artists")
    public ResponseEntity<?> apiArtists(Integer page,
                                        String sortBy,
                                        HttpServletRequest request,
                                        @PathVariable String language){
        Pageable pageable = PageRequest.of(page-1,20);
        String localization = ipTableService.getLocalizationByIp(request);
        List<Artist> firstNArtists = artistService.getSortedArtists(pageable,localization,sortBy);
        ArtistDto artistDto = artistService.createArtistDto(firstNArtists,language);
        return ResponseEntity.status(HttpStatus.OK).body(artistDto);
    }

    @GetMapping("/artists/detail")
    public String artistProfile(@RequestParam(value = "artist_id") Long artistId,
                                HttpServletRequest request,
                                @CurrentMember GeneralMember generalMember,
                                @PathVariable String language,
                                Model model) {
        model.addAttribute("generalMember",generalMember);
        String localization = ipTableService.getLocalizationByIp(request);

        Artist artist = artistService.findArtistById(artistId, localization);
        List<Artist> similarArtists = artistService.find15SimilarArtistsByArtistTag(artist,localization);
        String artwork = artistService.getFirstArtworkImageOfAnArtist(artist, localization);
        if(generalMember != null){
            boolean isLiked = artistService.checkIfArtistIsLikedByMember(generalMember,artist);
            model.addAttribute("isLiked", isLiked);
        }
        List<Exhibition> artistExhibitions = artistService.getArtistExhibitions(artist,localization);
        List<Artwork> artistExhibitionsFirstArtwork = artistExhibitions.stream().map(a->a.getArtworkExhibitions().stream()
                .filter(art->art.getArtwork().getArtist().equals(artist)).findFirst().get().getArtwork()).collect(Collectors.toList());
        List<String> exhibitionDuration = exhibitionService.exhibitionListDuration(artistExhibitions, language);
        artist.getArtistArtistTags().removeAll(artist.getArtistArtistTags().stream().filter(e -> !e.getArtistTag().getLanguage().equals(language)).collect(Collectors.toList()));
        model.addAttribute("artist", artist);
        model.addAttribute("artistExhibitions", artistExhibitions);
        model.addAttribute("artistExhibitionsFirstArtwork", artistExhibitionsFirstArtwork);
        model.addAttribute("exhibitionDuration", exhibitionDuration);
        model.addAttribute("artwork", artwork);
        model.addAttribute("similarArtists", similarArtists);
        model.addAttribute("ogImg",artist.getArtworks().stream().findFirst().isPresent() ? artist.getArtworks().stream().findFirst().get().getContentsThumbnail().getDefaultImg() : artist.getProfileImg());
        model.addAttribute("ogUrl", request.getRequestURL().append('?').append(request.getQueryString()));
        model.addAttribute("directAristId",artistId);
        model.addAttribute("language",language);
        return "artist/artist-detail";

    }
}
