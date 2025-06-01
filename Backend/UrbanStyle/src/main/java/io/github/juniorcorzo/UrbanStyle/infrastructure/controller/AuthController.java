package io.github.juniorcorzo.UrbanStyle.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.application.service.AuthService;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.UserDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.request.UserCredentials;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.AuthResponse;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
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
        ResponseCookie cookie = ResponseCookie.from("accessToken", accessToken)
                .httpOnly(true)
                .maxAge(Duration.ofDays(30))
                .path("/")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return new AuthResponse(accessToken);
    }

    @GetMapping("/verify")
    public ResponseDTO<UserDTO> verify(@NotBlank @CookieValue("accessToken") String token) {
        return this.authService.verifySession(token);
    }
    
    @DeleteMapping("/sign-out")
    public ResponseDTO<Object> signOut(HttpServletResponse response){
        response.addHeader(
                HttpHeaders.SET_COOKIE,
                ResponseCookie.from("accessToken", "chaooooo-no-vuelvas-a-volver")
                        .httpOnly(true)
                        .maxAge(0)
                        .path("/")
                        .build()
                        .toString()
        );

        return new ResponseDTO<>(
                HttpStatus.OK,
                "User signed out"
        );
    }
}
