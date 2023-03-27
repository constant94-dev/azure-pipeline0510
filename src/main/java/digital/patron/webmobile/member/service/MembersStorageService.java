package digital.patron.webmobile.member.service;

import digital.patron.webmobile.artist.domain.Artist;
import digital.patron.webmobile.artwork.domain.Artwork;
import digital.patron.webmobile.exhibition.domain.Exhibition;
import digital.patron.webmobile.member.domain.Collection;
import digital.patron.webmobile.member.domain.CollectionArtwork;
import digital.patron.webmobile.member.domain.GeneralMember;
import digital.patron.webmobile.member.domain.MemberWaitingExhibition;
import digital.patron.webmobile.member.dto.ArtworkDataListDto;
import digital.patron.webmobile.member.dto.CollectionDto;
import digital.patron.webmobile.member.dto.CollectionInfoDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MembersStorageService {
    //get collection ordered by ID descending
    Page<Collection> findArtworkCollection(String email, String localization, Pageable pageable);

    List<String> artworkCollectionListDuration(List<Collection> collectionList, String language);

    String artworkCollectionDuration(Collection collection, String language);

    List<CollectionArtwork> lastAddedArtworkInArtworkCollection(List<Collection> collectionList);

    List<CollectionArtwork> sortedArtworksInArtworkCollection(String localization, Collection collection);

    List<Exhibition> getExhibitionsInArtworkCollection(String localization, List<CollectionArtwork> collectionArtworks);

    List<Artist> getArtistsInArtworkCollection(List<CollectionArtwork> collectionArtworks);

    CollectionDto createCollectionDto(List<Collection> collectionList, Artwork artwork);

    CollectionInfoDto createCollectionInfoDtoForArtworkCollection(String language, String localization, List<Collection> collectionList);

    CollectionInfoDto createCollectionInfoDtoForExhibitionCollection(List<Collection> collectionList, String language, String localization);

    ArtworkDataListDto createArtworkDataListDto(String language, List<Artwork> artworkList);

    //Find Collections of member
    Page<Collection> findExhibitionsCollection(String email, String localization, Pageable pageable);

    //check if artwork was already seen by member today,
    //if it wasnt viewed at all add it to seenartwork table and increase view number
    //if it was viewed but not today, change last view date to today and increase view number
    int addToSeenArtworks(Long artworkId, GeneralMember generalMember);

    // if member didnt like this artwork already add record to DB
    int addToLikedArtworks(Long artworkId, GeneralMember generalMember);

    //remove record to DB
    int removeFromLikedArtworks(Long artworkId, GeneralMember generalMember);

    int addToLikedArtists(Long artistId, GeneralMember generalMember);

    //remove record to DB
    int removeFromLikedArtists(Long artistId, GeneralMember generalMember);

    //add artwork to collection
    int addArtworkToCollectionArtwork(Long artworkId, GeneralMember generalMember, String colName);

    //remove artwork from collection
    int removeArtworkFromCollectionArtwork(Long artworkId, GeneralMember generalMember, String colName);

    //create new exhibition collection
    int addExhibitionToCollection(Long exhibitionId, GeneralMember generalMember);

    // remove exhibition collection
    int removeExhibitionFromCollection(Long exhibitionId, GeneralMember generalMember);

    int createNewCollection(String name, List<Long> artIds, GeneralMember generalMember);

    int editCollection(String previousName, String newName, List<Long> artIds, GeneralMember generalMember);

    int deleteCollection(String name, GeneralMember generalMember);

    //check if exhibition is in collection
    Boolean isExhibitionInCollection(GeneralMember generalMember, Long exhibitionId);

    // add to waiting list
    int addToWaitingExhibitions(Long exhibitionId, GeneralMember generalMember);

    //remove record from DB
    int removeFromWaitingExhibitions(Long exhibitionId, GeneralMember generalMember);

    //get waiting exhibitions
    Page<MemberWaitingExhibition> findMemberWaitingExhibition(String email, String localization, Pageable pageable);

    List<Exhibition> getExhibitionListFromMemberWaitingExhibition(List<MemberWaitingExhibition> memberWaitingExhibitionList);

    //check if exhbition is already in waiting exhibition list
    Boolean checkIfAlreadyInWaitingList(GeneralMember generalMember, Exhibition exhibition);

    int removeSeenArtwork(GeneralMember generalMember, Long artworkId);

    int removeAllSeenArtwork(GeneralMember generalMember);

    Collection findCollectionById(Long colId);

    ArtworkDataListDto createArtworkDataListDto(List<Artwork> artworkList, Long collectionId, String language);

    //check if artwork was already liked by member
    Boolean isArtworkLikedByMember(GeneralMember generalMember, Artwork artwork);

    //get liked artists by member
    Page<Artist> getLikedArtists(GeneralMember generalMember, String localization, Pageable pageable);

    void deleteMembersStorageByGeneralMember(GeneralMember generalMember);
}
