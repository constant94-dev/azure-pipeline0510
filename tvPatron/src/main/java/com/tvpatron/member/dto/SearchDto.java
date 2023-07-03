package com.tvpatron.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SearchDto {

    private Integer artworkCount;

    private List<Long> artworkId;

    private List<String> artworkName;

    private List<String> artworkThumbNail;

    private List<String> artworkArtistName;
}
