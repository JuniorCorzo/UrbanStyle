package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.http.HttpStatusCode;

import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ResponseDTO<T>(
        HttpStatusCode status,
        List<T> data,
        String message,
        LocalDateTime time
) {
    public ResponseDTO(HttpStatusCode status, List<T> data, String message) {
        this(status, data, message, LocalDateTime.now());
    }

    public ResponseDTO(HttpStatusCode status, String message) {
        this(status, null, message, LocalDateTime.now());
    }
}
