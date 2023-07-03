package com.tvpatron.member.repository.custom;

import com.tvpatron.member.domain.MemberWaitingExhibition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface MemberWaitingExhibitionRepositoryCustom {
    Page<MemberWaitingExhibition> findWaitingExhibitionByEmailOrderByTimeLeft(String deviceId,String localization, Pageable pageable);
    List<MemberWaitingExhibition> findWaitingExhibitionThatStartedMoreThanSevenDaysAgo(String email, LocalDate sevedDaysAgo);


}
