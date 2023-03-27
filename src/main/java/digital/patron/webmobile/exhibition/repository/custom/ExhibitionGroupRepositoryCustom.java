package digital.patron.webmobile.exhibition.repository.custom;

import digital.patron.webmobile.exhibition.domain.Exhibition;

import java.util.List;

public interface ExhibitionGroupRepositoryCustom {
    List<Exhibition> findExhibitionsByExhibitionGroupNameAndLocalization(String groupName, String localization);
}
