package digital.patron.webmobile.artwork.repository;

import digital.patron.webmobile.artwork.domain.SoundSoundTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SoundSoundTagRepository extends JpaRepository<SoundSoundTag,Long> {
}
