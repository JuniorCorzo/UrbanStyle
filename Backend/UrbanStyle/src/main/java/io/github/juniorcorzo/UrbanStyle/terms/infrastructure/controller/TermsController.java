package io.github.juniorcorzo.UrbanStyle.terms.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.terms.domain.enums.Semver;
import io.github.juniorcorzo.UrbanStyle.terms.infrastructure.adapter.dto.TermsDTO;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import io.github.juniorcorzo.UrbanStyle.common.infrastructure.adapter.dtos.response.ResponseDTO;
import io.github.juniorcorzo.UrbanStyle.terms.application.service.TermService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/terms")
@RequiredArgsConstructor
@SuppressWarnings("unused")
public class TermsController {
  private final TermService termService;

  @GetMapping("/current")
  ResponseDTO<TermsDTO> getCurrentTerms() {
    return this.termService.getCurrentTerms();
  }

  @GetMapping()
  ResponseDTO<TermsDTO> getTermsByVersion(@RequestParam String version) {
      return this.termService.getTermsByVersion(version);
  }

  @PostMapping(value = "/publish")
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasRole('ADMIN')")
  ResponseDTO<Void> publishTerms(@RequestParam("file") MultipartFile multipartFile, @RequestParam Semver semver) {
    return this.termService.publishTerms(multipartFile, semver);
  }
}
