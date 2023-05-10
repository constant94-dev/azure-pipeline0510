package digital.patron.webmobile.ipTable.service;

import javax.servlet.http.HttpServletRequest;

public interface IpTableService {
    String getCodeByIp(String ip);

    String getLocalizationByIp(HttpServletRequest request);
}
