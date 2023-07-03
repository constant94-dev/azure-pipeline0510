package com.tvpatron.member.service;

import com.tvpatron.member.domain.LoginStatus;
import com.tvpatron.member.repository.LoginStatusRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class LoginToTvServiceImpl implements LoginToTvService{
    private final LoginStatusRepository loginStatusRepository;
    @Override
    public String getLoginCode(String deviceId, String deviceName){
        loginStatusRepository.deleteExpiredCodes(LocalDateTime.now().minusMinutes(3));
        Optional<LoginStatus> loginStatusExist = loginStatusRepository.getConnectionByDeviceId(deviceId);
        if(loginStatusExist.isPresent()){
            if (loginStatusExist.get().getEmail() != null) {
                return loginStatusExist.get().getEmail();
            }
            loginStatusRepository.deleteByLoginStatus(loginStatusExist.get());
        }
        String code = getAuthCode();
        LoginStatus loginStatus = new LoginStatus(
                null,
                deviceName,
                deviceId,
                code,
                LocalDateTime.now()
        );
        loginStatusRepository.save(loginStatus);
        return code;
    }
    @Override
    public String checkLoginCode(String deviceId, String deviceName){
        Optional<String> code = loginStatusRepository.getCodeByDeviceIdAndDeviceName(deviceId,deviceName);
        return code.orElse(null);
    }
    @Override
    public Optional<String> checkLoginStatus(String deviceId){return loginStatusRepository.checkLoginStatus(deviceId);}
    @Override
    public int deleteCode(String deviceId){
        return loginStatusRepository.deleteByDeviceId(deviceId);
    }
    @Override
    public int logout(String email){return loginStatusRepository.deleteByEmail(email);}

    private String getAuthCode() {
        Random random = new Random();
        StringBuilder buffer = new StringBuilder();
        int num;

        while(buffer.length() < 9) {
            num = random.nextInt(10);
            buffer.append(num);
        }

        return buffer.toString();
    }
}
