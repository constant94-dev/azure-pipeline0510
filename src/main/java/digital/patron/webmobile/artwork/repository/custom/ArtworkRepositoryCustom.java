package digital.patron.webmobile.artwork.repository.custom;

import digital.patron.webmobile.artwork.domain.Artwork;
import digital.patron.webmobile.artwork.domain.ArtworkTag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ArtworkRepositoryCustom {

    Page<Artwork> findSeenArtworksByEmailOrderByIdDesc(String email, String localization, Pageable pageable);

    Page<Artwork> findLikedArtworksByEmail(String email, String localization, Pageable pageable);

    Page<Artwork> findArtworksByKeyword(String keyword, String localization, Pageable pageable);

    List<Artwork> findArtworksByIsApproveAndIsShowingOrderByRegisteredAtDesc(String localization);

    List<Artwork> findAllByIdAndLocalization(String localization, List<Long> id);

    Artwork findByLocalization(String localization, Long id);

    List<Artwork> findSimilarArtworks(String localization, List<ArtworkTag> artworkTags, Artwork artwork);

    List<Artwork> findRandomLimitedArtworksOfDifferentArtist(String localization, Integer limit, Artwork artwrok);

    List<Artwork> findByTags(List<ArtworkTag> artworkTags, List<Artwork> artwork, Integer limit, String localization);

    Page<Artwork> getAllArtworksSortedByParameter(String sortBy, String localization, Pageable pageable);

    Integer findAllByLocalization(String localization);
}
