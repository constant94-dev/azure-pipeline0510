package com.tvpatron.artist.repository;

import com.tvpatron.artist.domain.ArtistTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtistTagRepository extends JpaRepository<ArtistTag, Long> {
}
