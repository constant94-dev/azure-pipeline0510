package com.tvpatron.member.repository;

import com.tvpatron.member.domain.GeneralMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface GeneralMemberRepository extends JpaRepository<GeneralMember, Long> {
    @Query("select m from GeneralMember m where m.email = :email")
    Optional<GeneralMember> findByEmail(@Param("email") String email);

    @Transactional
    @Modifying
    @Query("update GeneralMember m set m.preferredLanguage = :language where m.email = :email")
    void changePreferredLanguage(String email, String language);
}
