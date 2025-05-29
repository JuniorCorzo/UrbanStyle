package io.github.juniorcorzo.UrbanStyle.domain.dtos;

import org.springframework.http.HttpStatus;

public record ResponseError(
        HttpStatus status,
        String error
) {
}
