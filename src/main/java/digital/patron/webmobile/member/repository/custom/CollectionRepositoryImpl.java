package digital.patron.webmobile.member.repository.custom;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.impl.JPAQueryFactory;
import digital.patron.webmobile.member.domain.Collection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import static digital.patron.webmobile.member.domain.QCollection.collection;

@Repository
public class CollectionRepositoryImpl implements CollectionRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    public CollectionRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<Collection> findCollectionArtworksByEmailOrderByIdDesc(String email, Pageable pageable) {
        QueryResults<Collection> result = queryFactory
                .select(collection)
                .from(collection)
                .where(collection.generalMember.email.eq(email)
                        .and(collection.exhibition.isNull()))
                .orderBy(collection.updateTime.desc(),collection.collectionName.asc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetchResults();
        return new PageImpl<>(result.getResults(),pageable,result.getTotal());
    }

    @Override
    public Page<Collection> findCollectionsByEmail(String email, String localization, Pageable pageable) {
        QueryResults<Collection> result = queryFactory
                .select(collection)
                .from(collection)
                .where((collection.generalMember.email.eq(email))
                        .and(collection.exhibition.isNotNull())
                        .and(collection.exhibition.localization.contains(localization))
                        .and(collection.exhibition.artistExhibitions.isNotEmpty())
                        .and(collection.exhibition.artworkExhibitions.isNotEmpty())
                        .and(collection.exhibition.artworkExhibitions.any().artwork.localization.contains(localization))
                        .and(collection.exhibition.artistExhibitions.any().artist.localization.contains(localization)))
                .orderBy(collection.updateTime.desc(), collection.collectionName.asc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetchResults();
        return new PageImpl<>(result.getResults(),pageable,result.getTotal());
    }
}
