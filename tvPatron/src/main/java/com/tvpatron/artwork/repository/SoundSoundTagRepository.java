package com.tvpatron.artwork.repository;

import com.tvpatron.artwork.domain.SoundSoundTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SoundSoundTagRepository extends JpaRepository<SoundSoundTag,Long> {
}
