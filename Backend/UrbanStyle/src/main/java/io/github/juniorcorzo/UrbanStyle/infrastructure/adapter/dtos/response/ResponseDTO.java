package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatusCode;

import java.time.LocalDate;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ResponseDTO<T>(
        HttpStatusCode status,
        List<T> data,
        String message,
        LocalDate time
) {
    public ResponseDTO(HttpStatusCode status, List<T> data, String message) {
        this(status, data, message, LocalDate.now());
    }

    public ResponseDTO(HttpStatusCode status, String message) {
        this(status, null, message, LocalDate.now());
    }
}
