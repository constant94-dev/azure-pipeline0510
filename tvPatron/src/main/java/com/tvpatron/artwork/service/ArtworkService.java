package com.tvpatron.artwork.service;

import com.tvpatron.artist.domain.Artist;
import com.tvpatron.artwork.domain.Artwork;
import com.tvpatron.artwork.domain.ArtworkTag;
import com.tvpatron.artwork.domain.RecommendedTags;
import com.tvpatron.exhibition.domain.Exhibition;
import com.tvpatron.member.domain.GeneralMember;
import com.tvpatron.member.dto.PlayerDto;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface ArtworkService {
    //get seen artworks of a user
    List<Artwork> findSeenArtworks(String email, String localization, String language, Pageable pageable);

    //get liked artworks of a user
    List<Artwork> findLikedArtworks(String email, String localization, String language,Pageable pageable);

    //get newly registered artworks
    List<Artwork> findNewlyRegisteredArtworks(String localization);

    //searching artworks by keyword ordered by number of views descending
    //if artworks have same viewcount get by create time(old first)
    List<Artwork> searchArtworksByKeyword(String keyword,String localization, Pageable pageable);

    List<RecommendedTags> filterTagsByFixed(List<RecommendedTags> recommendedTags, Boolean fixed);

    //get artwork by id
    Artwork findArtworkById(Long artworkId);

    //get artworks in an exhibition
    //sort them according to current artwork
    List<Artwork> findSubsequentWatchingList(Long exhibitionId, Long artworkId, String localization);

    List<Artwork> findSubsequentArtistWatchingList(Long artistId, Long artworkId, String localization);

    List<Artwork> findSubsequentArtworkWatchingList(Artwork artwork, String localization);

    List<ArtworkTag> getMostArtworksTags(Pageable pageable);

    Long getTagCountByTagName(String localization, String tagName);

    String findShopUrlById(Long artworkId);

    List<RecommendedTags> getRecommendedTags(String localization);

    String durationTimeParse(Integer durationTime, String language);
}
