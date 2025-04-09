package io.github.juniorcorzo.UrbanStyle.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.application.service.AddressService;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.AddressDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/address")
public class AddressController {
    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping("/by/users/{id}")
    public ResponseDTO<AddressDTO> getAddressByUserId(@PathVariable String id) {
        return addressService.getAddressByUserId(id);
    }

    @PostMapping("/create")
    public ResponseDTO<AddressDTO> createAddress(@RequestBody AddressDTO addressDTO) {
        return addressService.createAddress(addressDTO);
    }

    @PutMapping("/update")
    public ResponseDTO<AddressDTO> updateAddress(@RequestBody AddressDTO addressDTO) {
        return addressService.updateAddress(addressDTO);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseDTO<AddressDTO> deleteAddress(@PathVariable String id) {
        return addressService.deleteAddress(id);
    }
}
