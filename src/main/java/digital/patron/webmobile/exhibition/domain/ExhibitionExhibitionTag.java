package digital.patron.webmobile.exhibition.domain;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter(AccessLevel.PRIVATE)
@Table(name = "exhibition_exhibition_tag_relation")
public class ExhibitionExhibitionTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Exhibition exhibition;

    @ManyToOne(fetch = FetchType.LAZY)
    private ExhibitionTag exhibitionTag;

    public void setExhibition(Exhibition exhibition) {
        this.exhibition = exhibition;
    }
}
