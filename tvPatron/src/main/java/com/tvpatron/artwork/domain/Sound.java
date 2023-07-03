package com.tvpatron.artwork.domain;

import com.tvpatron.common.utils.BaseTimeEntity;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter(AccessLevel.PRIVATE)
@AllArgsConstructor
public class Sound extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100, name = "code")
    private String soundCode;

    @Column(nullable = false, length = 50, name = "type")
    private String soundType;

    @Column(nullable = false, length = 200, name = "name")
    private String soundName;

    @Column(nullable = false, length = 100, name = "creator")
    private String soundCreator;

    @Column(length = 100, name = "player")
    private String soundPlayer;

    @Column(length = 300, name = "origin_url")
    private String soundOriginUrl;

    @Column( length = 100, name = "license")
    private String soundLicense;

    @Column(nullable = false, length = 300, name = "url")
    private String soundUrl;

    @OneToMany(mappedBy = "sound")
    private Set<SoundSoundTag> soundSoundTags = new HashSet<>();

    @OneToMany(mappedBy = "sound")
    private Set<Artwork> artworks = new HashSet<>();

    protected Sound() {
    }
}
