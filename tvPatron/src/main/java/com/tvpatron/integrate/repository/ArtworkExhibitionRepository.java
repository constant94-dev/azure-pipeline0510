package com.tvpatron.integrate.repository;

import com.tvpatron.integrate.domain.ArtworkExhibition;
import com.tvpatron.integrate.repository.custom.ArtworkExhibitionRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtworkExhibitionRepository extends JpaRepository<ArtworkExhibition, Long>, ArtworkExhibitionRepositoryCustom {
}
