package digital.patron.webmobile.member.repository.custom;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.impl.JPAQueryFactory;
import digital.patron.webmobile.member.domain.MemberWaitingExhibition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import static digital.patron.webmobile.member.domain.QMemberWaitingExhibition.memberWaitingExhibition;

@Repository
public class MemberWaitingExhibitionRepositoryImpl implements MemberWaitingExhibitionRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    public MemberWaitingExhibitionRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    //Artworks in Collection
    @Override
    public Page<MemberWaitingExhibition> findWaitingExhibitionByEmailOrderByTimeLeft(String email, String localization, Pageable pageable) {
        QueryResults<MemberWaitingExhibition> result = queryFactory
                .select(memberWaitingExhibition)
                .from(memberWaitingExhibition)
                .where(memberWaitingExhibition.generalMember.email.eq(email))
                .orderBy(memberWaitingExhibition.exhibition.startDate.asc(),memberWaitingExhibition.id.asc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetchResults();
        return new PageImpl<>(result.getResults(),pageable,result.getTotal());
    }

}
