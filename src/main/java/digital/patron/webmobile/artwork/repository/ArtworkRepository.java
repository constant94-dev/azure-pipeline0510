package digital.patron.webmobile.artwork.repository;

import digital.patron.webmobile.artwork.domain.Artwork;
import digital.patron.webmobile.artwork.repository.custom.ArtworkRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtworkRepository extends JpaRepository<Artwork, Long>, ArtworkRepositoryCustom {
    @Query("select a.shopUrl from Artwork a where a.id = :id")
    String findShopUrlById(Long id);
}
