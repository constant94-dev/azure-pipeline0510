package digital.patron.webmobile.artwork.domain;

import digital.patron.webmobile.artist.domain.Artist;
import digital.patron.webmobile.common.utils.BaseTimeEntity;
import digital.patron.webmobile.integrate.domain.ArtworkExhibition;
import digital.patron.webmobile.member.domain.CollectionArtwork;
import digital.patron.webmobile.member.domain.MemberLikedArtwork;
import digital.patron.webmobile.member.domain.MemberSeenArtwork;
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
public class Artwork extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100, unique = true)
    private String code;

    @Column(length = 100)
    private String localization;

    @Column(nullable = false, length = 100)
    private String size;

    @Column(nullable = false, length = 100)
    private String year;

    @Column(nullable = false, length = 100, name = "belong")
    private String keep;

    @Column(length = 500)
    private String shopUrl;

    @Column(nullable = false)
    private boolean approve;

    @Column(nullable = false)
    private int numberOfLikes;

    @Column
    private int durationTime;

    @Column(nullable = false)
    private int numberOfViews;

    @Column(nullable = false)
    private int numberOfShares;

    @OneToMany(mappedBy = "artwork")
    @OrderBy("artworkTag.id asc")
    private Set<ArtworkArtworkTag> artworkArtworkTags = new HashSet<>();

    @OneToMany(mappedBy = "artwork")
    private Set<ArtworkExhibition> artworkExhibitions = new HashSet<>();

    @OneToMany(mappedBy = "artwork")
    private Set<MemberLikedArtwork> memberLikedArtworks = new HashSet<>();

    @OneToMany(mappedBy = "artwork")
    private Set<MemberSeenArtwork> memberSeenArtworks = new HashSet<>();

    @OneToMany(mappedBy = "artwork")
    private Set<CollectionArtwork> collectionArtworks = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    private Sound sound;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Contents4k contents_4k;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private ContentsHd contentsHd;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private ContentsThumbnail contentsThumbnail;

    @ManyToOne(fetch = FetchType.LAZY)
    private Artist artist;

    @OneToMany(mappedBy = "artwork")
    private Set<ArtworkDetail> artworkDetails = new HashSet<>();

    protected Artwork() {
    }

    public void addMemberLikedArtwork(MemberLikedArtwork memberLikedArtwork) {
        memberLikedArtworks.add(memberLikedArtwork);
        memberLikedArtwork.setArtwork(this);
    }

    public void addMemberSeenArtwork(MemberSeenArtwork memberSeenArtwork) {
        memberSeenArtworks.add(memberSeenArtwork);
        memberSeenArtwork.setArtwork(this);
    }

    public void addCollectionArtwork(CollectionArtwork collectionArtwork) {
        collectionArtworks.add(collectionArtwork);
        collectionArtwork.setArtwork(this);
    }

    // 양방향 연관 관계 시, @OneToMany 인 엔티티에 연관 관계 편의 메소드를 구현하므로 setter 필요. //
    public void setArtist(Artist artist) {
        this.artist = artist;
    }

    public void increaseNumberOfLikes() {
        this.numberOfLikes += 1;
    }
    public void increaseNumberOfShares() {
        this.numberOfShares += 1;
    }
    public void increaseNumberOfViews() {
        this.numberOfViews += 1;
    }
    public void decreaseNumberOfLikes() {
        if(this.numberOfLikes > 0){
            this.numberOfLikes -= 1;
        }
    }
}
