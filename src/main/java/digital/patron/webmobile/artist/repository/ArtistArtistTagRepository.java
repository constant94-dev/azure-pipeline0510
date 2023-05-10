package digital.patron.webmobile.artist.repository;

import digital.patron.webmobile.artist.domain.Artist;
import digital.patron.webmobile.artist.domain.ArtistArtistTag;
import digital.patron.webmobile.artist.domain.ArtistTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ArtistArtistTagRepository extends JpaRepository<ArtistArtistTag, Long> {
    @Query("select a.artist from ArtistArtistTag a " +
            "where a.artistTag in :artistTags and a.artist.localization like :localization " +
            "group by a.artist order by count(a.artist) desc, a.artist.createTime desc")
    List<Artist> findSimilarArtists(List<ArtistTag> artistTags, String localization);
}
