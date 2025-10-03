package io.github.juniorcorzo.UrbanStyle.terms.infrastructure.adapter.dto;

import java.time.LocalDateTime;

public record TermsDTO(
        String content,
        String version,
        boolean valid,
        LocalDateTime publishedAt
) {
}
