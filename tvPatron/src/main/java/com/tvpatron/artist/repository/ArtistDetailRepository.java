package com.tvpatron.artist.repository;

import com.tvpatron.artist.domain.ArtistDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtistDetailRepository extends JpaRepository<ArtistDetail, Long> {
}
