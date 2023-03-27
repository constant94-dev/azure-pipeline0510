package digital.patron.webmobile.artwork.repository;

import digital.patron.webmobile.artwork.domain.ArtworkGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtworkGroupRepository extends JpaRepository<ArtworkGroup, Long> {
}
