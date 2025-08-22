package io.github.juniorcorzo.UrbanStyle.common.domain.exceptions;

public class MissingClaimException extends RuntimeException {
    public MissingClaimException(String claim, String value) {
        super(String.format("Missing claim %s with value %s", claim, value));
    }

    public MissingClaimException(String claim) {
        super(String.format("Missing claim %s", claim));
    }

    public MissingClaimException() {
        super("Failed to extract claim");
    }
}
