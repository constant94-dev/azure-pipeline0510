package com.tvpatron.artist.domain;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter(AccessLevel.PRIVATE)
@Table(name = "artist_artist_tag_relation")
public class ArtistArtistTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Artist artist;

    @ManyToOne(fetch = FetchType.LAZY)
    private ArtistTag artistTag;

    public void setArtist(Artist artist) {
        this.artist = artist;
    }

    public void setArtistTag(ArtistTag artistTag) {
        this.artistTag = artistTag;
    }

}
