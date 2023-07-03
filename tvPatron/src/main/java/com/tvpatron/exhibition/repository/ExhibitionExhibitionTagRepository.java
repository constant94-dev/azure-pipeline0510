package com.tvpatron.exhibition.repository;

import com.tvpatron.exhibition.domain.Exhibition;
import com.tvpatron.exhibition.domain.ExhibitionExhibitionTag;
import com.tvpatron.exhibition.domain.ExhibitionTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExhibitionExhibitionTagRepository extends JpaRepository<ExhibitionExhibitionTag, Long> {
    @Query("select e.exhibition from ExhibitionExhibitionTag e " +
            "where e.exhibitionTag in :exhibitionTags and e.exhibition.localization like :localization group by e.exhibition " +
            "order by count(e.exhibition) desc, e.exhibition.createTime desc")
    List<Exhibition> findSimilarExhibitions(String localization, List<ExhibitionTag> exhibitionTags);
}
