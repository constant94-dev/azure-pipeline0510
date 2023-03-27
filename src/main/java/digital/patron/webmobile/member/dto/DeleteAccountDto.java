package digital.patron.webmobile.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DeleteAccountDto {
    private String type;
    private String reason;
}
