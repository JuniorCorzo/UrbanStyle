package io.github.juniorcorzo.UrbanStyle.auth.application.service;

import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.CredentialsNotValid;
import io.github.juniorcorzo.UrbanStyle.user.infrastructure.adapter.dto.common.UserDTO;
import io.github.juniorcorzo.UrbanStyle.auth.infrastructure.adapter.dto.request.UserCredentials;
import io.github.juniorcorzo.UrbanStyle.common.infrastructure.adapter.dtos.response.ResponseDTO;
import io.github.juniorcorzo.UrbanStyle.user.application.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

