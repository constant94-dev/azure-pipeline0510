package com.tvpatron.artwork.repository.custom;

import com.tvpatron.artwork.domain.ArtworkTag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ArtworkArtworkTagRepositoryCustom {
    Page<ArtworkTag> findTop8TagsWithMostArtworks(Pageable pageable);
    Long getTagCountByTagName(String localization, String tagName);
}
