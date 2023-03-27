package digital.patron.webmobile.artist.domain;


import digital.patron.webmobile.common.utils.BaseTimeEntity;
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
public class ArtistGroup extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100)
    private String localization;

    @Column(nullable = false, length = 100, name = "name")
    private String groupName;

    private boolean status;

    @OneToMany(mappedBy = "artistGroup")
    private Set<ArtistArtistGroup> artistArtistGroups = new HashSet<>();

    protected ArtistGroup() {
    }

}
