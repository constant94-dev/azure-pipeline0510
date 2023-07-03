package com.tvpatron.exhibition.repository.custom;

import com.tvpatron.exhibition.domain.Exhibition;

import java.util.List;

public interface ExhibitionGroupRepositoryCustom {

    List<Exhibition> findExhibitionsByExhibitionGroupNameAndLocalization(String groupName, String localization);
}
