package com.tvpatron.member.service;

import com.tvpatron.member.domain.GeneralMember;

import java.util.List;

public interface SearchHistoryService {
    List<String> getSearchHistoryKeywords(GeneralMember generalMember);

    void saveSearchKeyword(GeneralMember generalMember, String keyword);
}
