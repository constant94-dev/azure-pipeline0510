package digital.patron.webmobile.common.security;

import digital.patron.webmobile.ipTable.service.IpTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class LogoutSuccessListener implements LogoutSuccessHandler {

    @Autowired
    private IpTableService ipTableService;
    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
//        String localization = ipTableService.getLocalizationByIp(request);
//        String language;
//        switch (localization){
//            case "kr":language = "ko";break;
//            case "jp":language = "ja";break;
//            default:language = "en";break;
//        }
//        response.sendRedirect("/" + language + "/home");
    }
}
