package com.tvpatron.artwork.repository;

import com.tvpatron.artwork.domain.RecommendedTags;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendedTagsRepository extends JpaRepository<RecommendedTags,Long> {
    @Query("select r from RecommendedTags r where r.localization like :localization")
    List<RecommendedTags> findByLocalization(String localization);
}
