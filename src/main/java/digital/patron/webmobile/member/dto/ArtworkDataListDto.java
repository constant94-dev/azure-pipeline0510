package digital.patron.webmobile.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ArtworkDataListDto {
    private List<Long> id;
    private List<String> name;
    private List<Long> artistId;
    private List<String> artistNationality;
    private List<String> artistName;
    private List<String> thumbnail;
    private List<Boolean> inCollection;
}
