package com.tvpatron.artwork.repository.custom;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tvpatron.artwork.domain.ArtworkTag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import static com.tvpatron.artwork.domain.QArtwork.artwork;
import static com.tvpatron.artwork.domain.QArtworkArtworkTag.artworkArtworkTag;
import static com.tvpatron.artwork.domain.QArtworkTag.artworkTag;

@Repository
public class ArtworkArtworkTagRepositoryImpl implements ArtworkArtworkTagRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public ArtworkArtworkTagRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }
    @Override
    public Page<ArtworkTag> findTop8TagsWithMostArtworks(Pageable pageable) {
        QueryResults<ArtworkTag> result = queryFactory
                .select(artworkTag)
                .from(artworkTag)
                .orderBy(artworkTag.artworkArtworkTags.size().desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetchResults();
        return new PageImpl<>(result.getResults(),pageable,result.getTotal());
    }
    @Override
    public Long getTagCountByTagName(String localization, String tagName) {
        return queryFactory.select(artworkTag)
                .from(artworkTag)
                .leftJoin(artworkTag.artworkArtworkTags, artworkArtworkTag)
                .leftJoin(artworkArtworkTag.artwork, artwork)
                .where(artwork.localization.contains(localization)
                        .and(artwork.artworkExhibitions.any().exhibition.localization.contains(localization))
                        .and(artworkTag.tagName.equalsIgnoreCase(tagName)))
                .stream().count();
    }
}
