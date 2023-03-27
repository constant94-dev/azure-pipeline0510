package digital.patron.webmobile.exhibition.service;

import digital.patron.webmobile.exhibition.domain.Exhibition;
import digital.patron.webmobile.exhibition.dto.ExhibitionDto;
import digital.patron.webmobile.member.dto.SearchDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ExhibitionService {
    Exhibition getById(Long id);

    List<Exhibition> getAllExhibitionsSorted(String sortBy, String localization, Pageable pageable);

    List<Exhibition> findExhibitionsByGroupName(String groupName, String localization, String language);

    List<Long> calculateLeftTimeTillExhibition(List<Exhibition> exhibitionList);

    Page<Exhibition> searchExhibitionsByKeyword(String keyword, String localization, Pageable pageable);

    SearchDto createSearchDto(String language, Page<Exhibition> exhibitionPage);

    Exhibition findExhibitionById(String localization, Long exhibitionId);

//    List<Exhibition> findSimilarExhibitions(String localization, Exhibition exhibition);

    int shareExhibition(Long exhibitionId);

    List<String> exhibitionListDuration(List<Exhibition> mainExhibitions, String language);

    String exhibitionDuration(Exhibition exhibition, String language);

    ExhibitionDto createExhibitionDto(List<Exhibition> exhibitions, String language);
}
