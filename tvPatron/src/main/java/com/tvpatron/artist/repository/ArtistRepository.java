package com.tvpatron.artist.repository;

import com.tvpatron.artist.domain.Artist;
import com.tvpatron.artist.repository.custom.ArtistRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtistRepository extends JpaRepository<Artist, Long>, ArtistRepositoryCustom {
}
