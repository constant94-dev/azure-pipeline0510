package digital.patron.webmobile.member.repository;

import digital.patron.webmobile.artwork.domain.Artwork;
import digital.patron.webmobile.member.domain.GeneralMember;
import digital.patron.webmobile.member.domain.MemberSeenArtwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberSeenArtworkRepository extends JpaRepository<MemberSeenArtwork, Long> {

    @Query("select k from MemberSeenArtwork k where k.generalMember = :generalMember and k.artwork = :artwork")
    Optional<MemberSeenArtwork> findIdByGeneralMemberAndArtwork(GeneralMember generalMember, Artwork artwork);

    @Transactional
    @Modifying
    @Query("delete from MemberSeenArtwork k where k.generalMember = :generalMember")
    int deleteByGeneralMember(GeneralMember generalMember);


    @Transactional
    @Modifying
    @Query("delete from MemberSeenArtwork k where k.generalMember = :generalMember and k.artwork = :artwork")
    int deleteByGeneralMemberAndArtwork(GeneralMember generalMember, Artwork artwork);

    @Query("select m from MemberSeenArtwork m where m.generalMember = :generalMember")
    List<MemberSeenArtwork> findByGeneralMember(GeneralMember generalMember);
    

}
