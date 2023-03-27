package digital.patron.webmobile.artwork.service;

import digital.patron.webmobile.artwork.domain.Artwork;
import digital.patron.webmobile.artwork.domain.RecommendedTags;
import digital.patron.webmobile.artwork.dto.ArtworkAllDto;
import digital.patron.webmobile.artwork.dto.ArtworkDto;
import digital.patron.webmobile.exhibition.domain.Exhibition;
import digital.patron.webmobile.member.dto.SearchDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ArtworkService {
    List<Artwork> findArtworksByIds(String localization, List<Long> ids);

    List<Artwork> getAllArtworksSorted(String sortBy, String localization, Pageable pageable);

    Integer findAllArtworksCountByLocalization(String localization);

    Artwork findArtworkById(String localization, Long id);

    Exhibition getArtworksFirstExhibition(String localization, Artwork artwork);

    //get seen artworks of a user
    Page<Artwork> findSeenArtworks(String email,String localization, Pageable pageable);

    //get liked artworks of a user
    Page<Artwork> findLikedArtworks(String email,String localization, Pageable pageable);

    //get newly registered artworks
    List<Artwork> findNewlyRegisteredArtworks(String localization);
    List<Artwork> findSubsequentArtworkWatchingList(Artwork artwork, String localization);


    //searching artworks by keyword ordered by number of views descending
    //if artworks have same viewcount get by create time(old first)
    Page<Artwork> searchArtworksByKeyword(String keyword, String localization, Pageable pageable);

    SearchDto createSearchDto(String language, Page<Artwork> artworkPage);

    int shareArtwork(Long artworkId);

    String durationTimeParse(Integer durationTime, String language);

    String findShopUrlById(Long artworkId);

    List<RecommendedTags> getRecommendedTags(String localization);

    List<RecommendedTags> filterTagsByFixed(List<RecommendedTags> recommendedTags, Boolean fixed);

    ArtworkDto createArtworkDto(String language, String localization, Artwork artwork, Long exhibitionId);

    ArtworkAllDto createArtworkAllDto(List<Artwork> artworks, String language);

    List<Artwork> sortArtworks(Long artworkId, List<Artwork> totalArtworks);
}
