package com.tvpatron.artwork.repository.custom;

import com.querydsl.core.QueryResults;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.core.types.dsl.StringTemplate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tvpatron.artwork.domain.Artwork;
import com.tvpatron.artwork.domain.ArtworkTag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.tvpatron.artist.domain.QArtist.artist;
import static com.tvpatron.artwork.domain.QArtwork.artwork;
import static com.tvpatron.artwork.domain.QArtworkArtworkGroup.artworkArtworkGroup;
import static com.tvpatron.artwork.domain.QArtworkArtworkTag.artworkArtworkTag;
import static com.tvpatron.artwork.domain.QArtworkTag.artworkTag;
import static com.tvpatron.artwork.domain.QContentsThumbnail.contentsThumbnail;
import static com.tvpatron.artwork.domain.QSound.sound;
import static com.tvpatron.exhibition.domain.QExhibition.exhibition;
import static com.tvpatron.integrate.domain.QArtworkExhibition.artworkExhibition;
import static com.tvpatron.member.domain.QMemberLikedArtwork.memberLikedArtwork;
import static com.tvpatron.member.domain.QMemberSeenArtwork.memberSeenArtwork;

@Repository
public class ArtworkRepositoryImpl implements ArtworkRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public ArtworkRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public List<Artwork> findArtworksByIsApproveAndIsShowingOrderByRegisteredAtDesc(String localization) {
        return  queryFactory
                .select(artworkArtworkGroup.artwork)
                .from(artworkArtworkGroup)
                .where(artworkArtworkGroup.artwork.approve.eq(true)
                        .and(artworkArtworkGroup.artwork.localization.contains(localization))
                        .and(artworkArtworkGroup.artwork.artist.localization.contains(localization))
                        .and(artworkArtworkGroup.artworkGroup.groupName.eq("작품그룹"))
                        .and(artworkArtworkGroup.artworkGroup.localization.eq(localization)))
                .orderBy(artworkArtworkGroup.id.asc())
                .fetch();
    }
    @Override
    public Page<Artwork> findArtworksByKeywordLikeOrderByNumberOfViewsDesc(String keyword, String localization,Pageable pageable) {
        StringTemplate keywordWithoutSpace = Expressions.stringTemplate("replace({0},' ','')", keyword);
        StringTemplate artworkNameWithoutSpace = Expressions.stringTemplate("replace({0},' ','')", artwork.artworkDetails.any().artworkName.toLowerCase());
        StringTemplate artworkTagWithoutSpace = Expressions.stringTemplate("replace({0},' ','')", artwork.artworkArtworkTags.any().artworkTag.tagName);
        StringTemplate nameWithoutSpace = Expressions.stringTemplate("replace({0},' ','')", artwork.artist.artistDetails.any().artistName);
        NumberExpression<Integer> caseArtworkName = new CaseBuilder().when(artworkNameWithoutSpace.contains(keywordWithoutSpace)).then(1).otherwise(0);
        NumberExpression<Integer> caseArtistName = new CaseBuilder().when(nameWithoutSpace.contains(keywordWithoutSpace)).then(1).otherwise(0);
        QueryResults<Artwork> result = queryFactory
                .selectDistinct(artwork)
                .from(artwork)
                .where((artworkNameWithoutSpace.contains(keywordWithoutSpace.toLowerCase())
                        .or(artworkTagWithoutSpace.contains(keywordWithoutSpace.toLowerCase()))
                        .or(nameWithoutSpace.toLowerCase().contains(keywordWithoutSpace.toLowerCase())))
                        .and(artwork.approve.eq(true))
                        .and(artwork.localization.contains(localization))
                        .and(artwork.artist.localization.contains(localization)))
                .orderBy(caseArtistName.desc(),caseArtworkName.desc(),artwork.numberOfViews.desc(),artwork.artist.createTime.desc(),artwork.createTime.desc(), artwork.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetchResults();
        return new PageImpl<>(result.getResults(),pageable,result.getTotal());
    }

    public List<Artwork> findArtworksByExhibitionIdOrderByArtworkExhibitionIdAsc(Long exhibitionId, String localization) {
        return queryFactory
                .select(artwork)
                .from(artwork)
                .join(artwork.artworkExhibitions, artworkExhibition)
                .join(artworkExhibition.exhibition, exhibition)
                .where(exhibition.id.eq(exhibitionId).and(artwork.localization.contains(localization))
                        .and(artwork.artworkExhibitions.any().exhibition.localization.contains(localization))
                        .and(artwork.artist.localization.contains(localization)))
                .orderBy(artworkExhibition.id.asc())
                .fetch();
    }
    public List<Artwork> findArtworksByArtistIdOrderByCreateTimeDesc(Long artistId, String localization) {
        return queryFactory
                .select(artwork)
                .from(artwork)
                .where(artwork.artist.id.eq(artistId).and(artwork.localization.contains(localization))
                        .and(artwork.artist.localization.contains(localization)))
                .orderBy(artwork.createTime.desc(),artwork.id.desc())
                .fetch();
    }

    //Watched Artworks
    @Override
    public Page<Artwork> findSeenArtworksByEmailOrderByIdDesc(String email,String localization, Pageable pageable) {
        QueryResults<Artwork> result = queryFactory
                .select(artwork)
                .from(artwork)
                .join(artwork.memberSeenArtworks, memberSeenArtwork)
                .where(artwork.approve.eq(true)
                        .and(artwork.localization.contains(localization))
                        .and(artwork.artist.localization.contains(localization))
                        .and(memberSeenArtwork.generalMember.email.eq(email)))
                .orderBy(memberSeenArtwork.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetchResults();
        return new PageImpl<>(result.getResults(),pageable,result.getTotal());
    }

    //Liked Artworks
    @Override
    public Page<Artwork> findLikedArtworksByEmail(String email, String localization, Pageable pageable) {
        QueryResults<Artwork> result = queryFactory
                .select(artwork)
                .from(artwork)
                .join(artwork.memberLikedArtworks, memberLikedArtwork)
                .where(artwork.approve.eq(true)
                        .and(artwork.localization.contains(localization))
                        .and(artwork.artist.localization.contains(localization))
                        .and(memberLikedArtwork.generalMember.email.eq(email)))
                .orderBy(memberLikedArtwork.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetchResults();
        return new PageImpl<>(result.getResults(),pageable,result.getTotal());
    }

    @Override
    public List<Artwork> findByTags(List<ArtworkTag> artworkTags, List<Artwork> art, Integer limit, String localization){
        return queryFactory
                .selectDistinct(artworkArtworkTag.artwork)
                .from(artworkArtworkTag)
                .join(artworkArtworkTag.artwork, artwork)
                .join(artworkArtworkTag.artworkTag, artworkTag)
                .where(artworkTag.in(artworkTags).and(artwork.notIn(art))
//                        .and(artwork.artist.ne(art.getArtist())
                                .and(artwork.localization.contains(localization)
                                        .and(artwork.artist.localization.contains(localization)))
                )
                .groupBy(artworkArtworkTag.artwork)
                .orderBy(artworkArtworkTag.count().desc(),
                        artwork.artworkArtworkTags.size().asc())
                .limit(limit).fetch();
    }
}
