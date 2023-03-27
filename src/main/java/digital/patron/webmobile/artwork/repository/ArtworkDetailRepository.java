package digital.patron.webmobile.artwork.repository;

import digital.patron.webmobile.artwork.domain.ArtworkDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtworkDetailRepository extends JpaRepository<ArtworkDetail, Long> {
}
