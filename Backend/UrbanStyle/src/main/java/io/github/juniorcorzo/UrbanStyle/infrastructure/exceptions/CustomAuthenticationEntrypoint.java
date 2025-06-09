package io.github.juniorcorzo.UrbanStyle.infrastructure.exceptions;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ResponseError;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationEntrypoint implements AuthenticationEntryPoint {
    private final ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");

        this.objectMapper.writeValue(response.getOutputStream(), ResponseError.builder()
                .status(HttpStatus.UNAUTHORIZED)
                .error(authException.getMessage())
                .build()
        );
    }
}
