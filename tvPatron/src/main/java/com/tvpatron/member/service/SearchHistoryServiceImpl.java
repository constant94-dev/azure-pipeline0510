package com.tvpatron.member.service;

import com.tvpatron.member.domain.GeneralMember;
import com.tvpatron.member.domain.SearchHistory;
import com.tvpatron.member.repository.SearchHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class SearchHistoryServiceImpl implements SearchHistoryService{
    private final SearchHistoryRepository searchHistoryRepository;
    @Override
    public List<String> getSearchHistoryKeywords(GeneralMember generalMember){
        List<String> keywords = searchHistoryRepository.findByGeneralMember(generalMember).stream().map(SearchHistory::getKeyword).collect(Collectors.toList());
        return keywords.size()>20 ? keywords.subList(0,20) : keywords;
    }
    @Override
    public void saveSearchKeyword(GeneralMember generalMember, String keyword){
        searchHistoryRepository.deleteByGeneralMemberAndKeyword(generalMember,keyword);
        List<SearchHistory> searchHistories = searchHistoryRepository.findByGeneralMember(generalMember);
        //delete oldest search history if size over 100
        if(searchHistories.size()>=100){
            searchHistoryRepository.deleteById(searchHistories.stream().min(Comparator.comparing(SearchHistory::getId)).get().getId());
        }
        SearchHistory searchHistory = new SearchHistory(keyword);
        searchHistory.setGeneralMember(generalMember);
        searchHistoryRepository.save(searchHistory);
    }

}
