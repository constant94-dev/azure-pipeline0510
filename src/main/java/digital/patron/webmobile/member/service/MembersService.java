package digital.patron.webmobile.member.service;

import digital.patron.webmobile.member.domain.DisabledMember;
import digital.patron.webmobile.member.domain.GeneralMember;
import digital.patron.webmobile.member.domain.LeftMember;
import digital.patron.webmobile.member.dto.DeleteAccountDto;

import java.util.Optional;

public interface MembersService {
    //get user by ID
    GeneralMember getById(Long id);

    Optional<LeftMember> isMemberALeftMember(String email);

    Optional<GeneralMember> getByEmail(String email);

    Optional<String> getProviderByEmail(String email);

    DisabledMember getDisabledMemberByEmail(String email);

    Optional<String> getDisabledMemberProviderByEmail(String email);

    //get nickname of device
    String getNickName(String email);

    String getBirth(String email);

    String getGender(String email);

    String getNationality(String email);

    String getPreferredLanguage(String email);

    String getPreferredLanguageAbbreviation(String language);

    boolean getMarketingStatus(GeneralMember generalMember);

    int changeMarketingStatus(GeneralMember generalMember, Boolean status);

    int checkIfPasswordMatch(GeneralMember generalMember, String password);

    int setNewPassword(GeneralMember generalMember, String password);

    int changeName(String name, GeneralMember generalMember);

    int changeBirthday(String birthday, GeneralMember generalMember);

    int changeGender(String gender, GeneralMember generalMember);

    int changeNationality(String nationality, GeneralMember generalMember);

    int changePreferredLanguage(String preferredLanguage, GeneralMember generalMember);

    int deleteAccount(GeneralMember generalMember, DeleteAccountDto deleteAccountDto);
}
