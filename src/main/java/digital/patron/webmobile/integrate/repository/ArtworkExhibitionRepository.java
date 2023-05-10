package digital.patron.webmobile.integrate.repository;

import digital.patron.webmobile.integrate.domain.ArtworkExhibition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtworkExhibitionRepository extends JpaRepository<ArtworkExhibition, Long>{
}
