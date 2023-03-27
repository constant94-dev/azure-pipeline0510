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
public class RecommendedTags {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;
    private String localization;
    private String thumbnail;
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private ArtworkTag artworkTag;
    private Boolean fixed;
    public RecommendedTags() {
    }
}
