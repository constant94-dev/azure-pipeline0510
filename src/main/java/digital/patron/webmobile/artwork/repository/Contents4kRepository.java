package digital.patron.webmobile.artwork.repository;

import digital.patron.webmobile.artwork.domain.Contents4k;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Contents4kRepository extends JpaRepository<Contents4k, Long> {
}
