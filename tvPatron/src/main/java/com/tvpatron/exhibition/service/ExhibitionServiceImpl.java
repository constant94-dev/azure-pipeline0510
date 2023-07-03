package com.tvpatron.exhibition.service;

import com.tvpatron.artist.domain.Artist;
import com.tvpatron.artwork.service.ArtworkService;
import com.tvpatron.common.utils.BaseTimeEntity;
import com.tvpatron.exhibition.domain.Exhibition;
import com.tvpatron.exhibition.domain.ExhibitionExhibitionTag;
import com.tvpatron.exhibition.domain.ExhibitionTag;
import com.tvpatron.exhibition.repository.ExhibitionExhibitionTagRepository;
import com.tvpatron.exhibition.repository.ExhibitionGroupRepository;
import com.tvpatron.exhibition.repository.ExhibitionRepository;
import com.tvpatron.integrate.domain.ArtistExhibition;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ExhibitionServiceImpl implements ExhibitionService{
    private final ExhibitionGroupRepository exhibitionGroupRepository;
    private final ExhibitionRepository exhibitionRepository;
    @Override
    public Long findRandomExhibitionId(){
        return exhibitionRepository.findRandomExhibition();
    }
    @Override
    public List<Exhibition> findExhibitionsByGroupName(String groupName, String localization, String language) {
        List<Exhibition> exhibitionList = exhibitionGroupRepository.findExhibitionsByExhibitionGroupNameAndLocalization(groupName, localization);
        if(!groupName.equals("전시그룹")){
            exhibitionListFilterByLocalization(exhibitionList,localization);
        }
        exhibitionRemoveByLanguageList(exhibitionList,language);
        return exhibitionList;
    }
    @Override
    public Exhibition findExhibitionById(Long exhibitionId,String language,String localization) {
        try{
            Exhibition exhibition = exhibitionRepository.findById(exhibitionId).orElse(null);
            exhibitionFilterByLocalization(exhibition,localization);
            return exhibition;
        }catch (Exception e){
            System.out.println("Exhibition with id = " + exhibitionId + " was not found" + e);
            return null;
        }
    }
    @Override
    public Exhibition findExhibitionByIdIgnoreShowing(Long exhibitionId) {
        try{
            Exhibition exhibition = exhibitionRepository.findById(exhibitionId).orElse(null);
            return exhibition;
        }catch (Exception e){
            System.out.println("Exhibition with id = " + exhibitionId + " was not found" + e);
            return null;
        }
    }
    @Override
    public List<Exhibition> findExhibitionsByArtistId(Artist artist, String localization) {
        List<Exhibition> artistExhibitions = new ArrayList<>();
        for (ArtistExhibition ae : artist.getArtistExhibitions()) {
            if (ae.getExhibition().getLocalization().contains(localization)) {
                ae.getExhibition().getArtworkExhibitions().removeIf(a->!a.getArtwork().getLocalization().contains(localization));
                if(ae.getExhibition().getArtworkExhibitions().size() != 0){
                    artistExhibitions.add(ae.getExhibition());
                }
            }
        }
        artistExhibitions.sort(Comparator.comparing(BaseTimeEntity::getCreateTime).reversed());
        return artistExhibitions;
    }
    @Override
    public List<Long> calculateLeftTimeTillExhibition(List<Exhibition> exhibitionList){
        return exhibitionList.stream()
                .map(e->e.getStartDate().isBefore(LocalDate.now()) ?
                        0 : ChronoUnit.DAYS.between(LocalDate.now(),e.getStartDate())).collect(Collectors.toList());
    }

    public void exhibitionRemoveByLanguageList(List<Exhibition> exhibitionList, String language){
        exhibitionList.forEach(exhibition -> {
            exhibition.getExhibitionExhibitionTags().removeAll(exhibition.getExhibitionExhibitionTags().stream().filter(e -> !e.getExhibitionTag().getLanguage().equals(language)).collect(Collectors.toList()));
        });
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
