package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.http.HttpStatusCode;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ResponseDTO<T>(HttpStatusCode status, List<T> data, String message) {
    public ResponseDTO(HttpStatusCode status, List<T> data) {
        this(status, data, null);
    }

    public ResponseDTO(HttpStatusCode status, String message) {
        this(status, null, message);
    }
}
