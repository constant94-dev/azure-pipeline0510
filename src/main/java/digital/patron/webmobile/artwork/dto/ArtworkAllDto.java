package digital.patron.webmobile.artwork.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ArtworkAllDto {
    private List<Long> id;
    private List<String> name;
    private List<String> artistName;    
    private List<String> thumbnail;

}
