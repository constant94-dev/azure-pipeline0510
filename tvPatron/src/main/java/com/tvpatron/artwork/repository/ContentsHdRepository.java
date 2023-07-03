package com.tvpatron.artwork.repository;

import com.tvpatron.artwork.domain.ContentsHd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentsHdRepository extends JpaRepository<ContentsHd, Long> {
}
