package io.github.juniorcorzo.UrbanStyle.common.domain.exceptions;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FieldExists extends RuntimeException {
    public FieldExists(String field, String value) {
        super(String.format("%s already exists: %s", field, value));
    }
}
