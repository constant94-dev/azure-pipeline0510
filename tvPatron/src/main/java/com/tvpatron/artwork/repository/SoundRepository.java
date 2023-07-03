package com.tvpatron.artwork.repository;

import com.tvpatron.artwork.domain.Sound;
import com.tvpatron.artwork.repository.custom.SoundRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SoundRepository extends JpaRepository<Sound, Long>, SoundRepositoryCustom {
}
