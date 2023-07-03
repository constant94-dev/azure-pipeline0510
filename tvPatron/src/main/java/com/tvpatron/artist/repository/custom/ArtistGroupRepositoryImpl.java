package com.tvpatron.artist.repository.custom;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tvpatron.artist.domain.Artist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import static com.tvpatron.artist.domain.QArtist.artist;
import static com.tvpatron.artist.domain.QArtistArtistGroup.artistArtistGroup;
import static com.tvpatron.artist.domain.QArtistGroup.artistGroup;

@Repository
public class ArtistGroupRepositoryImpl implements ArtistGroupRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public ArtistGroupRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<Artist> findArtistsByArtistGroupNameOrderByArtistArtistGroupIdAsc(String localization, Pageable pageable) {
        QueryResults<Artist> result = queryFactory
                .select(artist)
                .from(artistGroup)
                .join(artistGroup.artistArtistGroups, artistArtistGroup)
                .join(artistArtistGroup.artist, artist)
                .where(artistGroup.localization.contains(localization)
                        .and(artist.localization.contains(localization)))
                .orderBy(artistArtistGroup.id.asc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetchResults();
        return new PageImpl<>(result.getResults(),pageable,result.getTotal());
    }
}
