package digital.patron.webmobile.member.service;

import digital.patron.webmobile.member.domain.LoginStatus;
import digital.patron.webmobile.member.repository.LoginStatusRepository;
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
public class LoginToTvServiceImpl implements LoginToTvService {
    private final LoginStatusRepository loginStatusRepository;

    @Override
    public Optional<LoginStatus> findByEmail(String email){
        return loginStatusRepository.findByEmail(email);
    }
    @Override
    public String loginToTv(String email, String code){
        Optional<LoginStatus> loginStatusExist = loginStatusRepository.findByEmail(email);
        if(loginStatusExist.isPresent()){
            return loginStatusExist.get().getDeviceName();
        }
        int response = loginStatusRepository.loginMemberToTv(email,code);
        return String.valueOf(response);
    }
    @Override
    public String getLoggedInTvName(String email){
        Optional<LoginStatus> existingDevice = loginStatusRepository.findByEmail(email);
        return existingDevice.map(LoginStatus::getDeviceName).orElse(null);
    }
    @Override
    public Integer logoutTv(String email){
        return loginStatusRepository.logoutTvByEmail(email);
    }

    @Override
    public String getLoginCode(String deviceId, String deviceName){
        loginStatusRepository.deleteExpiredCodes(LocalDateTime.now().minusMinutes(3));
        Optional<LoginStatus> loginStatusExist = loginStatusRepository.getConnectionByDeviceId(deviceId);
        if(loginStatusExist.isPresent()){
            if(loginStatusExist.get().getEmail() == null){
                return loginStatusExist.get().getCode();}
            return loginStatusExist.get().getEmail();
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
    private String getAuthCode() {
        Random random = new Random();
        StringBuffer buffer = new StringBuffer();
        int num;

        while(buffer.length() < 9) {
            num = random.nextInt(10);
            buffer.append(num);
        }

        return buffer.toString();
    }
}
