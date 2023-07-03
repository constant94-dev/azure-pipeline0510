package com.tvpatron.member.repository;

import com.tvpatron.exhibition.domain.Exhibition;
import com.tvpatron.member.domain.Collection;
import com.tvpatron.member.domain.GeneralMember;
import com.tvpatron.member.repository.custom.CollectionRepositoryCustom;
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

    @Transactional
    @Modifying
    @Query("update Collection c set c.updateTime = :updateTime where c = :collection")
    int updateTime(LocalDateTime updateTime, Collection collection);

    @Query("select c from Collection c where c.generalMember = :generalMember and c.exhibition is null order by c.collectionName asc")
    List<Collection> findArtworkCollectionsByEmail(GeneralMember generalMember);
}