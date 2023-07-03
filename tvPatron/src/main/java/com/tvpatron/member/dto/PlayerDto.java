package com.tvpatron.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Stream;

@Data
@AllArgsConstructor
public class PlayerDto {

    private Long Id;

    private String ArtworkName;
    private String ArtworkIntro;//
    private String ArtworkSource;//
    private String ArtworkSize;//
    private String ArtworkDate;//
    private String ArtworkKeep;//

    private String DefaultImg4K;
    private String OriginalImg4K;

    private Long ArtistId;
    private String ArtistName;
    private String ArtistIntro;//
    private String ArtistProfileImg;//

    private String SoundName;//
    private String SoundUrl;
    private String SoundOriginalUrl;//
    private String SoundLicense;//
    private String SoundCreator;//

    private String shopUrl;

    private List<Long> otherArtistArtworksId;
    private List<String> otherArtistArtworksName;
    private List<String> otherArtistArtworksArtistName;
    private List<String> otherArtistArtworksThumbnail;

    private List<String> otherTagsName;

    private List<Long> otherExhibitionsId;
    private List<String> otherExhibitionsName;
    private List<String> otherExhibitionsArtistName;
    private List<String> otherExhibitionsThumbnail;
    private List<Integer> otherExhibitionsArtistCount;//

    private Boolean artworkLiked;
    private List<String> allCollections;
    private List<Boolean> artworkInCollection;
    private List<Boolean> artworkInRecentCollection;
    private List<String> recentCollections;
    private Boolean exhibitionInCollection;

    private LocalDate viewLastTime;

    private Long currentExhibitionId;
    private String currentExhibitionName;
    private String currentExhibitionIntro;
    private String currentArtistName;
    private Integer currentArtistsCount;
    private String currentExhibitionThumbnail;

}

