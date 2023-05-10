package digital.patron.webmobile.exhibition.repository;

import digital.patron.webmobile.exhibition.domain.Exhibition;
import digital.patron.webmobile.exhibition.repository.custom.ExhibitionRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExhibitionRepository extends JpaRepository<Exhibition, Long>, ExhibitionRepositoryCustom {

}
