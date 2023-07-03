package com.tvpatron.member.repository;

import com.tvpatron.member.domain.LoginStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface LoginStatusRepository extends JpaRepository<LoginStatus, Long> {
    @Query("select l from LoginStatus l where l.deviceId = :deviceId")
    Optional<LoginStatus> getConnectionByDeviceId(String deviceId);

    @Transactional
    @Modifying
    @Query("delete from LoginStatus l where l.createTime < :localDateTime and l.code is not null")
    int deleteExpiredCodes(LocalDateTime localDateTime);

    @Transactional
    @Modifying
    @Query("delete from LoginStatus l where l = :loginStatus")
    int deleteByLoginStatus(LoginStatus loginStatus);

    @Transactional
    @Modifying
    @Query("delete from LoginStatus l where l.email = :email")
    int deleteByEmail(String email);

    @Transactional
    @Modifying
    @Query("delete from LoginStatus l where l.deviceId = :deviceId and l.code is not null")
    int deleteByDeviceId(String deviceId);

    @Query("select l.code from LoginStatus l where l.deviceId = :deviceId and l.deviceName = :deviceName")
    Optional<String> getCodeByDeviceIdAndDeviceName(String deviceId, String deviceName);

    @Query("select l.email from LoginStatus l where l.deviceId = :deviceId and l.code is null and l.email is not null")
    Optional<String> checkLoginStatus(String deviceId);
}
