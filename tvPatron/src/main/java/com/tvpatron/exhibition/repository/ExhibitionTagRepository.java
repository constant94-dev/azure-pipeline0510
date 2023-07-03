package com.tvpatron.exhibition.repository;

import com.tvpatron.exhibition.domain.ExhibitionTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExhibitionTagRepository extends JpaRepository<ExhibitionTag, Long> {

}
