package digital.patron.webmobile.bulletinBoard.repository;

import digital.patron.webmobile.bulletinBoard.domain.AdminOftenQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OftenQuestionRepository extends JpaRepository<AdminOftenQuestion, Long> {
    @Query("select a from AdminOftenQuestion a where a.type = :type and a.status = true")
    List<AdminOftenQuestion> findAllByType(String type);
}
