package digital.patron.webmobile.exhibition.repository;

import digital.patron.webmobile.exhibition.domain.ExhibitionExhibitionGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExhibitionExhibitionGroupRepository extends JpaRepository<ExhibitionExhibitionGroup, Long> {
}
