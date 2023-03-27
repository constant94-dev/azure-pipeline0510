package digital.patron.webmobile.common.security;


import digital.patron.webmobile.email.domain.TempEmailStorage;
import digital.patron.webmobile.email.repository.TempEmailStorageRepository;
import digital.patron.webmobile.member.domain.Collection;
import digital.patron.webmobile.member.domain.DisabledMember;
import digital.patron.webmobile.member.domain.GeneralMember;
import digital.patron.webmobile.member.dto.MemberDto;
import digital.patron.webmobile.member.repository.CollectionRepository;
import digital.patron.webmobile.member.repository.GeneralMemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService,UserDetailsService {

    private final GeneralMemberRepository generalMemberRepository;
    private final LoginAttemptService loginAttemptService;
    private final HttpServletRequest request;
    private final TempEmailStorageRepository tempEmailStorageRepository;
    private final SessionRegistry sessionRegistry;
    private final CollectionRepository collectionRepository;

    //get user by email from db
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        String ip = getClientIP();
        if (loginAttemptService.isBlocked(ip)) {
            throw new RuntimeException("blocked");
        }

        try {
            Optional<GeneralMember> generalMember = generalMemberRepository.findByEmail(email);
            if(generalMember.isPresent()){
                return new Users(generalMember.get());
            }else{
                throw new UsernameNotFoundException(email);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    private String getClientIP() {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null){
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    @Override
    public void login(GeneralMember generalMember) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                new Users(generalMember),
                generalMember.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_USER")));

        SecurityContext context = SecurityContextHolder.getContext();
        context.setAuthentication(token);
    }

    @Override
    public GeneralMember create(MemberDto memberDto, String localization) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        memberDto.setPassword(encoder.encode(memberDto.getPassword()));
        String language;
        switch (localization){
            case "kr" : language = "한국어"; break;
            case "jp" : language = "日本語";  break;
            default: language = "English"; break;
        }
        try{
            GeneralMember generalMember = new GeneralMember(
                    memberDto.getEmail(),
                    memberDto.getName(),
                    "정상",
                    null,
                    null,
                    null,
                    language,
                    null,
                    memberDto.getProvider(),
                    memberDto.getMarketing(),
                    false,
                    memberDto.getPassword(),
                    LocalDateTime.now(),
                    LocalDate.now()
            );
            generalMemberRepository.save(generalMember);
            Collection collection = new Collection(0, generalMember.getName() + " Collection",LocalDateTime.now());
            collection.setGeneralMember(generalMember);
            collectionRepository.save(collection);
            return generalMember;
        }catch (Exception e){
            log.error("Exception : " + e);
            return null;
        }
    }

    @Override
    public GeneralMember moveDisabledToGeneral(DisabledMember disabledMember) {
        try{
            GeneralMember generalMember = new GeneralMember(
                    disabledMember.getEmail(),
                    disabledMember.getName(),
                    "정상",
                    null,
                    disabledMember.getBirth(),
                    disabledMember.getNationality(),
                    "English",
                    disabledMember.getGender(),
                    disabledMember.getProvider(),
                    disabledMember.isMarketing(),
                    true,
                    disabledMember.getPassword(),
                    LocalDateTime.now(),
                    LocalDate.now()
            );
            generalMemberRepository.save(generalMember);
            Collection collection = new Collection(0, generalMember.getName() + " Collection",LocalDateTime.now());
            collection.setGeneralMember(generalMember);
            collectionRepository.save(collection);
            return generalMember;
        }catch (Exception e){
            log.error("Exception : " + e);
            return null;
        }
    }

    @Override
    public int createTemp(String email, String authKey){
        try{
            tempEmailStorageRepository.deleteByEmail(email);
            TempEmailStorage tempEmailStorage = new TempEmailStorage(
                    email,
                    authKey,
                    LocalDateTime.now()
            );
            tempEmailStorageRepository.save(tempEmailStorage);
            return 1;
        }catch (Exception e){
            log.error("There was an error : " + e);
            return 0;
        }

    }
    @Override
    public int verifyEmail(String email, String authKey){
        try{
            LocalDateTime createTime = tempEmailStorageRepository.findCreateTimeByEmailAndAuthKey(email,authKey);
            if(createTime == null){return -2;}
            if(createTime.plusMinutes(30).isAfter(LocalDateTime.now())){
                tempEmailStorageRepository.deleteByEmail(email);
                return 1;
            }
            return 0;
        }catch (Exception e){
            log.error("There was an error : " + e);
            return -1;
        }

    }

    @Override
    public int resetPassword(String email, String password){
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        String encodedPassword = encoder.encode(password);
        int response = generalMemberRepository.resetPassword(email,encodedPassword);
        if(response == 1){
            for (Object principal : sessionRegistry.getAllPrincipals()) {
                for (SessionInformation session : sessionRegistry.getAllSessions(principal, false)) {
                    Optional<GeneralMember> generalMember = generalMemberRepository.findByEmail(email);
                    if(generalMember.isPresent()){
                        Users users = new Users(generalMember.get());
                        if(session.getPrincipal().equals(users)){
                            session.expireNow();
                        }
                    }
//
                }
            }
        }
        return response;
    }
    @Override
    public int deleteVerificationCode(String email){
        return tempEmailStorageRepository.deleteByEmail(email);
    }

}