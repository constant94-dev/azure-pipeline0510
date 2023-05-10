package digital.patron.webmobile.artist.repository;

import digital.patron.webmobile.artist.domain.ArtistTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtistTagRepository extends JpaRepository<ArtistTag, Long> {
}
