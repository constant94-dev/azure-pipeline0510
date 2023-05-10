package digital.patron.webmobile.member.repository;

import digital.patron.webmobile.artwork.domain.Artwork;
import digital.patron.webmobile.member.domain.Collection;
import digital.patron.webmobile.member.domain.CollectionArtwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollectionArtworkRepository extends JpaRepository<CollectionArtwork, Long> {
    @Query("select c from CollectionArtwork c where c.collection = :collection and c.artwork = :artwork")
    Optional<CollectionArtwork> findByCollectionAndArtwork(Collection collection, Artwork artwork);

    @Transactional
    @Modifying
    @Query("delete from CollectionArtwork c where c.collection = :collection and c.artwork = :artwork")
    void deleteByCollectionAndArtwork(Collection collection, Artwork artwork);

    @Transactional
    @Modifying
    @Query("delete from CollectionArtwork c where c.collection = :collection")
    void deleteByCollection(Collection collection);

    @Transactional
    @Modifying
    @Query("delete from CollectionArtwork c where c.collection in :collection")
    void deleteByCollections(List<Collection> collection);
}
