package digital.patron.webmobile.artist.service;

import digital.patron.webmobile.artist.domain.Artist;
import digital.patron.webmobile.artist.domain.ArtistArtistTag;
import digital.patron.webmobile.artist.domain.ArtistTag;
import digital.patron.webmobile.artist.dto.ArtistDto;
import digital.patron.webmobile.artist.repository.ArtistArtistTagRepository;
import digital.patron.webmobile.artist.repository.ArtistGroupRepository;
import digital.patron.webmobile.artist.repository.ArtistRepository;
import digital.patron.webmobile.artwork.domain.Artwork;
import digital.patron.webmobile.exhibition.domain.Exhibition;
import digital.patron.webmobile.integrate.domain.ArtistExhibition;
import digital.patron.webmobile.member.domain.GeneralMember;
import digital.patron.webmobile.member.dto.SearchDto;
import digital.patron.webmobile.member.repository.MemberLikedArtistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ArtistServiceImpl implements ArtistService{

    private final ArtistGroupRepository artistGroupRepository;
    private final ArtistRepository artistRepository;
    private final ArtistArtistTagRepository artistArtistTagRepository;
    private final MemberLikedArtistRepository memberLikedArtistRepository;

    @Override
    public List<Artist> findArtistsByArtistGroupName(String localization, Pageable pageable) {
        List<Artist> artistList = artistGroupRepository.findArtistsByArtistGroupNameOrderByArtistArtistGroupIdAsc(localization, pageable).getContent();
        return artistList;
    }

    @Override
    public Page<Artist> findArtistsByKeyword(String keyword, String localization, Pageable pageable) {
        Page<Artist> artistPage = artistRepository.findArtistsByKeywordLikeOrderByArtistIdAsc(keyword, localization, pageable);
        return artistPage;
    }

    @Override
    public SearchDto createSearchDto(String language, Page<Artist> artistPage){
        List<Artist> artists = artistPage.getContent();
        long artistCount = artists.size();
        return new SearchDto(null, null,null,
                artistCount,
                artistPage.getTotalElements(),
                null,null,
                artists.stream().map(Artist::getProfileImg).collect(Collectors.toList()),
                artists.stream().map(Artist::getId).collect(Collectors.toList()),
                artists.stream().map(a->a.getArtistDetails().stream().filter(ad->ad.getLanguage().equals(language)).findFirst().get().getNationality()).collect(Collectors.toList()),
                artists.stream().map(a->a.getArtistDetails().stream().filter(ad->ad.getLanguage().equals(language)).findFirst().get().getArtistName()).collect(Collectors.toList()),
                null,null,null);
    }
    @Override
    public Artist findArtistById(Long artistId, String localization) {
        Artist artist = artistRepository.findById(artistId).orElseThrow(()-> new NoSuchElementException());
        artist.getArtworks().removeIf(a->!a.getLocalization().contains(localization));
        return artist;
    }
    @Override
    public List<Artist> getSortedArtists(Pageable pageable, String localization, String sortBy){
        Page<Artist> artistList = artistRepository.getSortedArtists(pageable, localization, sortBy);
        return artistList.getContent();
    }

    @Override
    public List<Artist> find15SimilarArtistsByArtistTag(Artist artist, String localization){
        List<ArtistTag> artistTags = artist.getArtistArtistTags().stream().map(ArtistArtistTag::getArtistTag).collect(Collectors.toList());
        List<Artist> similarArtists = artistArtistTagRepository.findSimilarArtists(artistTags, "%" + localization + "%");
        similarArtists.removeIf(s->s.equals(artist));
        return similarArtists.size() > 15 ? similarArtists.subList(0,15) : similarArtists;
    }
    @Override
    public String getFirstArtworkImageOfAnArtist(Artist artist, String localization){
        Optional<Artwork> artistsArtwork = artist.getArtworks().stream().findFirst();
        return artistsArtwork.isPresent() ?
                artistsArtwork.get().getContentsHd().getDefaultImg() : null;
    }
    @Override
    public List<Exhibition> getArtistExhibitions(Artist artist, String localization){
        List<Exhibition> artistExhibitions = new ArrayList<>();
        for (ArtistExhibition ae : artist.getArtistExhibitions()) {
            if (ae.getExhibition().getLocalization().contains(localization)) {
                ae.getExhibition().getArtworkExhibitions().removeIf(a->!a.getArtwork().getLocalization().contains(localization));
                if(ae.getExhibition().getArtworkExhibitions().size() != 0){
                    artistExhibitions.add(ae.getExhibition());
                }
            }
        }
        return artistExhibitions;
    }

    @Override
    public boolean checkIfArtistIsLikedByMember(GeneralMember generalMember, Artist artist){
        return memberLikedArtistRepository.findIdByGeneralMemberAndArtist(generalMember,artist).isPresent();
    }

    @Override
    public int shareArtist(Long artistId){
        try {
            Artist artist = artistRepository.findById(artistId).get();
            artist.increaseNumberOfShares();
            return 1;
        }catch (Exception e){
            log.error("couldn't add share to artist by id = " + artistId + " with error : " + e);
            return 0;
        }
    }
    @Override
    public ArtistDto createArtistDto(List<Artist> artists, String language){
        return new ArtistDto(
                artists.stream().map(Artist::getId).collect(Collectors.toList()),
                artists.stream().map(a->a.getArtistDetails().stream().filter(ad->ad.getLanguage().equals(language)).findFirst().get().getArtistName()).collect(Collectors.toList()),
                artists.stream().map(a->a.getArtistDetails().stream().filter(ad->ad.getLanguage().equals(language)).findFirst().get().getNationality()).collect(Collectors.toList()),
                artists.stream().map(Artist::getProfileImg).collect(Collectors.toList()),
                artists.stream().map(Artist::getNumberOfLikes).collect(Collectors.toList()));
    }
}
