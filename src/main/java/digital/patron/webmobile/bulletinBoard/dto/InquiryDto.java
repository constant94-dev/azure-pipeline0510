package digital.patron.webmobile.bulletinBoard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class InquiryDto {
    private List<Long> id;

    private List<String> writer;

    private List<String> type;

    private List<String> content;

    private List<String> answer;
    private List<LocalDateTime> createTime;

}

