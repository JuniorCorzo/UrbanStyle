package io.github.juniorcorzo.UrbanStyle.domain.exceptions;

public class CredentialsNotValid extends RuntimeException {
    public CredentialsNotValid() {
        super("Authentication failed: invalid credentials");
    }
}
