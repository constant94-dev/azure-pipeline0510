package digital.patron.webmobile.advertisement.domain;

import digital.patron.webmobile.common.utils.BaseTimeEntity;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter(AccessLevel.PRIVATE)
@AllArgsConstructor
public class Advertisement extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 100, unique = true)
    private String name;
    @Column(length = 1000)
    private String image;
    @Column(length = 1000)
    private String file;
    @Column(length = 500)
    private String hrefUrl;
    private Boolean status;

    protected Advertisement(){
    }
}
