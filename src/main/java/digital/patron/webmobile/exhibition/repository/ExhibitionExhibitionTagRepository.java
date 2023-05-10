package digital.patron.webmobile.exhibition.repository;

import digital.patron.webmobile.exhibition.domain.ExhibitionExhibitionTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExhibitionExhibitionTagRepository extends JpaRepository<ExhibitionExhibitionTag, Long> {
//    @Query("select e.exhibition from ExhibitionExhibitionTag e " +
//            "where e.exhibitionTag in :exhibitionTags and e.exhibition.localization like :localization group by e.exhibition " +
//            "order by count(e.exhibition) desc, e.exhibition.createTime desc")
//    List<Exhibition> findSimilarExhibitions(String localization, List<ExhibitionTag> exhibitionTags);
}
