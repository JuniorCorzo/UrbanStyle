package io.github.juniorcorzo.UrbanStyle.infrastructure.security;

import io.github.juniorcorzo.UrbanStyle.application.service.CustomerUserDetailsService;
import io.github.juniorcorzo.UrbanStyle.application.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;

@Component
@Slf4j
public class JwtCookieFilter extends OncePerRequestFilter {
    private final TokenService tokenService;
    private final CustomerUserDetailsService userDetailsService;

    public JwtCookieFilter(TokenService tokenService, CustomerUserDetailsService userDetailsService) {
        this.tokenService = tokenService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        log.info("Processing Authentication by cookie for the endpoint {}", request.getRequestURI());

        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            filterChain.doFilter(request, response);
            return;
        }

        Optional<String> token = Arrays.stream(cookies)
                .filter(cookie -> cookie.getName().equals("accessToken"))
                .findFirst()
                .map(Cookie::getValue);


        String email = tokenService.extractUsername(
                token.orElse(null)
        );

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
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
    }
}
