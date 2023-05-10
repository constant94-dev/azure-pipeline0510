package digital.patron.webmobile.artwork.service;

import digital.patron.webmobile.artist.domain.Artist;
import digital.patron.webmobile.artwork.domain.*;
import digital.patron.webmobile.artwork.dto.ArtworkAllDto;
import digital.patron.webmobile.artwork.dto.ArtworkDto;
import digital.patron.webmobile.artwork.repository.ArtworkRepository;
import digital.patron.webmobile.artwork.repository.RecommendedTagsRepository;
import digital.patron.webmobile.artwork.repository.SoundRepository;
import digital.patron.webmobile.exhibition.domain.Exhibition;
import digital.patron.webmobile.exhibition.repository.ExhibitionRepository;
import digital.patron.webmobile.exhibition.service.ExhibitionService;
import digital.patron.webmobile.integrate.domain.ArtworkExhibition;
import digital.patron.webmobile.member.dto.SearchDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ArtworkServiceImpl implements ArtworkService{

    private final SoundRepository soundRepository;
    private final ArtworkRepository artworkRepository;
    private final RecommendedTagsRepository recommendedTagsRepository;
    private final ExhibitionRepository exhibitionRepository;

    @Scheduled(fixedRate = 8000000000L)
    public void run() {
//        Artwork artwork = artworkRepository.getById(23L);
//        List<Artwork> otherArtistsArtwork = artwork.getArtist().getArtworks().stream()
//                .filter(art -> art != artwork) // Exclude the initial artwork
//                .limit(5) // Limit to 5 items
//                .collect(Collectors.toList());
//        List<ArtworkTag> artworkTags = artwork.getArtworkArtworkTags().stream().map(ArtworkArtworkTag::getArtworkTag).collect(Collectors.toList());
//        List<Artwork> similarTagsArtwork = artworkRepository.findSimilarArtworks("en", artworkTags,artwork);
//        List<Artwork> combineList = new ArrayList<>(otherArtistsArtwork);
//        combineList.addAll(similarTagsArtwork);
//        if(combineList.size()<10){
//            combineList.addAll(artworkRepository.findRandomLimitedArtworksOfDifferentArtist("en",10-combineList.size(),artwork));
//        }
//        List<Artwork> similarArtworks  = artworkRepository.findByTags(artworkTags,artwork);
//        System.out.println(artwork.getId());
//        System.out.println(artworkTags.stream().map(a->a.getTagName()).collect(Collectors.toList()));
//        System.out.println(similarArtworks.stream().map(a->a.getId()).collect(Collectors.toList()));
//        similarArtworks.stream().forEach(a-> System.out.println(a.getArtworkArtworkTags().stream().map(t->t.getArtworkTag().getTagName()).collect(Collectors.toList())));
//        similarArtworks.forEach(a-> a.getArtworkArtworkTags().removeIf(t->!artworkTags.contains(t.getArtworkTag())));
//        similarArtworks.forEach(a-> System.out.println(a.getArtworkArtworkTags().stream().map(t->t.getArtworkTag().getTagName()).collect(Collectors.toList()).size()));
    }

    @Override
    public List<Artwork> findArtworksByIds(String localization, List<Long> ids){
        List<Artwork> allByIdAndLocalization = artworkRepository.findAllByIdAndLocalization(localization, ids);
        return allByIdAndLocalization;
    }
    public Integer findAllArtworksCountByLocalization(String localization){
        return artworkRepository.findAllByLocalization(localization);
    }
    @Override
    public List<Artwork> getAllArtworksSorted(String sortBy,String localization, Pageable pageable){
        Page<Artwork> artworkList = artworkRepository.getAllArtworksSortedByParameter(sortBy, localization,pageable);
        return artworkList.getContent();
    }
    @Override
    public Artwork findArtworkById(String localization, Long id){
        return artworkRepository.findByLocalization(localization, id);
    }

    @Override
    public Exhibition getArtworksFirstExhibition(String localization, Artwork artwork){
        Optional<ArtworkExhibition> artworkExhibition = artwork.getArtworkExhibitions().stream().filter(a -> a.getExhibition().getLocalization().contains(localization)).findFirst();
        return artworkExhibition.isPresent() ? artworkExhibition.get().getExhibition() : null;
    }
    //get seen artworks of a user
    @Override
    public Page<Artwork> findSeenArtworks(String email, String localization, Pageable pageable) {
        Page<Artwork> artworkList = artworkRepository.findSeenArtworksByEmailOrderByIdDesc(email, localization, pageable);
//        artworkFilterByLocalization(artworkList.getContent(),localization);
        return artworkList;
    }


    //get liked artworks of a user
    @Override
    public Page<Artwork> findLikedArtworks(String email, String localization, Pageable pageable) {
        Page<Artwork> artworkList = artworkRepository.findLikedArtworksByEmail(email, localization, pageable);
//        artworkFilterByLocalization(artworkList.getContent(),localization);
        return artworkList;
    }

    //get newly registered artworks
    @Override
    public List<Artwork> findNewlyRegisteredArtworks(String localization) {
        List<Artwork> artworkList = artworkRepository.findArtworksByIsApproveAndIsShowingOrderByRegisteredAtDesc(localization);
//        artworkList = removeOlderArtworks(artworkList);
//        artworkFilterByLocalization(artworkList,localization);
        return artworkList;
    }
    @Override
    public List<Artwork> findSubsequentArtworkWatchingList(Artwork artwork, String localization) {
        List<Artwork> otherArtistsArtwork = artwork.getArtist().getArtworks().stream()
                .filter(art -> art != artwork && art.getLocalization().contains(localization)) // Exclude the initial artwork
                .limit(10) // Limit to 5 items
                .collect(Collectors.toList());
        Integer limit = 20 - otherArtistsArtwork.size();
        otherArtistsArtwork.add(0,artwork);
        List<Artwork> combineList = new ArrayList<>(otherArtistsArtwork);
        List<SoundTag> soundTags = artwork.getSound().getSoundSoundTags().stream().map(s->s.getSoundTag()).collect(Collectors.toList());
        List<Artwork> similarSoundArtworks  = soundRepository.findByTags(soundTags,otherArtistsArtwork,limit, localization);
        combineList.addAll(similarSoundArtworks);
        List<ArtworkTag> artworkTags = artwork.getArtworkArtworkTags().stream().map(ArtworkArtworkTag::getArtworkTag).collect(Collectors.toList());
        limit = 29 - (similarSoundArtworks.size() + otherArtistsArtwork.size());
        List<Artwork> similarArtworks = artworkRepository.findByTags(artworkTags, combineList, limit, localization);
        combineList.addAll(similarArtworks);
        combineList.remove(0);
        Collections.shuffle(combineList);
        combineList.add(0,artwork);
        return combineList;
    }
    //searching artworks by keyword ordered by number of views descending
    //if artworks have same viewcount get by create time(old first)
    @Override
    public Page<Artwork> searchArtworksByKeyword(String keyword, String localization, Pageable pageable) {
        Page<Artwork> artworkList = artworkRepository.findArtworksByKeyword(keyword, localization, pageable);
//        artworkFilterByLocalization(artworkList.getContent(),localization);
        return artworkList;
    }

    @Override
    public SearchDto createSearchDto(String language, Page<Artwork> artworkPage){
        List<Artwork> artworks = artworkPage.getContent();
        long artworkCount = artworks.size();
        return new SearchDto(null, null,null,
                artworkCount,
                artworkPage.getTotalElements(),
                artworks.stream().map(Artwork::getId).collect(Collectors.toList()),
                artworks.stream().map(a->a.getArtworkDetails().stream().filter(ad->ad.getLanguage().equals(language)).findFirst().get().getArtworkName()).collect(Collectors.toList()),
                artworks.stream().map(a->a.getContentsThumbnail().getDefaultImg()).collect(Collectors.toList()),
                artworks.stream().map(a->a.getArtist().getId()).collect(Collectors.toList()),
                artworks.stream().map(a->a.getArtist().getArtistDetails().stream().filter(ad->ad.getLanguage().equals(language)).findFirst().get().getNationality()).collect(Collectors.toList()),
                artworks.stream().map(a->a.getArtist().getArtistDetails().stream().filter(ad->ad.getLanguage().equals(language)).findFirst().get().getArtistName()).collect(Collectors.toList()),
                null,null,null);
    }

    @Override
    public int shareArtwork(Long artworkId){
        try {
            Artwork artwork = artworkRepository.findById(artworkId).orElseThrow(()->new NoSuchElementException());
            artwork.increaseNumberOfShares();
            return 1;
        }catch (Exception e){
            log.error("couldn't add share to artwork by id = " + artworkId + " with error : " + e);
            return 0;
        }

    }
    @Override
    public String durationTimeParse(Integer durationTime, String language){
        int hours = durationTime / 3600;
        int minutes = (durationTime / 60) % 60;
//        int seconds = durationTime % 60;

        String hourString = hours > 0 ? hours + (language.equals("ko") ? "시간 " : (language.equals("ja") ? "時間 " : "h ")) : "";
        String minuteString = minutes > 0 ? minutes + (language.equals("ko") ? "분" : (language.equals("ja") ? "分" : "min")) : "";
//        String secondString = seconds + (language.equals("ko") ? "초" : (language.equals("ja") ? "酢" : "sec"));

        return hourString + minuteString;
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
    public List<RecommendedTags> filterTagsByFixed(List<RecommendedTags> recommendedTags, Boolean fixed){
        List<RecommendedTags> tagList = recommendedTags.stream().filter(r -> r.getFixed().equals(fixed)).collect(Collectors.toList());
        if(!fixed){Collections.shuffle(tagList);}
        return tagList;
    }
    @Override
    public ArtworkDto createArtworkDto(String language, String localization, Artwork artwork, Long exhibitionId){
        List<Artwork> otherArtistArtworks = artwork.getArtist().getArtworks().stream().filter(ar->ar.getLocalization().contains(localization)).sorted(Comparator.comparing(a->a.getNumberOfViews())).limit(15).collect(Collectors.toList());
        List<ArtworkTag> artworkTags = artwork.getArtworkArtworkTags().stream().filter(t->t.getArtworkTag().getLanguage().equals(language)).map(a->a.getArtworkTag()).collect(Collectors.toList());
        List<Exhibition> otherExhibitions = artwork.getArtworkExhibitions().stream().filter(e->e.getExhibition().getLocalization().contains(localization)).map(a->a.getExhibition()).collect(Collectors.toList());
        otherExhibitions.addAll(artwork.getArtist().getArtistExhibitions().stream().filter(e->e.getExhibition().getLocalization().contains(localization)).map(a->a.getExhibition()).collect(Collectors.toList()));
        Set<Exhibition> exhibitionSet = new HashSet<Exhibition>(otherExhibitions);
        List<Exhibition> recommendedExhibitions = new ArrayList<Exhibition>(exhibitionSet).stream().limit(16).collect(Collectors.toList());
        if(exhibitionId != null){
            recommendedExhibitions.remove(exhibitionRepository.findByLocalization(exhibitionId,localization));
        }
        return new ArtworkDto(
                artwork.getArtworkDetails().stream().filter(a->a.getLanguage().equals(language)).findFirst().get().getArtworkName(),
                artwork.getArtist().getArtistDetails().stream().filter(a->a.getLanguage().equals(language)).findFirst().get().getNationality(),
                artwork.getArtist().getArtistDetails().stream().filter(a->a.getLanguage().equals(language)).findFirst().get().getArtistName(),
                artwork.getArtist().getArtistDetails().stream().filter(a->a.getLanguage().equals(language)).findFirst().get().getIntro(),
                artwork.getArtworkDetails().stream().filter(a->a.getLanguage().equals(language)).findFirst().get().getIntro(),
                artwork.getArtworkDetails().stream().filter(a->a.getLanguage().equals(language)).findFirst().get().getSource(),
                artwork.getSize(),
                artwork.getContentsHd().getVideo() != null ? "video" : "artwork",
                artwork.getContentsHd().getVideo() != null ? artwork.getContentsHd().getVideo() : artwork.getContentsHd().getDefaultImg(),
                artwork.getContentsThumbnail().getDefaultImg(),
                artwork.getYear(),
                artwork.getSound().getSoundName(),
                artwork.getSound().getSoundCreator(),
                artwork.getSound().getSoundUrl(),
                artwork.getSound().getSoundLicense(),
                artwork.getDurationTime(),
                artwork.getId(),
                artwork.getArtist().getId(),
                artwork.getArtist().getProfileImg(),
                artwork.getArtworkExhibitions().stream().findFirst().get().getExhibition().getId(),
                otherArtistArtworks == null ? null : otherArtistArtworks.stream().map(a->a.getId()).collect(Collectors.toList()),
                otherArtistArtworks == null ? null : otherArtistArtworks.stream().map(a->a.getArtworkDetails().stream().filter(ar->ar.getLanguage().equals(language)).findFirst().get().getArtworkName()).collect(Collectors.toList()),
                otherArtistArtworks == null ? null : otherArtistArtworks.stream().map(a->a.getArtist().getArtistDetails().stream().filter(ar->ar.getLanguage().equals(language)).findFirst().get().getArtistName()).collect(Collectors.toList()),
                otherArtistArtworks == null ? null : otherArtistArtworks.stream().map(a->a.getContentsThumbnail().getDefaultImg()).collect(Collectors.toList()),
                artworkTags == null ? null : artworkTags.stream().map(a->a.getTagName()).collect(Collectors.toList()),
                artworkTags == null ? null : artworkTags.stream().map(a->a.getArtworkArtworkTags().stream().findFirst().get().getArtwork().getContentsThumbnail().getDefaultImg()).collect(Collectors.toList()),
                recommendedExhibitions == null ? null : recommendedExhibitions.stream().map(e->e.getId()).collect(Collectors.toList()),
                recommendedExhibitions == null ? null : recommendedExhibitions.stream().map(e->e.getExhibitionDetails().stream().filter(ex->ex.getLanguage().equals(language)).findFirst().get().getExhibitionName()).collect(Collectors.toList()),
                recommendedExhibitions == null ? null : recommendedExhibitions.stream().map(e->e.getArtistExhibitions().stream().findFirst().get().getArtist().getArtistDetails().stream().filter(ar->ar.getLanguage().equals(language)).findFirst().get().getArtistName()).collect(Collectors.toList()),
                recommendedExhibitions == null ? null : recommendedExhibitions.stream().map(e->e.getArtistExhibitions().size()).collect(Collectors.toList()),
                recommendedExhibitions == null ? null : recommendedExhibitions.stream().map(e->e.getArtworkExhibitions().size()).collect(Collectors.toList()),
                recommendedExhibitions == null ? null : recommendedExhibitions.stream().map(e->exhibitionDuration(e, language)).collect(Collectors.toList()),
                recommendedExhibitions == null ? null : recommendedExhibitions.stream().map(e->e.getArtworkExhibitions().stream().findFirst().get().getArtwork().getContentsThumbnail().getDefaultImg()).collect(Collectors.toList())
                );
    }
    public String exhibitionDuration(Exhibition exhibition, String language) {
        Integer exhibitionDurationInt = exhibition.getArtworkExhibitions().stream().mapToInt(a->a.getArtwork().getDurationTime()).sum();
        return durationTimeParse(exhibitionDurationInt, language);
    }
    @Override
    public ArtworkAllDto createArtworkAllDto(List<Artwork> artworks, String language){
        return new ArtworkAllDto(
                artworks.stream().map(Artwork::getId).collect(Collectors.toList()),
                artworks.stream().map(a->a.getArtworkDetails().stream().filter(ad->ad.getLanguage().equals(language)).findFirst().get().getArtworkName()).collect(Collectors.toList()),
                artworks.stream().map(a->a.getArtist().getArtistDetails().stream().filter(ad->ad.getLanguage().equals(language)).findFirst().get().getArtistName()).collect(Collectors.toList()),
                artworks.stream().map(a->a.getContentsThumbnail().getDefaultImg()).collect(Collectors.toList())
        );
    }
    @Override
    public List<Artwork> sortArtworks(Long artworkId, List<Artwork> totalArtworks) {
        List<Artwork> sortedArtworks = new ArrayList<>();

        for (int i = 0; i < totalArtworks.size(); i++) {
            int k = i;
            if (totalArtworks.get(i).getId().equals(artworkId)) {
                sortedArtworks.add(totalArtworks.get(i));
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
    List<Artwork> removeOlderArtworks(List<Artwork> artworks) {
        Map<Artist, Artwork> latestArtworks = new HashMap<>();
        for (Artwork artwork : artworks) {
            Artwork latestForArtist = latestArtworks.get(artwork.getArtist());
            if (latestForArtist == null || artwork.getCreateTime().isAfter(latestForArtist.getCreateTime())) {
                latestArtworks.put(artwork.getArtist(), artwork);
            }
            if(latestArtworks.size() == 15){
                artworks.retainAll(latestArtworks.values());
                return artworks;
            }
        }
        artworks.retainAll(latestArtworks.values());
        return artworks;
    }
}

