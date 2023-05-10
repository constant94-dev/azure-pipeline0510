package digital.patron.webmobile.member.repository;

import digital.patron.webmobile.member.domain.LoginStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface LoginStatusRepository extends JpaRepository<LoginStatus, Long> {
    @Query("select l from LoginStatus l where l.email = :email")
    Optional<LoginStatus> findByEmail(String email);

    @Transactional
    @Modifying
    @Query("update LoginStatus l set l.email = :email, l.code = null where l.code = :code")
    int loginMemberToTv(String email, String code);

    @Transactional
    @Modifying
    @Query("delete from LoginStatus l where l.email = :email")
    int logoutTvByEmail(String email);

    @Query("select l from LoginStatus l where l.deviceId = :deviceId")
    Optional<LoginStatus> getConnectionByDeviceId(String deviceId);

    @Transactional
    @Modifying
    @Query("delete from LoginStatus l where l.createTime < :localDateTime and l.code is not null")
    int deleteExpiredCodes(LocalDateTime localDateTime);

    @Transactional
    @Modifying
    @Query("delete from LoginStatus l where l.email = :email")
    int deleteByEmail(String email);
}
