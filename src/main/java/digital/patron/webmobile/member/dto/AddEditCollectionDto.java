package digital.patron.webmobile.member.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class AddEditCollectionDto {
    private String previousName;
    private String name;
    private List<Long> artIds;
}
