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
public class ContentsHd {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100, unique = true)
    private String code;

    @Column(length = 500)
    private String video;

    @Column(length = 500, nullable = false)
    private String defaultImg;

    @Column(length = 500, nullable = false)
    private String originalImg;

    protected ContentsHd() {
    }
}
