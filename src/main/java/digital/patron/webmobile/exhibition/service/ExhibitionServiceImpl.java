package digital.patron.webmobile.exhibition.service;

import digital.patron.webmobile.artwork.service.ArtworkService;
import digital.patron.webmobile.exhibition.domain.Exhibition;
import digital.patron.webmobile.exhibition.dto.ExhibitionDto;
import digital.patron.webmobile.exhibition.repository.ExhibitionGroupRepository;
import digital.patron.webmobile.exhibition.repository.ExhibitionRepository;
import digital.patron.webmobile.member.dto.SearchDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;


@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ExhibitionServiceImpl implements ExhibitionService{
    private final ExhibitionGroupRepository exhibitionGroupRepository;
    private final ExhibitionRepository exhibitionRepository;
    private final ArtworkService artworkService;

    @Override
    public Exhibition getById(Long id){
        return exhibitionRepository.getById(id);
    }
    @Override
    public List<Exhibition> getAllExhibitionsSorted(String sortBy,String localization, Pageable pageable){
        Page<Exhibition> exhibitionList = exhibitionRepository.getAllExhibitionsSortedByParameter(sortBy, localization,pageable);
        exhibitionListFilterByLocalization(exhibitionList.getContent(),localization);
        return exhibitionList.getContent();
    }
    @Override
    public List<Exhibition> findExhibitionsByGroupName(String groupName, String localization, String language) {
        List<Exhibition> exhibitionList = exhibitionGroupRepository.findExhibitionsByExhibitionGroupNameAndLocalization(groupName, localization);
        if(!groupName.equals("전시그룹")){
            exhibitionListFilterByLocalization(exhibitionList,localization);
        }
        return exhibitionList;
    }

    @Override
    public List<Long> calculateLeftTimeTillExhibition(List<Exhibition> exhibitionList){
        LocalDate now = LocalDate.now();
        return exhibitionList.stream()
                .map(e->e.getStartDate().isBefore(now) ? 0 : ChronoUnit.DAYS.between(now,e.getStartDate()))
                .collect(Collectors.toList());
    }
    @Override
    public Page<Exhibition> searchExhibitionsByKeyword(String keyword, String localization, Pageable pageable){
        Page<Exhibition> exhibitionList = exhibitionRepository.findExhibitionsByKeyword(keyword, localization, pageable);
        exhibitionListFilterByLocalization(exhibitionList.getContent(),localization);
        return exhibitionList;
    }
    @Override
    public SearchDto createSearchDto(String language, Page<Exhibition> exhibitionPage){
        List<Exhibition> exhibitions = exhibitionPage.getContent();
        long exhibitionCount = exhibitions.size();
        return new SearchDto(null, null,null,
                exhibitionCount,
                exhibitionPage.getTotalElements(),
                exhibitions.stream().map(Exhibition::getId).collect(Collectors.toList()),
                exhibitions.stream().map(e->e.getExhibitionDetails().stream().filter(ed->ed.getLanguage().equals(language)).findFirst().get().getExhibitionName()).collect(Collectors.toList()),
                exhibitions.stream().map(a->a.getArtworkExhibitions().stream().findFirst().get().getArtwork().getContentsThumbnail().getDefaultImg()).collect(Collectors.toList()),
                exhibitions.stream().map(a->a.getArtistExhibitions().stream().findFirst().get().getArtist().getId()).collect(Collectors.toList()),
                exhibitions.stream().map(a->a.getArtistExhibitions().stream().findFirst().get().getArtist().getArtistDetails().stream().filter(ad->ad.getLanguage().equals(language)).findFirst().get().getNationality()).collect(Collectors.toList()),
                exhibitions.stream().map(e->e.getArtistExhibitions().stream().map(a->a.getArtist().getArtistDetails().stream().filter(ad->ad.getLanguage().equals(language)).findFirst().get().getArtistName()).limit(3).collect(Collectors.joining(", "))).collect(Collectors.toList()),
                exhibitions.stream().map(a->a.getArtworkExhibitions().size()).collect(Collectors.toList()),
                exhibitions.stream().map(a->a.getArtistExhibitions().size()).collect(Collectors.toList()),
                exhibitionListDuration(exhibitions, language));
    }

    @Override
    public Exhibition findExhibitionById(String localization, Long exhibitionId) {
        try{
            Exhibition exhibition = exhibitionRepository.findByLocalization(exhibitionId,localization);
            exhibitionFilterByLocalization(exhibition,localization);
            return exhibition;
        }catch (Exception e){
            log.error("couldn't find exhibition by id = " + exhibitionId + " with error : " + e);
            return null;
        }
    }

//    @Override
//    public List<Exhibition> findSimilarExhibitions(String localization, Exhibition exhibition){
//        List<ExhibitionTag> exhibitionTags = exhibition.getExhibitionExhibitionTags().stream().map(ExhibitionExhibitionTag::getExhibitionTag).collect(Collectors.toList());
//        List<Exhibition> exhibitionList = exhibitionRepository.findSimilarExhibitions(localization, exhibitionTags);
//        exhibitionList.removeIf(e->e.equals(exhibition));
//        exhibitionListFilterByLocalization(exhibitionList,localization);
//        return exhibitionList;
//    }

    @Override
    public int shareExhibition(Long exhibitionId){
        try {
            Exhibition exhibition = exhibitionRepository.findById(exhibitionId).get();
            exhibition.increaseNumberOfShares();
            return 1;
        }catch (Exception e){
            log.error("couldn't add share to exhibition by id = " + exhibitionId + " with error : " + e);
            return 0;
        }
    }

    @Override
    public List<String> exhibitionListDuration(List<Exhibition> exhibitionList, String language) {
        return exhibitionList.stream()
                .map(m->artworkService.durationTimeParse(m.getArtworkExhibitions().stream()
                        .mapToInt(a->a.getArtwork().getDurationTime()).sum(),language)).collect(Collectors.toList());
    }

    @Override
    public String exhibitionDuration(Exhibition exhibition, String language) {
        Integer exhibitionDurationInt = exhibition.getArtworkExhibitions().stream().mapToInt(a->a.getArtwork().getDurationTime()).sum();
        return artworkService.durationTimeParse(exhibitionDurationInt, language);
    }
    @Override
    public ExhibitionDto createExhibitionDto(List<Exhibition> exhibitions, String language){
        List<Integer> durationTimeInt = exhibitions.stream().map(e->e.getArtworkExhibitions().stream().mapToInt(a->a.getArtwork().getDurationTime()).sum()).collect(Collectors.toList());
        List<Long> dDay = exhibitions.stream().map(w-> ChronoUnit.DAYS.between(LocalDate.now(), w.getStartDate())).collect(Collectors.toList());
        return new ExhibitionDto(
                exhibitions.stream().map(Exhibition::getId).collect(Collectors.toList()),
                exhibitions.stream().map(e->e.getExhibitionDetails().stream().filter(ed->ed.getLanguage().equals(language)).findFirst().get().getExhibitionName()).collect(Collectors.toList()),
                exhibitions.stream().map(e->e.getArtistExhibitions().stream().findFirst().get().getArtist().getArtistDetails().stream().filter(ad->ad.getLanguage().equals(language)).findFirst().get().getNationality()).collect(Collectors.toList()),
                exhibitions.stream().map(e->e.getArtistExhibitions().stream().map(a->a.getArtist().getArtistDetails().stream().filter(ad->ad.getLanguage().equals(language)).findFirst().get().getArtistName()).limit(3).collect(Collectors.joining(", "))).collect(Collectors.toList()),
//                exhibitions.stream().map(e->e.getArtistExhibitions().stream().findFirst().get().getArtist().getArtistDetails().stream().filter(ad->ad.getLanguage().equals(language)).findFirst().get().getArtistName()).collect(Collectors.toList()),
                exhibitions.stream().map(e->e.getArtistExhibitions().size()-1).collect(Collectors.toList()),
                exhibitions.stream().map(e->e.getArtworkExhibitions().size()).collect(Collectors.toList()),
                durationTimeInt.stream().map(d -> artworkService.durationTimeParse(d, language)).collect(Collectors.toList()),
                exhibitions.stream().map(e->e.getArtworkExhibitions().stream().findFirst().get().getArtwork().getContentsThumbnail().getDefaultImg()).collect(Collectors.toList()),
                dDay
        );
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
        if(exhibition != null){
            exhibition.getArtworkExhibitions().removeIf(a -> !a.getArtwork().getLocalization().contains(localization));
            exhibition.getArtistExhibitions().removeIf(a->!a.getArtist().getLocalization().contains(localization));
        }
    }
}
