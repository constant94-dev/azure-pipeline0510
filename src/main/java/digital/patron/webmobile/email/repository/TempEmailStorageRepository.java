package digital.patron.webmobile.email.repository;

import digital.patron.webmobile.email.domain.TempEmailStorage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Repository
public interface TempEmailStorageRepository extends JpaRepository<TempEmailStorage,Long> {
    @Transactional
    @Modifying
    @Query("delete from TempEmailStorage t where t.email = :email")
    Integer deleteByEmail(String email);

    @Query("select t.createTime from TempEmailStorage t where t.email = :email and t.authKey = :authKey")
    LocalDateTime findCreateTimeByEmailAndAuthKey(String email, String authKey);

    @Transactional
    @Modifying
    @Query("delete from TempEmailStorage t where t.createTime < :localDateTime")
    int removeExpiredCode(LocalDateTime localDateTime);
}
