package digital.patron.webmobile.exhibition.repository.custom;

import com.querydsl.core.QueryResults;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.core.types.dsl.StringTemplate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import digital.patron.webmobile.exhibition.domain.Exhibition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import static digital.patron.webmobile.exhibition.domain.QExhibition.exhibition;
import static digital.patron.webmobile.integrate.domain.QArtistExhibition.artistExhibition;

@Repository
public class ExhibitionRepositoryImpl implements ExhibitionRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public ExhibitionRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<Exhibition> findExhibitionsByKeyword(String keyword, String localization, Pageable pageable) {
        StringTemplate keywordWithoutSpace = Expressions.stringTemplate("replace({0},' ','')", keyword);
        StringTemplate exhibitionNameWithoutSpace = Expressions.stringTemplate("replace({0},' ','')", exhibition.exhibitionDetails.any().exhibitionName);
        StringTemplate exhibitionTagWithoutSpace = Expressions.stringTemplate("replace({0},' ','')",  exhibition.exhibitionExhibitionTags.any().exhibitionTag.tagName);
        StringTemplate artistNameWithoutSpace = Expressions.stringTemplate("replace({0},' ','')",artistExhibition.artist.artistDetails.any().artistName);
        NumberExpression<Integer> caseExhibitionName = new CaseBuilder().when(exhibitionNameWithoutSpace.containsIgnoreCase(keywordWithoutSpace)).then(1).otherwise(0);
        NumberExpression<Integer> caseExhibitionArtistName = new CaseBuilder().when(artistNameWithoutSpace.containsIgnoreCase(keyword)).then(1).otherwise(0);
        QueryResults<Exhibition> result = queryFactory
                .selectDistinct(exhibition)
                .from(exhibition)
                .join(exhibition.artistExhibitions, artistExhibition)
                .where((exhibitionNameWithoutSpace.containsIgnoreCase(keywordWithoutSpace)
                        .or(exhibitionTagWithoutSpace.containsIgnoreCase(keywordWithoutSpace))
                        .or(artistNameWithoutSpace.toLowerCase().containsIgnoreCase(keywordWithoutSpace)))
                        .and(exhibition.localization.contains(localization)
                                .and(exhibition.artworkExhibitions.isNotEmpty())
                                .and(artistExhibition.isNotNull())
                                .and(exhibition.artworkExhibitions.any().artwork.localization.contains(localization))
                                .and(exhibition.artistExhibitions.any().artist.localization.contains(localization))))
                .orderBy(caseExhibitionArtistName.desc(),
                        caseExhibitionName.desc(),exhibition.numberOfViews.desc(),exhibition.createTime.desc(), exhibition.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetchResults();
        return new PageImpl<>(result.getResults(),pageable,result.getTotal());
    }

    @Override
    public Page<Exhibition> getAllExhibitionsSortedByParameter(String sortBy, String localization, Pageable pageable) {
        QueryResults<Exhibition> result =  queryFactory
                .selectDistinct(exhibition)
                .from(exhibition)
                .where(exhibition.localization.contains(localization)
                        .and(exhibition.artworkExhibitions.isNotEmpty())
                        .and(exhibition.artistExhibitions.isNotEmpty())
                        .and(exhibition.artistExhibitions.any().artist.localization.contains(localization))
                        .and(exhibition.artworkExhibitions.any().artwork.localization.contains(localization)))
                .orderBy("최신순".equalsIgnoreCase(sortBy) ? exhibition.createTime.desc() :
                        ("인기순".equalsIgnoreCase(sortBy) ? exhibition.numberOfViews.desc() :
                        ("공유순".equalsIgnoreCase(sortBy) ? exhibition.numberOfShares.desc() :
                                exhibition.createTime.desc())))
                .orderBy(exhibition.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetchResults();
        return new PageImpl<>(result.getResults(),pageable,result.getTotal());
    }
//    @Override
//    public List<Exhibition> findSimilarExhibitions(String localization, List<ExhibitionTag> exhibitionTags) {
//        return queryFactory
//                .select(exhibitionExhibitionTag.exhibition)
//                .from(exhibitionExhibitionTag)
//                .where(exhibitionExhibitionTag.exhibitionTag.in(exhibitionTags)
//                        .and(exhibitionExhibitionTag.exhibition.localization.contains(localization))
//                        .and(exhibitionExhibitionTag.exhibition.artworkExhibitions.isNotEmpty())
//                        .and(exhibitionExhibitionTag.exhibition.artistExhibitions.isNotEmpty())
//                        .and(exhibitionExhibitionTag.exhibition.artistExhibitions.any().artist.localization.contains(localization))
//                        .and(exhibitionExhibitionTag.exhibition.artworkExhibitions.any().artwork.localization.contains(localization)))
//                .groupBy(exhibitionExhibitionTag.exhibition)
//                .orderBy(exhibitionExhibitionTag.exhibition.count().desc(),exhibitionExhibitionTag.exhibition.createTime.desc(),exhibitionExhibitionTag.exhibition.id.desc())
//                .limit(15)
//                .fetch();
//    }
    @Override
    public Exhibition findByLocalization(Long id, String localization){
        return queryFactory
                .select(exhibition)
                .from(exhibition)
                .where(exhibition.id.eq(id)
                        .and(exhibition.localization.contains(localization))
                        .and(exhibition.artworkExhibitions.isNotEmpty())
                        .and(exhibition.artistExhibitions.isNotEmpty())
                        .and(exhibition.artistExhibitions.any().artist.localization.contains(localization))
                        .and(exhibition.artworkExhibitions.any().artwork.localization.contains(localization)))
                .fetchFirst();
    }
}
