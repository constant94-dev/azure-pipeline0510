package com.tvpatron.exhibition.repository.custom;

import com.tvpatron.exhibition.domain.Exhibition;
import com.tvpatron.exhibition.domain.ExhibitionTag;

import java.util.List;

public interface ExhibitionRepositoryCustom {
    List<Exhibition> findByTags(Exhibition exhibition, String localization, List<ExhibitionTag> exhibitionTags);
}
