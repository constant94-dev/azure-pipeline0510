package com.tvpatron.ipTable.service;

import javax.servlet.http.HttpServletRequest;

public interface IpTableService {
    String getCodeByIp(String ip);

    String getLocalizationByIp(HttpServletRequest request);
}
