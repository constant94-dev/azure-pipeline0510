package com.tvpatron.artwork.repository;

import com.tvpatron.artwork.domain.ArtworkArtworkGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtworkArtworkGroupRepository extends JpaRepository<ArtworkArtworkGroup, Long> {
}
