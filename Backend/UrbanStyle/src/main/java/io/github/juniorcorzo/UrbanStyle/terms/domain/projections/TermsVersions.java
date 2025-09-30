package io.github.juniorcorzo.UrbanStyle.terms.domain.projections;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record TermsVersions(
        String version,
        LocalDateTime publishedAt
) {
}
