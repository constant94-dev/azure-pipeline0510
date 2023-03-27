package digital.patron.webmobile.artwork.repository;

import digital.patron.webmobile.artwork.domain.Sound;
import digital.patron.webmobile.artwork.repository.custom.SoundRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SoundRepository extends JpaRepository<Sound, Long>, SoundRepositoryCustom {
}
