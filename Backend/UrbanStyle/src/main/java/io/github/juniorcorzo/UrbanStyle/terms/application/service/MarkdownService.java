package io.github.juniorcorzo.UrbanStyle.terms.application.service;

import io.github.juniorcorzo.UrbanStyle.terms.domain.projections.TermsVersions;
import io.github.juniorcorzo.UrbanStyle.terms.domain.repository.TermsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class MarkdownService {
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd 'de' MMMM, yyyy", Locale.of("es", "CO"));
    private final TermsRepository termsRepository;

    @Value("${app.historyVersionUrl:/terms?version=}")
    private String HistoryVersionUrl;

    public String process(String content, final String version) {
        log.info("Processing markdown content");
        content = this.replacePlaceholder(content, version);
        content = this.replaceHistoryVersion(content);

        return content;
    }

    private String replacePlaceholder(String content, final String version) {
        final Map<String, String> replacements = Map.of(
                "version", version,
                "publishedAt", LocalDate.now().format(DATE_FORMAT)
        );

        for (Map.Entry<String, String> replacement : replacements.entrySet()) {
            final String regex = String.format("\\{\\{%s\\}\\}", replacement.getKey());
            content = content.replaceAll(regex, replacement.getValue());
        }
        return content;
    }

    private String replaceHistoryVersion(String content) {
        final String regex = "\\{\\{versionHistory}}";
        final List<TermsVersions> allVersions = this.termsRepository.findAllVersions()
                .orElse(Collections.singletonList(TermsVersions.builder()
                                .version("1.0.0")
                                .publishedAt(LocalDateTime.now())
                                .build()
                        )
                );

        final String history = this.getHistoryFormated(allVersions);
        return content.replaceAll(regex, history);
    }

    private String getHistoryFormated(final List<TermsVersions> versions) {
        final StringBuilder stringBuilder = new StringBuilder();
        versions.forEach(version ->
                stringBuilder.append(
                        String.format(
                                "- [**%s** | %s](%s)\n",
                                version.version(),
                                version.publishedAt().format(DATE_FORMAT),
                                this.HistoryVersionUrl + version.version()
                        )
                )
        );

        return stringBuilder.toString();
    }

}
