package digital.patron.webmobile.exhibition.repository;

import digital.patron.webmobile.exhibition.domain.ExhibitionTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExhibitionTagRepository extends JpaRepository<ExhibitionTag, Long> {

}
