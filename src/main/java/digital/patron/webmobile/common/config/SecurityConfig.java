package digital.patron.webmobile.common.config;

import digital.patron.webmobile.common.security.AuthenticationServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import javax.sql.DataSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableCaching
public class SecurityConfig {

    private final DataSource dataSource;

    @Bean
    public PersistentTokenRepository tokenRepository(){
        JdbcTokenRepositoryImpl jdbcTokenRepository = new JdbcTokenRepositoryImpl();
        jdbcTokenRepository.setDataSource(dataSource);

        return jdbcTokenRepository;
    }


    @Configuration
    @RequiredArgsConstructor
    public class UserConfigurationAdapter extends WebSecurityConfigurerAdapter {
        private final AuthenticationServiceImpl authenticationServiceImpl;
        private final PersistentTokenRepository tokenRepository;
        private final PasswordEncoder passwordEncoder;
        private final AuthenticationFailureHandler authenticationFailureHandler;
        private final AuthenticationSuccessHandler authenticationSuccessHandler;
        private final LogoutSuccessHandler logoutSuccessHandler;

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http
                    .headers()
                    .disable()
                    .csrf().disable()
                    .authorizeRequests()
                    .antMatchers("/**").permitAll()
                    .anyRequest().authenticated()
                    .and()
                    .formLogin()
                        .loginPage("/login") //custom login template path
                        .loginProcessingUrl("/api/login")
                        .usernameParameter("email")
                        .successHandler(authenticationSuccessHandler)
                        .failureHandler(authenticationFailureHandler)
                        .permitAll()
                    .and()
                    .oauth2Login()
                        .loginPage("/login")
                    .and()
                    .logout()
                        .logoutRequestMatcher(new AntPathRequestMatcher("/logout","POST"))
                        .clearAuthentication(true)
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID", "remember-me")
                        .logoutSuccessHandler(logoutSuccessHandler)
                    .and()
                    .rememberMe()
                        .tokenValiditySeconds(365*24*60*60)  //possibly not needed
                    .userDetailsService(authenticationServiceImpl)
                    .tokenRepository(tokenRepository)
                    .and()
                    .sessionManagement()
                        .maximumSessions(10).sessionRegistry(sessionRegistry());
        }

        @Override
        public void configure(WebSecurity web) throws Exception {
            web.ignoring()
                    .mvcMatchers("/img/**", "/font/**")
                    .requestMatchers(PathRequest.toStaticResources().atCommonLocations());
        }

        @Override
        protected void configure(AuthenticationManagerBuilder auth) throws Exception {
            auth.userDetailsService(authenticationServiceImpl).passwordEncoder(passwordEncoder);
        }
    }
    //encode password
    @Bean
    protected PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }


}
