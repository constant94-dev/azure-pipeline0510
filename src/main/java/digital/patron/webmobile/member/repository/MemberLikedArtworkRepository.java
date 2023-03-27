package digital.patron.webmobile.member.repository;

import digital.patron.webmobile.artwork.domain.Artwork;
import digital.patron.webmobile.member.domain.GeneralMember;
import digital.patron.webmobile.member.domain.MemberLikedArtwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface MemberLikedArtworkRepository extends JpaRepository<MemberLikedArtwork, Long> {

    @Query("select k from MemberLikedArtwork k where k.generalMember = :generalMember and k.artwork = :artwork")
    Optional<MemberLikedArtwork> findIdByGeneralMemberAndArtwork(GeneralMember generalMember, Artwork artwork);

    @Transactional
    @Modifying
    @Query("delete from MemberLikedArtwork k where k.generalMember = :generalMember and k.artwork = :artwork")
    void deleteByGeneralMemberAndArtwork(GeneralMember generalMember, Artwork artwork);

    @Transactional
    @Modifying
    @Query("delete from MemberLikedArtwork k where k.generalMember = :generalMember")
    int deleteByGeneralMember(GeneralMember generalMember);

}
