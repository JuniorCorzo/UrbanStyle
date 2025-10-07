package io.github.juniorcorzo.UrbanStyle.auth.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.auth.application.service.AuthService;
import io.github.juniorcorzo.UrbanStyle.common.application.utils.CookiesUtils;
import io.github.juniorcorzo.UrbanStyle.user.infrastructure.adapter.dto.common.UserDTO;
import io.github.juniorcorzo.UrbanStyle.auth.infrastructure.adapter.dto.request.UserCredentials;
import io.github.juniorcorzo.UrbanStyle.auth.infrastructure.adapter.dto.response.AuthResponse;
import io.github.juniorcorzo.UrbanStyle.common.infrastructure.adapter.dtos.response.ResponseDTO;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@SuppressWarnings("unused")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody UserCredentials credentials, HttpServletResponse response) {
        String accessToken = authService.login(credentials);
        CookiesUtils.createCookie(response, "accessToken", accessToken, 30);

        return new AuthResponse(accessToken);
    }

    @GetMapping("/verify")
    @PreAuthorize("hasRole('USER')")
    public ResponseDTO<UserDTO> verify(@NotBlank @CookieValue("accessToken") String token) {
        return this.authService.verifySession(token);
    }
    
    @DeleteMapping("/sign-out")
    @PreAuthorize("hasRole('USER')")
    public ResponseDTO<Object> signOut(HttpServletResponse response){
        CookiesUtils.clearCookie(response, "accessToken");

        return new ResponseDTO<>(
                HttpStatus.OK,
                "User signed out"
        );
    }
}
