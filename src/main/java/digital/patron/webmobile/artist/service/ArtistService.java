package digital.patron.webmobile.artist.service;

import digital.patron.webmobile.artist.domain.Artist;
import digital.patron.webmobile.artist.dto.ArtistDto;
import digital.patron.webmobile.exhibition.domain.Exhibition;
import digital.patron.webmobile.member.domain.GeneralMember;
import digital.patron.webmobile.member.dto.SearchDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ArtistService {
    List<Artist> findArtistsByArtistGroupName(String localization, Pageable pageable);

    Page<Artist> findArtistsByKeyword(String keyword, String localization, Pageable pageable);

    SearchDto createSearchDto(String language, Page<Artist> artistPage);

    Artist findArtistById(Long artistId, String localization);


    List<Artist> getSortedArtists(Pageable pageable, String localization, String sortBy);

    List<Artist> find15SimilarArtistsByArtistTag(Artist artist, String localization);

    String getFirstArtworkImageOfAnArtist(Artist artist, String localization);

    List<Exhibition> getArtistExhibitions(Artist artist, String localization);

    boolean checkIfArtistIsLikedByMember(GeneralMember generalMember, Artist artist);

    int shareArtist(Long artistId);

    ArtistDto createArtistDto(List<Artist> artists, String language);
}
