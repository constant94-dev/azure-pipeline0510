package com.tvpatron.artwork.repository;

import com.tvpatron.artwork.domain.Contents4k;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Contents4kRepository extends JpaRepository<Contents4k, Long> {
}
