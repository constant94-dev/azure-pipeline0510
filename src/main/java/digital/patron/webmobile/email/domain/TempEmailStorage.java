package digital.patron.webmobile.email.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter(AccessLevel.PRIVATE)
@AllArgsConstructor
public class TempEmailStorage implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 100, nullable = false, unique = true)
    private String email;
    @Column(length = 6, nullable = false, unique = true)
    private String authKey;
    private LocalDateTime createTime;
    protected TempEmailStorage() {
    }

    public TempEmailStorage(String email, String authKey,LocalDateTime createTime) {
        this.email = email;
        this.authKey = authKey;
        this.createTime = createTime;
    }
}
