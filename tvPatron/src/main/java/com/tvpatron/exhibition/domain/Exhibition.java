package com.tvpatron.exhibition.domain;

import com.tvpatron.common.utils.BaseTimeEntity;
import com.tvpatron.integrate.domain.ArtistExhibition;
import com.tvpatron.integrate.domain.ArtworkExhibition;
import com.tvpatron.member.domain.BusinessMember;
import com.tvpatron.member.domain.MemberWaitingExhibition;
import com.tvpatron.member.domain.SaleMember;
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
@Setter(AccessLevel.PUBLIC)
@AllArgsConstructor
public class Exhibition extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100, unique = true)
    private String code;

    @Column(length = 100)
    private String localization;

    @Column(nullable = false, length = 10)
    private String type;

    @Column(nullable = false, length = 500)
    private String docent;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate;

    @Column(nullable = false)
    private int numberOfLikes;

    @Column(nullable = false)
    private int numberOfViews;

    @OneToMany(mappedBy = "exhibition")
    @OrderBy("exhibitionTag.id asc")
    private Set<ExhibitionExhibitionTag> exhibitionExhibitionTags = new HashSet<>();

    @OneToMany(mappedBy = "exhibition")
    private Set<ExhibitionExhibitionGroup> exhibitionExhibitionGroups = new HashSet<>();

    @OneToMany(mappedBy = "exhibition")
    @OrderBy("id asc")
    private Set<ArtistExhibition> artistExhibitions = new HashSet<>();

    @OneToMany(mappedBy = "exhibition")
    private Set<MemberWaitingExhibition> memberWaitingExhibitions = new HashSet<>();

    @OneToMany(mappedBy = "exhibition")
    @OrderBy("id asc")
    private Set<ArtworkExhibition> artworkExhibitions = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    private BusinessMember businessMember;

    @ManyToOne(fetch = FetchType.LAZY)
    private SaleMember saleMember;

    @OneToMany(mappedBy = "exhibition")
    private Set<ExhibitionDetail> exhibitionDetails = new HashSet<>();

    protected Exhibition() {
    }

    public void addMemberWaitingExhibition(MemberWaitingExhibition memberWaitingExhibition) {
        memberWaitingExhibitions.add(memberWaitingExhibition);
        memberWaitingExhibition.setExhibition(this);
    }
}
