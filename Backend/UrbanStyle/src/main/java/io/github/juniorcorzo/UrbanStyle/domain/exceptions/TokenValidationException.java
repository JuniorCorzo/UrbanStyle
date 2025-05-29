package io.github.juniorcorzo.UrbanStyle.domain.exceptions;

public class TokenValidationException extends RuntimeException {
    public TokenValidationException() {
        super("Invalid token");
    }

    public TokenValidationException(String message) {
        super(message);
    }
}
