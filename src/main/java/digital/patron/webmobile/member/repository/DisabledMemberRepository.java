package digital.patron.webmobile.member.repository;

import digital.patron.webmobile.member.domain.DisabledMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DisabledMemberRepository extends JpaRepository<DisabledMember, Long> {
    @Query("select d.provider from DisabledMember d where d.email = :email")
    Optional<String> getProviderByEmail(String email);
    @Query("select d from DisabledMember d where d.email = :email")
    DisabledMember getByEmail(String email);
}
