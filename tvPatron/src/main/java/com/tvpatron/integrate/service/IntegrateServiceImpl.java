package com.tvpatron.integrate.service;

import com.tvpatron.artist.domain.Artist;
import com.tvpatron.artist.service.ArtistService;
import com.tvpatron.artwork.domain.Artwork;
import com.tvpatron.artwork.domain.ArtworkArtworkTag;
import com.tvpatron.artwork.domain.ArtworkTag;
import com.tvpatron.artwork.service.ArtworkService;
import com.tvpatron.exhibition.domain.Exhibition;
import com.tvpatron.exhibition.service.ExhibitionService;
import com.tvpatron.integrate.domain.ArtistExhibition;
import com.tvpatron.integrate.domain.ArtworkExhibition;
import com.tvpatron.integrate.repository.ArtworkExhibitionRepository;
import com.tvpatron.member.domain.Collection;
import com.tvpatron.member.domain.GeneralMember;
import com.tvpatron.member.dto.PlayerDto;
import com.tvpatron.member.service.MemberStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class IntegrateServiceImpl implements IntegrateService{
    private final ArtworkExhibitionRepository artworkExhibitionRepository;
    private final ExhibitionService exhibitionService;
    private final MemberStorageService memberStorageService;
    private final ArtworkService artworkService;
    private final ArtistService artistService;

    // get most number of views exhibition by artwork
    @Override
    public Long findMostWatchedExhibitionIdByArtworkId(Long artworkId){
        Long exhibition = artworkExhibitionRepository.findExhibitionIdByArtworkIdAndMostNumberOfViews(artworkId);
        if(exhibition == null){
            exhibition = exhibitionService.findRandomExhibitionId();
        }
        return exhibition;
    }
    @Override
    public PlayerDto createPlayerDto(Artwork artwork, Exhibition exhibition, GeneralMember member, String language, String localization){
        boolean exhibitionInCollection = exhibition != null && member != null ? memberStorageService.isExhibitionInCollection(member, exhibition) : false;
        List<Collection> allCollections = member != null ? memberStorageService.getAllCollections(member) : null;
        List<Boolean> artworkInCollection = member != null ? memberStorageService.isArtworkInCollections(allCollections,artwork) : null;
        LocalDate lastViewTime = member != null ? memberStorageService.getLastViewTime(artwork,member) : null;
        Boolean artworkLiked = member != null ? memberStorageService.isArtworkLikedByMember(member, artwork) : null;
        List<Collection> recentCollections = member != null ? memberStorageService.findFirst3RecentCollections(allCollections) : null;
        List<String> recentCollectionNames = recentCollections != null ? recentCollections.stream().map(Collection::getCollectionName).collect(Collectors.toList()) : null;
        List<Boolean> artworkInRecentCollection = recentCollections != null ? memberStorageService.isArtworkInCollections(recentCollections, artwork) : null;
        List<Artwork> otherArtistArtworks = artwork.getArtist().getArtworks().stream().filter(ar->ar.getLocalization().contains(localization)).sorted(Comparator.comparing(Artwork::getNumberOfViews)).limit(15).collect(Collectors.toList());
        otherArtistArtworks.remove(artwork);
        List<ArtworkTag> artworkTags = artwork.getArtworkArtworkTags().stream().map(ArtworkArtworkTag::getArtworkTag).filter(artworkTag -> artworkTag.getLanguage().equals(language)).limit(15).collect(Collectors.toList());
        List<Exhibition> otherExhibitions = artwork.getArtworkExhibitions().stream().map(ArtworkExhibition::getExhibition).filter(eExhibition -> eExhibition.getLocalization().contains(localization)).collect(Collectors.toList());
        otherExhibitions.addAll(artwork.getArtist().getArtistExhibitions().stream().map(ArtistExhibition::getExhibition).filter(eExhibition -> eExhibition.getLocalization().contains(localization)).collect(Collectors.toList()));
        Set<Exhibition> exhibitionSet = new HashSet<Exhibition>(otherExhibitions);
        List<Exhibition> similarExhibitions = new ArrayList<Exhibition>(exhibitionSet).stream().limit(16).collect(Collectors.toList());
        if(exhibition != null) similarExhibitions.remove(exhibitionService.findExhibitionById(exhibition.getId(), language, localization));
        return new PlayerDto(artwork.getId(),
                artwork.getArtworkDetails().stream().filter(a -> a.getLanguage().equals(language)).findFirst().get().getArtworkName(),
                artwork.getArtworkDetails().stream().filter(a -> a.getLanguage().equals(language)).findFirst().get().getIntro(),
                artwork.getArtworkDetails().stream().filter(a -> a.getLanguage().equals(language)).findFirst().get().getSource(),
                artwork.getSize(),
                artwork.getYear(),
                artwork.getKeep(),
                artwork.getContents_4k() != null ? artwork.getContents_4k().getDefaultImg() : null,
                artwork.getContents_4k() != null ? artwork.getContents_4k().getOriginalImg() : null,
                artwork.getArtist() != null ? artwork.getArtist().getId() : null,
                artwork.getArtist() != null ? artwork.getArtist().getArtistDetails().stream().filter(a -> a.getLanguage().equals(language)).findFirst().get().getArtistName() : "undefined",
                artwork.getArtist() != null ? artwork.getArtist().getArtistDetails().stream().filter(a -> a.getLanguage().equals(language)).findFirst().get().getIntro() : "undefined",
                artwork.getArtist() != null ? artwork.getArtist().getProfileImg() : null,
                artwork.getSound().getSoundName(),
                artwork.getSound().getSoundUrl(),
                artwork.getSound().getSoundOriginUrl(),
                artwork.getSound().getSoundLicense(),
                artwork.getSound().getSoundCreator(),
                artwork.getShopUrl(),
                otherArtistArtworks.stream().map(Artwork::getId).collect(Collectors.toList()),
                otherArtistArtworks.stream().map(a -> a.getArtworkDetails().stream().filter(ar -> ar.getLanguage().equals(language)).findFirst().get().getArtworkName()).collect(Collectors.toList()),
                otherArtistArtworks.stream().map(a -> a.getArtist().getArtistDetails().stream().filter(ar -> ar.getLanguage().equals(language)).findFirst().get().getArtistName()).collect(Collectors.toList()),
                otherArtistArtworks.stream().map(a -> a.getContentsThumbnail().getDefaultImg()).collect(Collectors.toList()),
                artworkTags.stream().map(ArtworkTag::getTagName).collect(Collectors.toList()),
                similarExhibitions.stream().map(Exhibition::getId).collect(Collectors.toList()),
                similarExhibitions.stream().map(o -> o.getExhibitionDetails().stream().filter(e -> e.getLanguage().equals(language)).findFirst().get().getExhibitionName()).collect(Collectors.toList()),
                similarExhibitions.stream().map(o -> o.getArtistExhibitions().stream().map(ar -> ar.getArtist().getArtistDetails().stream().filter(ad -> ad.getLanguage().equals(language)).findFirst().get().getArtistName()).limit(3).collect(Collectors.joining(", "))).collect(Collectors.toList()),
                similarExhibitions.stream().map(o -> o.getArtworkExhibitions().stream().findFirst().isPresent() ? o.getArtworkExhibitions().stream().findFirst().get().getArtwork().getContentsThumbnail().getDefaultImg() : null).collect(Collectors.toList()),
                similarExhibitions.stream().map(e -> e.getArtistExhibitions().size() - 3).collect(Collectors.toList()),
                artworkLiked,
                allCollections == null ? null : allCollections.stream().map(Collection::getCollectionName).collect(Collectors.toList()),
                artworkInCollection,
                artworkInRecentCollection,
                recentCollectionNames,
                exhibitionInCollection,
                lastViewTime,
                exhibition == null ? null : exhibition.getId(),
                exhibition == null ? null : exhibition.getExhibitionDetails().stream().filter(e -> e.getLanguage().equals(language)).findFirst().get().getExhibitionName(),
                exhibition == null ? null : exhibition.getExhibitionDetails().stream().filter(e -> e.getLanguage().equals(language)).findFirst().get().getIntro(),
                exhibition == null ? null : exhibition.getArtistExhibitions().stream().findFirst().orElseGet(null).getArtist().getArtistDetails().stream().filter(a -> a.getLanguage().equals(language)).findFirst().get().getArtistName(),
                exhibition == null ? null : exhibition.getArtistExhibitions().size() - 1,
                exhibition == null ? null : exhibition.getArtworkExhibitions().stream().findFirst().isPresent() ? exhibition.getArtworkExhibitions().stream().findFirst().get().getArtwork().getContentsThumbnail().getDefaultImg() : ""
        );
    }

    @Override
    public String exhibitionDuration(Exhibition exhibition, String language) {
        Integer exhibitionDurationInt = exhibition.getArtworkExhibitions().stream().mapToInt(a->a.getArtwork().getDurationTime()).sum();
        return artworkService.durationTimeParse(exhibitionDurationInt, language);
    }
    @Override
    public List<String> exhibitionListDuration(List<Exhibition> exhibitionList, String language) {
        return exhibitionList.stream()
                .map(m->artworkService.durationTimeParse(m.getArtworkExhibitions().stream()
                        .mapToInt(a->a.getArtwork().getDurationTime()).sum(),language)).collect(Collectors.toList());
    }
    @Override
    public Long findFirstArtworkIdByExhibitionId(Long exhibitionId, String language, String localization) {
        Exhibition exhibition = exhibitionService.findExhibitionById(exhibitionId,language,localization);
        return exhibition.getArtworkExhibitions().stream().findFirst().orElseGet(null).getArtwork().getId();
    }
    @Override
    public Long findFirstArtworkIdByArtistId(Long artistId, String language, String localization) {
        Artist artist = artistService.findArtistById(artistId);
        artist.getArtworks().removeIf(a->!a.getLocalization().contains(localization));
        return artist.getArtworks().stream().findFirst().get().getId();
    }
    @Override
    public Long findFirstArtworkIdByCollectionName(String myCollection, GeneralMember member, String localization) {
        Collection collection = memberStorageService.findCollectionByNameAndMemberAndExhibitionNull(myCollection,member,localization);
        return collection.getCollectionArtworks().stream().findFirst().get().getId();
    }
}
