package digital.patron.webmobile.artist.repository;

import digital.patron.webmobile.artist.domain.Artist;
import digital.patron.webmobile.artist.repository.custom.ArtistRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtistRepository extends JpaRepository<Artist, Long>, ArtistRepositoryCustom {

}
