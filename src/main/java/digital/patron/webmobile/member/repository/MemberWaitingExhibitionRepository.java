package digital.patron.webmobile.member.repository;

import digital.patron.webmobile.exhibition.domain.Exhibition;
import digital.patron.webmobile.member.domain.GeneralMember;
import digital.patron.webmobile.member.domain.MemberWaitingExhibition;
import digital.patron.webmobile.member.repository.custom.MemberWaitingExhibitionRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface  MemberWaitingExhibitionRepository extends JpaRepository<MemberWaitingExhibition,Long>, MemberWaitingExhibitionRepositoryCustom {
    @Query("select m from MemberWaitingExhibition m where m.generalMember = :generalMember and m.exhibition = :exhibition")
    Optional<MemberWaitingExhibition> findIdByGeneralMemberAndExhibition(GeneralMember generalMember, Exhibition exhibition);

    @Transactional
    @Modifying
    @Query("delete from MemberWaitingExhibition m where m.generalMember = :generalMember and m.exhibition = :exhibition")
    void deleteByGeneralMemberAndExhibition(GeneralMember generalMember, Exhibition exhibition);

    @Transactional
    @Modifying
    @Query("delete from MemberWaitingExhibition k where k.generalMember = :generalMember")
    int deleteByGeneralMember(GeneralMember generalMember);

}
