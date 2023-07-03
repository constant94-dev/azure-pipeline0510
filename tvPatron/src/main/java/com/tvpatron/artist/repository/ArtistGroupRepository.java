package com.tvpatron.artist.repository;

import com.tvpatron.artist.domain.ArtistGroup;
import com.tvpatron.artist.repository.custom.ArtistGroupRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtistGroupRepository extends JpaRepository<ArtistGroup, Long>, ArtistGroupRepositoryCustom {
}
