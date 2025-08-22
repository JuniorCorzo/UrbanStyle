package io.github.juniorcorzo.UrbanStyle.address.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.address.applications.service.AddressService;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.groups.OnCreate;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.groups.OnUpdate;
import io.github.juniorcorzo.UrbanStyle.address.infrastructure.adapter.dto.AddressDTO;
import io.github.juniorcorzo.UrbanStyle.common.infrastructure.adapter.dtos.response.ResponseDTO;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/address")
@SuppressWarnings("unused")
public class AddressController {
    private final AddressService addressService;

    @GetMapping("/by/users/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseDTO<AddressDTO> getAddressByUserId(@NotBlank @IdFormatConstraint @PathVariable String id) {
        return addressService.getAddressByUserId(id);
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('USER')")
    public ResponseDTO<AddressDTO> createAddress(@Validated(OnCreate.class) @RequestBody AddressDTO addressDTO) {
        return addressService.createAddress(addressDTO);
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('USER')")
    public ResponseDTO<AddressDTO> updateAddress(@Validated(OnUpdate.class) @RequestBody AddressDTO addressDTO) {
        return addressService.updateAddress(addressDTO);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseDTO<AddressDTO> deleteAddress(@NotBlank @IdFormatConstraint @PathVariable String id) {
        return addressService.deleteAddress(id);
    }
}
