package com.tvpatron.artist.repository.custom;

import com.querydsl.core.QueryResults;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.core.types.dsl.StringTemplate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tvpatron.artist.domain.Artist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import static com.tvpatron.artist.domain.QArtist.artist;
import static com.tvpatron.member.domain.QMemberLikedArtist.memberLikedArtist;


@Repository
public class ArtistRepositoryImpl implements ArtistRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public ArtistRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<Artist> findArtistsByKeywordLikeOrderByArtistIdAsc(String keyword, String localization, Pageable pageable) {
        StringTemplate nameWithoutSpace = Expressions.stringTemplate("replace({0},' ','')", artist.artistDetails.any().artistName);
        StringTemplate keywordWithoutSpace = Expressions.stringTemplate("replace({0},' ','')", keyword);
        StringTemplate tagWithoutSpace = Expressions.stringTemplate("replace({0},' ','')", artist.artistArtistTags.any().artistTag.tagName);
        NumberExpression<Integer> caseArtistContainsName = new CaseBuilder().when(nameWithoutSpace.contains(keywordWithoutSpace)).then(1).otherwise(0);
        NumberExpression<Integer> caseArtistEqualsName = new CaseBuilder().when(nameWithoutSpace.eq(keywordWithoutSpace)).then(1).otherwise(0);
        QueryResults<Artist> result = queryFactory
                .selectDistinct(artist)
                .from(artist)
                .where((nameWithoutSpace.containsIgnoreCase(keywordWithoutSpace)
                        .or(tagWithoutSpace.equalsIgnoreCase(keyword)))
                        .and(artist.localization.contains(localization)))
                .orderBy(artist.artworks.size().desc(),caseArtistContainsName.desc(),caseArtistEqualsName.desc(),artist.numberOfLikes.desc(),artist.createTime.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetchResults();
        return new PageImpl<>(result.getResults(),pageable,result.getTotal());
    }
    @Override
    public Page<Artist> findArtistsSorted(String localization, Pageable pageable) {
        QueryResults<Artist> result = queryFactory
                .select(artist)
                .from(artist)
                .where(artist.localization.contains(localization))
                .orderBy(artist.createTime.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetchResults();
        return new PageImpl<>(result.getResults(),pageable,result.getTotal());
    }

    @Override
    public Page<Artist> findLikedArtistsByEmail(String email, String localization, Pageable pageable) {
        QueryResults<Artist> result = queryFactory
                .select(artist)
                .from(artist)
                .join(artist.memberLikedArtists, memberLikedArtist)
                .where(artist.localization.contains(localization)
                        .and(artist.artworks.any().localization.contains(localization))
                        .and(memberLikedArtist.generalMember.email.eq(email)))
                .orderBy(memberLikedArtist.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetchResults();
        return new PageImpl<>(result.getResults(),pageable,result.getTotal());
    }

}
