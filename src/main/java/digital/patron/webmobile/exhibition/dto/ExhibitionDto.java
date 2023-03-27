package digital.patron.webmobile.exhibition.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ExhibitionDto {
    private List<Long> id;
    private List<String> exhibitionName;
    private List<String> exhibitionArtistNationality;
    private List<String> exhibitionArtistName;
    private List<Integer> artistCount;
    private List<Integer> artworksCount;
    private List<String> durationTime;
    private List<String> exhibitionThumb;
    private List<Long> dDay;
}
