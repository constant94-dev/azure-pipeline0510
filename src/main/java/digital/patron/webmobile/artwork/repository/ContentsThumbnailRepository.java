package digital.patron.webmobile.artwork.repository;

import digital.patron.webmobile.artwork.domain.ContentsThumbnail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentsThumbnailRepository extends JpaRepository<ContentsThumbnail, Long> {
}
