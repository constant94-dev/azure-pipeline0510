package digital.patron.webmobile.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MemberInfoDto {
    private String name;
    private String birth;
    private String gender;
    private String nationality;
    private String preferredLanguage;
}
