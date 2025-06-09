package io.github.juniorcorzo.UrbanStyle.application.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ResponseError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collection;
import java.util.List;


@Slf4j
@RequiredArgsConstructor
@Service
public class BaseAuthentication {
    private final TokenService tokenService;
    private final CustomerUserDetailsService userDetailsService;
    private final ObjectMapper objectMapper;

    public void authenticate(HttpServletRequest request,
                             HttpServletResponse response,
                             String token
    ) throws IOException {
        try {
            String email = tokenService.extractUsername(token);
            String role = tokenService.extractClaim(token, "userRole");

            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                Collection<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        this.userDetailsService.loadUserByUsername(email),
                        null,
                        authorities
                );

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);
            }

        } catch (RuntimeException e) {
            log.error("Error processing authentication by cookie: {}", e.getMessage(), e);
            this.sendErrorResponse(response, e.getMessage());
        }
    }

    private void sendErrorResponse(HttpServletResponse response, String message) throws IOException {
        ResponseError responseError = new ResponseError(HttpStatus.UNAUTHORIZED, message);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.addHeader(
                HttpHeaders.SET_COOKIE,
                ResponseCookie.from("accessToken", "chaooooo-no-vuelvas-a-volver")
                        .httpOnly(true)
                        .maxAge(0)
                        .path("/")
                        .build()
                        .toString()
        );

        response.getWriter().write(this.objectMapper.writeValueAsString(responseError));
    }

}

