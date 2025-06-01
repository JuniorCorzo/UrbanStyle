package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserCredentials(
        @Email(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", message = "Email must be valid")
        String email,
        @NotBlank
        String password
) {
}
