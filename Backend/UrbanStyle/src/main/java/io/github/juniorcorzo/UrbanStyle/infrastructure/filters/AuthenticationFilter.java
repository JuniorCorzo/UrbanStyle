package io.github.juniorcorzo.UrbanStyle.infrastructure.filters;

import io.github.juniorcorzo.UrbanStyle.infrastructure.security.mediator.AuthenticationMediator;
import io.github.juniorcorzo.UrbanStyle.infrastructure.security.mediator.JwtCookieAuthHandler;
import io.github.juniorcorzo.UrbanStyle.infrastructure.security.mediator.JwtHeaderAuthHandler;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AuthenticationFilter extends OncePerRequestFilter {
    private final ApplicationContext applicationContext;

    @Override
    protected void doFilterInternal(HttpServletRequest request, @NotNull HttpServletResponse response, @NotNull FilterChain filterChain) throws ServletException, IOException {
        AuthenticationMediator authenticationMediator;
        Cookie[] cookies = request.getCookies();
        boolean isPresentCookie = cookies != null && Arrays.stream(cookies).anyMatch((cookie) -> cookie.getName().equals("accessToken"));
        if (isPresentCookie) {
            authenticationMediator = applicationContext.getBean(JwtCookieAuthHandler.class);
            authenticationMediator.authenticate(request, response);
            filterChain.doFilter(request, response);
            return;
        }

            authenticationMediator = applicationContext.getBean(JwtHeaderAuthHandler.class);
            authenticationMediator.authenticate(request, response);
            filterChain.doFilter(request, response);
    }
}
