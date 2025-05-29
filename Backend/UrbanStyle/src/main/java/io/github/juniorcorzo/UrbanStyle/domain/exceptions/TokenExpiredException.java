package io.github.juniorcorzo.UrbanStyle.domain.exceptions;

public class TokenExpiredException extends RuntimeException {
    public TokenExpiredException() {
        super("Token expired");
    }

    public TokenExpiredException(String message) {
        super(message);
    }
}
