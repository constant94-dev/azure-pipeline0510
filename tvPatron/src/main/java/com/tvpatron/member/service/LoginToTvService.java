package com.tvpatron.member.service;

import java.util.Optional;

public interface LoginToTvService {
    String getLoginCode(String deviceId, String deviceName);

    String checkLoginCode(String deviceId, String deviceName);

    Optional<String> checkLoginStatus(String deviceId);

    int deleteCode(String deviceId);

    int logout(String email);
}
