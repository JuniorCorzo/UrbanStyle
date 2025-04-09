package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record AddressDTO(
        String id,
        String userId,
        String street,
        String city,
        String state,
        String country,
        String postalCode
) {

    public AddressDTO {
    }

    public AddressDTO(String id, String street, String city, String state, String country, String postalCode) {
        this(id, null, street, city, state, country, postalCode);
    }
}
