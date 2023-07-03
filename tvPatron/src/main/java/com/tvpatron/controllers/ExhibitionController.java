package com.tvpatron.controllers;

import com.tvpatron.artist.domain.Artist;
import com.tvpatron.artwork.service.ArtworkService;
import com.tvpatron.exhibition.domain.Exhibition;
import com.tvpatron.exhibition.service.ExhibitionService;
import com.tvpatron.ipTable.service.IpTableService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.NoSuchElementException;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/{language}")
public class ExhibitionController {
    private final ExhibitionService exhibitionService;
    private final IpTableService ipTableService;
    @GetMapping("/exhibition")
    public String exhibition(@RequestParam(value = "exh_id") Long exhibitionId,
                             @PathVariable String language,
                             HttpServletRequest request,
                             HttpSession session,
                             Model model) {
        String email = (String) session.getAttribute("email_session");
        model.addAttribute("loginStatus", email != null);
        String localization = ipTableService.getLocalizationByIp(request);
        Exhibition exhibition = exhibitionService.findExhibitionById(exhibitionId, language, localization);
        if(exhibition == null) throw new NoSuchElementException();
        model.addAttribute("exhibition", exhibition);
        return  "exhibition/exhibition";
    }
}
