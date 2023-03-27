package digital.patron.webmobile.artMagazine.domain;

import digital.patron.webmobile.common.utils.BaseTimeEntity;
import digital.patron.webmobile.exhibition.domain.Exhibition;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter(AccessLevel.PRIVATE)
@AllArgsConstructor
public class ArtMagazine extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Exhibition exhibition;
    private String type;
    private String url;
    private String title;
    private String intro;
    private String thumbnail;
    private Integer recommended;

    public ArtMagazine(){

    }
}
