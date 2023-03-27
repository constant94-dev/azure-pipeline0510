package digital.patron.webmobile.member.service;

import digital.patron.webmobile.member.domain.GeneralMember;
import digital.patron.webmobile.member.domain.SearchHistory;
import digital.patron.webmobile.member.repository.SearchHistoryRepository;
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
public class SearchHistoryServiceImpl implements SearchHistoryService {
    private final SearchHistoryRepository searchHistoryRepository;

    @Override
    public List<String> getSearchHistoryKeywords(GeneralMember generalMember){
        List<SearchHistory> searchHistoryList = searchHistoryRepository.findByGeneralMember(generalMember);
        List<String> searchHistoryKeywords = searchHistoryList.stream().map(SearchHistory::getKeyword).collect(Collectors.toList());
        return searchHistoryKeywords;
    }
    @Override
    public void saveSearchKeyword(GeneralMember generalMember, String keyword){
        searchHistoryRepository.deleteByGeneralMemberAndKeyword(generalMember,keyword);
        List<SearchHistory> searchHistorieList = searchHistoryRepository.findByGeneralMember(generalMember);
        if(searchHistorieList.size()>=100){
            Long oldestSearchId = searchHistorieList.stream().min(Comparator.comparing(SearchHistory::getId)).get().getId();
            searchHistoryRepository.deleteById(oldestSearchId);
        }
        SearchHistory searchHistory = new SearchHistory(keyword);
        searchHistory.setGeneralMember(generalMember);
        searchHistoryRepository.save(searchHistory);
    }
    @Override
    public Integer deleteSearchHistoryByGeneralMember(GeneralMember generalMember){
        return searchHistoryRepository.deleteByGeneralMember(generalMember);
    }
    @Override
    public Integer deleteSearchHistoryByKeyword(GeneralMember generalMember, String keyword){
        return searchHistoryRepository.deleteByGeneralMemberAndKeyword(generalMember, keyword);
    }
}
