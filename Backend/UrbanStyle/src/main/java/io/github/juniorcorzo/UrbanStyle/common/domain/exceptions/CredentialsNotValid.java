package io.github.juniorcorzo.UrbanStyle.common.domain.exceptions;

public class CredentialsNotValid extends RuntimeException {
    public CredentialsNotValid() {
        super("Authentication failed: invalid credentials");
    }
}
