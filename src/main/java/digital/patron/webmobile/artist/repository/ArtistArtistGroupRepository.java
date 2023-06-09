package digital.patron.webmobile.artist.repository;

import digital.patron.webmobile.artist.domain.ArtistArtistGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtistArtistGroupRepository extends JpaRepository<ArtistArtistGroup, Long> {
}
