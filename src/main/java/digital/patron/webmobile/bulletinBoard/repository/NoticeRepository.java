package digital.patron.webmobile.bulletinBoard.repository;

import digital.patron.webmobile.bulletinBoard.domain.AdminNotice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NoticeRepository extends JpaRepository<AdminNotice, Long> {
    @Query("select n from AdminNotice n where n.id = :notice_id")
    Optional<AdminNotice> findById(Long notice_id);
}
