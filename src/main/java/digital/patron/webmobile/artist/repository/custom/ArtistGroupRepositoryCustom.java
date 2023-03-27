package digital.patron.webmobile.artist.repository.custom;

import digital.patron.webmobile.artist.domain.Artist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ArtistGroupRepositoryCustom {
    Page<Artist> findArtistsByArtistGroupNameOrderByArtistArtistGroupIdAsc(String localization, Pageable pageable);
}
