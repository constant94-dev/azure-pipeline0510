package com.tvpatron.member.domain;

import com.tvpatron.artwork.domain.Artwork;
import com.tvpatron.common.utils.BaseTimeEntity;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter(AccessLevel.PRIVATE)
@Table(name = "kt_member_likes_artwork_relation")
public class MemberLikedArtwork extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artwork_id")
    private Artwork artwork;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "general_member_id")
    private GeneralMember generalMember;

    public void setArtwork(Artwork artwork) {
        this.artwork = artwork;
    }

    public void setGeneralMember(GeneralMember generalMember) {
        this.generalMember = generalMember;
    }
}
