package com.tvpatron.member.repository;

import com.tvpatron.artwork.domain.Artwork;
import com.tvpatron.member.domain.Collection;
import com.tvpatron.member.domain.CollectionArtwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface CollectionArtworkRepository extends JpaRepository<CollectionArtwork, Long> {
    @Query("select c from CollectionArtwork c where c.collection = :collection and c.artwork = :artwork")
    Optional<CollectionArtwork> findByCollectionAndArtwork(Collection collection, Artwork artwork);

    @Transactional
    @Modifying
    @Query("delete from CollectionArtwork c where c.collection = :collection and c.artwork = :artwork")
    void deleteByCollectionAndArtwork(Collection collection, Artwork artwork);
}
