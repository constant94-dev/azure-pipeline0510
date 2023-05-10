package digital.patron.webmobile.exhibition.repository;

import digital.patron.webmobile.exhibition.domain.ExhibitionGroup;
import digital.patron.webmobile.exhibition.repository.custom.ExhibitionGroupRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExhibitionGroupRepository extends JpaRepository<ExhibitionGroup, Long>, ExhibitionGroupRepositoryCustom {
}
