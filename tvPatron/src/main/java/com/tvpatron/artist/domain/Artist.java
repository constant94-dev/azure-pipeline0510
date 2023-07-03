package com.tvpatron.artist.domain;

import com.tvpatron.artwork.domain.Artwork;
import com.tvpatron.common.utils.BaseTimeEntity;
import com.tvpatron.integrate.domain.ArtistExhibition;
import com.tvpatron.member.domain.MemberLikedArtist;
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
    // 양방향 연관관계 //

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
    private Set<ArtistDetail> artistDetails = new HashSet<>();
    @OneToMany(mappedBy = "artist")
    private Set<MemberLikedArtist> memberLikedArtists = new HashSet<>();

    // 기본 생성자 //
    protected Artist() {
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
