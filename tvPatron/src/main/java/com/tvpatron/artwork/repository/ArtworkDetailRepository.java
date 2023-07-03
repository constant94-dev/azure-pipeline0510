package com.tvpatron.artwork.repository;

import com.tvpatron.artwork.domain.ArtworkDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtworkDetailRepository extends JpaRepository<ArtworkDetail, Long> {
}
