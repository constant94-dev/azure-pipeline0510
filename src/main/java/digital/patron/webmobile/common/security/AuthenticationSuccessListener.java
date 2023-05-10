package digital.patron.webmobile.common.security;

import digital.patron.webmobile.member.service.MembersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class AuthenticationSuccessListener implements AuthenticationSuccessHandler {

    @Autowired
    private LoginAttemptService loginAttemptService;
    @Autowired
    private MembersService membersService;
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // Get the authenticated user
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String email = userDetails.getUsername();
        String preferredLanguage = membersService.getPreferredLanguage(email);
        String language;
        switch (preferredLanguage){
            case "한국어" : language = "ko";break;
            case "日本語" : language = "ja";break;
            default: language = "en";
        }
        // Perform any logic you want here before redirecting the user
        // ...
        final String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            loginAttemptService.loginSucceeded(request.getRemoteAddr());
        } else {
            loginAttemptService.loginSucceeded(xfHeader.split(",")[0]);
        }
        if(request.getHeader("Referer").contains("deviceId")){
            String url = request.getHeader("Referer");
            int start = url.indexOf("/",10) + 1;
            int end = url.indexOf("/", start);
            String currentLanguage = url.substring(start, end);
            String newUrl = url.replace("/" + currentLanguage + "/", "/" + language + "/");
            response.setHeader("myUrl", newUrl);
        }else{
            // Redirect the user to the success URL
            response.setHeader("myUrl", "/" + language + "/home");
        }
    }
}