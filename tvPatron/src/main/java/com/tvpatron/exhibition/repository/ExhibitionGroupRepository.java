package com.tvpatron.exhibition.repository;

import com.tvpatron.exhibition.domain.ExhibitionGroup;
import com.tvpatron.exhibition.repository.custom.ExhibitionGroupRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExhibitionGroupRepository extends JpaRepository<ExhibitionGroup, Long>, ExhibitionGroupRepositoryCustom {
}
