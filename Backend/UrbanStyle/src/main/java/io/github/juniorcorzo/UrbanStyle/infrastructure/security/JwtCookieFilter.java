package io.github.juniorcorzo.UrbanStyle.infrastructure.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.juniorcorzo.UrbanStyle.application.service.CustomerUserDetailsService;
import io.github.juniorcorzo.UrbanStyle.application.service.TokenService;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ResponseError;
import io.github.juniorcorzo.UrbanStyle.domain.exceptions.TokenValidationException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtCookieFilter extends OncePerRequestFilter {
    private final TokenService tokenService;
    private final CustomerUserDetailsService userDetailsService;
    private final ObjectMapper objectMapper;


    @Override
    protected void doFilterInternal(
            @NotNull HttpServletRequest request,
            @NotNull HttpServletResponse response,
            @NotNull FilterChain filterChain
    ) throws ServletException, IOException {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            filterChain.doFilter(request, response);
            return;
        }

        log.info("Processing Authentication by cookie for the endpoint {}", request.getRequestURI());
        String token = Arrays.stream(cookies)
                .filter(cookie -> cookie.getName().equals("accessToken"))
                .findFirst()
                .map(Cookie::getValue)
                .orElseThrow(TokenValidationException::new);

        try {
            String email = tokenService.extractUsername(token);

            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        this.userDetailsService,
                        email,
                        null
                );

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);
            }

            filterChain.doFilter(request, response);
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
