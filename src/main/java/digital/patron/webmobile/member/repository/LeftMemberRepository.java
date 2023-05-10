package digital.patron.webmobile.member.repository;

import digital.patron.webmobile.member.domain.LeftMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface LeftMemberRepository extends JpaRepository<LeftMember, Long> {
    @Query("select l from LeftMember l where l.email = :email")
    Optional<LeftMember> isMemberALeftMember(String email);
}
