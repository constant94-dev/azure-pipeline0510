package digital.patron.webmobile.artist.repository;

import digital.patron.webmobile.artist.domain.ArtistGroup;
import digital.patron.webmobile.artist.repository.custom.ArtistGroupRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtistGroupRepository extends JpaRepository<ArtistGroup, Long>, ArtistGroupRepositoryCustom {
}
