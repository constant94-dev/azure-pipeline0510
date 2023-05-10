package digital.patron.webmobile.socket.repository;

import digital.patron.webmobile.socket.domain.SocketConnection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SocketConnectionRepository extends JpaRepository<SocketConnection,Long> {

    @Transactional
    @Modifying
    @Query("update SocketConnection s set s.email = :email, s.name = :name, s.connection = :req, s.code = null where s.code = :code")
    int requestConnectionToDeviceByCode(String email, String name, String code,String req);

    @Query("select s.deviceId from SocketConnection s where s.code = :code and s.connection = :req")
    Optional<String> getDeviceIdByRequestedCode(String code,String req);

    @Transactional
    @Modifying
    @Query("update SocketConnection s set s.artId = :artId, s.exhId = :exhId, s.play = :play, s.inquirer = :inquirer where s.email = :email and s.connection = :con")
    int requestTvToPlayArtwork(String email,Long artId, Long exhId,Boolean play, String con, String inquirer);

    @Query("select s from SocketConnection s where s.email = :email and  s.connection = :con")
    Optional<SocketConnection> connectionAlreadyExist(String email, String con);

    @Transactional
    @Modifying
    @Query("delete from SocketConnection s where s.email = :email and s.code = :code and s.connection = :req")
    int deleteDuplicateRequest(String email,String code,String req);

    @Transactional
    @Modifying
    @Query("delete from SocketConnection s where s.email = :email")
    int deleteByEmail(String email);

    @Query("select s from SocketConnection s where s.code = :code")
    Optional<String> findByRequestCode(String code);

    @Transactional
    @Modifying
    @Query("delete from SocketConnection s where s.createTime < :localDateTime and s.code is not null")
    int removeExpiredCode(LocalDateTime localDateTime);

    @Query("select s from SocketConnection s where s.connection = :con and s.inquirer = :inquirer and (s.artId is not null or s.exhId is not null or s.play is not null)")
    List<SocketConnection> checkIfConnected(String con, String inquirer);
    @Query("select s from SocketConnection s where s.email = :email and s.connection = :con and s.inquirer = :inquirer")
    SocketConnection getSocketConnectionByEmail(String email, String con, String inquirer);

    @Transactional
    @Modifying
    @Query("update SocketConnection s set s.artId = null,s.exhId = null,s.play = null, s.inquirer = null where s.email = :email and s.connection = :con")
    int resetArtAndExhIdAndPlay(String email,String con);

    @Query("select s.deviceName from SocketConnection s where s.email = :email and s.connection = :con")
    String getDeviceNameByEmail(String email, String con);

    @Query("select s from SocketConnection s where s.deviceId = :deviceId and s.connection = :con")
    List<SocketConnection> getAllConnectionsByDeviceId(String deviceId, String con);

}
