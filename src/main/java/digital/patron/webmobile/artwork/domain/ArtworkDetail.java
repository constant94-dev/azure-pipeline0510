package digital.patron.webmobile.artwork.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter(AccessLevel.PRIVATE)
@AllArgsConstructor
public class ArtworkDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2)
    private String language;

    @Column(nullable = false, length = 200, name = "name")
    private String artworkName;

    @Column(nullable = false, length = 5000)
    private String intro;

    @Column(length = 100)
    private String category;

    @Column(length = 100)
    private String source;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artwork_id")
    private Artwork artwork;

    public void setArtwork(Artwork artwork) {
        this.artwork = artwork;
    }

    protected ArtworkDetail(){

    }

    public ArtworkDetail(String language, String artworkName, String intro, String category, String source) {
        this.language = language;
        this.artworkName = artworkName;
        this.intro = intro;
        this.category = category;
        this.source = source;
    }
}
