package digital.patron.webmobile.artMagazine.service;

import digital.patron.webmobile.artMagazine.domain.ArtMagazine;
import digital.patron.webmobile.exhibition.domain.Exhibition;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ArtMagazineService {
    List<ArtMagazine> getArtMagazineByType(String type);

    List<ArtMagazine> get8RecommendedArtMagazines(List<ArtMagazine> artMagazines);

    void removeRecommendedMagazinesFromList(List<ArtMagazine> artMagazines);

    List<String> getArtMagazineTypes(List<ArtMagazine> artMagazines);

    ArtMagazine getArtMagazineById(Long artMagazineId);

    List<ArtMagazine> findRecommendedArtMagazines(Pageable pageable);

    ArtMagazine getArtMagazineByExhibition(Exhibition exhibition);
}
