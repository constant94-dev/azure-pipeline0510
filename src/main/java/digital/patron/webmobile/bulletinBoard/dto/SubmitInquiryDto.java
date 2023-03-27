package digital.patron.webmobile.bulletinBoard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SubmitInquiryDto {

    private String type;

    private String content;
}
