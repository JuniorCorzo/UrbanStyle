package io.github.juniorcorzo.UrbanStyle.infrastructure.security.mediator;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public interface AuthenticationMediator {
    void authenticate( HttpServletRequest request, HttpServletResponse response) throws IOException;
}
