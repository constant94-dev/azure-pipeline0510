package digital.patron.webmobile.artist.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ArtistDto {
    public List<Long> id;
    public List<String> name;
    public List<String> nationality;
    public List<String> profileImg;
    public List<Integer> numberOfLikes;
}
