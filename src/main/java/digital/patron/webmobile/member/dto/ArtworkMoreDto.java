package digital.patron.webmobile.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ArtworkMoreDto {
    private Boolean artworkLiked;
    private Boolean exhibitionSaved;
    private Long exh_id;
    private String artworkDescription;
}
