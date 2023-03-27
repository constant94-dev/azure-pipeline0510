package digital.patron.webmobile.member.service;

import digital.patron.webmobile.member.domain.DisabledMember;
import digital.patron.webmobile.member.domain.GeneralMember;
import digital.patron.webmobile.member.domain.LeftMember;
import digital.patron.webmobile.member.dto.DeleteAccountDto;
import digital.patron.webmobile.member.repository.DisabledMemberRepository;
import digital.patron.webmobile.member.repository.GeneralMemberRepository;
import digital.patron.webmobile.member.repository.LeftMemberRepository;
import digital.patron.webmobile.member.repository.LoginStatusRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class MembersServiceImpl implements MembersService{
    private final GeneralMemberRepository generalMemberRepository;
    private final LeftMemberRepository leftMemberRepository;
    private final DisabledMemberRepository disabledMemberRepository;
    private final MembersStorageService membersStorageService;
    private final SearchHistoryService searchHistoryService;
    private final LoginStatusRepository loginStatusRepository;

    //get user by ID
    @Override
    public GeneralMember getById(Long id) {return generalMemberRepository.getById(id);}

    @Override
    public Optional<LeftMember> isMemberALeftMember(String email) {return leftMemberRepository.isMemberALeftMember(email);}

    @Override
    public Optional<GeneralMember> getByEmail(String email) {
        return generalMemberRepository.findByEmail(email);
    }

    @Override
    public Optional<String> getProviderByEmail(String email) {return generalMemberRepository.getProviderByEmail(email);}

    @Override
    public DisabledMember getDisabledMemberByEmail(String email) {return disabledMemberRepository.getByEmail(email);}

    @Override
    public Optional<String> getDisabledMemberProviderByEmail(String email) {return disabledMemberRepository.getProviderByEmail(email);}

    @Override
    public String getNickName(String email) {
        return generalMemberRepository.getGeneralMemberNickNameByEmail(email);
    }

    @Override
    public String getBirth(String email) {
        LocalDate birthDate = generalMemberRepository.getGeneralMemberBirthByEmail(email);
        return birthDate != null ? birthDate.toString() : null;
    }

    @Override
    public String getGender(String email) {
        return generalMemberRepository.getGeneralMemberGenderByEmail(email);
    }

    @Override
    public String getNationality(String email) {return generalMemberRepository.getGeneralMemberNationalityByEmail(email);}
    @Override
    public String getPreferredLanguage(String email) {return generalMemberRepository.getGeneralMemberPreferredLanguageByEmail(email);}
    @Override
    public String getPreferredLanguageAbbreviation(String language) {
        switch (language){
            case "한국어" : return "ko";
            case "日本語" : return "ja";
            default: return "en";
        }
    }
    @Override
    public boolean getMarketingStatus(GeneralMember generalMember) {return generalMemberRepository.getMarketingStatus(generalMember);}

    @Override
    public int changeMarketingStatus(GeneralMember generalMember, Boolean status) {
        return generalMemberRepository.changeMarketingStatusByGeneralMember(generalMember, status);
    }

    @Override
    public int checkIfPasswordMatch(GeneralMember generalMember, String password) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        String currentPassword = generalMemberRepository.getPassword(generalMember);
        boolean checkPassword = encoder.matches(password, currentPassword);
        return checkPassword ? 1 : 0;
    }

    @Override
    public int setNewPassword(GeneralMember generalMember, String password) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        String encodedPassword = encoder.encode(password);
        return generalMemberRepository.setNewPassword(generalMember, encodedPassword);
    }
    @Override
    public int changeName(String name, GeneralMember generalMember) {
        return generalMemberRepository.changeName(name, generalMember);
    }

    @Override
    public int changeBirthday(String birthday, GeneralMember generalMember) {
        LocalDate birth = LocalDate.parse(birthday);
        return generalMemberRepository.changeBirthday(birth, generalMember);
    }

    @Override
    public int changeGender(String gender, GeneralMember generalMember) {
        return generalMemberRepository.changeGender(gender, generalMember);
    }

    @Override
    public int changeNationality(String nationality, GeneralMember generalMember) {
        return generalMemberRepository.changeNationality(nationality, generalMember);
    }

    @Override
    public int changePreferredLanguage(String preferredLanguage, GeneralMember generalMember) {
        return generalMemberRepository.changePreferredLanguage(preferredLanguage, generalMember);
    }
    @Override
    public int deleteAccount(GeneralMember generalMember, DeleteAccountDto deleteAccountDto){
        membersStorageService.deleteMembersStorageByGeneralMember(generalMember);
        searchHistoryService.deleteSearchHistoryByGeneralMember(generalMember);
        loginStatusRepository.deleteByEmail(generalMember.getEmail());
        LeftMember leftMember = new LeftMember(generalMember.getEmail(),
                deleteAccountDto.getType(),
                deleteAccountDto.getReason());
        leftMemberRepository.save(leftMember);
        generalMemberRepository.deleteByGeneralMember(generalMember);
        return 1;
    }
}
