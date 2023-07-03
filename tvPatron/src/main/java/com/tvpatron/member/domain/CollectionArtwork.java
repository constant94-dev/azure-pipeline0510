package com.tvpatron.member.domain;

import com.tvpatron.artwork.domain.Artwork;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter(AccessLevel.PRIVATE)
@Table(name = "collection_artwork_relation")
public class CollectionArtwork {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artwork_id")
    private Artwork artwork;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collection_id")
    private Collection collection;

    public void setArtwork(Artwork artwork) {
        this.artwork = artwork;
    }

    public void setCollection(Collection collection) {
        this.collection = collection;
    }
}
