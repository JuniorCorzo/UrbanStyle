package io.github.juniorcorzo.UrbanStyle.user.infrastructure.adapter.dto.common;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.groups.OnCreate;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.groups.OnUpdate;
import jakarta.validation.constraints.AssertTrue;

import java.time.LocalDateTime;

public record DataConsentDTO(
        @AssertTrue(message = "La aceptación de políticas de datos es obligatoria", groups = {OnCreate.class, OnUpdate.class})
        Boolean accepted,
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        LocalDateTime acceptedAt,
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        String version,
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        String ipAddress
) {

}
