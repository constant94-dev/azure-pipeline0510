package digital.patron.webmobile.email.dto;

import digital.patron.webmobile.common.annotation.ValidEmail;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TempDto {
    @ValidEmail
    private String email;
    private String authKey;
    private String type;
}
