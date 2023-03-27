package digital.patron.webmobile.artwork.repository;

import digital.patron.webmobile.artwork.domain.ArtworkSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtworkSourceRepository extends JpaRepository<ArtworkSource, Long> {
}
