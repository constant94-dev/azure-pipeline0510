package digital.patron.webmobile.artwork.repository;

import digital.patron.webmobile.artwork.domain.SoundTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SoundTagRepository extends JpaRepository<SoundTag,Long> {
}
