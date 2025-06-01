package io.github.juniorcorzo.UrbanStyle.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.application.service.AddressService;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.AddressDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/address")
@SuppressWarnings("unused")
public class AddressController {
    private final AddressService addressService;

    @GetMapping("/by/users/{id}")
    public ResponseDTO<AddressDTO> getAddressByUserId(@PathVariable String id) {
        return addressService.getAddressByUserId(id);
    }

    @PostMapping("/create")
    public ResponseDTO<AddressDTO> createAddress(@Valid @RequestBody AddressDTO addressDTO) {
        return addressService.createAddress(addressDTO);
    }

    @PutMapping("/update")
    public ResponseDTO<AddressDTO> updateAddress(@Valid @RequestBody AddressDTO addressDTO) {
        return addressService.updateAddress(addressDTO);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseDTO<AddressDTO> deleteAddress(@NotBlank @PathVariable String id) {
        return addressService.deleteAddress(id);
    }
}
