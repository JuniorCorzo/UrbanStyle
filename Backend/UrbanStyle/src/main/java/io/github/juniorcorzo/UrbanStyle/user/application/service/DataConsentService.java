package io.github.juniorcorzo.UrbanStyle.user.application.service;

import io.github.juniorcorzo.UrbanStyle.terms.domain.projections.ObtainVersion;
import io.github.juniorcorzo.UrbanStyle.terms.domain.repository.TermsRepository;
import io.github.juniorcorzo.UrbanStyle.user.domain.entities.DataConsent;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataConsentService {
    private final TermsRepository termsRepository;

    public DataConsent prepareDataConsent(final DataConsent dataConsent, final HttpServletRequest request) {
        final String termsVersion = this.termsRepository.findCurrentVersion()
                .map(ObtainVersion::getVersion)
                .orElse(null);

        dataConsent.setAcceptedAt(LocalDateTime.now());
        dataConsent.setIpAddress(this.hashIpAddress(request.getRemoteAddr()));
        dataConsent.setVersion(termsVersion);

        return dataConsent;
    }

    private String hashIpAddress(String ipAddress) {
        try {
            log.info("Hashing IP address");
            MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
            byte[] ipHashed = messageDigest.digest(ipAddress.getBytes());
            return Base64.getEncoder().encodeToString(ipHashed);
        } catch (NoSuchAlgorithmException e) {
            log.error("Error hashing IP address: {}", e.getMessage(), e);
            throw new RuntimeException(e);
        }
    }
}
