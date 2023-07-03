package com.tvpatron.member.service;

import com.tvpatron.artist.domain.Artist;
import com.tvpatron.artist.repository.ArtistRepository;
import com.tvpatron.artwork.domain.Artwork;
import com.tvpatron.artwork.repository.ArtworkRepository;
import com.tvpatron.exhibition.domain.Exhibition;
import com.tvpatron.exhibition.repository.ExhibitionRepository;
import com.tvpatron.member.domain.Collection;
import com.tvpatron.member.domain.*;
import com.tvpatron.member.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class MemberStorageServiceImpl implements MemberStorageService {
    private final CollectionRepository collectionRepository;
    private final GeneralMemberRepository generalMemberRepository;
    private final ArtworkRepository artworkRepository;
    private final ArtistRepository artistRepository;
    private final MemberSeenArtworkRepository memberSeenArtworkRepository;
    private final MemberLikedArtworkRepository memberLikedArtworkRepository;
    private final MemberLikedArtistRepository memberLikedArtistRepository;
    private final MemberWaitingExhibitionRepository memberWaitingExhibitionRepository;
    private final CollectionArtworkRepository collectionArtworkRepository;
    private final ExhibitionRepository exhibitionRepository;

    @Override
    public Collection findCollectionByNameAndMemberAndExhibitionNull(String name, GeneralMember generalMember, String localization){
        Collection collection = collectionRepository.findByGeneralMemberAndCollectionNameAndExhibitionNull(name, generalMember).orElseThrow(() -> new NoSuchElementException());
        collection.getCollectionArtworks().removeIf(collectionArtwork -> !collectionArtwork.getArtwork().getLocalization().contains(localization));
        return collection;
    }
    //get collection ordered by ID descending
    @Override
    public List<Collection> findArtworkCollections(String email, String localization, Pageable pageable) {
        List<Collection> collections = collectionRepository.findCollectionArtworksByEmailOrderByIdDesc(email, pageable).getContent();
        collections.forEach(c->c.getCollectionArtworks().removeIf(a->!a.getArtwork().getLocalization().contains(localization) || !a.getArtwork().getArtist().getLocalization().contains(localization)));
        return collections;
    }
    //get subsequent artwork from collection
    @Override
    public List<Artwork> findSubsequentArtworkInCollection(GeneralMember generalMember, Long artworkId, Collection collection, String localization){
        List<CollectionArtwork> artworkCollection = getArtworkCollection(collection);
        List<Artwork> artworksInCollection = artworkCollection.stream().map(CollectionArtwork::getArtwork).collect(Collectors.toList());
        artworksInCollection.removeIf(a->!a.getLocalization().contains(localization));
        return sortArtworkListToStartWithGivenId(artworkId, artworksInCollection);
    }


    //Find Collections of member
    @Override
    public List<Collection> findExhibitionsCollection(String email, String localization, String language, Pageable pageable) {
        Page<Collection> collections = collectionRepository.findCollectionsByEmail(email, localization, pageable);
        List<Collection> collectionList = new ArrayList<>(collections.getContent());
        collectionList.removeIf(c->!c.getExhibition().getLocalization().contains(localization));
        for(Collection collection : collectionList){
            collection.getExhibition().getArtworkExhibitions().removeIf(a->!a.getArtwork().getLocalization().contains(localization));
            collection.getExhibition().getArtistExhibitions().removeIf(a -> !a.getArtist().getLocalization().contains(localization));
            collection.getExhibition().getExhibitionExhibitionTags().stream().filter(e -> !e.getExhibitionTag().getLanguage().equals(language)).collect(Collectors.toList()).forEach(collection.getExhibition().getExhibitionExhibitionTags()::remove);
        }
        return collectionList;
    }
    @Override
    public List<CollectionArtwork> lastAddedArtworkInArtworkCollection(List<Collection> collectionList){
        return collectionList.stream().map(c->c.getCollectionArtworks().size() != 0 ?
                c.getCollectionArtworks().stream().max(Comparator.comparing(CollectionArtwork::getId)).get() : null).collect(Collectors.toList());
    }

    //check if artwork was already seen by member today,
    //if it wasnt viewed at all add it to seenartwork table and increase view number
    //if it was viewed but not today, change last view date to today and increase view number
    @Override
    public int addToSeenArtworks(Long artworkId, String email){
        try{
            MemberSeenArtwork memberSeenArtwork = new MemberSeenArtwork(LocalDate.now());
            Optional<GeneralMember> generalMember = generalMemberRepository.findByEmail(email);
            Artwork artwork = artworkRepository.getById(artworkId);
            Optional<MemberSeenArtwork> alreadySeenArtwork = memberSeenArtworkRepository.findIdByGeneralMemberAndArtwork(generalMember.get(), artwork);
            //delete oldest viewed artwork
            List<MemberSeenArtwork> memberSeenArtworkList = memberSeenArtworkRepository.findByGeneralMember(generalMember.get());
            if(memberSeenArtworkList.size() > 99){
                Long oldestSeenArtworkId = memberSeenArtworkList.stream().max(Comparator.comparing(MemberSeenArtwork::getViewLastTime)).get().getId();
                memberSeenArtworkRepository.deleteById(oldestSeenArtworkId);
            }
            if (alreadySeenArtwork.isEmpty()) {
                generalMember.get().addMemberSeenArtwork(memberSeenArtwork);
                artwork.addMemberSeenArtwork(memberSeenArtwork);
                memberSeenArtworkRepository.save(memberSeenArtwork);
                artwork.increaseNumberOfViews();
                return 1;
            }
            memberSeenArtworkRepository.deleteByGeneralMemberAndArtwork(generalMember.get(),artwork);
            generalMember.get().addMemberSeenArtwork(memberSeenArtwork);
            artwork.addMemberSeenArtwork(memberSeenArtwork);
            memberSeenArtworkRepository.save(memberSeenArtwork);
            if(!Objects.equals(alreadySeenArtwork.get().getViewLastTime(), LocalDate.now())){
                artwork.increaseNumberOfViews();
            }
            return 1;
        }catch (Exception e){
            System.out.println("Failed to add to seen artworks " + artworkId + " artwork to user " + email + " with exception: " + e);
            return 0;
        }


    }
    // if member didnt like this artwork already add record to DB
    @Override
    public int addToLikedArtworks(Long artworkId, String email){
        try{
            Optional<GeneralMember> generalMember = generalMemberRepository.findByEmail(email);
            Artwork artwork = artworkRepository.findById(artworkId).orElseThrow(NoSuchElementException::new);
            Optional<MemberLikedArtwork> alreadyLikedArtwork = memberLikedArtworkRepository.findIdByGeneralMemberAndArtwork(generalMember.get(), artwork);
            if(alreadyLikedArtwork.isPresent()){return -1;}
            MemberLikedArtwork memberLikedArtwork = new MemberLikedArtwork();
            generalMember.get().addMemberLikedArtwork(memberLikedArtwork);
            artwork.addMemberLikedArtwork(memberLikedArtwork);
            memberLikedArtworkRepository.save(memberLikedArtwork);
            artwork.increaseNumberOfLikes();
            return 1;
        }catch (Exception e){
            System.out.println("Failed to add to liked artworks " + artworkId + " artwork to user " + email + " with exception: " + e);
            return 0;
        }
    }

    //remove record to DB
    @Override
    public int removeFromLikedArtworks(Long artworkId, String email){
        try {
            GeneralMember generalMember = generalMemberRepository.findByEmail(email).orElseThrow(NoSuchElementException::new);
            Artwork artwork = artworkRepository.findById(artworkId).orElseThrow(NoSuchElementException::new);
            Optional<MemberLikedArtwork> alreadyLikedArtwork = memberLikedArtworkRepository.findIdByGeneralMemberAndArtwork(generalMember, artwork);
            if(alreadyLikedArtwork.isEmpty()){return -1;}
            memberLikedArtworkRepository.deleteByGeneralMemberAndArtwork(generalMember, artwork);
            artwork.decreaseNumberOfLikes();
            return 1;
        }catch (Exception e){
            log.error("Exception " + e);
            return 0;
        }
    }
    //delete view history of member
    @Override
    public void emptySeenArtworks(String email){
        Optional<GeneralMember> generalMember = generalMemberRepository.findByEmail(email);
        memberSeenArtworkRepository.deleteByGeneralMember(generalMember.get());
    }
    //add artwork to collection
    @Override
    public int addArtworkToCollectionArtwork(Long artworkId, String email, String colName){
        CollectionArtwork collectionArtwork = new CollectionArtwork();
        //get generalMember
        GeneralMember generalMember = generalMemberRepository.findByEmail(email).orElseThrow(()->new NoSuchElementException());
        //get artwork
        Artwork artwork = artworkRepository.findById(artworkId).orElseThrow(()->new NoSuchElementException());
        //get artwork collection(where exhibition is null)
        Optional<Collection> collection = collectionRepository.findByGeneralMemberAndCollectionNameAndExhibitionNull(colName,generalMember);
        //if artwork collection doesn't exist create new
        //else add artwork to existing artwork collection
        if(collection.isEmpty()){return -2;}
        if(collectionArtworkRepository.findByCollectionAndArtwork(collection.get(),artwork).isPresent()){return -1;}
        collectionRepository.updateTime(LocalDateTime.now(),collection.get());
        collection.get().addCollectionArtwork(collectionArtwork);
        artwork.addCollectionArtwork(collectionArtwork);
        collectionArtworkRepository.save(collectionArtwork);
        return 1;
    }

    //remove artwork from collection
    @Override
    public int removeArtworkFromCollectionArtwork(Long artworkId, String email, String colName){
        GeneralMember generalMember = generalMemberRepository.findByEmail(email).orElseThrow(NoSuchElementException::new);
        Optional<Collection> collection = collectionRepository.findByGeneralMemberAndCollectionNameAndExhibitionNull(colName,generalMember);
        Artwork artwork = artworkRepository.findById(artworkId).orElseThrow(NoSuchElementException::new);
        if (collection.isEmpty()) {return -2;}
        try{
            collectionArtworkRepository.deleteByCollectionAndArtwork(collection.get(), artwork);
            collectionRepository.updateTime(LocalDateTime.now(),collection.get());
            return 1;
        }catch (Exception e){
            log.error("Exception : " + e);
            return 0;
        }
    }
    //create new exhibition collection
    @Override
    public int addExhibitionToCollection(Long exhibitionId, String language, String email){
        try{
            Exhibition exhibition = exhibitionRepository.findById(exhibitionId).orElseThrow(()->new NoSuchElementException());
            GeneralMember generalMember = generalMemberRepository.findByEmail(email).orElseThrow(()->new NoSuchElementException());
            if(collectionRepository.findByGeneralMemberAndExhibition(generalMember,exhibition).isPresent()){
                return -1;
            }
            Integer sortNumber = collectionRepository.findLastSortNumberByGeneralMember(generalMember);
            if(sortNumber == null){sortNumber = 0;}
            Collection collection = new Collection(sortNumber+1, exhibition.getExhibitionDetails().stream().filter(e->e.getLanguage().equals(language)).findFirst().get().getExhibitionName(),LocalDateTime.now());
            collection.setExhibition(exhibition);
            collection.setGeneralMember(generalMember);
            collectionRepository.save(collection);
            return 1;
        }catch (Exception e){
            log.error("Exception " + e);
            return 0;
        }
    }
    // remove exhibition collection
    @Override
    public int removeExhibitionFromCollection(Long exhibitionId, String email){
        try{
            GeneralMember generalMember = generalMemberRepository.findByEmail(email).orElseThrow(()->new NoSuchElementException());
            Exhibition exhibition = exhibitionRepository.findById(exhibitionId).orElseThrow(()->new NoSuchElementException());
            collectionRepository.deleteByGeneralMemberAndExhibition(generalMember, exhibition);
            return 1;
        }catch (Exception e){
            log.error("Exception : " + e);
            return 0;
        }
    }

    //check if artwork was already liked by member
    @Override
    public Boolean isArtworkLikedByMember(GeneralMember generalMember, Artwork artwork){
        return memberLikedArtworkRepository.findIdByGeneralMemberAndArtwork(generalMember,artwork).isPresent();
    }

    @Override
    public List<Collection> getAllCollections(GeneralMember generalMember){
        List<Collection> collection = collectionRepository.findArtworkCollectionsByEmail(generalMember);
        collection = collection.stream().sorted(Comparator.comparing(Collection::getCollectionName)).collect(Collectors.toList());
        return collection;
    }
    @Override
    public List<Boolean> isArtworkInCollections(List<Collection> collections, Artwork artwork){
        return collections.stream().map(c->c.getCollectionArtworks().stream().map(CollectionArtwork::getArtwork).collect(Collectors.toList())
                .contains(artwork)).collect(Collectors.toList());
    }
    @Override
    public List<Collection> findFirst3RecentCollections(List<Collection> collections){
        collections = collections.stream().sorted(Comparator.comparing(Collection::getUpdateTime).reversed()).collect(Collectors.toList());
        return collections.size() > 3 ? collections.subList(0,3) : collections;
    }
    //check if exhibition is in collection
    @Override
    public Boolean isExhibitionInCollection(GeneralMember generalMember, Exhibition exhibition){
        return collectionRepository.findByGeneralMemberAndExhibition(generalMember,exhibition).isPresent();
    }
    //get last view time
    @Override
    public LocalDate getLastViewTime(Artwork artwork, GeneralMember generalMember){
        return memberSeenArtworkRepository.findLastViewTimeByArtworkIdAndEmail(artwork, generalMember);
    }
    // add to waiting list
    @Override
    public void addToWaitingExhibitions(Long exhibitionId, String email){
        MemberWaitingExhibition memberWaitingExhibition = new MemberWaitingExhibition();
        GeneralMember generalMember = generalMemberRepository.findByEmail(email).orElseThrow(()->new NoSuchElementException());
        Exhibition exhibition = exhibitionRepository.findById(exhibitionId).orElseThrow(()->new NoSuchElementException());
        Optional<MemberWaitingExhibition> alreadyWaitingArtwork = memberWaitingExhibitionRepository.findIdByGeneralMemberAndExhibition(generalMember, exhibition);

        if(alreadyWaitingArtwork.isEmpty()){
            generalMember.addMemberWaitingExhibition(memberWaitingExhibition);
            exhibition.addMemberWaitingExhibition(memberWaitingExhibition);
            memberWaitingExhibitionRepository.save(memberWaitingExhibition);
        }
    }
    //remove record from DB
    @Override
    public void removeFromWaitingExhibitions(Long exhibitionId, String email){
        GeneralMember generalMember = generalMemberRepository.findByEmail(email).orElseThrow(()->new NoSuchElementException());
        Exhibition exhibition = exhibitionRepository.findById(exhibitionId).orElseThrow(()->new NoSuchElementException());
        memberWaitingExhibitionRepository.deleteByGeneralMemberAndExhibition(generalMember, exhibition);
    }
    //get waiting exhibitions
    @Override
    public List<Exhibition> findWaitingExhibition(String email, String localization, String language, Pageable pageable) {
        List<MemberWaitingExhibition> getWaitingExhibitionsThatStartedMoreThanSevenDaysAgo = memberWaitingExhibitionRepository.findWaitingExhibitionThatStartedMoreThanSevenDaysAgo(email, LocalDate.now().minusDays(7));
        for(MemberWaitingExhibition e : getWaitingExhibitionsThatStartedMoreThanSevenDaysAgo){
            addExhibitionToCollection(e.getExhibition().getId(),language,email);
            memberWaitingExhibitionRepository.delete(e);
        }
        List<MemberWaitingExhibition> waitingExhibitions = memberWaitingExhibitionRepository.findWaitingExhibitionByEmailOrderByTimeLeft(email,localization, pageable).getContent();
        for (MemberWaitingExhibition e : waitingExhibitions) {
            if(!e.getExhibition().getLocalization().equals("")){
                exhibitionFilterByLocalization(e.getExhibition(),localization);
            }
            e.getExhibition().getExhibitionExhibitionTags().removeAll(e.getExhibition().getExhibitionExhibitionTags().stream().filter(t -> !t.getExhibitionTag().getLanguage().equals(language)).collect(Collectors.toList()));
        }
        return waitingExhibitions.stream().map(MemberWaitingExhibition::getExhibition).collect(Collectors.toList());
    }

    //check if exhbition is already in waiting exhibition list
    @Override
    public Boolean checkIfAlreadyInWaitingList(GeneralMember generalMember, Exhibition exhibition){
        return memberWaitingExhibitionRepository.findIdByGeneralMemberAndExhibition(generalMember,exhibition).isPresent();
    }

    @Override
    public void changeLanguage(String email, String language){
        generalMemberRepository.changePreferredLanguage(email,language);
    }
    @Override
    public int addToLikedArtists(Long artistId, GeneralMember generalMember) {
        try {
            Artist artist = artistRepository.getById(artistId);
            Optional<MemberLikedArtist> alreadyLikedArtist = memberLikedArtistRepository.findIdByGeneralMemberAndArtist(generalMember, artist);
            if (alreadyLikedArtist.isEmpty()) {
                MemberLikedArtist memberLikedArtist = new MemberLikedArtist();
                artist.addMemberLikedArtist(memberLikedArtist);
                memberLikedArtist.setGeneralMember(generalMember);
                memberLikedArtistRepository.save(memberLikedArtist);
                artist.increaseNumberOfLikes();
                return 1;
            }
            return -1;
        } catch (Exception e) {
            log.warn("Exception e : " + e);
            return 0;
        }
    }
    @Override
    public int removeFromLikedArtists(Long artistId, GeneralMember generalMember) {
        try {
            Artist artist = artistRepository.getById(artistId);
            memberLikedArtistRepository.deleteByGeneralMemberAndArtwork(generalMember, artist);
            artist.decreaseNumberOfLikes();
            return 2;
        } catch (Exception e) {
            log.error("Exception e : " + e);
            return 0;
        }

    }
    private List<CollectionArtwork> getArtworkCollection(Collection collection){
        return collection.getCollectionArtworks().stream()
                .sorted(Comparator.comparing(CollectionArtwork::getId).reversed()).collect(Collectors.toList());
    }
    //sorting artworks
    // find current artwork in a list
    // add artworks that go after to the sort list and then add artworks that were before
    private List<Artwork> sortArtworkListToStartWithGivenId(Long artworkId, List<Artwork> totalArtworks) {
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
    public void exhibitionFilterByLocalization(Exhibition exhibition, String localization){
        exhibition.getArtworkExhibitions().removeIf(a -> !a.getArtwork().getLocalization().contains(localization));
        exhibition.getArtistExhibitions().removeIf(a->!a.getArtist().getLocalization().contains(localization));
    }

}
