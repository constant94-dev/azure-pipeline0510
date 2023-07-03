package com.tvpatron.artwork.service;

import com.tvpatron.artist.domain.Artist;
import com.tvpatron.artwork.domain.*;
import com.tvpatron.artwork.repository.ArtworkArtworkTagRepository;
import com.tvpatron.artwork.repository.ArtworkRepository;
import com.tvpatron.artwork.repository.RecommendedTagsRepository;
import com.tvpatron.artwork.repository.SoundRepository;
import com.tvpatron.exhibition.domain.Exhibition;
import com.tvpatron.exhibition.repository.ExhibitionRepository;
import com.tvpatron.exhibition.service.ExhibitionService;
import com.tvpatron.integrate.domain.ArtistExhibition;
import com.tvpatron.integrate.domain.ArtworkExhibition;
import com.tvpatron.member.domain.Collection;
import com.tvpatron.member.domain.GeneralMember;
import com.tvpatron.member.dto.PlayerDto;
import com.tvpatron.member.service.MemberStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ArtworkServiceImpl implements ArtworkService{
    private final ArtworkRepository artworkRepository;
    private final ArtworkArtworkTagRepository artworkArtworkTagRepository;
    private final RecommendedTagsRepository recommendedTagsRepository;
    private final SoundRepository soundRepository;


    //get seen artworks of a user
    @Override
    public List<Artwork> findSeenArtworks(String email, String localization, String language, Pageable pageable) {
        List<Artwork> artworkList = artworkRepository.findSeenArtworksByEmailOrderByIdDesc(email,localization, pageable).getContent();
        return artworkList;
    }

    //get liked artworks of a user
    @Override
    public List<Artwork> findLikedArtworks(String email, String localization, String language, Pageable pageable) {
        List<Artwork> artworkList = artworkRepository.findLikedArtworksByEmail(email, localization, pageable).getContent();
        return artworkList;
    }

    //get newly registered artworks
    @Override
    public List<Artwork> findNewlyRegisteredArtworks(String localization) {
        List<Artwork> artworkList = artworkRepository.findArtworksByIsApproveAndIsShowingOrderByRegisteredAtDesc(localization);
        return artworkList;
    }
    //searching artworks by keyword ordered by number of views descending
    //if artworks have same viewcount get by create time(old first)
    @Override
    public List<Artwork> searchArtworksByKeyword(String keyword,String localization, Pageable pageable) {
        Page<Artwork> artworkList = artworkRepository.findArtworksByKeywordLikeOrderByNumberOfViewsDesc(keyword, localization,pageable);
        return artworkList.getContent();
    }
    @Override
    public List<RecommendedTags> filterTagsByFixed(List<RecommendedTags> recommendedTags, Boolean fixed){
        List<RecommendedTags> tagList = recommendedTags.stream().filter(r -> r.getFixed().equals(fixed)).collect(Collectors.toList());
        if(!fixed){
            Collections.shuffle(tagList);}
        return tagList;
    }

    //get artwork by id
    @Override
    public Artwork findArtworkById(Long artworkId) {
        try{
            Artwork artwork = artworkRepository.findById(artworkId).orElse(null);
            return artwork;
        }catch (Exception e){
            System.out.println("No artwork with ID = " + artworkId + " found." + e);
            return null;
        }
    }
    //get artworks in an exhibition
    //sort them according to current artwork
    @Override
    public List<Artwork> findSubsequentWatchingList(Long exhibitionId, Long artworkId, String localization) {
        List<Artwork> artworkList = artworkRepository.findArtworksByExhibitionIdOrderByArtworkExhibitionIdAsc(exhibitionId, localization);
        artworkFilterByLocalization(artworkList,localization);
        return sortArtworks(artworkId, artworkList);
    }
    @Override
    public List<Artwork> findSubsequentArtistWatchingList(Long artistId, Long artworkId, String localization) {
        List<Artwork> artworkList = artworkRepository.findArtworksByArtistIdOrderByCreateTimeDesc(artistId, localization);
        return sortArtworks(artworkId, artworkList);
    }
    @Override
    public List<Artwork> findSubsequentArtworkWatchingList(Artwork artwork, String localization) {
        List<Artwork> otherArtistsArtwork = artwork.getArtist().getArtworks().stream()
                .filter(art -> art != artwork && art.getLocalization().contains(localization)) // Exclude the initial artwork
                .limit(10) // Limit to 5 items
                .collect(Collectors.toList());
        int limit = 20 - otherArtistsArtwork.size();
        otherArtistsArtwork.add(0,artwork);
        List<Artwork> combineList = new ArrayList<>(otherArtistsArtwork);
        List<SoundTag> soundTags = artwork.getSound().getSoundSoundTags().stream().map(SoundSoundTag::getSoundTag).collect(Collectors.toList());
        List<Artwork> similarSoundArtworks  = soundRepository.findByTags(soundTags,otherArtistsArtwork,limit, localization);
        combineList.addAll(similarSoundArtworks);
        List<ArtworkTag> artworkTags = artwork.getArtworkArtworkTags().stream().map(ArtworkArtworkTag::getArtworkTag).collect(Collectors.toList());
        limit = 29 - (similarSoundArtworks.size() + otherArtistsArtwork.size());
        List<Artwork> similarArtworks = artworkRepository.findByTags(artworkTags, combineList, limit, localization);
        combineList.addAll(similarArtworks);
        combineList.remove(0);
        Collections.shuffle(combineList);
        combineList.add(0,artwork);
        return sortArtworks(artwork.getId(), combineList);
    }

    @Override
    public List<ArtworkTag> getMostArtworksTags(Pageable pageable){
        return artworkArtworkTagRepository.findTop8TagsWithMostArtworks(pageable).getContent();
    }
    @Override
    public Long getTagCountByTagName(String localization, String tagName){
        return artworkArtworkTagRepository.getTagCountByTagName(localization, tagName);
    }
    @Override
    public String findShopUrlById(Long artworkId){
        return artworkRepository.findShopUrlById(artworkId);
    }
    @Override
    public List<RecommendedTags> getRecommendedTags(String localization){
        return recommendedTagsRepository.findByLocalization("%" + localization + "%");
    }
    @Override
    public String durationTimeParse(Integer durationTime, String language){
        int hours = durationTime / 3600;
        int minutes = (durationTime / 60) % 60;
//        int seconds = durationTime % 60;

        String hourString = hours > 0 ? hours + (language.equals("ko") ? "시간 " : (language.equals("ja") ? "時間 " : "h ")) : "";
        String minuteString = minutes > 0 ? minutes + (language.equals("ko") ? "분 " : (language.equals("ja") ? "分 " : "min ")) : "";
//        String secondString = seconds + (language.equals("ko") ? "초" : (language.equals("ja") ? "酢" : "sec"));

        return hourString + minuteString;
    }

    //sorting artworks
    // find current artwork in a list
    // add artworks that go after to the sort list and then add artworks that were before
    private List<Artwork> sortArtworks(Long artworkId, List<Artwork> totalArtworks) {
        List<Artwork> sortedArtworks = new ArrayList<>();

        for (int i = 0; i < totalArtworks.size(); i++) {
            int k = i;
            if (totalArtworks.get(i).getId().equals(artworkId)) {
                for (int j = 0; j < totalArtworks.size() - (i + 1); j++) {
                    sortedArtworks.add(totalArtworks.get(++k));
                }
                for (int j = 0; j < i; j++) {
                    sortedArtworks.add(totalArtworks.get(j));
                }
            }
        }
        return sortedArtworks;
    }
    public void artworkFilterByLocalization(List<Artwork> artworkList, String localization){
        if(artworkList != null && artworkList.size() != 0){
            for (Artwork artwork : artworkList){
                artwork.getArtworkExhibitions().removeIf(a -> !a.getExhibition().getLocalization().contains(localization));
            }
        }
    }
}
