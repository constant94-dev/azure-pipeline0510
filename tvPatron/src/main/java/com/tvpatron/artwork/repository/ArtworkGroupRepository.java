package com.tvpatron.artwork.repository;

import com.tvpatron.artwork.domain.ArtworkGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtworkGroupRepository extends JpaRepository<ArtworkGroup, Long> {
}
