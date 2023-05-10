package digital.patron.webmobile.artist.domain;

import digital.patron.webmobile.artwork.domain.Artwork;
import digital.patron.webmobile.common.utils.BaseTimeEntity;
import digital.patron.webmobile.integrate.domain.ArtistExhibition;
import digital.patron.webmobile.member.domain.MemberLikedArtist;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter(AccessLevel.PRIVATE)
@AllArgsConstructor
public class Artist extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100, unique = true)
    private String code;

    @Column(length = 100)
    private String localization;

    @Column(length = 500)
    private String profileImg;

    @Column(length = 500)
    private String resume;

    private LocalDate birth;

    private LocalDate deathDate;

    @Column(nullable = false)
    private boolean deathCheck;

    @Column(nullable = false)
    private int numberOfLikes;

    @Column(nullable = false)
    private int numberOfShares;

    @OneToMany(mappedBy = "artist")
    @OrderBy("id asc")
    private Set<Artwork> artworks = new HashSet<>();

    @OneToMany(mappedBy = "artist")
    private Set<ArtistExhibition> artistExhibitions = new HashSet<>();

    @OneToMany(mappedBy = "artist")
    private Set<ArtistArtistGroup> artistArtistGroups = new HashSet<>();

    @OneToMany(mappedBy = "artist")
    @OrderBy("artistTag.id asc")
    private Set<ArtistArtistTag> artistArtistTags = new HashSet<>();

    @OneToMany(mappedBy = "artist")
    private Set<MemberLikedArtist> memberLikedArtists = new HashSet<>();

    @OneToMany(mappedBy = "artist")
    private Set<ArtistDetail> artistDetails = new HashSet<>();
    public Artist() {
    }
    public void addMemberLikedArtist(MemberLikedArtist memberLikedArtist) {
        memberLikedArtists.add(memberLikedArtist);
        memberLikedArtist.setArtist(this);
    }
    public void increaseNumberOfLikes() {
        this.numberOfLikes += 1;
    }
    public void increaseNumberOfShares() {
        this.numberOfShares += 1;
    }
    public void decreaseNumberOfLikes() {
        if(this.numberOfLikes > 0){
            this.numberOfLikes -= 1;
        }
    }
}
