package digital.patron.webmobile.member.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter(AccessLevel.PRIVATE)
@AllArgsConstructor
public class DisabledMember implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false, unique = true)
    private String email;
    @Column(length = 100, nullable = false)
    private String reason;
    @Column(length = 10, nullable = false)
    private String type;
    @Column(length = 10, nullable = false)
    private String provider;
    @Column(nullable = false)
    private LocalDateTime leave_date;
    @Column(length = 300, nullable = false)
    private String password;
    @Column(length = 100, nullable = false)
    private String name;
    private LocalDate birth;
    @Column(length = 20)
    private String nationality;
    @Column(length = 10)
    private String gender;
    private boolean marketing;

    protected DisabledMember() {
    }
}
