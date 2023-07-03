package com.tvpatron.member.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;


@Entity
@Getter
@Setter(AccessLevel.PRIVATE)
@AllArgsConstructor
public class GeneralMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false, unique = true)
    private String email;
    @Column(length = 100, nullable = false)
    private String name;
    @Column(length = 10, nullable = false)
    private String status;
    @Column(length = 300)
    private String public_wallet;
    private LocalDate birth;
    @Column(length = 20)
    private String nationality;
    @Column(length = 10)
    private String gender;
    private boolean tutorial_check;
    @Column(length = 300, nullable = false)
    private String password;
    @Column(nullable = false)
    private LocalDateTime last_login;
    @Column(nullable = false)
    private LocalDate create_time;
    @Column(length = 10)
    private String provider;
    private boolean marketing;
    @Column(length = 50)
    private String preferredLanguage;


    @OneToMany(mappedBy = "generalMember")
    private Set<Collection> collections = new HashSet<>();
    @OneToMany(mappedBy = "generalMember")
    private Set<MemberSeenArtwork> memberSeenArtworks = new HashSet<>();
    @OneToMany(mappedBy = "generalMember")
    private Set<MemberLikedArtwork> memberLikedArtworks = new HashSet<>();
    @OneToMany(mappedBy = "generalMember")
    private Set<MemberWaitingExhibition> memberWaitingExhibitions = new HashSet<>();
    @OneToMany(mappedBy = "generalMember")
    private Set<SearchHistory> searchHistories = new HashSet<>();



    public void addMemberLikedArtwork(MemberLikedArtwork memberLikedArtwork) {
        memberLikedArtworks.add(memberLikedArtwork);
        memberLikedArtwork.setGeneralMember(this);
    }

    public void addMemberSeenArtwork(MemberSeenArtwork memberSeenArtwork) {
        memberSeenArtworks.add(memberSeenArtwork);
        memberSeenArtwork.setGeneralMember(this);
    }
    public void addMemberWaitingExhibition(MemberWaitingExhibition memberWaitingExhibition) {
        memberWaitingExhibitions.add(memberWaitingExhibition);
        memberWaitingExhibition.setGeneralMember(this);
    }
    protected GeneralMember() {

    }

    public GeneralMember(String email, String name,
                         String status, LocalDate create_time,
                         LocalDateTime last_login, String public_wallet,
                         LocalDate birth, String nationality,
                         String gender, String password,
                         String provider, Boolean marketing,
                         String preferredLanguage,
                         Boolean tutorial_check) {
        this.email = email;
        this.name = name;
        this.status = status;
        this.create_time = create_time;
        this.last_login = last_login;
        this.public_wallet = public_wallet;
        this.birth = birth;
        this.nationality = nationality;
        this.gender = gender;
        this.password = password;
        this.provider = provider;
        this.marketing = marketing;
        this.preferredLanguage = preferredLanguage;
        this.tutorial_check = tutorial_check;
    }
}