package io.github.juniorcorzo.UrbanStyle.application.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.UserDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
public class TokenService { 
    @Value("${SECRET_KEY}")
    private String SECRET_KEY;
    private final UserService userService;

    public TokenService(UserService userService) {
        this.userService = userService;
    }

    public String generateToken(Authentication authentication) {
        UserDTO user = this.userService.getUserByCredentials(authentication.getName()).data().getFirst();

        Instant now = Instant.now();
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .issuer("localhost:8080")
                .issueTime(Date.from(now))
                .expirationTime(Date.from(now.plus(30, ChronoUnit.DAYS))) // Token expiration time
                .subject(user.id())
                .build();

        try {
            JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
            SignedJWT signedJWT = new SignedJWT(header, claims);
            JWSSigner signer = new MACSigner(SECRET_KEY.getBytes());
            signedJWT.sign(signer);
            return signedJWT.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }

    public String extractUsername(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(SECRET_KEY.getBytes());
            if (signedJWT.verify(verifier)) {
                JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
                return claims.getSubject();
            }

            return null;
        } catch (ParseException | JOSEException e) {
            throw new RuntimeException(e);
        }
    }
}
