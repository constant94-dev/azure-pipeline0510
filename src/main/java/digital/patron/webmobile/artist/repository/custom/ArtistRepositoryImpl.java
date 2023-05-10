package digital.patron.webmobile.artist.repository.custom;

import com.querydsl.core.QueryResults;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.core.types.dsl.StringTemplate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import digital.patron.webmobile.artist.domain.Artist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import static digital.patron.webmobile.artist.domain.QArtist.artist;
import static digital.patron.webmobile.artwork.domain.QArtwork.artwork;
import static digital.patron.webmobile.member.domain.QMemberLikedArtist.memberLikedArtist;
import static digital.patron.webmobile.member.domain.QMemberLikedArtwork.memberLikedArtwork;

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
        NumberExpression<Integer> caseArtistContainsName = new CaseBuilder().when(nameWithoutSpace.contains(keywordWithoutSpace)).then(1).otherwise(0);
        NumberExpression<Integer> caseArtistEqualsName = new CaseBuilder().when(nameWithoutSpace.eq(keywordWithoutSpace)).then(1).otherwise(0);
        QueryResults<Artist> result = queryFactory
                .selectDistinct(artist)
                .from(artist)
                .where((nameWithoutSpace.containsIgnoreCase(keywordWithoutSpace)
                        .or(artist.artistArtistTags.any().artistTag.tagName.equalsIgnoreCase(keyword)))
                        .and(artist.localization.contains(localization)))
                .orderBy(artist.artworks.size().desc(),caseArtistContainsName.desc(),caseArtistEqualsName.desc(),artist.numberOfLikes.desc(),artist.createTime.desc(), artist.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetchResults();
        return new PageImpl<>(result.getResults(),pageable,result.getTotal());
    }



    @Override
    public Page<Artist> getSortedArtists(Pageable pageable, String localization, String sortBy) {
        QueryResults<Artist> result = queryFactory
                .select(artist)
                .from(artist)
                .where(artist.localization.contains(localization))
                .orderBy("최신순".equalsIgnoreCase(sortBy) ? artist.createTime.desc() :
                        ("인기순".equalsIgnoreCase(sortBy) ? artist.numberOfLikes.desc() :
                                ("가나다순".equalsIgnoreCase(sortBy) ? artist.artistDetails.any().artistName.asc() :
                                        ("공유순".equalsIgnoreCase(sortBy) ? artist.numberOfShares.desc() :
                                        artist.createTime.desc()))), artist.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetchResults();
        return new PageImpl<>(result.getResults(),pageable,result.getTotal());
    }

    //LikedArtworksArtists
    @Override
    public Page<Artist> findArtistsOfLikedArtworksByEmail(String email, String localization, Pageable pageable) {
        QueryResults<Artist> result = queryFactory
                .select(artist)
                .from(artwork)
                .join(artwork.memberLikedArtworks, memberLikedArtwork)
                .join(artwork.artist, artist)
                .where(artwork.approve.eq(true)
                        .and(artwork.localization.contains(localization))
                        .and(memberLikedArtwork.generalMember.email.eq(email)))
                .orderBy(memberLikedArtwork.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetchResults();
        return new PageImpl<>(result.getResults(),pageable,result.getTotal());
    }

}
