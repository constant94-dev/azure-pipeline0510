package digital.patron.webmobile.artwork.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ArtworkDto {
    private String name;
    private String artistNationality;
    private String artistName;
    private String artistIntro;
    private String description;
    private String source;
    private String size;
    private String category;
    private String hd;
    private String thumbnail;
    private String year;
    private String soundName;
    private String soundCreator;
    private String soundUrl;
    private String soundLicense;
    private int duration;
    private Long id;
    private Long artistId;
    private String artistThumbnail;
    private Long exhId;
    private List<Long> otherArtistArtworksId;
    private List<String> otherArtistArtworksName;
    private List<String> otherArtistArtworksArtistName;
    private List<String> otherArtistArtworksThumbnail;
    private List<String> otherTagsName;
    private List<String> otherTagsThumbnail;
    private List<Long> otherExhibitionId;
    private List<String> otherExhibitionName;
    private List<String> otherExhibitionArtistName;
    private List<Integer> otherExhibitionArtistMore;
    private List<Integer> otherExhibitionArtworkCount;
    private List<String> otherExhibitionDuration;
    private List<String> otherExhibitionThumbnail;

}
