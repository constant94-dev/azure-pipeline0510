package digital.patron.webmobile.bulletinBoard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class OftenQuestionDto {
    private List<Long> id;

    private List<String> type;

    private List<String> title;

    private List<String> name;

    private List<String> attachFile;

    private List<Boolean> fixTop;

    private List<String> content;

    private List<Integer> numberOfViews;

}
