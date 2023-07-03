package com.tvpatron.artwork.repository.custom;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tvpatron.artwork.domain.Artwork;
import com.tvpatron.artwork.domain.SoundTag;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.tvpatron.artwork.domain.QArtwork.artwork;
import static com.tvpatron.artwork.domain.QSound.sound;
import static com.tvpatron.artwork.domain.QSoundSoundTag.soundSoundTag;
import static com.tvpatron.artwork.domain.QSoundTag.soundTag;

@Repository
public class SoundRepositoryImpl implements SoundRepositoryCustom{
    private final JPAQueryFactory queryFactory;

    public SoundRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }
    @Override
    public List<Artwork> findByTags(List<SoundTag> soundTags, List<Artwork> art, Integer limit, String localization){
        return queryFactory.selectDistinct(artwork)
                .from(soundSoundTag)
                .join(soundSoundTag.sound, sound)
                .join(soundSoundTag.soundTag, soundTag)
                .join(sound.artworks, artwork)
                .where(soundTag.in(soundTags)
                        .and(artwork.notIn(art))
//                        .and(artwork.artist.ne(artgetArtist()))
                        .and(artwork.localization.containsIgnoreCase(localization))
                        .and(artwork.artist.localization.containsIgnoreCase(localization)))
                .groupBy(artwork)
                .orderBy(soundSoundTag.count().desc(), sound.artworks.size().asc())
                .limit(limit)
                .fetch();

    }
}
