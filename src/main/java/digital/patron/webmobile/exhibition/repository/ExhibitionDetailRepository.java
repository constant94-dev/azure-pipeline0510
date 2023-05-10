package digital.patron.webmobile.exhibition.repository;

import digital.patron.webmobile.exhibition.domain.ExhibitionDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExhibitionDetailRepository extends JpaRepository<ExhibitionDetail, Long> {
}
