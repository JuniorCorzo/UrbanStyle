package io.github.juniorcorzo.UrbanStyle.application.service;

import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.request.UserCredentials;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;
    public AuthService(TokenService tokenService, AuthenticationManager authenticationManager) {
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager;
    }

    public String login(UserCredentials credentials) {
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(credentials.email(), credentials.password());

        this.authenticationManager.authenticate(authToken);
        System.out.printf("User %s authenticated successfully%n", authToken);
        return tokenService.generateToken(authToken);
    }
}

