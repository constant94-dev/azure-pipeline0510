package digital.patron.webmobile.common.security.handler;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component("authenticationFailureHandler")
public class CustomAuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(final HttpServletRequest request, final HttpServletResponse response, final AuthenticationException exception) throws IOException, ServletException {


        Integer errorCode;

        if (exception.getMessage()
            .equalsIgnoreCase("User is disabled")) {
            errorCode = 403;
        } else if (exception.getMessage()
                .equalsIgnoreCase("User account has expired")) {
            errorCode = 419;
        } else if (exception.getMessage()
                .equalsIgnoreCase("bad credentials")) {
            errorCode = 401;
        } else if (exception.getMessage()
            .equalsIgnoreCase("blocked")) {
            errorCode = 403;
        }else{
            errorCode = 500;
        }
        response.sendError(errorCode, HttpStatus.UNAUTHORIZED.getReasonPhrase());

        request.getSession()
            .setAttribute(WebAttributes.AUTHENTICATION_EXCEPTION, errorCode);
    }
}