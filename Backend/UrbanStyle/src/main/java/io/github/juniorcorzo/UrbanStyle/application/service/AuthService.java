package io.github.juniorcorzo.UrbanStyle.application.service;

import io.github.juniorcorzo.UrbanStyle.domain.exceptions.CredentialsNotValid;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.UserDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.request.UserCredentials;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    public String login(UserCredentials credentials) {
        try {

        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(credentials.email(), credentials.password());

        this.authenticationManager.authenticate(authToken);
        return tokenService.generateToken(authToken);
        } catch (Exception e) {
            log.error("Error logging in: {}", e.getMessage(), e);
            throw new CredentialsNotValid();
        }
    }

    public ResponseDTO<UserDTO> verifySession(String token) {
        String userId = this.tokenService.extractClaim(token, "userId");
        return this.userService.getUserById(userId);
    }
}

