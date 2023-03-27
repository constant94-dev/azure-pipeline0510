package digital.patron.webmobile.artwork.repository;

import digital.patron.webmobile.artwork.domain.ContentsHd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentsHdRepository extends JpaRepository<ContentsHd, Long> {
}
