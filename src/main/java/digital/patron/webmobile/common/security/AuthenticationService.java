package digital.patron.webmobile.common.security;

import digital.patron.webmobile.member.domain.DisabledMember;
import digital.patron.webmobile.member.domain.GeneralMember;
import digital.patron.webmobile.member.dto.MemberDto;

public interface AuthenticationService {
    void login(GeneralMember generalMember);

    GeneralMember create(MemberDto memberDto, String localization);

    GeneralMember moveDisabledToGeneral(DisabledMember disabledMember);

    int createTemp(String email, String authKey);

    int verifyEmail(String email, String authKey);

    int resetPassword(String email, String password);

    int deleteVerificationCode(String email);
}
