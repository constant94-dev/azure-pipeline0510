package digital.patron.webmobile.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SearchDto {

    private String keyword;

    private String type;

    private Integer p;

    private Long count;

    private Long totalCount;

    private List<Long> id;

    private List<String> name;

    private List<String> thumbnail;

    private List<Long> artistId;

    private List<String> nationality;

    private List<String> artistName;

    private List<Integer> artworkCount;

    private List<Integer> artistCount;

    private List<String> durationTime;
}
