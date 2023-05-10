package digital.patron.webmobile.bulletinBoard.domain;

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
public class AdminOftenQuestion extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String type;

    @Column(nullable = false, length = 200, name = "title")
    private String title;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String attach_file;

    @Column(nullable = false)
    private Boolean status;

    @Column(nullable = false)
    private Boolean fix_top;

    @Column(nullable = false, length = 5000)
    private String content;

    @Column(nullable = false)
    private Integer number_of_views;

    protected AdminOftenQuestion(){}
}
