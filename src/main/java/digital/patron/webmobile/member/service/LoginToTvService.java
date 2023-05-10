package digital.patron.webmobile.member.service;

import digital.patron.webmobile.member.domain.LoginStatus;

import java.util.Optional;

public interface LoginToTvService {
    Optional<LoginStatus> findByEmail(String email);

    String loginToTv(String email, String code);

    String getLoggedInTvName(String email);

    Integer logoutTv(String email);

    String getLoginCode(String deviceId, String deviceName);
}
