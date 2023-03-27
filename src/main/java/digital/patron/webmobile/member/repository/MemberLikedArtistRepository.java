package digital.patron.webmobile.member.repository;

import digital.patron.webmobile.artist.domain.Artist;
import digital.patron.webmobile.member.domain.GeneralMember;
import digital.patron.webmobile.member.domain.MemberLikedArtist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface MemberLikedArtistRepository extends JpaRepository<MemberLikedArtist,Long> {
    @Query("select m from MemberLikedArtist m where m.generalMember = :generalMember and  m.artist = :artist")
    Optional<MemberLikedArtist> findIdByGeneralMemberAndArtist(GeneralMember generalMember, Artist artist);

    @Transactional
    @Modifying
    @Query("delete from MemberLikedArtist m where m.generalMember = :generalMember and  m.artist = :artist")
    void deleteByGeneralMemberAndArtwork(GeneralMember generalMember, Artist artist);

    @Query("select m.artist from MemberLikedArtist m where m.generalMember = :generalMember and m.artist.localization like :localization order by m.id desc")
    Page<Artist> getArtistsByGeneralMember(GeneralMember generalMember, String localization, Pageable pageable);

    @Transactional
    @Modifying
    @Query("delete from MemberLikedArtist k where k.generalMember = :generalMember")
    int deleteByGeneralMember(GeneralMember generalMember);
}
