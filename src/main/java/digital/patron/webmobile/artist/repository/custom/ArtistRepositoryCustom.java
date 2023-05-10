package digital.patron.webmobile.artist.repository.custom;

import digital.patron.webmobile.artist.domain.Artist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ArtistRepositoryCustom {

    Page<Artist> findArtistsByKeywordLikeOrderByArtistIdAsc(String keyword, String localization, Pageable pageable);

    Page<Artist> getSortedArtists(Pageable pageable, String localization, String sortBy);

    Page<Artist> findArtistsOfLikedArtworksByEmail(String email,String localization, Pageable pageable);


}
