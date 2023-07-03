package com.tvpatron.exhibition.service;

import com.tvpatron.artist.domain.Artist;
import com.tvpatron.exhibition.domain.Exhibition;

import java.util.List;


public interface ExhibitionService {


    Long findRandomExhibitionId();

    List<Exhibition> findExhibitionsByGroupName(String groupName, String localization, String language);

    Exhibition findExhibitionById(Long exhibitionId, String language, String localization);

    Exhibition findExhibitionByIdIgnoreShowing(Long exhibitionId);

    List<Exhibition> findExhibitionsByArtistId(Artist artist, String localization);

    List<Long>  calculateLeftTimeTillExhibition(List<Exhibition> exhibitionList);

}