package digital.patron.webmobile.member.repository.custom;

import digital.patron.webmobile.member.domain.MemberWaitingExhibition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MemberWaitingExhibitionRepositoryCustom {
    Page<MemberWaitingExhibition> findWaitingExhibitionByEmailOrderByTimeLeft(String email, String localization, Pageable pageable);

}
