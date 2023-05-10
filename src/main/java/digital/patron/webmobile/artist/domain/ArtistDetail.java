package digital.patron.webmobile.artist.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter(AccessLevel.PRIVATE)
@AllArgsConstructor
public class ArtistDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2)
    private String language;

    @Column(nullable = false, length = 200, name = "name")
    private String artistName;

    @Column(nullable = false, length = 2000)
    private String intro;

    @Column(length = 100)
    private String nationality;

    @Column(length = 20)
    private String gender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_id")
    private Artist artist;

    public void setArtist(Artist artist) {
        this.artist = artist;
    }

    protected ArtistDetail(){

    }

    public ArtistDetail(String language, String artistName, String intro, String nationality, String gender) {
        this.language = language;
        this.artistName = artistName;
        this.intro = intro;
        this.nationality = nationality;
        this.gender = gender;
    }
}
