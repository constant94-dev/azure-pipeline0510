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
public class AdminNotice extends BaseTimeEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 500)
    private String attach_file;

    @Column(nullable = false)
    private Boolean status;

    @Column(nullable = false)
    private Boolean fix_top;

    @Column(length = 5000, nullable = false)
    private String content;

    @Column(nullable = false)
    private Integer number_of_views;



    protected AdminNotice(){

    }
}
