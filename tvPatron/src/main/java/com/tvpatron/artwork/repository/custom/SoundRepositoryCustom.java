package com.tvpatron.artwork.repository.custom;

import com.tvpatron.artwork.domain.Artwork;
import com.tvpatron.artwork.domain.SoundTag;

import java.util.List;

public interface SoundRepositoryCustom {
    List<Artwork> findByTags(List<SoundTag> soundTags, List<Artwork> artwork, Integer limit, String localization);

}
