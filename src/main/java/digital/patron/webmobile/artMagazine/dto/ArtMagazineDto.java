package digital.patron.webmobile.artMagazine.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class ArtMagazineDto {
    private List<Long> id;
    private List<String> type;
    private List<String> title;
    private List<Integer> recommend;
    private List<LocalDateTime> createTime;
    private List<String> thumbnail;
}
