package com.tvpatron.artist.service;

import com.tvpatron.artist.domain.Artist;
import com.tvpatron.artist.domain.ArtistDetail;
import com.tvpatron.artist.dto.ArtistDto;
import com.tvpatron.artist.repository.ArtistGroupRepository;
import com.tvpatron.artist.repository.ArtistRepository;
import com.tvpatron.artwork.domain.Artwork;
import com.tvpatron.exhibition.domain.Exhibition;
import com.tvpatron.member.domain.GeneralMember;
import com.tvpatron.member.repository.MemberLikedArtistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ArtistServiceImpl implements ArtistService{
    private final ArtistGroupRepository artistGroupRepository;
    private final ArtistRepository artistRepository;
    private final MemberLikedArtistRepository memberLikedArtistRepository;

    @Override
    public List<Artist> findArtistsByArtistGroupName(String localization, Pageable pageable) {
        List<Artist> artistList = artistGroupRepository.findArtistsByArtistGroupNameOrderByArtistArtistGroupIdAsc(localization, pageable).getContent();
        return artistList;
    }
    @Override
    public List<Artist> findArtistsByKeyword(String keyword, String localization, Pageable pageable) {
        List<Artist> artistList = artistRepository.findArtistsByKeywordLikeOrderByArtistIdAsc(keyword, localization, pageable).getContent();
        return artistList;
    }
    @Override
    public Artist findArtistById(Long ArtistId) {
        Artist artist = artistRepository.findById(ArtistId).orElseThrow(()->new NoSuchElementException());
        return artist;
    }
    @Override
    public List<Artist> findLikedArtists(String email, String localization, String language, Pageable pageable) {
        List<Artist> artistList = artistRepository.findLikedArtistsByEmail(email, localization, pageable).getContent();
        return artistList;
    }
    @Override
    public boolean checkIfArtistIsLikedByMember(GeneralMember generalMember, Artist artist){
        return memberLikedArtistRepository.findIdByGeneralMemberAndArtist(generalMember,artist).isPresent();
    }
    @Override
    public List<Artist> getSortedArtists(String localization, Pageable pageable){
        return artistRepository.findArtistsSorted(localization, pageable).getContent();
    }
    @Override
    public ArtistDto createArtistDto(List<Artist> artists, String language) {
        List<Long> ids = getArtistIds(artists);
        List<String> names = getArtistNames(artists, language);
        List<String> nationalities = getArtistNationalities(artists, language);
        List<String> profileImages = getArtistProfileImages(artists);
        List<Integer> numberOfLikes = getArtistNumberOfLikes(artists);
        return new ArtistDto(ids, names, nationalities, profileImages, numberOfLikes);
    }
    @Override
    public List<Artwork> getFirstArtistExhibitionsFirstArtwork(List<Exhibition> artistExhibitions, Artist artist){
        return artistExhibitions.stream().map(a->a.getArtworkExhibitions().stream()
                .filter(art->art.getArtwork().getArtist().equals(artist)).findFirst().get().getArtwork()).collect(Collectors.toList());
    }

    private List<Long> getArtistIds(List<Artist> artists) {
        return artists.stream().map(Artist::getId).collect(Collectors.toList());
    }

    private List<String> getArtistNames(List<Artist> artists, String language) {
        return getArtistDetails(artists, language)
                .map(ArtistDetail::getArtistName)
                .collect(Collectors.toList());
    }

    private List<String> getArtistNationalities(List<Artist> artists, String language) {
        return getArtistDetails(artists, language)
                .map(ArtistDetail::getNationality)
                .collect(Collectors.toList());
    }

    private List<String> getArtistProfileImages(List<Artist> artists) {
        return artists.stream().map(Artist::getProfileImg).collect(Collectors.toList());
    }

    private List<Integer> getArtistNumberOfLikes(List<Artist> artists) {
        return artists.stream().map(Artist::getNumberOfLikes).collect(Collectors.toList());
    }

    private Stream<ArtistDetail> getArtistDetails(List<Artist> artists, String language) {
        return artists.stream().map(artist -> artist.getArtistDetails().stream()
                .filter(artistDetail -> artistDetail.getLanguage().equals(language)).findFirst().get());
    }
}
