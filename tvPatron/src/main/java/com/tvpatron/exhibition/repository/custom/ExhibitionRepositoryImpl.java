package com.tvpatron.exhibition.repository.custom;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tvpatron.artwork.domain.Artwork;
import com.tvpatron.artwork.domain.ArtworkTag;
import com.tvpatron.exhibition.domain.Exhibition;
import com.tvpatron.exhibition.domain.ExhibitionTag;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.tvpatron.artist.domain.QArtist.artist;
import static com.tvpatron.artwork.domain.QArtwork.artwork;
import static com.tvpatron.artwork.domain.QArtworkArtworkTag.artworkArtworkTag;
import static com.tvpatron.artwork.domain.QArtworkTag.artworkTag;
import static com.tvpatron.exhibition.domain.QExhibition.exhibition;
import static com.tvpatron.exhibition.domain.QExhibitionExhibitionTag.exhibitionExhibitionTag;
import static com.tvpatron.exhibition.domain.QExhibitionTag.exhibitionTag;
import static com.tvpatron.integrate.domain.QArtistExhibition.artistExhibition;
import static com.tvpatron.integrate.domain.QArtworkExhibition.artworkExhibition;

@Repository
public class ExhibitionRepositoryImpl implements ExhibitionRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public ExhibitionRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public List<Exhibition> findByTags(Exhibition exh, String localization, List<ExhibitionTag> exhibitionTags){
        return queryFactory
                .selectDistinct(exhibitionExhibitionTag.exhibition)
                .from(exhibitionExhibitionTag)
                .join(exhibitionExhibitionTag.exhibition, exhibition)
                .join(exhibitionExhibitionTag.exhibitionTag, exhibitionTag)
                .where(exhibitionTag.in(exhibitionTags).and(exhibition.ne(exh))
                        .and(exhibition.localization.contains(localization)
                                .and(exhibition.artworkExhibitions.any().artwork.localization.contains(localization))
                                .and(exhibition.artistExhibitions.any().artist.localization.contains(localization)))
                )
                .groupBy(exhibitionExhibitionTag.exhibition)
                .orderBy(exhibitionExhibitionTag.count().desc(),
                        exhibition.exhibitionExhibitionTags.size().asc())
                .limit(10).fetch();
    }
}
