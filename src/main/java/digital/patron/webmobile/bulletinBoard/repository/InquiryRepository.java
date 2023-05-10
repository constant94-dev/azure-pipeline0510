package digital.patron.webmobile.bulletinBoard.repository;

import digital.patron.webmobile.bulletinBoard.domain.AdminInquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface InquiryRepository extends JpaRepository<AdminInquiry,Long> {
    @Query("select a from AdminInquiry a where a.writer = :email")
    List<AdminInquiry> findAllByWriter(String email);

    @Transactional
    @Modifying
    @Query("delete from AdminInquiry a where a.id = :id and  a.writer = :email")
    int deleteByIdAndEmail(String email, Long id);
}
