package com.tvpatron.member.repository;

import com.tvpatron.artwork.domain.Artwork;
import com.tvpatron.member.domain.GeneralMember;
import com.tvpatron.member.domain.MemberSeenArtwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MemberSeenArtworkRepository extends JpaRepository<MemberSeenArtwork, Long> {

    @Query("select k from MemberSeenArtwork k where k.generalMember = :generalMember and k.artwork = :artwork")
    Optional<MemberSeenArtwork> findIdByGeneralMemberAndArtwork(GeneralMember generalMember, Artwork artwork);

    @Transactional
    @Modifying
    @Query("delete from MemberSeenArtwork k where k.generalMember = :generalMember")
    void deleteByGeneralMember(GeneralMember generalMember);


    @Transactional
    @Modifying
    @Query("delete from MemberSeenArtwork k where k.generalMember = :generalMember and k.artwork = :artwork")
    void deleteByGeneralMemberAndArtwork(GeneralMember generalMember, Artwork artwork);

    @Query("select k.viewLastTime from MemberSeenArtwork k where k.generalMember = :generalMember and k.artwork = :artwork")
    LocalDate findLastViewTimeByArtworkIdAndEmail(Artwork artwork, GeneralMember generalMember);

    @Query("select m from MemberSeenArtwork m where m.generalMember = :generalMember")
    List<MemberSeenArtwork> findByGeneralMember(GeneralMember generalMember);
}
