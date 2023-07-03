package com.tvpatron.artwork.repository;

import com.tvpatron.artwork.domain.SoundTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SoundTagRepository extends JpaRepository<SoundTag,Long> {
}
