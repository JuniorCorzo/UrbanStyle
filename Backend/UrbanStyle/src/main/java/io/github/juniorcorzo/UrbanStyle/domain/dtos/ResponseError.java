package io.github.juniorcorzo.UrbanStyle.domain.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.http.HttpStatus;

import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ResponseError(
        HttpStatus status,
        String error,
        Map<String, String> errors
) {

    public ResponseError(HttpStatus status, String error) {
        this(status, error, null);
    }

    public ResponseError(HttpStatus status, Map<String, String> errors) {
        this(status, null, errors);
    }

    public ResponseError(HttpStatus status, String error, Map<String, String> errors) {
        this.status = status;
        this.error = error;
        this.errors = errors;
    }


}
