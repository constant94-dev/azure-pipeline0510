package digital.patron.webmobile.member.service;

import digital.patron.webmobile.member.domain.GeneralMember;

import java.util.List;

public interface SearchHistoryService {
    List<String> getSearchHistoryKeywords(GeneralMember generalMember);

    void saveSearchKeyword(GeneralMember generalMember, String keyword);

    Integer deleteSearchHistoryByGeneralMember(GeneralMember generalMember);

    Integer deleteSearchHistoryByKeyword(GeneralMember generalMember, String keyword);
}
