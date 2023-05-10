package digital.patron.webmobile.common.config;

import org.springframework.web.servlet.LocaleResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Locale;

public class PathLocaleResolver implements LocaleResolver {

    @Override
    public Locale resolveLocale(HttpServletRequest request) {
        String path = request.getServletPath();
        String[] segments = path.split("/");
        if (segments.length > 1) {
            String localeString = segments[1];
            return Locale.forLanguageTag(localeString);
        }
        return Locale.getDefault();
    }

    @Override
    public void setLocale(HttpServletRequest request, HttpServletResponse response, Locale locale) {
        // This method is not needed for this implementation
    }
}