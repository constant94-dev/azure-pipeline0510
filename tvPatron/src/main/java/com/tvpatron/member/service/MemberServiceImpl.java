package com.tvpatron.member.service;

import com.tvpatron.member.domain.GeneralMember;
import com.tvpatron.member.dto.MemberDto;
import com.tvpatron.member.repository.GeneralMemberRepository;
import com.tvpatron.member.repository.SearchHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class MemberServiceImpl implements MemberService {
    private final GeneralMemberRepository generalMemberRepository;
    private final SearchHistoryRepository searchHistoryRepository;

    //get generalMember by device ID
    @Override
    public GeneralMember getMemberByEmail(String email) {
        return generalMemberRepository.findByEmail(email).orElseThrow(() -> new NoSuchElementException());
    }

    @Override
    public String getPreferredLanguage(String email) {
        GeneralMember member = generalMemberRepository.findByEmail(email).orElseThrow(() -> new NoSuchElementException());
        String preferredLanguage = member.getPreferredLanguage();
        switch (preferredLanguage) {
            case "한국어":
                preferredLanguage = "ko";
                break;
            case "日本語":
                preferredLanguage = "ja";
                break;
            default:
                preferredLanguage = "en";
        }
        return preferredLanguage;
    }

    @Override
    public Integer deleteSearchHistoryByGeneralMember(GeneralMember generalMember) {
        return searchHistoryRepository.deleteByGeneralMember(generalMember);
    }

    @Override
    public void authenticateUser(MemberDto memberDto) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                memberDto.getDeviceId(),
                "patronSecretCredentials",
                List.of(new SimpleGrantedAuthority("ROLE_USER")));
        SecurityContext context = SecurityContextHolder.getContext();
        context.setAuthentication(token);
    }
}
