package com.tvpatron.artist.service;


import com.tvpatron.artist.domain.Artist;
import com.tvpatron.artist.dto.ArtistDto;
import com.tvpatron.artwork.domain.Artwork;
import com.tvpatron.exhibition.domain.Exhibition;
import com.tvpatron.member.domain.GeneralMember;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ArtistService {

    List<Artist> findArtistsByArtistGroupName(String localization, Pageable pageable);

    List<Artist> findArtistsByKeyword(String keyword, String localization, Pageable pageable);

    Artist findArtistById(Long ArtistId);

    List<Artist> findLikedArtists(String email, String localization, String language, Pageable pageable);

    boolean checkIfArtistIsLikedByMember(GeneralMember generalMember, Artist artist);

    List<Artist> getSortedArtists(String localization, Pageable pageable);

    ArtistDto createArtistDto(List<Artist> artists, String language);

    List<Artwork> getFirstArtistExhibitionsFirstArtwork(List<Exhibition> artistExhibitions, Artist artist);
}