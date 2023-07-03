package com.tvpatron.artwork.repository;

import com.tvpatron.artwork.domain.Artwork;
import com.tvpatron.artwork.repository.custom.ArtworkRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArtworkRepository extends JpaRepository<Artwork, Long>, ArtworkRepositoryCustom {
    @Query("select a.shopUrl from Artwork a where a.id = :id")
    String findShopUrlById(Long id);
}
