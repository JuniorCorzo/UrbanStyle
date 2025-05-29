package io.github.juniorcorzo.UrbanStyle.domain.exceptions;

public class TokenGenerationException extends RuntimeException {
    public TokenGenerationException(String message) {
        super(message);
    }

    public TokenGenerationException() {
        super("Failed to generate token");
    }
}
