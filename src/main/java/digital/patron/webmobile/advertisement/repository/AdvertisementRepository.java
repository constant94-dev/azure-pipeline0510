package digital.patron.webmobile.advertisement.repository;

import digital.patron.webmobile.advertisement.domain.Advertisement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface AdvertisementRepository extends JpaRepository<Advertisement,Long> {
    @Query("select a from Advertisement a where a.name = :name")
    Optional<Advertisement> findByName(String name);
}
