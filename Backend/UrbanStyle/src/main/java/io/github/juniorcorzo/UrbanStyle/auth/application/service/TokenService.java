package io.github.juniorcorzo.UrbanStyle.auth.application.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.MissingClaimException;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.TokenExpiredException;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.TokenGenerationException;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.TokenValidationException;
import io.github.juniorcorzo.UrbanStyle.common.infrastructure.adapter.mapper.UserMapper;
import io.github.juniorcorzo.UrbanStyle.user.domain.repository.UserRepository;
import io.github.juniorcorzo.UrbanStyle.user.infrastructure.adapter.dto.common.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class TokenService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    @Value("${SECRET_KEY}")
    @SuppressWarnings("unused")
    private String SECRET_KEY;


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
        final UserDTO user = userMapper.toDto(
                this.userRepository
                        .findUserByEmail(authentication.getName())
                        .orElseThrow(() -> new UsernameNotFoundException(
                                String.format("User with email %s not found", authentication.getName()))
                        )
        );
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
