package com.tvpatron.artist.repository;

import com.tvpatron.artist.domain.ArtistArtistTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtistArtistTagRepository extends JpaRepository<ArtistArtistTag, Long> {
}
