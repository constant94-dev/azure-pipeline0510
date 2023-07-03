package com.tvpatron.artist.repository.custom;

import com.tvpatron.artist.domain.Artist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ArtistGroupRepositoryCustom {
    Page<Artist> findArtistsByArtistGroupNameOrderByArtistArtistGroupIdAsc(String localization, Pageable pageable);
}
