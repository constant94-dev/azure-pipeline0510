package com.tvpatron.artwork.repository;

import com.tvpatron.artwork.domain.ArtworkArtworkTag;
import com.tvpatron.artwork.repository.custom.ArtworkArtworkTagRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtworkArtworkTagRepository extends JpaRepository<ArtworkArtworkTag, Long>, ArtworkArtworkTagRepositoryCustom {
}
