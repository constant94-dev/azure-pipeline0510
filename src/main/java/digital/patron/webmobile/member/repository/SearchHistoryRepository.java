package digital.patron.webmobile.member.repository;

import digital.patron.webmobile.member.domain.GeneralMember;
import digital.patron.webmobile.member.domain.SearchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory,Long> {
    @Query("select s from SearchHistory s where s.generalMember = :generalMember order by s.id desc")
    List<SearchHistory> findByGeneralMember(GeneralMember generalMember);

    @Transactional
    @Modifying
    @Query("delete from SearchHistory s where s.generalMember = :generalMember and s.keyword = :keyword")
    int deleteByGeneralMemberAndKeyword(GeneralMember generalMember,String keyword);

    @Transactional
    @Modifying
    @Query("delete from SearchHistory s where s.generalMember = :generalMember")
    int deleteByGeneralMember(GeneralMember generalMember);
}
