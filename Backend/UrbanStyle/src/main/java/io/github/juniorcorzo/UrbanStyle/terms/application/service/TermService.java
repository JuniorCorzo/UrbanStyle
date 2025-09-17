package io.github.juniorcorzo.UrbanStyle.terms.application.service;

import io.github.juniorcorzo.UrbanStyle.common.infrastructure.adapter.dtos.response.ResponseDTO;
import io.github.juniorcorzo.UrbanStyle.terms.application.exceptions.NotFoundTermsValid;
import io.github.juniorcorzo.UrbanStyle.terms.application.exceptions.TermsInsertionException;
import io.github.juniorcorzo.UrbanStyle.terms.application.utils.SemverHelper;
import io.github.juniorcorzo.UrbanStyle.terms.domain.entities.TermsEntity;
import io.github.juniorcorzo.UrbanStyle.terms.domain.enums.Semver;
import io.github.juniorcorzo.UrbanStyle.terms.domain.repository.TermsRepository;
import io.github.juniorcorzo.UrbanStyle.terms.infrastructure.adapter.dto.TermsDTO;
import io.github.juniorcorzo.UrbanStyle.terms.infrastructure.adapter.mapper.TermMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;

@Slf4j
@Service
@RequiredArgsConstructor
public class TermService {
    private final TermsRepository termsRepository;
    private final TermMapper termMapper;

    public ResponseDTO<TermsDTO> getCurrentTerms() {
        TermsEntity terms = this.termsRepository
                .findCurrentTerms()
                .orElseThrow(NotFoundTermsValid::new);

        return new ResponseDTO<>(
                HttpStatus.OK,
                Collections.singletonList(this.termMapper.toDto(terms)),
                "Terms valid found"

        );
    }

    public ResponseDTO<TermsDTO> getTermsByVersion(String version) {
        TermsEntity terms = this.termsRepository
                .findTermsByVersion(version)
                .orElseThrow(NotFoundTermsValid::new);

        return new ResponseDTO<>(
                HttpStatus.OK,
                Collections.singletonList(this.termMapper.toDto(terms)),
                "Terms valid found"
        );
    }

    @Transactional
    public ResponseDTO<Void> publishTerms(MultipartFile multipartFile, Semver semverType) {
        final String contentType = multipartFile.getContentType();
        if (contentType == null || !contentType.equalsIgnoreCase("text/markdown")) {
            log.error("Invalid file type: {}", multipartFile.getOriginalFilename());
            throw new TermsInsertionException("Invalid file type. Only markdown files are accepted.");
        }

        final String version = this.updateVersion(semverType);
        try {
            log.info("Publishing terms with version: {}", version);

            this.termsRepository.removeValid();
            TermsEntity terms = TermsEntity.builder()
                    .content(new String(multipartFile.getBytes()))
                    .version(version)
                    .valid(true)
                    .build();

            this.termsRepository.save(terms);
            return new ResponseDTO<>(
                    HttpStatus.CREATED,
                    "Terms published"

            );
        } catch (Exception e) {
            log.error("Error to insert terms: {}", e.getMessage());
            throw new TermsInsertionException();
        }
    }

    private String updateVersion(Semver semverType) {
        final String currentVersion = this.termsRepository
                .findCurrentVersion()
                .getVersion();


        return new SemverHelper(currentVersion, semverType).getNewVersion();
    }
}
