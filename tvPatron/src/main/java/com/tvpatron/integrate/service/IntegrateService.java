package com.tvpatron.integrate.service;

import com.tvpatron.artwork.domain.Artwork;
import com.tvpatron.exhibition.domain.Exhibition;
import com.tvpatron.member.domain.GeneralMember;
import com.tvpatron.member.dto.PlayerDto;

import java.util.List;

public interface IntegrateService {
    // get most number of views exhibition by artwork
    Long findMostWatchedExhibitionIdByArtworkId(Long artworkId);

    PlayerDto createPlayerDto(Artwork artwork, Exhibition exhibition, GeneralMember member, String language, String localization);

    String exhibitionDuration(Exhibition exhibition, String language);

    List<String> exhibitionListDuration(List<Exhibition> exhibitionList, String language);

    Long findFirstArtworkIdByExhibitionId(Long exhibitionId, String language, String localization);

    Long findFirstArtworkIdByArtistId(Long artistId, String language, String localization);

    Long findFirstArtworkIdByCollectionName(String myCollection, GeneralMember member, String localization);
}
