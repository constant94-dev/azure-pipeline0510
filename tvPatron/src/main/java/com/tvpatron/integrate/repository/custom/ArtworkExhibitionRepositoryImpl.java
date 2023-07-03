package com.tvpatron.integrate.repository.custom;

import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.stereotype.Repository;

import static com.tvpatron.integrate.domain.QArtworkExhibition.artworkExhibition;

@Repository
public class ArtworkExhibitionRepositoryImpl implements ArtworkExhibitionRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public ArtworkExhibitionRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public Long findExhibitionIdByArtworkIdAndMostNumberOfViews(Long artworkId) {
        return queryFactory
                .select(artworkExhibition.exhibition.id)
                .from(artworkExhibition)
                .where(artworkExhibition.artwork.id.eq(artworkId))
                .orderBy(artworkExhibition.exhibition.numberOfViews.desc())
                .fetchFirst();
    }
}
