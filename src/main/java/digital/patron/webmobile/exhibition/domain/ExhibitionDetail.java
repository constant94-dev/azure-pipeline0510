package digital.patron.webmobile.exhibition.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter(AccessLevel.PRIVATE)
@AllArgsConstructor
public class ExhibitionDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2)
    private String language;

    @Column(nullable = false, length = 200, name = "name")
    private String exhibitionName;

    @Column(nullable = false, length = 2000)
    private String intro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exhibition_id")
    private Exhibition exhibition;

    public void setExhibition(Exhibition exhibition) {
        this.exhibition = exhibition;
    }

    protected ExhibitionDetail(){

    }

    public ExhibitionDetail(String language, String exhibitionName, String intro) {
        this.language = language;
        this.exhibitionName = exhibitionName;
        this.intro = intro;
    }
}
