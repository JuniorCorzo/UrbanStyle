package io.github.juniorcorzo.UrbanStyle.auth.infrastructure.security.mediator;

import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.TokenValidationException;
import io.github.juniorcorzo.UrbanStyle.auth.application.service.BaseAuthentication;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Arrays;


@Component
@Slf4j
@RequiredArgsConstructor
public class JwtCookieAuthHandler implements AuthenticationMediator {
    private final BaseAuthentication baseAuthentication;
    
    @Override
    public void authenticate(HttpServletRequest request, HttpServletResponse response) throws IOException {
        log.info("Processing Authentication by cookie for the endpoint {}", request.getRequestURI());
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return;

        String token = Arrays.stream(cookies)
                .filter(cookie -> cookie.getName().equals("accessToken"))
                .findFirst()
                .map(Cookie::getValue)
                .orElseThrow(TokenValidationException::new);

        this.baseAuthentication.authenticate(request, response, token);

    }
}
