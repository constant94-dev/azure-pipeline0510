package digital.patron.webmobile.controllers;

import digital.patron.webmobile.artMagazine.domain.ArtMagazine;
import digital.patron.webmobile.artMagazine.dto.ArtMagazineDto;
import digital.patron.webmobile.artMagazine.service.ArtMagazineService;
import digital.patron.webmobile.common.annotation.CurrentMember;
import digital.patron.webmobile.common.utils.BaseTimeEntity;
import digital.patron.webmobile.member.domain.GeneralMember;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@Slf4j
@RequiredArgsConstructor
public class ArtMagazineController {
    private final ArtMagazineService artMagazineService;

    @GetMapping("/art-magazine")
    public String artMagazine(@CurrentMember GeneralMember generalMember,
                              Model model){
        List<ArtMagazine> artMagazines = artMagazineService.getArtMagazineByType("all");
        List<ArtMagazine> recommended8Magazines = artMagazineService.get8RecommendedArtMagazines(artMagazines);
        artMagazineService.removeRecommendedMagazinesFromList(artMagazines);
        List<String> artMagazineTypes = artMagazineService.getArtMagazineTypes(artMagazines);
        model.addAttribute("recommended", recommended8Magazines);
        model.addAttribute("artMagazineTypes", artMagazineTypes);
        model.addAttribute("artMagazines", artMagazines);
        model.addAttribute("generalMember", generalMember);
        return "artmagazine/artmagazine";
    }

    @PostMapping("/api/art-magazine")
    public ResponseEntity<?> artMagazine(@RequestParam(value = "type") String type){
        List<ArtMagazine> artMagazines = artMagazineService.getArtMagazineByType(type);
        ArtMagazineDto artMagazineDto = new ArtMagazineDto(
                artMagazines.stream().map(ArtMagazine::getId).collect(Collectors.toList()),
                artMagazines.stream().map(ArtMagazine::getType).collect(Collectors.toList()),
                artMagazines.stream().map(ArtMagazine::getTitle).collect(Collectors.toList()),
                artMagazines.stream().map(ArtMagazine::getRecommended).collect(Collectors.toList()),
                artMagazines.stream().map(BaseTimeEntity::getCreateTime).collect(Collectors.toList()),
                artMagazines.stream().map(ArtMagazine::getThumbnail).collect(Collectors.toList())
        );
        return ResponseEntity.status(HttpStatus.OK).body(artMagazineDto);
    }

    @GetMapping("/art-magazine-detail")
    public String artMagazineDetail(
                              @RequestParam(name = "artMagazineId") Long artMagazineId,
                              @CurrentMember GeneralMember generalMember,
                              HttpServletRequest request,
                              Model model){
        ArtMagazine artMagazine = artMagazineService.getArtMagazineById(artMagazineId);
        model.addAttribute("artMagazine", artMagazine);
        model.addAttribute("generalMember", generalMember);
        model.addAttribute("ogImg",artMagazine.getThumbnail());
        model.addAttribute("ogUrl", request.getRequestURL().append('?').append(request.getQueryString()));

        return "artmagazine/artmagazine-detail";
    }
}
