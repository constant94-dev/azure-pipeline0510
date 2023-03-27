package digital.patron.webmobile.member.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter
@Setter(AccessLevel.PRIVATE)
@AllArgsConstructor
public class LeftMember implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false, unique = true)
    private String email;
    @Column(length = 100)
    private String type;
    @Column(length = 500)
    private String reason;

    protected LeftMember() {
    }

    public LeftMember(String email, String type, String reason) {
        this.email = email;
        this.type = type;
        this.reason = reason;
    }
}
