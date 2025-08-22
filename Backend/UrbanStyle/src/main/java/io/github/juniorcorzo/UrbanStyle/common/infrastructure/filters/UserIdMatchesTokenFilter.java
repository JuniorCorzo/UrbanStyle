package io.github.juniorcorzo.UrbanStyle.common.infrastructure.filters;

import io.github.juniorcorzo.UrbanStyle.auth.application.service.TokenService;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.TokenValidationException;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.UserIdMismatchException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UserIdMatchesTokenFilter extends OncePerRequestFilter {
    private final TokenService tokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, @NotNull HttpServletResponse response, @NotNull FilterChain filterChain) throws ServletException, IOException {
        final String requestMethod = request.getMethod();
        if (requestMethod.equals("POST")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = this.getTokenInCookie(request.getCookies())
                .orElseGet(() -> Optional
                        .ofNullable(request.getHeader("Authorization"))
                        .filter(header -> header.startsWith("Bearer"))
                        .map(header -> header.substring(7))
                        .orElseThrow(TokenValidationException::new)
                );

        final String userId = this.tokenService.extractClaim(token, "userId");

        this.validateByPath(request, userId);
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        final String path = request.getRequestURI();
        return !path.startsWith("/users");
    }

    private Optional<String> getTokenInCookie(Cookie[] cookies) {
        if (cookies == null) return Optional.empty();

        return Arrays.stream(cookies)
                .filter((cookie) -> cookie.getName().equals("accessToken"))
                .map(Cookie::getValue)
                .findFirst();

    }

    private void validateByPath(HttpServletRequest request, final String tokenUserId) {
        final String userId = request.getParameter("user-id");
        if (!userId.equals(tokenUserId)) {
            throw new UserIdMismatchException();
        }
    }
}


