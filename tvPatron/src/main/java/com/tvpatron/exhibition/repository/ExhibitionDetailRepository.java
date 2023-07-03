package com.tvpatron.exhibition.repository;

import com.tvpatron.exhibition.domain.ExhibitionDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExhibitionDetailRepository extends JpaRepository<ExhibitionDetail, Long> {
}
