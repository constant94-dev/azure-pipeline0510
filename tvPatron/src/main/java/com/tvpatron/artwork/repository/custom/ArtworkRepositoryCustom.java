package com.tvpatron.artwork.repository.custom;

import com.tvpatron.artwork.domain.Artwork;
import com.tvpatron.artwork.domain.ArtworkTag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ArtworkRepositoryCustom {

    List<Artwork> findArtworksByIsApproveAndIsShowingOrderByRegisteredAtDesc(String localization);

    Page<Artwork> findSeenArtworksByEmailOrderByIdDesc(String email, String localization,Pageable pageable);

    Page<Artwork> findLikedArtworksByEmail(String email,String localization, Pageable pageable);

    Page<Artwork> findArtworksByKeywordLikeOrderByNumberOfViewsDesc(String keyword, String localization,Pageable pageable);

    List<Artwork> findArtworksByExhibitionIdOrderByArtworkExhibitionIdAsc(Long exhibitionId, String localization);

    List<Artwork> findArtworksByArtistIdOrderByCreateTimeDesc(Long artistId, String localization);

    List<Artwork> findByTags(List<ArtworkTag> artworkTags, List<Artwork> artwork, Integer l, String localization);

}
