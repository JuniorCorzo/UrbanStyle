package io.github.juniorcorzo.UrbanStyle.infrastructure.filters;

import io.github.juniorcorzo.UrbanStyle.application.service.TokenService;
import io.github.juniorcorzo.UrbanStyle.domain.exceptions.TokenValidationException;
import io.github.juniorcorzo.UrbanStyle.domain.exceptions.UserIdMismatchException;
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

        final String token = Arrays.stream(request.getCookies())
                .filter((cookie) -> cookie.getName().equals("accessToken"))
                .findFirst()
                .map(Cookie::getValue)
                .orElseThrow(TokenValidationException::new);
        final String userId = this.tokenService.extractClaim(token, "userId");

        this.validateByPath(request, userId);
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        final String path = request.getRequestURI();
        return !path.startsWith("/users");
    }

    private void validateByPath(HttpServletRequest request, final String tokenUserId) {
        final String userId = request.getParameter("user-id");
        if (!userId.equals(tokenUserId)) {
            throw new UserIdMismatchException();
        }
    }
}


