package com.tvpatron.member.repository;

import com.tvpatron.exhibition.domain.Exhibition;
import com.tvpatron.member.domain.GeneralMember;
import com.tvpatron.member.domain.MemberWaitingExhibition;
import com.tvpatron.member.repository.custom.MemberWaitingExhibitionRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface MemberWaitingExhibitionRepository extends JpaRepository<MemberWaitingExhibition,Long>, MemberWaitingExhibitionRepositoryCustom {
    @Query("select m from MemberWaitingExhibition m where m.generalMember = :generalMember and m.exhibition = :exhibition")
    Optional<MemberWaitingExhibition> findIdByGeneralMemberAndExhibition(GeneralMember generalMember, Exhibition exhibition);

    @Transactional
    @Modifying
    @Query("delete from MemberWaitingExhibition m where m.generalMember = :generalMember and m.exhibition = :exhibition")
    void deleteByGeneralMemberAndExhibition(GeneralMember generalMember, Exhibition exhibition);
}