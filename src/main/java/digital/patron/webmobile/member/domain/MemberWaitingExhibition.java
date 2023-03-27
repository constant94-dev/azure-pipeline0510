package digital.patron.webmobile.member.domain;

import digital.patron.webmobile.exhibition.domain.Exhibition;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter
@Setter(AccessLevel.PRIVATE)
@Table(name = "members_waiting_exhibition_relation")
public class MemberWaitingExhibition implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exhibition_id")
    private Exhibition exhibition;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "general_member_id")
    private GeneralMember generalMember;

    public void setExhibition(Exhibition exhibition) {
        this.exhibition = exhibition;
    }
    public void setGeneralMember(GeneralMember generalMember) {
        this.generalMember = generalMember;
    }
}
