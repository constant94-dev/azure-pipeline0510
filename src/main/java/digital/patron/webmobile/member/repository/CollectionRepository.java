package digital.patron.webmobile.member.repository;

import digital.patron.webmobile.exhibition.domain.Exhibition;
import digital.patron.webmobile.member.domain.Collection;
import digital.patron.webmobile.member.domain.GeneralMember;
import digital.patron.webmobile.member.repository.custom.CollectionRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CollectionRepository extends JpaRepository<Collection, Long>, CollectionRepositoryCustom {
    @Query("select c from Collection c where c.generalMember = :generalMember and c.exhibition is null and c.collectionName = :collectionName")
    Optional<Collection> findByGeneralMemberAndCollectionNameAndExhibitionNull(String collectionName, GeneralMember generalMember);

    @Transactional
    @Modifying
    @Query("delete from Collection c where  c.generalMember = :generalMember and c.exhibition = :exhibition")
    void deleteByGeneralMemberAndExhibition(GeneralMember generalMember, Exhibition exhibition);

    @Query("select max(c.sortNumber) from Collection c where c.generalMember = :generalMember")
    Integer findLastSortNumberByGeneralMember(GeneralMember generalMember);

    @Query("select c from Collection c where c.generalMember = :generalMember and c.exhibition = :exhibition")
    Optional<Collection> findByGeneralMemberAndExhibition(GeneralMember generalMember, Exhibition exhibition);

    @Query("select c from Collection c where c.generalMember = :generalMember")
    List<Collection> findCollectionsByGeneralMember(GeneralMember generalMember);

    @Transactional
    @Modifying
    @Query("delete from Collection c where c.generalMember = :generalMember")
    int deleteByGeneralMember(GeneralMember generalMember);

    @Transactional
    @Modifying
    @Query("update Collection c set c.collectionName = :newName, c.updateTime = :updateTime where c.collectionName = :previousName and c.generalMember = :generalMember")
    int editCollectionName(String previousName, String newName, GeneralMember generalMember, LocalDateTime updateTime);

    @Transactional
    @Modifying
    @Query("delete from Collection c where c = :collection")
    int deleteByCollection(Collection collection);

    @Query("select count(c) from Collection c where c.generalMember = :generalMember and c.exhibition = null")
    int countAllByGeneralMember(GeneralMember generalMember);

    @Transactional
    @Modifying
    @Query("update Collection c set c.updateTime = :updateTime where c = :collection")
    int updateTime(LocalDateTime updateTime, Collection collection);
}