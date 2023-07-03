package com.tvpatron.member.service;

import com.tvpatron.member.domain.GeneralMember;
import com.tvpatron.member.dto.MemberDto;

public interface MemberService {
    //get generalMember by device ID
    GeneralMember getMemberByEmail(String email);

    String getPreferredLanguage(String email);

    Integer deleteSearchHistoryByGeneralMember(GeneralMember generalMember);

    void authenticateUser(MemberDto memberDto);
}
