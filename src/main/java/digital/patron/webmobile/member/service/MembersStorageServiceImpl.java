package digital.patron.webmobile.member.service;

import digital.patron.webmobile.artist.domain.Artist;
import digital.patron.webmobile.artist.repository.ArtistRepository;
import digital.patron.webmobile.artwork.domain.Artwork;
import digital.patron.webmobile.artwork.repository.ArtworkRepository;
import digital.patron.webmobile.artwork.service.ArtworkService;
import digital.patron.webmobile.exhibition.domain.Exhibition;
import digital.patron.webmobile.exhibition.repository.ExhibitionRepository;
import digital.patron.webmobile.integrate.domain.ArtistExhibition;
import digital.patron.webmobile.member.domain.Collection;
import digital.patron.webmobile.member.domain.*;
import digital.patron.webmobile.member.dto.ArtworkDataListDto;
import digital.patron.webmobile.member.dto.CollectionDto;
import digital.patron.webmobile.member.dto.CollectionInfoDto;
import digital.patron.webmobile.member.repository.*;
import digital.patron.webmobile.socket.repository.SocketConnectionRepository;
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
public class MembersStorageServiceImpl implements MembersStorageService{
    private final MemberSeenArtworkRepository memberSeenArtworkRepository;
    private final MemberLikedArtworkRepository memberLikedArtworkRepository;
    private final MemberLikedArtistRepository memberLikedArtistRepository;
    private final MemberWaitingExhibitionRepository memberWaitingExhibitionRepository;
    private final CollectionArtworkRepository collectionArtworkRepository;
    private final CollectionRepository collectionRepository;
    private final ArtworkRepository artworkRepository;
    private final ExhibitionRepository exhibitionRepository;
    private final ArtistRepository artistRepository;
    private final SocketConnectionRepository socketConnectionRepository;
    private final LoginStatusRepository loginStatusRepository;
    private final ArtworkService artworkService;
    //get collection ordered by ID descending

    @Override
    public Page<Collection> findArtworkCollection(String email, String localization, Pageable pageable) {
        Page<Collection> collectionList = collectionRepository.findCollectionArtworksByEmailOrderByIdDesc(email, pageable);
        for (Collection collection : collectionList.getContent()){
            collection.getCollectionArtworks().removeIf(a->!a.getArtwork().getLocalization().contains(localization) ||
                    !a.getArtwork().getArtist().getLocalization().contains(localization) ||
                    !a.getArtwork().getArtworkExhibitions().stream().anyMatch(e->e.getExhibition().getLocalization().contains(localization)));
        }
        return collectionList;
    }
    @Override
    public List<String> artworkCollectionListDuration(List<Collection> collectionList, String language){
        List<Integer> artworkCollectionDurationInt = collectionList.stream().map(a->a.getCollectionArtworks().stream().mapToInt(c->c.getArtwork().getDurationTime()).sum()).collect(Collectors.toList());
        return artworkCollectionDurationInt.stream().map(d -> artworkService.durationTimeParse(d, language)).collect(Collectors.toList());
    }
    @Override
    public String artworkCollectionDuration(Collection collection, String language){
        Integer artworkCollectionDurationInt = collection.getCollectionArtworks().stream().mapToInt(c->c.getArtwork().getDurationTime()).sum();
        return artworkService.durationTimeParse(artworkCollectionDurationInt,language);
    }
    @Override
    public List<CollectionArtwork> lastAddedArtworkInArtworkCollection(List<Collection> collectionList){
        return collectionList.stream().map(c->c.getCollectionArtworks().size() != 0 ?
                c.getCollectionArtworks().stream().max(Comparator.comparing(CollectionArtwork::getId)).get() : null).collect(Collectors.toList());
    }
    @Override
    public List<CollectionArtwork> sortedArtworksInArtworkCollection(String localization, Collection collection){
        return collection.getCollectionArtworks()
                .stream().filter(c->c.getArtwork().getLocalization().contains(localization) && c.getArtwork().getArtist().getLocalization().contains(localization) &&
                        c.getArtwork().getArtworkExhibitions().stream().anyMatch(e->e.getExhibition().getLocalization().contains(localization)))
                .sorted(Comparator.comparing(CollectionArtwork::getId).reversed()).collect(Collectors.toList());
    }
    @Override
    public List<Exhibition> getExhibitionsInArtworkCollection(String localization, List<CollectionArtwork> collectionArtworks){
        collectionArtworks.removeIf(a-> a.getArtwork().getArtworkExhibitions().stream().noneMatch(e->e.getExhibition().getLocalization().contains(localization)));
        return collectionArtworks.stream().map(c->c.getArtwork().getArtworkExhibitions().stream().findFirst().isPresent() ? c.getArtwork().getArtworkExhibitions().stream().findFirst().get().getExhibition() : null).distinct().collect(Collectors.toList());
    }
    @Override
    public List<Artist> getArtistsInArtworkCollection(List<CollectionArtwork> collectionArtworks){
        return collectionArtworks.stream().map(c->c.getArtwork().getArtist()).distinct().collect(Collectors.toList());
    }

    @Override
    public CollectionDto createCollectionDto(List<Collection> collectionList, Artwork artwork){
        List<Collection> collectionsSortedByName = collectionList.stream().sorted(Comparator.comparing(Collection::getCollectionName)).collect(Collectors.toList());
        List<Collection> recentCollections = collectionList.stream().sorted(Comparator.comparing(Collection::getUpdateTime).reversed()).collect(Collectors.toList());
        recentCollections = recentCollections.size() > 3 ? recentCollections.subList(0,3) : recentCollections;
        return new CollectionDto(
                collectionsSortedByName.stream().map(Collection::getCollectionName).collect(Collectors.toList()),
                collectionsSortedByName.stream().map(Collection::getId).collect(Collectors.toList()),
                collectionsSortedByName.stream().map(c->c.getCollectionArtworks().stream().anyMatch(a->a.getArtwork().equals(artwork))).collect(Collectors.toList()),
                recentCollections.stream().map(Collection::getCollectionName).collect(Collectors.toList()),
                recentCollections.stream().map(Collection::getId).collect(Collectors.toList()),
                recentCollections.stream().map(c->c.getCollectionArtworks().stream().anyMatch(a->a.getArtwork().equals(artwork))).collect(Collectors.toList())
        );
    }

    @Override
    public CollectionInfoDto createCollectionInfoDtoForArtworkCollection(String language, String localization, List<Collection> collectionList){
        List<List<CollectionArtwork>> sortedArtworkCollection = collectionList.stream().map(c->c.getCollectionArtworks() != null ?
                sortedArtworksInArtworkCollection(localization, c) : null).collect(Collectors.toList());
        List<Integer> durationTimeInt = sortedArtworkCollection.stream().map(a->a.stream().mapToInt(c->c.getArtwork().getDurationTime()).sum()).collect(Collectors.toList());
        return new CollectionInfoDto(
                collectionList.stream().map(Collection::getId).collect(Collectors.toList()),
                collectionList.stream().map(Collection::getCollectionName).collect(Collectors.toList()),
                null,null,null,
                collectionList.stream().map(a->a.getCollectionArtworks().stream().filter(c->c.getArtwork().getLocalization().contains(localization)).count()).collect(Collectors.toList()),
                durationTimeInt.stream().map(d -> artworkService.durationTimeParse(d, language)).collect(Collectors.toList()),
                sortedArtworkCollection.stream().map(a->a.stream().findFirst().isPresent()?a.stream().findFirst().get().getArtwork().getContentsHd().getDefaultImg():null).collect(Collectors.toList())
        );
    }
    @Override
    public CollectionInfoDto createCollectionInfoDtoForExhibitionCollection(List<Collection> collectionList, String language, String localization){
        List<Integer> durationTimeInt = collectionList.stream().map(e->e.getExhibition().getArtworkExhibitions().stream().mapToInt(a->a.getArtwork().getDurationTime()).sum()).collect(Collectors.toList());
        for(Collection collection : collectionList){
            collection.getExhibition().getArtistExhibitions().removeIf(a->!a.getArtist().getLocalization().contains(localization));
            collection.getExhibition().getArtworkExhibitions().removeIf(a->!a.getArtwork().getLocalization().contains(localization));
        }
        List<Optional<ArtistExhibition>> artistExhibitions = collectionList.stream().map(e->e.getExhibition().getArtistExhibitions().stream().filter(a->a.getArtist().getLocalization().contains(localization)).findFirst()).collect(Collectors.toList());
        List<List<ArtistExhibition>> artistExhibitionsList = collectionList.stream().map(e->e.getExhibition().getArtistExhibitions().stream().filter(a->a.getArtist().getLocalization().contains(localization)).collect(Collectors.toList())).collect(Collectors.toList());

        return new CollectionInfoDto(
                collectionList.stream().map(e->e.getExhibition().getId()).collect(Collectors.toList()),
                collectionList.stream().map(e->e.getExhibition().getExhibitionDetails().stream().filter(ed->ed.getLanguage().equals(language)).findFirst().get().getExhibitionName()).collect(Collectors.toList()),
                artistExhibitions.stream().map(a->a.isPresent() ? a.get().getArtist().getArtistDetails().stream().filter(ad->ad.getLanguage().equals(language)).findFirst().get().getNationality() : null).collect(Collectors.toList()),
                artistExhibitionsList.stream().map(a->a.stream().map(ar->ar.getArtist().getArtistDetails().stream().filter(ad->ad.getLanguage().equals(language)).findFirst().get().getArtistName()).limit(3).collect(Collectors.joining(", "))).collect(Collectors.toList()),
                collectionList.stream().map(e->e.getExhibition().getArtistExhibitions().stream().filter(a->a.getArtist().getLocalization().contains(localization)).count()).collect(Collectors.toList()),
                collectionList.stream().map(e->e.getExhibition().getArtworkExhibitions().stream().filter(a->a.getArtwork().getLocalization().contains(localization)).count()).collect(Collectors.toList()),
                durationTimeInt.stream().map(d -> artworkService.durationTimeParse(d,language)).collect(Collectors.toList()),
                collectionList.stream().map(e->e.getExhibition().getArtworkExhibitions().stream().findFirst().isPresent()?e.getExhibition().getArtworkExhibitions().stream().findFirst().get().getArtwork().getContentsHd().getDefaultImg():null).collect(Collectors.toList())
        );
    }
    @Override
    public ArtworkDataListDto createArtworkDataListDto(String language, List<Artwork> artworkList){
        return new ArtworkDataListDto(
                artworkList.stream().map(Artwork::getId).collect(Collectors.toList()),
                artworkList.stream().map(a->a.getArtworkDetails().stream().filter(ad->ad.getLanguage().equals(language)).findFirst().get().getArtworkName()).collect(Collectors.toList()),
                artworkList.stream().map(a->a.getArtist().getId()).collect(Collectors.toList()),
                artworkList.stream().map(a->a.getArtist().getArtistDetails().stream().filter(ad->ad.getLanguage().equals(language)).findFirst().get().getNationality()).collect(Collectors.toList()),
                artworkList.stream().map(a->a.getArtist().getArtistDetails().stream().filter(ad->ad.getLanguage().equals(language)).findFirst().get().getArtistName()).collect(Collectors.toList()),
                artworkList.stream().map(a->a.getContentsThumbnail().getDefaultImg()).collect(Collectors.toList()),
                null);
    }
    //Find Collections of member
    @Override
    public Page<Collection> findExhibitionsCollection(String email, String localization, Pageable pageable) {
        Page<Collection> collections = collectionRepository.findCollectionsByEmail(email,localization, pageable);
        exhibitionListFilterByLocalization(collections.getContent().stream().map(c->c.getExhibition()).collect(Collectors.toList()), localization);
        return collections;
    }

    //check if artwork was already seen by member today,
    //if it wasnt viewed at all add it to seenartwork table and increase view number
    //if it was viewed but not today, change last view date to today and increase view number
    @Override
    public int addToSeenArtworks(Long artworkId, GeneralMember generalMember) {
        try {
            MemberSeenArtwork memberSeenArtwork = new MemberSeenArtwork(LocalDate.now());
            Artwork artwork = artworkRepository.getById(artworkId);
            Optional<MemberSeenArtwork> alreadySeenArtwork = memberSeenArtworkRepository.findIdByGeneralMemberAndArtwork(generalMember, artwork);
            //delete oldest viewed artwork
            List<MemberSeenArtwork> memberSeenArtworkList = memberSeenArtworkRepository.findByGeneralMember(generalMember);
            if (memberSeenArtworkList.size() > 99) {
                memberSeenArtworkRepository.deleteById(memberSeenArtworkList.stream().max(Comparator.comparing(MemberSeenArtwork::getViewLastTime)).get().getId());
            }
            if (alreadySeenArtwork.isEmpty()) {
                memberSeenArtwork.setGeneralMember(generalMember);
                artwork.addMemberSeenArtwork(memberSeenArtwork);
                memberSeenArtworkRepository.save(memberSeenArtwork);
                artwork.increaseNumberOfViews();
                return 1;
            }
            memberSeenArtworkRepository.deleteByGeneralMemberAndArtwork(generalMember, artwork);
            memberSeenArtwork.setGeneralMember(generalMember);
            artwork.addMemberSeenArtwork(memberSeenArtwork);
            memberSeenArtworkRepository.save(memberSeenArtwork);
            if (!alreadySeenArtwork.get().getViewLastTime().equals(LocalDate.now())) {
                artwork.increaseNumberOfViews();
            }
            return 1;
        } catch (Exception e) {
            log.error("Exception : " + e);
            return 0;
        }


    }

    // if member didnt like this artwork already add record to DB
    @Override
    public int addToLikedArtworks(Long artworkId, GeneralMember generalMember) {
        try {
            Artwork artwork = artworkRepository.getById(artworkId);
            Optional<MemberLikedArtwork> alreadyLikedArtwork = memberLikedArtworkRepository.findIdByGeneralMemberAndArtwork(generalMember, artwork);
            if (alreadyLikedArtwork.isEmpty()) {
                MemberLikedArtwork memberLikedArtwork = new MemberLikedArtwork();
                memberLikedArtwork.setGeneralMember(generalMember);
                artwork.addMemberLikedArtwork(memberLikedArtwork);
                memberLikedArtworkRepository.save(memberLikedArtwork);
                artwork.increaseNumberOfLikes();
                return 1;
            }
            return 0;
        } catch (Exception e) {
            log.error("Exception e : " + e);
            return 0;
        }
    }

    //remove record to DB
    @Override
    public int removeFromLikedArtworks(Long artworkId, GeneralMember generalMember) {
        try {
            Artwork artwork = artworkRepository.getById(artworkId);
            memberLikedArtworkRepository.deleteByGeneralMemberAndArtwork(generalMember, artwork);
            artwork.decreaseNumberOfLikes();
            return 2;
        } catch (Exception e) {
            log.error("Exception e : " + e);
            return 0;
        }

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

    //remove record to DB
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

    //add artwork to collection
    @Override
    public int addArtworkToCollectionArtwork(Long artworkId, GeneralMember generalMember, String colName) {
        try {
            CollectionArtwork collectionArtwork = new CollectionArtwork();
            Artwork artwork = artworkRepository.getById(artworkId);
            Optional<Collection> collection = collectionRepository.findByGeneralMemberAndCollectionNameAndExhibitionNull(colName, generalMember);
            if (collection.isEmpty()) {return -1;}
            Optional<CollectionArtwork> artworkExistInCollection = collectionArtworkRepository.findByCollectionAndArtwork(collection.get(), artwork);
            if (artworkExistInCollection.isEmpty()) {
                collection.get().addCollectionArtwork(collectionArtwork);
                artwork.addCollectionArtwork(collectionArtwork);
                collectionArtworkRepository.save(collectionArtwork);
                collectionRepository.updateTime(LocalDateTime.now(), collection.get());
            }
            return 1;
        } catch (Exception e) {
            log.error("Exception e : " + e);
            return 0;
        }
    }

    //remove artwork from collection
    @Override
    public int removeArtworkFromCollectionArtwork(Long artworkId, GeneralMember generalMember, String colName) {
        Optional<Collection> collection = collectionRepository.findByGeneralMemberAndCollectionNameAndExhibitionNull(colName, generalMember);
        Artwork artwork = artworkRepository.getById(artworkId);
        if (!collection.isPresent()) {return -1;}
        try {
            collectionArtworkRepository.deleteByCollectionAndArtwork(collection.get(), artwork);
            collectionRepository.updateTime(LocalDateTime.now(), collection.get());
            return 1;
        } catch (Exception e) {
            log.error("Exception : " + e);
            return 0;
        }
    }

    //create new exhibition collection
    @Override
    public int addExhibitionToCollection(Long exhibitionId, GeneralMember generalMember) {
        try {
            Exhibition exhibition = exhibitionRepository.getById(exhibitionId);
            Integer sortNumber = collectionRepository.findLastSortNumberByGeneralMember(generalMember);
            if (sortNumber == null) {sortNumber = 0;}
            Collection collection = new Collection(sortNumber + 1, exhibition.getExhibitionDetails().stream().findFirst().get().getExhibitionName(), LocalDateTime.now());
            collection.setExhibition(exhibition);
            collection.setGeneralMember(generalMember);
            collectionRepository.save(collection);
            return 1;
        } catch (Exception e) {
            log.error("Exception : " + e);
            return 0;
        }
    }

    // remove exhibition collection
    @Override
    public int removeExhibitionFromCollection(Long exhibitionId, GeneralMember generalMember) {
        try {
            Exhibition exhibition = exhibitionRepository.getById(exhibitionId);
            collectionRepository.deleteByGeneralMemberAndExhibition(generalMember, exhibition);
            return 2;
        } catch (Exception e) {
            log.error("Exception : " + e);
            return 0;
        }
    }

    @Override
    public int createNewCollection(String name, List<Long> artIds, GeneralMember generalMember) {
        try {
            Integer sortNumber = collectionRepository.findLastSortNumberByGeneralMember(generalMember);
            if (sortNumber == null) {sortNumber = 0;}
            int collectionCount = collectionRepository.countAllByGeneralMember(generalMember);
            if (collectionCount >= 100) {return -1;}
            Optional<Collection> collectionExist = collectionRepository.findByGeneralMemberAndCollectionNameAndExhibitionNull(name, generalMember);
            if (collectionExist.isPresent()) {return -2;}
            Collection collection = new Collection(sortNumber + 1, name, LocalDateTime.now());
            collection.setGeneralMember(generalMember);
            collectionRepository.save(collection);
            if(artIds != null && artIds.size() != 0){
                for (Long artId : artIds) {
                    Artwork artwork = artworkRepository.getById(artId);
                    CollectionArtwork collectionArtwork = new CollectionArtwork();
                    collection.addCollectionArtwork(collectionArtwork);
                    artwork.addCollectionArtwork(collectionArtwork);
                    collectionArtworkRepository.save(collectionArtwork);
                }
            }
            return 1;
        } catch (Exception e) {
            log.error("Exception e");
            return 0;
        }
    }

    @Override
    public int editCollection(String previousName, String newName, List<Long> artIds, GeneralMember generalMember) {
        try {
            Optional<Collection> checkNewName =
                    collectionRepository.findByGeneralMemberAndCollectionNameAndExhibitionNull(newName, generalMember);
            if (checkNewName.isPresent()) {return -1;}
            Optional<Collection> collection =
                    collectionRepository.findByGeneralMemberAndCollectionNameAndExhibitionNull(previousName, generalMember);
            if (!collection.isPresent()) {return -1;}
            if(newName.isEmpty()){newName = previousName;}
            collectionRepository.editCollectionName(previousName, newName, generalMember, LocalDateTime.now());
            collectionArtworkRepository.deleteByCollection(collection.get());
            if(artIds != null && artIds.size() != 0) {
                Collections.reverse(artIds);
                for (Long artId : artIds) {
                    Artwork artwork = artworkRepository.getById(artId);
                    CollectionArtwork collectionArtwork = new CollectionArtwork();
                    collection.get().addCollectionArtwork(collectionArtwork);
                    artwork.addCollectionArtwork(collectionArtwork);
                    collectionArtworkRepository.save(collectionArtwork);
                }
            }
            return 1;
        } catch (Exception e) {
            log.error("Exception e");
            return 0;
        }
    }

    @Override
    public int deleteCollection(String name, GeneralMember generalMember) {
        try {
            int collectionCount = collectionRepository.countAllByGeneralMember(generalMember);
            if (collectionCount <= 1) {return -2;}
            Optional<Collection> checkExist =
                    collectionRepository.findByGeneralMemberAndCollectionNameAndExhibitionNull(name, generalMember);
            if (!checkExist.isPresent()) {return -1;}
            collectionArtworkRepository.deleteByCollection(checkExist.get());
            collectionRepository.deleteByCollection(checkExist.get());
            return 1;
        } catch (Exception e) {
            log.error("Exception : " + e);
            return 0;
        }
    }

    //check if exhibition is in collection
    @Override
    public Boolean isExhibitionInCollection(GeneralMember generalMember, Long exhibitionId) {
        Exhibition exhibition = exhibitionRepository.getById(exhibitionId);
        return collectionRepository.findByGeneralMemberAndExhibition(generalMember, exhibition).isPresent();
    }



    // add to waiting list
    @Override
    public int addToWaitingExhibitions(Long exhibitionId, GeneralMember generalMember) {
        try {
            Exhibition exhibition = exhibitionRepository.getById(exhibitionId);
            Optional<MemberWaitingExhibition> alreadyWaitingArtwork =
                    memberWaitingExhibitionRepository.findIdByGeneralMemberAndExhibition(generalMember, exhibition);
            if (!alreadyWaitingArtwork.isEmpty()) {return -1;}
            MemberWaitingExhibition memberWaitingExhibition = new MemberWaitingExhibition();
            memberWaitingExhibition.setGeneralMember(generalMember);
            exhibition.addMemberWaitingExhibition(memberWaitingExhibition);
            memberWaitingExhibitionRepository.save(memberWaitingExhibition);
            return 1;
        } catch (Exception e) {
            log.error("Exception : " + e);
            return 0;
        }

    }

    //remove record from DB
    @Override
    public int removeFromWaitingExhibitions(Long exhibitionId, GeneralMember generalMember) {
        try {
            Exhibition exhibition = exhibitionRepository.getById(exhibitionId);
            memberWaitingExhibitionRepository.deleteByGeneralMemberAndExhibition(generalMember, exhibition);
            return 2;
        } catch (Exception e) {
            log.error("Exception : " + e);
            return 0;
        }
    }

    //get waiting exhibitions
    @Override
    public Page<MemberWaitingExhibition> findMemberWaitingExhibition(String email, String localization, Pageable pageable) {
        Page<MemberWaitingExhibition> waitingExhibitionByEmailOrderByTimeLeft = memberWaitingExhibitionRepository.findWaitingExhibitionByEmailOrderByTimeLeft(email, localization, pageable);
        for (MemberWaitingExhibition e : waitingExhibitionByEmailOrderByTimeLeft) {
            if(!e.getExhibition().getLocalization().equals("")){
                exhibitionFilterByLocalization(e.getExhibition(),localization);
            }
        }
        return waitingExhibitionByEmailOrderByTimeLeft;
    }

    @Override
    public List<Exhibition> getExhibitionListFromMemberWaitingExhibition(List<MemberWaitingExhibition> memberWaitingExhibitionList){
        return memberWaitingExhibitionList.stream().map(MemberWaitingExhibition::getExhibition).collect(Collectors.toList());
    }

    //check if exhbition is already in waiting exhibition list
    @Override
    public Boolean checkIfAlreadyInWaitingList(GeneralMember generalMember, Exhibition exhibition) {
        return memberWaitingExhibitionRepository.findIdByGeneralMemberAndExhibition(generalMember, exhibition).isPresent();
    }



    @Override
    public int removeSeenArtwork(GeneralMember generalMember, Long artworkId) {
        Artwork artwork = artworkRepository.findById(artworkId).orElseThrow(()->new NoSuchElementException());
        return memberSeenArtworkRepository.deleteByGeneralMemberAndArtwork(generalMember, artwork);
    }

    @Override
    public int removeAllSeenArtwork(GeneralMember generalMember) {
        return memberSeenArtworkRepository.deleteByGeneralMember(generalMember);
    }

    @Override
    public Collection findCollectionById(Long colId) {
        return collectionRepository.findById(colId).orElseThrow(()-> new NoSuchElementException());
    }

    @Override
    public ArtworkDataListDto createArtworkDataListDto(List<Artwork> artworkList, Long collectionId, String language){
        List<Boolean> inCollection = null;
        if(collectionId != null){
            Collection collection = collectionRepository.findById(collectionId).orElseThrow(()->new NoSuchElementException());
            inCollection = artworkList.stream().map(a -> a.getCollectionArtworks().stream().anyMatch(c -> c.getCollection().equals(collection))).collect(Collectors.toList());
        }
        return new ArtworkDataListDto(
                artworkList.stream().map(Artwork::getId).collect(Collectors.toList()),
                artworkList.stream().map(a->a.getArtworkDetails().stream().filter(ad->ad.getLanguage().equals(language)).findFirst().get().getArtworkName()).collect(Collectors.toList()),
                artworkList.stream().map(a->a.getArtist().getId()).collect(Collectors.toList()),
                artworkList.stream().map(a->a.getArtist().getArtistDetails().stream().filter(ad->ad.getLanguage().equals(language)).findFirst().get().getNationality()).collect(Collectors.toList()),
                artworkList.stream().map(a->a.getArtist().getArtistDetails().stream().filter(ad->ad.getLanguage().equals(language)).findFirst().get().getArtistName()).collect(Collectors.toList()),
                artworkList.stream().map(a->a.getContentsThumbnail().getDefaultImg()).collect(Collectors.toList()),
                inCollection);
    }


    //check if artwork was already liked by member
    @Override
    public Boolean isArtworkLikedByMember(GeneralMember generalMember, Artwork artwork) {
        return memberLikedArtworkRepository.findIdByGeneralMemberAndArtwork(generalMember, artwork).isPresent();
    }

    //get liked artists by member
    @Override
    public Page<Artist> getLikedArtists(GeneralMember generalMember, String localization, Pageable pageable) {
        return memberLikedArtistRepository.getArtistsByGeneralMember(generalMember, "%" + localization + "%", pageable);
    }
    @Override
    public void deleteMembersStorageByGeneralMember(GeneralMember generalMember){
        List<Collection> collections = collectionRepository.findCollectionsByGeneralMember(generalMember);
        collectionArtworkRepository.deleteByCollections(collections);
        collectionRepository.deleteByGeneralMember(generalMember);
        memberSeenArtworkRepository.deleteByGeneralMember(generalMember);
        memberLikedArtistRepository.deleteByGeneralMember(generalMember);
        memberLikedArtworkRepository.deleteByGeneralMember(generalMember);
        memberWaitingExhibitionRepository.deleteByGeneralMember(generalMember);
        loginStatusRepository.logoutTvByEmail(generalMember.getEmail());
        socketConnectionRepository.deleteByEmail(generalMember.getEmail());
    }
    public void exhibitionListFilterByLocalization(List<Exhibition> exhibitionList, String localization){
        if(exhibitionList != null && exhibitionList.size() != 0){
            for (Exhibition exhibition : exhibitionList){
                exhibition.getArtworkExhibitions().removeIf(a -> !a.getArtwork().getLocalization().contains(localization));
                exhibition.getArtistExhibitions().removeIf(a->!a.getArtist().getLocalization().contains(localization));
            }
        }
    }
    public void exhibitionFilterByLocalization(Exhibition exhibition, String localization){
        exhibition.getArtworkExhibitions().removeIf(a -> !a.getArtwork().getLocalization().contains(localization));
        exhibition.getArtistExhibitions().removeIf(a->!a.getArtist().getLocalization().contains(localization));
    }
}
