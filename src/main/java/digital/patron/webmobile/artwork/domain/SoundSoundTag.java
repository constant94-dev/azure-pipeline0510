package digital.patron.webmobile.artwork.domain;


import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter(AccessLevel.PRIVATE)
@Table(name = "sound_sound_tag_relation")
public class SoundSoundTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Sound sound;

    @ManyToOne(fetch = FetchType.LAZY)
    private SoundTag soundTag;
}
