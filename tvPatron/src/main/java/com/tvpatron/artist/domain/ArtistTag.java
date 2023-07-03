package com.tvpatron.artist.domain;

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
public class ArtistTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100, name = "name")
    private String tagName;

    @Column(length = 10)
    private String language;



    @OneToMany(mappedBy = "artistTag")
    private Set<ArtistArtistTag> artistArtistTags = new HashSet<>();

    protected ArtistTag() {
    }
}
