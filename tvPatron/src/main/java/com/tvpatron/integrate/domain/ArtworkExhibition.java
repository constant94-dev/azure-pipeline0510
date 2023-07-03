package com.tvpatron.integrate.domain;

import com.tvpatron.artwork.domain.Artwork;
import com.tvpatron.exhibition.domain.Exhibition;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "artwork_exhibition_relation")
@Getter
@Setter(AccessLevel.PRIVATE)
public class ArtworkExhibition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Artwork artwork;

    @ManyToOne(fetch = FetchType.LAZY)
    private Exhibition exhibition;

    public void setArtwork(Artwork artwork) {
        this.artwork = artwork;
    }

    public void setExhibition(Exhibition exhibition) {
        this.exhibition = exhibition;
    }

}
