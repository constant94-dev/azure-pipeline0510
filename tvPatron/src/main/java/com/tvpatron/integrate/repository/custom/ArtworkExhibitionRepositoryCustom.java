package com.tvpatron.integrate.repository.custom;

public interface ArtworkExhibitionRepositoryCustom {
    Long findExhibitionIdByArtworkIdAndMostNumberOfViews(Long artworkId);

}
