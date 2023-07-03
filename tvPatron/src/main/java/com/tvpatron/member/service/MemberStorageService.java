package com.tvpatron.member.service;

import com.tvpatron.artwork.domain.Artwork;
import com.tvpatron.exhibition.domain.Exhibition;
import com.tvpatron.member.domain.Collection;
import com.tvpatron.member.domain.CollectionArtwork;
import com.tvpatron.member.domain.GeneralMember;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;


public interface MemberStorageService {
    Collection findCollectionByNameAndMemberAndExhibitionNull(String name, GeneralMember generalMember, String localization);


    //get collection ordered by ID descending
    List<Collection> findArtworkCollections(String email,String localization, Pageable pageable);

    //get subsequent artwork from collection
    List<Artwork> findSubsequentArtworkInCollection(GeneralMember generalMember, Long artworkId, Collection collection, String localization);
    //get current artwork from collection
//    Integer findCurrentArtworkInCollection(GeneralMember generalMember, Long artworkId, Collection collection);

    //Find Collections of member
    List<Collection> findExhibitionsCollection(String email, String localization,String language, Pageable pageable);

    List<CollectionArtwork> lastAddedArtworkInArtworkCollection(List<Collection> collectionList);

    //check if artwork was already seen by member today,
    //if it wasnt viewed at all add it to seenartwork table and increase view number
    //if it was viewed but not today, change last view date to today and increase view number
    int addToSeenArtworks(Long artworkId, String email);

    // if member didnt like this artwork already add record to DB
    int addToLikedArtworks(Long artworkId, String email);

    //remove record to DB
    int removeFromLikedArtworks(Long artworkId, String email);

    //delete view history of member
    void emptySeenArtworks(String email);

    //add artwork to collection
    int addArtworkToCollectionArtwork(Long artworkId, String email, String colName);

    //remove artwork from collection
    int removeArtworkFromCollectionArtwork(Long artworkId, String email, String colName);

    //create new exhibition collection
    int addExhibitionToCollection(Long exhibitionId,String language, String email);

    // remove exhibition collection
    int removeExhibitionFromCollection(Long exhibitionId, String email);

    //check if artwork was already liked by member
    Boolean isArtworkLikedByMember(GeneralMember generalMember, Artwork artwork);

    List<Collection> getAllCollections(GeneralMember generalMember);

    List<Boolean> isArtworkInCollections(List<Collection> collections, Artwork artwork);

    List<Collection> findFirst3RecentCollections(List<Collection> collections);

    //check if exhibition is in collection
    Boolean isExhibitionInCollection(GeneralMember generalMember, Exhibition exhibition);

    //get last view time
    LocalDate getLastViewTime(Artwork artwork, GeneralMember generalMember);

    // add to waiting list
    void addToWaitingExhibitions(Long exhibitionId, String email);

    //remove record from DB
    void removeFromWaitingExhibitions(Long exhibitionId, String email);

    //get waiting exhibitions
    List<Exhibition> findWaitingExhibition(String email, String localization, String language, Pageable pageable);

    //check if exhbition is already in waiting exhibition list
    Boolean checkIfAlreadyInWaitingList(GeneralMember generalMember, Exhibition exhibition);

    void changeLanguage(String email, String language);

    int addToLikedArtists(Long artistId, GeneralMember generalMember);

    int removeFromLikedArtists(Long artistId, GeneralMember generalMember);
}