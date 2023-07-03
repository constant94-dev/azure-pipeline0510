package com.tvpatron.exhibition.repository;

import com.tvpatron.exhibition.domain.Exhibition;
import com.tvpatron.exhibition.repository.custom.ExhibitionRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ExhibitionRepository extends JpaRepository<Exhibition, Long>, ExhibitionRepositoryCustom {
    @Query("select max(e.id) from Exhibition e order by e.id desc")
    Long findRandomExhibition();
}
