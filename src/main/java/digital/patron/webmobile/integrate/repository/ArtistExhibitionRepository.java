package digital.patron.webmobile.integrate.repository;

import digital.patron.webmobile.integrate.domain.ArtistExhibition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtistExhibitionRepository extends JpaRepository<ArtistExhibition, Long> {


}
