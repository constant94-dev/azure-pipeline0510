package com.tvpatron.advertisement.repository;

import com.tvpatron.advertisement.domain.Advertisement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdvertisementRepository extends JpaRepository<Advertisement,Long> {
    @Query("select a from Advertisement a where a.name = :name")
    Optional<Advertisement> findByName(String name);
}
