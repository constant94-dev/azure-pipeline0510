package digital.patron.webmobile.member.domain;

import digital.patron.webmobile.artist.domain.Artist;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter
@Setter(AccessLevel.PRIVATE)
@Table(name = "kt_member_likes_artist_relation")
public class MemberLikedArtist implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_id")
    private Artist artist;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "general_member_id")
    private GeneralMember generalMember;

    public void setArtist(Artist artist) {
        this.artist = artist;
    }

    public void setGeneralMember(GeneralMember generalMember) {
        this.generalMember = generalMember;
    }
}
