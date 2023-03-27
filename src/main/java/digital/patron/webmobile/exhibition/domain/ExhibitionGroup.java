package digital.patron.webmobile.exhibition.domain;

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
public class ExhibitionGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100)
    private String localization;

    @Column(nullable = false, length = 100, name = "name")
    private String groupName;

    private boolean status;

    @OneToMany(mappedBy = "exhibitionGroup")
    private Set<ExhibitionExhibitionGroup> exhibitionExhibitionGroups = new HashSet<>();

    protected ExhibitionGroup() {
    }

}
