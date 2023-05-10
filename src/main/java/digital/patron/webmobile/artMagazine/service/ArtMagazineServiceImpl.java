package digital.patron.webmobile.artMagazine.service;

import digital.patron.webmobile.artMagazine.domain.ArtMagazine;
import digital.patron.webmobile.artMagazine.repository.ArtMagazineRepository;
import digital.patron.webmobile.exhibition.domain.Exhibition;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ArtMagazineServiceImpl implements ArtMagazineService {
    private final ArtMagazineRepository artMagazineRepository;
    @Override
    public List<ArtMagazine> getArtMagazineByType(String type){
        return type.equalsIgnoreCase("all") ?
                artMagazineRepository.findAll() : artMagazineRepository.getByType(type);
    }
    @Override
    public List<ArtMagazine> get8RecommendedArtMagazines(List<ArtMagazine> artMagazines){
        List<ArtMagazine> recommendedMagazines = artMagazines.stream().filter(a -> a.getRecommended() != null).collect(Collectors.toList());
        return recommendedMagazines.size() > 8 ? recommendedMagazines.subList(0,8) : recommendedMagazines;
    }
    @Override
    public void removeRecommendedMagazinesFromList(List<ArtMagazine> artMagazines){
        artMagazines.removeIf(a->a.getRecommended() != null);
    }

    @Override
    public List<String> getArtMagazineTypes(List<ArtMagazine> artMagazines){
        return artMagazines.stream().map(ArtMagazine::getType).distinct().collect(Collectors.toList());
    }
    @Override
    public ArtMagazine getArtMagazineById(Long artMagazineId){
        return artMagazineRepository.findById(artMagazineId).orElseThrow(()->new NoSuchElementException());
    }

    @Override
    public List<ArtMagazine> findRecommendedArtMagazines(Pageable pageable){
        return artMagazineRepository.findRecommendedMagazines(pageable).getContent();
    }

    @Override
    public ArtMagazine getArtMagazineByExhibition(Exhibition exhibition){
        return artMagazineRepository.getArtMagazineByExhibition(exhibition);
    }
}
