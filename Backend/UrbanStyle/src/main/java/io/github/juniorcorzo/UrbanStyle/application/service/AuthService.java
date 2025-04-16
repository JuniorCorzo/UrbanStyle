package io.github.juniorcorzo.UrbanStyle.application.service;

import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.UserDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.request.UserCredentials;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    public AuthService(TokenService tokenService, AuthenticationManager authenticationManager, @Lazy UserService userService) {
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    public String login(UserCredentials credentials) {
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(credentials.email(), credentials.password());

        this.authenticationManager.authenticate(authToken);
        return tokenService.generateToken(authToken);
    }

    public ResponseDTO<UserDTO> verifySession(String token) {
        String userId = this.tokenService.extractClaim(token, "userId");
        return this.userService.getUserById(userId);
    }
}

