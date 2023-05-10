package digital.patron.webmobile.artMagazine.repository;

import digital.patron.webmobile.artMagazine.domain.ArtMagazine;
import digital.patron.webmobile.exhibition.domain.Exhibition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArtMagazineRepository extends JpaRepository<ArtMagazine, Long> {

    @Query("select a from ArtMagazine a where a.type = :type")
    List<ArtMagazine> getByType(String type);

    @Query("select a from ArtMagazine a where a.recommended is not null order by a.recommended asc")
    Page<ArtMagazine> findRecommendedMagazines(Pageable pageable);

    @Query("select a from ArtMagazine a where a.exhibition = :exhibition")
    ArtMagazine getArtMagazineByExhibition(Exhibition exhibition);
}
