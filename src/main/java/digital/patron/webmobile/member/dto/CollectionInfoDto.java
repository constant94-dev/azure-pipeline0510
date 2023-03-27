package digital.patron.webmobile.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class CollectionInfoDto {
    private List<Long> id;
    private List<String> name;
    private List<String> artistNationality;
    private List<String> artistName;
    private List<Long> artistCount;
    private List<Long> artworkCount;
    private List<String> durationTime;
    private List<String> exhibitionThumb;
}
