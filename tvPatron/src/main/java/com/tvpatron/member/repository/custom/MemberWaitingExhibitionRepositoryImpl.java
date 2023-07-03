package com.tvpatron.member.repository.custom;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tvpatron.member.domain.MemberWaitingExhibition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

import static com.tvpatron.exhibition.domain.QExhibition.exhibition;
import static com.tvpatron.member.domain.QGeneralMember.generalMember;
import static com.tvpatron.member.domain.QMemberWaitingExhibition.memberWaitingExhibition;

@Repository
public class MemberWaitingExhibitionRepositoryImpl implements com.tvpatron.member.repository.custom.MemberWaitingExhibitionRepositoryCustom {
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
    @Override
    public List<MemberWaitingExhibition> findWaitingExhibitionThatStartedMoreThanSevenDaysAgo(String email, LocalDate sevenDaysAgo) {
        return queryFactory
                .select(memberWaitingExhibition)
                .from(memberWaitingExhibition)
                .where(memberWaitingExhibition.generalMember.email.eq(email).and(memberWaitingExhibition.exhibition.startDate.before(sevenDaysAgo)))
                .fetch();
    }
}
