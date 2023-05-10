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
public class AdminInquiry extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String writer;

    @Column(nullable = false, length = 100)
    private String type;

    @Column(nullable = false, length = 5000)
    private String content;

    @Column(length = 5000)
    private String answer;


    protected AdminInquiry(){

    }

    public AdminInquiry(String writer, String type, String content, String answer) {
        this.writer = writer;
        this.type = type;
        this.content = content;
        this.answer = answer;
    }
}
