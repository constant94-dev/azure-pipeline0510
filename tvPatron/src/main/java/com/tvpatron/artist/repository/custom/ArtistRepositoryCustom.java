package com.tvpatron.artist.repository.custom;

import com.tvpatron.artist.domain.Artist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ArtistRepositoryCustom {

    Page<Artist> findArtistsByKeywordLikeOrderByArtistIdAsc(String keyword, String localization, Pageable pageable);

    Page<Artist> findArtistsSorted(String localization, Pageable pageable);

    Page<Artist> findLikedArtistsByEmail(String email, String localization, Pageable pageable);
}
