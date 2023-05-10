package digital.patron.webmobile.artwork.repository.custom;

import digital.patron.webmobile.artwork.domain.Artwork;
import digital.patron.webmobile.artwork.domain.SoundTag;

import java.util.List;

public interface SoundRepositoryCustom {
    List<Artwork> findByTags(List<SoundTag> soundTags, List<Artwork> artwork, Integer limit, String localization);

}
