package io.github.juniorcorzo.UrbanStyle.infrastructure.security.mediator;

import io.github.juniorcorzo.UrbanStyle.application.service.BaseAuthentication;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtHeaderAuthHandler implements AuthenticationMediator {
    private final BaseAuthentication baseAuthentication;

    @Override
    public void authenticate(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null) return;

        log.info("Processing Authentication by header for the endpoint {}", request.getRequestURI());
        if (!authorizationHeader.startsWith("Bearer")) {
            return;
        }

        String token = authorizationHeader.substring(7);
        baseAuthentication.authenticate(request, response, token);
    }
}
