package digital.patron.webmobile.socket.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter(AccessLevel.PRIVATE)
@AllArgsConstructor
public class SocketConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String name;
    private String deviceName;
    private String deviceId;
    private String code;
    private String inquirer;
    @Column(length = 3)
    private String connection;
    private Long artId;
    private Long exhId;
    private Boolean play;
    private LocalDateTime createTime;


    protected SocketConnection() {
    }
}

