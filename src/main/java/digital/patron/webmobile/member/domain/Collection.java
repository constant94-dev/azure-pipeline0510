package digital.patron.webmobile.member.domain;

import digital.patron.webmobile.exhibition.domain.Exhibition;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter(AccessLevel.PRIVATE)
@AllArgsConstructor
public class Collection implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int sortNumber;

    @Column(nullable = false, name = "name", length = 100)
    private String collectionName;

    private LocalDateTime updateTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "general_member_id")
    private GeneralMember generalMember;

    @OneToMany(mappedBy = "collection")
    private Set<CollectionArtwork> collectionArtworks = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exhibition_id")
    private Exhibition exhibition;

    protected Collection() {
    }

    public Collection(int sortNumber, String collectionName, LocalDateTime updateTime) {
        this.sortNumber = sortNumber;
        this.collectionName = collectionName;
        this.updateTime = updateTime;
    }

    public void addCollectionArtwork(CollectionArtwork collectionArtwork) {
        collectionArtworks.add(collectionArtwork);
        collectionArtwork.setCollection(this);
    }


    public void setGeneralMember(GeneralMember generalMember) {
        this.generalMember = generalMember;
    }

    public void setExhibition(Exhibition exhibition) {
        this.exhibition = exhibition;
    }
}
