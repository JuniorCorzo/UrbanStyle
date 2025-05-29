package io.github.juniorcorzo.UrbanStyle.domain.exceptions;

public class FieldExists extends RuntimeException {
    public FieldExists(String field, String value) {
        super(String.format("%s already exists: %s", field, value));
    }
}
