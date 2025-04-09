package io.github.juniorcorzo.UrbanStyle.application.service;

import io.github.juniorcorzo.UrbanStyle.domain.entities.AddressEntity;
import io.github.juniorcorzo.UrbanStyle.domain.repository.AddressRepository;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.AddressDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.mapper.AddressMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {
    private final AddressRepository addressRepository;
    private final AddressMapper addressMapper;

    public AddressService(AddressRepository addressRepository, AddressMapper addressMapper) {
        this.addressRepository = addressRepository;
        this.addressMapper = addressMapper;
    }

    public ResponseDTO<AddressDTO> getAddressByUserId(String id) {
        List<AddressEntity> addressEntities = addressRepository.findByUserId(id);
        List<AddressDTO> addressResponse = addressEntities.stream().map(addressMapper::toDTO).toList();
        return new ResponseDTO<>(HttpStatus.OK, addressResponse, "Addresses found");
    }

    public ResponseDTO<AddressDTO> createAddress(AddressDTO addressDTO) {
        AddressEntity addressEntity = addressMapper.toEntity(addressDTO);
        AddressEntity savedAddress = addressRepository.save(addressEntity);
        AddressDTO savedAddressDTO = addressMapper.toDTO(savedAddress);
        return new ResponseDTO<>(HttpStatus.CREATED, List.of(savedAddressDTO), "Address created successfully");
    }

    public ResponseDTO<AddressDTO> updateAddress(AddressDTO addressDTO) {
        AddressEntity addressEntity = addressMapper.toEntity(addressDTO);
        AddressEntity updatedAddress = addressRepository.save(addressEntity);
        AddressDTO updatedAddressDTO = addressMapper.toDTO(updatedAddress);
        return new ResponseDTO<>(HttpStatus.OK, List.of(updatedAddressDTO), "Address updated successfully");
    }

    public ResponseDTO<AddressDTO> deleteAddress(String id) {
        addressRepository.deleteById(id);
        return new ResponseDTO<>(HttpStatus.OK, "Address deleted successfully");
    }
}
