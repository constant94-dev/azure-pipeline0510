package digital.patron.webmobile.member.repository;

import digital.patron.webmobile.member.domain.GeneralMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface GeneralMemberRepository extends JpaRepository<GeneralMember, Long> {
    @Query("select case when count(m)> 0 then true else false end from GeneralMember m where m.email =:email")
    boolean existsGeneralMemberByEmail(@Param("email") String email);

    @Query("select m from GeneralMember m where m.email = :email")
    Optional<GeneralMember> findByEmail(String email);

    @Query("select m.name from GeneralMember m where m.email = :email")
    String getGeneralMemberNickNameByEmail(@Param("email") String email);

    @Query("select m.birth from GeneralMember m where m.email = :email")
    LocalDate getGeneralMemberBirthByEmail(@Param("email") String email);

    @Query("select m.gender from GeneralMember m where m.email = :email")
    String getGeneralMemberGenderByEmail(@Param("email") String email);

    @Query("select m.nationality from GeneralMember m where m.email = :email")
    String getGeneralMemberNationalityByEmail(@Param("email") String email);

    @Query("select m.preferredLanguage from GeneralMember m where m.email = :email")
    String getGeneralMemberPreferredLanguageByEmail(@Param("email") String email);

    @Transactional
    @Modifying
    @Query("update GeneralMember k set k.tutorial_check = true where k.email = :email")
    void setTutorialCheckToTrueByEmail(String email);

    @Query("select g.provider from GeneralMember g where g.email = :email")
    Optional<String> getProviderByEmail(String email);


    @Transactional
    @Modifying
    @Query("update GeneralMember g set g.password = :password where g.email = :email")
    int resetPassword(String email, String password);

    @Query("select g.marketing from GeneralMember g where g = :generalMember")
    boolean getMarketingStatus(GeneralMember generalMember);

    @Transactional
    @Modifying
    @Query("update GeneralMember g set g.marketing = :status where g = :generalMember")
    int changeMarketingStatusByGeneralMember(GeneralMember generalMember, Boolean status);

    @Query("select g.password from GeneralMember g where g = :generalMember")
    String getPassword(GeneralMember generalMember);

    @Transactional
    @Modifying
    @Query("update GeneralMember g set g.password = :password where g = :generalMember")
    int setNewPassword(GeneralMember generalMember, String password);
    @Transactional
    @Modifying
    @Query("update GeneralMember g set g.name = :name where g = :generalMember")
    int changeName(String name, GeneralMember generalMember);

    @Transactional
    @Modifying
    @Query("update GeneralMember g set g.birth = :birthday where g = :generalMember")
    int changeBirthday(LocalDate birthday, GeneralMember generalMember);

    @Transactional
    @Modifying
    @Query("update GeneralMember g set g.gender = :gender where g = :generalMember")
    int changeGender(String gender, GeneralMember generalMember);

    @Transactional
    @Modifying
    @Query("update GeneralMember g set g.nationality = :nationality where g = :generalMember")
    int changeNationality(String nationality, GeneralMember generalMember);

    @Transactional
    @Modifying
    @Query("update GeneralMember g set g.preferredLanguage = :preferredLanguage where g = :generalMember")
    int changePreferredLanguage(String preferredLanguage, GeneralMember generalMember);

    @Transactional
    @Modifying
    @Query("delete from GeneralMember g where g = :generalMember")
    int deleteByGeneralMember(GeneralMember generalMember);
}
