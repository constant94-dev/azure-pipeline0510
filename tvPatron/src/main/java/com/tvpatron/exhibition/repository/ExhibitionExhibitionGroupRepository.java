package com.tvpatron.exhibition.repository;

import com.tvpatron.exhibition.domain.ExhibitionExhibitionGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExhibitionExhibitionGroupRepository extends JpaRepository<ExhibitionExhibitionGroup, Long> {
}
