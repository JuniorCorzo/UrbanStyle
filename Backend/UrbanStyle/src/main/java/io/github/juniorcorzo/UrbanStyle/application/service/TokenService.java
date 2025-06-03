package io.github.juniorcorzo.UrbanStyle.application.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import io.github.juniorcorzo.UrbanStyle.domain.exceptions.MissingClaimException;
import io.github.juniorcorzo.UrbanStyle.domain.exceptions.TokenExpiredException;
import io.github.juniorcorzo.UrbanStyle.domain.exceptions.TokenGenerationException;
import io.github.juniorcorzo.UrbanStyle.domain.exceptions.TokenValidationException;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.UserDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Optional;

@Service
public class TokenService {
    private final UserService userService;
    @Value("${SECRET_KEY}")
    private String SECRET_KEY;

    public TokenService(UserService userService) {
        this.userService = userService;
    }

    private static JWTClaimsSet getJwtClaimsSet(UserDTO user) {
        Instant now = Instant.now();
        return new JWTClaimsSet.Builder()
                .issuer("http://localhost:8080")
                .issueTime(Date.from(now))
                .expirationTime(Date.from(now.plus(30, ChronoUnit.DAYS)))
                .subject(user.email())
                .claim("userId", user.id())
                .claim("userRole", user.role())
                .build();
    }

    public String generateToken(Authentication authentication) {
            UserDTO user = this.userService.getUserByCredentials(authentication.getName()).data().getFirst();
        return this.generateToken(user);
    }

    public String generateToken(UserDTO user) {
        try {
            JWTClaimsSet claims = getJwtClaimsSet(user);
            JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
            SignedJWT signedJWT = new SignedJWT(header, claims);
            JWSSigner signer = new MACSigner(SECRET_KEY.getBytes());
            signedJWT.sign(signer);
            return signedJWT.serialize();
        } catch (JOSEException e) {
            throw new TokenGenerationException();
        }
    }

    public String extractUsername(String token) {
        return Optional.ofNullable(this.extractClaims(token))
                .orElseThrow(MissingClaimException::new)
                .getSubject();
    }

    public String extractClaim(String token, String claim) {
        try {
            return Optional.ofNullable(this.extractClaims(token))
                    .orElseThrow(() -> new MissingClaimException(claim))
                    .getStringClaim(claim);

        } catch (ParseException e) {
            throw new TokenValidationException("Error extracting the claim");
        }
    }

    private JWTClaimsSet extractClaims(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(SECRET_KEY.getBytes());
            if (signedJWT.verify(verifier)) {
                this.verifyExpiration(signedJWT.getJWTClaimsSet());
                return signedJWT.getJWTClaimsSet();
            }

            throw new TokenValidationException();
        } catch (ParseException | JOSEException e) {
            throw new MissingClaimException();
        }
    }

    private void verifyExpiration(JWTClaimsSet claims) {
        Date exp = Optional.ofNullable(claims.getExpirationTime())
                .orElseThrow(() -> new TokenValidationException("Missing expiration time"));

        if (exp.before(new Date())) {
            throw new TokenExpiredException();
        }
    }
}
