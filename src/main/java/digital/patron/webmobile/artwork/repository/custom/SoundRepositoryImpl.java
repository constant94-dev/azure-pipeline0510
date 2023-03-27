package digital.patron.webmobile.artwork.repository.custom;

import com.querydsl.jpa.impl.JPAQueryFactory;
import digital.patron.webmobile.artwork.domain.Artwork;
import digital.patron.webmobile.artwork.domain.SoundTag;
import org.springframework.stereotype.Repository;

import java.util.List;

import static digital.patron.webmobile.artwork.domain.QArtwork.artwork;
import static digital.patron.webmobile.artwork.domain.QSound.sound;
import static digital.patron.webmobile.artwork.domain.QSoundSoundTag.soundSoundTag;
import static digital.patron.webmobile.artwork.domain.QSoundTag.soundTag;

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
//                        .and(artwork.artist.ne(art.getArtist()))
                        .and(artwork.localization.containsIgnoreCase(localization))
                        .and(artwork.artist.localization.containsIgnoreCase(localization)))
                .groupBy(artwork)
                .orderBy(soundSoundTag.count().desc(), sound.artworks.size().asc())
                .limit(limit)
                .fetch();

    }
}
