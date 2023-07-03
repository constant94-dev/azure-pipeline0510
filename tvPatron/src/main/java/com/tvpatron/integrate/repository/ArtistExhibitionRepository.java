package com.tvpatron.integrate.repository;

import com.tvpatron.integrate.domain.ArtistExhibition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtistExhibitionRepository extends JpaRepository<ArtistExhibition, Long> {

}
