package com.tvpatron.artist.repository;

import com.tvpatron.artist.domain.ArtistArtistGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtistArtistGroupRepository extends JpaRepository<ArtistArtistGroup, Long> {
}
