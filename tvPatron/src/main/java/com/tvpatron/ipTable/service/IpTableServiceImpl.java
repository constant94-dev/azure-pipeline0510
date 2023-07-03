package com.tvpatron.ipTable.service;

import com.tvpatron.ipTable.repository.IpTableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class IpTableServiceImpl implements IpTableService{
    private final IpTableRepository ipTableRepository;
    @Override
    public String getCodeByIp(String ip){
        return ipTableRepository.getCodeByIp(ip);
    }
    @Override
    public String getLocalizationByIp(HttpServletRequest request){
        String ip = getClientIp(request);
        String countryCode = ipTableRepository.getCodeByIp(ip);
        if("kr".equalsIgnoreCase(countryCode)){
            return "kr";
        }else if("jp".equalsIgnoreCase(countryCode)){
            return "jp";
        }else{
            return "en";
        }
    }
    public static String getClientIp(HttpServletRequest request) {
        String remoteAddr = "";

        if (request != null) {
            remoteAddr = request.getHeader("X-FORWARDED-FOR");
            if (remoteAddr == null || "".equals(remoteAddr)) {
                remoteAddr = request.getRemoteAddr();
            }
        }
        String[] parts = remoteAddr.split(":");
        return parts[0];
    }
}
