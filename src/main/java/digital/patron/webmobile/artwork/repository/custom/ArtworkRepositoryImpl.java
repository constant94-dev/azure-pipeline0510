package digital.patron.webmobile.artwork.repository.custom;

import com.querydsl.core.QueryResults;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.core.types.dsl.StringTemplate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import digital.patron.webmobile.artwork.domain.Artwork;
import digital.patron.webmobile.artwork.domain.ArtworkTag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

import static digital.patron.webmobile.artwork.domain.QArtwork.artwork;
import static digital.patron.webmobile.artwork.domain.QArtworkArtworkGroup.artworkArtworkGroup;
import static digital.patron.webmobile.artwork.domain.QArtworkArtworkTag.artworkArtworkTag;
import static digital.patron.webmobile.artwork.domain.QArtworkTag.artworkTag;
import static digital.patron.webmobile.member.domain.QMemberLikedArtwork.memberLikedArtwork;
import static digital.patron.webmobile.member.domain.QMemberSeenArtwork.memberSeenArtwork;

@Repository
public class ArtworkRepositoryImpl implements ArtworkRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public ArtworkRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<Artwork> findArtworksByKeyword(String keyword, String localization, Pageable pageable) {
        StringTemplate keywordWithoutSpace = Expressions.stringTemplate("replace({0},' ','')", keyword);
        StringTemplate artworkNameWithoutSpace = Expressions.stringTemplate("replace({0},' ','')", artwork.artworkDetails.any().artworkName);
        StringTemplate artworkTagWithoutSpace = Expressions.stringTemplate("replace({0},' ','')", artwork.artworkArtworkTags.any().artworkTag.tagName);
        StringTemplate nameWithoutSpace = Expressions.stringTemplate("replace({0},' ','')", artwork.artist.artistDetails.any().artistName);
        NumberExpression<Integer> caseArtworkName = new CaseBuilder().when(artworkNameWithoutSpace.containsIgnoreCase(keywordWithoutSpace)).then(1).otherwise(0);
        NumberExpression<Integer> caseArtistName = new CaseBuilder().when(nameWithoutSpace.contains(keywordWithoutSpace)).then(1).otherwise(0);
        QueryResults<Artwork> result = queryFactory
                .selectDistinct(artwork)
                .from(artwork)
                .where((artworkNameWithoutSpace.containsIgnoreCase(keywordWithoutSpace.toLowerCase())
                        .or(artworkTagWithoutSpace.containsIgnoreCase(keywordWithoutSpace.toLowerCase()))
                        .or(nameWithoutSpace.toLowerCase().containsIgnoreCase(keywordWithoutSpace.toLowerCase())))
                        .and(artwork.approve.eq(true))
                        .and(artwork.localization.contains(localization))
                        .and(artwork.artist.localization.contains(localization)))
                .orderBy(caseArtistName.desc(),caseArtworkName.desc(),artwork.numberOfViews.desc(),artwork.artist.createTime.desc(),artwork.createTime.desc(),artwork.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetchResults();
        return new PageImpl<>(result.getResults(),pageable,result.getTotal());
    }

    //Watched Artworks
    @Override
    public Page<Artwork> findSeenArtworksByEmailOrderByIdDesc(String email, String localization, Pageable pageable) {
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
    public List<Artwork> findArtworksByIsApproveAndIsShowingOrderByRegisteredAtDesc(String localization) {
        return  queryFactory
                .select(artworkArtworkGroup.artwork)
                .from(artworkArtworkGroup)
                .where(artworkArtworkGroup.artwork.approve.eq(true)
                        .and(artworkArtworkGroup.artwork.localization.contains(localization))
                        .and(artworkArtworkGroup.artwork.artist.localization.contains(localization))
                        .and(artworkArtworkGroup.artworkGroup.groupName.eq("작품그룹"))
                        .and(artworkArtworkGroup.artworkGroup.localization.eq(localization))
                )
                .orderBy(artworkArtworkGroup.id.asc())
                .fetch();
    }
    @Override
    public List<Artwork> findAllByIdAndLocalization(String localization, List<Long> id) {
        return queryFactory
                .select(artwork)
                .from(artwork)
                .where(artwork.approve.eq(true)
                        .and(artwork.localization.contains(localization))
                        .and(artwork.artist.localization.contains(localization))
                        .and(artwork.id.in(id)))
                .fetch();
    }
    @Override
    public Integer findAllByLocalization(String localization) {
        return queryFactory
                .select(artwork)
                .from(artwork)
                .where(artwork.approve.eq(true)
//                        .and(artwork.localization.contains(localization))
//                        .and(artwork.artist.localization.contains(localization))
                        )
                .fetch().size();
    }
    @Override
    public Artwork findByLocalization(String localization, Long id) {
        return queryFactory
                .select(artwork)
                .from(artwork)
                .where(artwork.approve.eq(true)
                        .and(artwork.localization.contains(localization))
                        .and(artwork.artist.localization.contains(localization))
                        .and(artwork.id.eq(id)))
                .fetchFirst();
    }
    @Override
    public List<Artwork> findSimilarArtworks(String localization, List<ArtworkTag> artworkTags, Artwork artwork) {
        return queryFactory
                .select(artworkArtworkTag.artwork)
                .from(artworkArtworkTag)
                .where(artworkArtworkTag.artworkTag.in(artworkTags)
                        .and(artworkArtworkTag.artwork.localization.contains(localization))
                        .and(artworkArtworkTag.artwork.artist.ne(artwork.getArtist()))
                        .and(artworkArtworkTag.artwork.artist.localization.contains(localization))
                        .and(artworkArtworkTag.artwork.approve.eq(true)))
                .groupBy(artworkArtworkTag.artwork)
                .orderBy(artworkArtworkTag.artwork.count().desc(),artworkArtworkTag.artwork.createTime.desc(),artworkArtworkTag.artwork.id.desc())
                .limit(5)
                .fetch();
    }
    @Override
    public List<Artwork> findRandomLimitedArtworksOfDifferentArtist(String localization, Integer limit, Artwork initArtwork) {
        return queryFactory
                .select(artwork)
                .from(artwork)
                .where(artwork.approve.eq(true)
                        .and(artwork.localization.contains(localization))
                        .and(artwork.artist.localization.contains(localization))
                        .and(artwork.artist.ne(initArtwork.getArtist())))
                .limit(limit)
                .fetch();
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
    @Override
    public Page<Artwork> getAllArtworksSortedByParameter(String sortBy, String localization, Pageable pageable) {
        QueryResults<Artwork> result =  queryFactory
                .selectDistinct(artwork)
                .from(artwork)
                .where(artwork.localization.contains(localization)
                        .and(artwork.approve.eq(true)).and(artwork.artist.localization.contains(localization)))
                .orderBy("최신순".equalsIgnoreCase(sortBy) ? artwork.createTime.desc() :
                        ("인기순".equalsIgnoreCase(sortBy) ? artwork.numberOfViews.desc() :
                                ("공유순".equalsIgnoreCase(sortBy) ? artwork.numberOfShares.desc() :
                                        artwork.createTime.desc())))
                .orderBy(artwork.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetchResults();
        return new PageImpl<>(result.getResults(),pageable,result.getTotal());
    }
}
