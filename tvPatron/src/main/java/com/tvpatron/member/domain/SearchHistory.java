package com.tvpatron.member.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter(AccessLevel.PRIVATE)
@AllArgsConstructor
public class SearchHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "general_member_id")
    private GeneralMember generalMember;
    private String keyword;

    public SearchHistory(String keyword) {
        this.keyword = keyword;
    }

    public SearchHistory() {

    }
    public void setGeneralMember(GeneralMember generalMember) {
        this.generalMember = generalMember;
    }
}
